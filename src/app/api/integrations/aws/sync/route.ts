import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspace } from "@/lib/workspace";
import { getIntegrationToken } from "@/lib/integrations/store";
import { createServiceClient } from "@/lib/supabase/service";
import crypto from "crypto";

export const dynamic = "force-dynamic";

// AWS Signature V4 helpers (no SDK needed)
function hmac(key: Buffer | string, data: string): Buffer {
  return crypto.createHmac("sha256", key).update(data, "utf8").digest();
}

function getSignatureKey(key: string, dateStamp: string, region: string, service: string): Buffer {
  const kDate = hmac("AWS4" + key, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, "aws4_request");
}

async function awsFetch(
  service: string,
  region: string,
  host: string,
  path: string,
  body: string,
  accessKeyId: string,
  secretAccessKey: string,
  action: string
) {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = crypto.createHash("sha256").update(body, "utf8").digest("hex");
  const canonicalHeaders = `content-type:application/x-amz-json-1.1\nhost:${host}\nx-amz-date:${amzDate}\nx-amz-target:${action}\n`;
  const signedHeaders = "content-type;host;x-amz-date;x-amz-target";
  const canonicalRequest = `POST\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${crypto.createHash("sha256").update(canonicalRequest).digest("hex")}`;

  const signingKey = getSignatureKey(secretAccessKey, dateStamp, region, service);
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return fetch(`https://${host}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Date": amzDate,
      "X-Amz-Target": action,
      Authorization: authorization,
    },
    body,
  });
}

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const workspace = await requireWorkspace(user);
    const token = await getIntegrationToken(workspace.workspaceId, "aws");
    if (!token) return NextResponse.json({ error: "aws_not_connected" }, { status: 400 });

    let awsCredentials: { accessKeyId: string; secretAccessKey: string; region?: string };
    try {
      awsCredentials = JSON.parse(token);
    } catch {
      return NextResponse.json({ error: "aws_invalid_credentials_format" }, { status: 400 });
    }

    if (!awsCredentials.accessKeyId || !awsCredentials.secretAccessKey) {
      return NextResponse.json({ error: "aws_missing_credentials" }, { status: 400 });
    }

    const region = awsCredentials.region || "us-east-1";
    const { accessKeyId, secretAccessKey } = awsCredentials;

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

    // Validate credentials using STS GetCallerIdentity (no SDK needed)
    const stsHost = `sts.${region}.amazonaws.com`;
    const stsRes = await awsFetch(
      "sts", region, stsHost, "/",
      "Action=GetCallerIdentity&Version=2011-06-15",
      accessKeyId, secretAccessKey,
      "AmazonSecurityTokenServiceV20110615.GetCallerIdentity"
    ).catch(() => null);

    const credentialsValid = stsRes?.ok ?? false;

    await admin.from("provider_health").upsert({
      connection_id: connection.id,
      workspace_id: workspace.workspaceId,
      status: credentialsValid ? "healthy" : "error",
      last_check_at: new Date().toISOString(),
      metadata: { region, credentials_valid: credentialsValid },
    }, { onConflict: "connection_id" });

    await admin.from("activity_logs").insert({
      workspace_id: workspace.workspaceId,
      user_id: user.id,
      action: "integration.synced",
      resource_type: "integration",
      metadata: { provider: "aws", region, credentials_valid: credentialsValid },
    });

    return NextResponse.json({ success: true, count: 0, credentials_valid: credentialsValid });
  } catch (err: any) {
    console.error("AWS sync error:", err);
    return NextResponse.json({ error: "sync_failed", message: err.message }, { status: 500 });
  }
}
