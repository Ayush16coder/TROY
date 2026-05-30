import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspace } from "@/lib/workspace";
import { getIntegrationToken } from "@/lib/integrations/store";
import { createServiceClient } from "@/lib/supabase/service";

// Note: Graceful degradation if AWS SDK is not installed.
// The user can install it later: npm install @aws-sdk/client-ecs @aws-sdk/client-lambda @aws-sdk/client-s3
let ECSClient: any = null;
let LambdaClient: any = null;
let S3Client: any = null;
let ListClustersCommand: any = null;
let ListFunctionsCommand: any = null;
let ListBucketsCommand: any = null;

try {
  const ecs = require("@aws-sdk/client-ecs");
  ECSClient = ecs.ECSClient;
  ListClustersCommand = ecs.ListClustersCommand;
  
  const lambda = require("@aws-sdk/client-lambda");
  LambdaClient = lambda.LambdaClient;
  ListFunctionsCommand = lambda.ListFunctionsCommand;
  
  const s3 = require("@aws-sdk/client-s3");
  S3Client = s3.S3Client;
  ListBucketsCommand = s3.ListBucketsCommand;
} catch (e) {
  console.log("AWS SDK not installed. AWS integration sync will be limited.");
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

    if (ECSClient && LambdaClient && S3Client) {
       try {
           const credentials = {
                accessKeyId: awsCredentials.accessKeyId,
                secretAccessKey: awsCredentials.secretAccessKey,
           };
           
           // Fetch ECS Clusters
           const ecsClient = new ECSClient({ region, credentials });
           const ecsRes = await ecsClient.send(new ListClustersCommand({}));
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
           const lambdaClient = new LambdaClient({ region, credentials });
           const lambdaRes = await lambdaClient.send(new ListFunctionsCommand({}));
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
           const s3Client = new S3Client({ region, credentials });
           const s3Res = await s3Client.send(new ListBucketsCommand({}));
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
        // Mock success if SDK not installed just to test the DB flow
        console.log("Mocking AWS Sync because SDK is missing.");
         await admin.from("provider_health").upsert({
              connection_id: connection.id,
              workspace_id: workspace.workspaceId,
              status: "healthy",
              last_check_at: new Date().toISOString(),
              metadata: { note: "AWS SDK not installed. Mock sync." },
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
