import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspace } from "@/lib/workspace";
import { getIntegrationToken } from "@/lib/integrations/store";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const workspace = await requireWorkspace(user);
    const token = await getIntegrationToken(workspace.workspaceId, "docker");
    if (!token) return NextResponse.json({ error: "docker_not_connected" }, { status: 400 });

    // 1. Fetch Docker Hub username first
    const userRes = await fetch("https://hub.docker.com/v2/user/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!userRes.ok) {
      console.error("Docker API error fetching user:", userRes.status, await userRes.text());
      return NextResponse.json({ error: "docker_api_failed" }, { status: 502 });
    }
    
    const userData = await userRes.json();
    const username = userData.username;
    
    if (!username) {
        return NextResponse.json({ error: "docker_username_not_found" }, { status: 502 });
    }

    // 2. Fetch repositories
    const repoRes = await fetch(`https://hub.docker.com/v2/repositories/${username}/?page_size=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!repoRes.ok) {
      console.error("Docker API error fetching repos:", repoRes.status, await repoRes.text());
      return NextResponse.json({ error: "docker_api_failed" }, { status: 502 });
    }

    const repoData = await repoRes.json();
    const repositories = repoData.results || [];
    
    const admin = createServiceClient();

    const { data: connection } = await admin
      .from("provider_connections")
      .select("id")
      .eq("workspace_id", workspace.workspaceId)
      .eq("provider", "docker")
      .maybeSingle();

    if (connection) {
      for (const repo of repositories) {
        await admin.from("provider_projects").upsert(
          {
            connection_id: connection.id,
            workspace_id: workspace.workspaceId,
            provider_project_id: `${username}/${repo.name}`,
            name: repo.name,
            metadata: {
              namespace: repo.namespace,
              description: repo.description,
              is_private: repo.is_private,
              pull_count: repo.pull_count,
              star_count: repo.star_count,
              last_updated: repo.last_updated,
            },
            updated_at: new Date().toISOString(),
          },
          { onConflict: "connection_id,provider_project_id" }
        );
      }

      await admin.from("provider_health").upsert(
        {
          connection_id: connection.id,
          workspace_id: workspace.workspaceId,
          status: "healthy",
          last_check_at: new Date().toISOString(),
          metadata: { project_count: repositories.length, username },
        },
        { onConflict: "connection_id" }
      );
    }

    await admin.from("activity_logs").insert({
      workspace_id: workspace.workspaceId,
      user_id: user.id,
      action: "integration.synced",
      resource_type: "integration",
      metadata: { provider: "docker", project_count: repositories.length },
    });

    return NextResponse.json({ success: true, count: repositories.length });
  } catch (err) {
    console.error("Docker sync error:", err);
    return NextResponse.json({ error: "sync_failed" }, { status: 500 });
  }
}
