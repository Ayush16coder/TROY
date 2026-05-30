import { createServiceClient } from "@/lib/supabase/service";

export async function syncGitHubEvent(event: any) {
  const admin = createServiceClient();
  const { event_type, payload } = event;

  // Real world implementation of GitHub event syncing
  if (event_type === "push") {
    const repoFullName = payload.repository.full_name;
    const branch = payload.ref.replace("refs/heads/", "");
    const commitSha = payload.head_commit?.id;
    const commitMsg = payload.head_commit?.message;

    // Find the repository in our DB
    const { data: repo } = await admin
      .from("repositories")
      .select("id, workspace_id")
      .eq("full_name", repoFullName)
      .maybeSingle();

    if (repo) {
      // Update repository last commit info
      await admin
        .from("repositories")
        .update({
          last_commit_sha: commitSha,
          last_commit_message: commitMsg,
          last_commit_at: new Date(payload.head_commit?.timestamp).toISOString(),
          synced_at: new Date().toISOString(),
        })
        .eq("id", repo.id);

      // Emit a realtime activity log
      await admin.from("activity_logs").insert({
        workspace_id: repo.workspace_id,
        action: "github.push",
        resource_type: "repository",
        resource_id: repo.id,
        metadata: {
          branch,
          commit: commitSha,
          message: commitMsg,
        },
      });
    }
  } else if (event_type === "pull_request") {
    // Handle PR events...
  } else if (event_type === "installation") {
    // Handle GitHub app installations...
  } else {
    console.log(`Unhandled GitHub event type: ${event_type}`);
  }
}
