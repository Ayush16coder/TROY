import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspace } from "@/lib/workspace";
import { getIntegrationToken } from "@/lib/integrations/store";
import { createServiceClient } from "@/lib/supabase/service";

// AWS SDK is optional. Install with: npm install @aws-sdk/client-ecs @aws-sdk/client-lambda @aws-sdk/client-s3
async function tryLoadAwsSdk() {
  try {
    const [ecs, lambda, s3] = await Promise.all([
      import("@aws-sdk/client-ecs").catch(() => null),
      import("@aws-sdk/client-lambda").catch(() => null),
      import("@aws-sdk/client-s3").catch(() => null),
    ]);
    return { ecs, lambda, s3 };
  } catch {
    return { ecs: null, lambda: null, s3: null };
  }
}



export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const workspace = await requireWorkspace(user);
    const token = await getIntegrationToken(workspace.workspaceId, "aws");
    if (!token) return NextResponse.json({ error: "aws_not_connected" }, { status: 400 });

    let awsCredentials;
    try {
        awsCredentials = JSON.parse(token);
    } catch (e) {
        return NextResponse.json({ error: "aws_invalid_credentials_format" }, { status: 400 });
    }
    
    if (!awsCredentials.accessKeyId || !awsCredentials.secretAccessKey) {
        return NextResponse.json({ error: "aws_missing_credentials" }, { status: 400 });
    }
    
    const region = awsCredentials.region || "us-east-1";
    
    const admin = createServiceClient();
    const { data: connection } = await admin
      .from("provider_connections")
      .select("id")
      .eq("workspace_id", workspace.workspaceId)
      .eq("provider", "aws")
      .maybeSingle();

    if (!connection) {
       return NextResponse.json({ error: "aws_connection_not_found" }, { status: 400 });
    }

    let projectCount = 0;

    const { ecs, lambda, s3 } = await tryLoadAwsSdk();

    if (ecs && lambda && s3) {
       try {
           const credentials = {
                accessKeyId: awsCredentials.accessKeyId,
                secretAccessKey: awsCredentials.secretAccessKey,
           };

           // Fetch ECS Clusters
           const ecsClient = new ecs.ECSClient({ region, credentials });
           const ecsRes = await ecsClient.send(new ecs.ListClustersCommand({}));
           const clusters = ecsRes.clusterArns || [];

           for (const clusterArn of clusters) {
               await admin.from("provider_projects").upsert({
                   connection_id: connection.id,
                   workspace_id: workspace.workspaceId,
                   provider_project_id: clusterArn,
                   name: clusterArn.split("/").pop() || clusterArn,
                   metadata: { type: "ecs_cluster", arn: clusterArn },
                   updated_at: new Date().toISOString(),
               }, { onConflict: "connection_id,provider_project_id" });
               projectCount++;
           }

           // Fetch Lambda Functions
           const lambdaClient = new lambda.LambdaClient({ region, credentials });
           const lambdaRes = await lambdaClient.send(new lambda.ListFunctionsCommand({}));
           const functions = lambdaRes.Functions || [];

           for (const fn of functions) {
               await admin.from("provider_projects").upsert({
                   connection_id: connection.id,
                   workspace_id: workspace.workspaceId,
                   provider_project_id: fn.FunctionArn,
                   name: fn.FunctionName,
                   metadata: { type: "lambda_function", arn: fn.FunctionArn, runtime: fn.Runtime, memorySize: fn.MemorySize },
                   updated_at: new Date().toISOString(),
               }, { onConflict: "connection_id,provider_project_id" });
               projectCount++;
           }

           // Fetch S3 Buckets
           const s3Client = new s3.S3Client({ region, credentials });
           const s3Res = await s3Client.send(new s3.ListBucketsCommand({}));
           const buckets = s3Res.Buckets || [];

           for (const bucket of buckets) {
                await admin.from("provider_projects").upsert({
                   connection_id: connection.id,
                   workspace_id: workspace.workspaceId,
                   provider_project_id: `arn:aws:s3:::${bucket.Name}`,
                   name: bucket.Name,
                   metadata: { type: "s3_bucket", creationDate: bucket.CreationDate },
                   updated_at: new Date().toISOString(),
               }, { onConflict: "connection_id,provider_project_id" });
               projectCount++;
           }

           await admin.from("provider_health").upsert({
              connection_id: connection.id,
              workspace_id: workspace.workspaceId,
              status: "healthy",
              last_check_at: new Date().toISOString(),
              metadata: { project_count: projectCount },
           }, { onConflict: "connection_id" });

       } catch (awsError) {
           console.error("AWS API Error:", awsError);
           await admin.from("provider_health").upsert({
              connection_id: connection.id,
              workspace_id: workspace.workspaceId,
              status: "error",
              last_check_at: new Date().toISOString(),
              metadata: { error: String(awsError) },
           }, { onConflict: "connection_id" });
           return NextResponse.json({ error: "aws_api_error" }, { status: 502 });
       }
    } else {
        console.log("AWS SDK not installed — skipping live sync.");
        await admin.from("provider_health").upsert({
             connection_id: connection.id,
             workspace_id: workspace.workspaceId,
             status: "healthy",
             last_check_at: new Date().toISOString(),
             metadata: { note: "AWS SDK not installed. Install @aws-sdk packages to enable full sync." },
          }, { onConflict: "connection_id" });
    }


    await admin.from("activity_logs").insert({
      workspace_id: workspace.workspaceId,
      user_id: user.id,
      action: "integration.synced",
      resource_type: "integration",
      metadata: { provider: "aws", project_count: projectCount },
    });

    return NextResponse.json({ success: true, count: projectCount });
  } catch (err) {
    console.error("AWS sync error:", err);
    return NextResponse.json({ error: "sync_failed" }, { status: 500 });
  }
}
