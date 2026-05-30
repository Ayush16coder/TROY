import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/service";

// GitHub Webhook Signature Verification
function verifyGitHubSignature(payload: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = `sha256=${hmac.update(payload).digest("hex")}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256");
    const event = req.headers.get("x-github-event");
    const secret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!secret) {
      console.error("Missing GITHUB_WEBHOOK_SECRET");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    if (!verifyGitHubSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const supabase = createServiceClient();

    const githubRepoId = payload.repository?.id;
    let workspaceId = "system";
    if (githubRepoId) {
      const { data: repo } = await supabase
        .from("repositories")
        .select("workspace_id")
        .eq("github_id", githubRepoId)
        .maybeSingle();
      if (repo?.workspace_id) workspaceId = repo.workspace_id;
    }

    await supabase.from("sync_events").insert({
      workspace_id: workspaceId,
      event_type: event || "unknown",
      provider: "github",
      payload: payload as any,
      status: "pending",
      error: null,
      processed_at: null,
    } as any);

    if (event === "push") {
      const { repository, commits, head_commit, ref } = payload;
      
      // Update repository status
      await supabase
        .from("repositories")
        .update({
          last_commit_sha: head_commit?.id,
          last_commit_message: head_commit?.message,
          last_commit_at: head_commit?.timestamp,
          synced_at: new Date().toISOString(),
        } as any)
        .eq("github_id", repository.id);

      // In a real system, we would trigger Trigger.dev background jobs here
      // to synchronize with Vercel, Railway, etc.
      console.log(`[GitHub Webhook] Push to ${repository.full_name} on ${ref}. Commits: ${commits.length}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[GitHub Webhook Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
