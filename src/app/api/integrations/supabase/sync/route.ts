import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspace } from "@/lib/workspace";
import { getIntegrationToken } from "@/lib/integrations/store";
import { createServiceClient } from "@/lib/supabase/service";

interface SupabaseProject {
  id: string;
  name: string;
  region: string;
  organization_id: string;
  status: string;
  created_at: string;
  database?: { host: string; version: string };
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const workspace = await requireWorkspace(user);
    const token = await getIntegrationToken(workspace.workspaceId, "supabase");
    if (!token) return NextResponse.json({ error: "supabase_not_connected" }, { status: 400 });

    const res = await fetch("https://api.supabase.com/v1/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const errBody = await res.text();
      console.error("Supabase API error:", errBody);
      return NextResponse.json({ error: "supabase_api_failed" }, { status: 502 });
    }

    const projects: SupabaseProject[] = await res.json();
    const count = Array.isArray(projects) ? projects.length : 0;
    const admin = createServiceClient();

    // Get the connection record
    const { data: connection } = await admin
      .from("provider_connections")
      .select("id")
      .eq("workspace_id", workspace.workspaceId)
      .eq("provider", "supabase")
      .maybeSingle();

    if (connection) {
      // Upsert each project into provider_projects
      for (const project of projects) {
        await admin.from("provider_projects").upsert(
          {
            connection_id: connection.id,
            workspace_id: workspace.workspaceId,
            provider_project_id: project.id,
            name: project.name,
            metadata: {
              region: project.region,
              organization_id: project.organization_id,
              status: project.status,
              database_host: project.database?.host,
              created_at: project.created_at,
            },
            updated_at: new Date().toISOString(),
          },
          { onConflict: "connection_id,provider_project_id" }
        );
      }

      // Upsert provider health
      await admin.from("provider_health").upsert(
        {
          connection_id: connection.id,
          workspace_id: workspace.workspaceId,
          status: "healthy",
          last_check_at: new Date().toISOString(),
          metadata: { project_count: count },
        },
        { onConflict: "connection_id" }
      );
    }

    await admin.from("activity_logs").insert({
      workspace_id: workspace.workspaceId,
      user_id: user.id,
      action: "integration.synced",
      resource_type: "integration",
      metadata: { provider: "supabase", project_count: count },
    });

    return NextResponse.json({ success: true, count });
  } catch (err) {
    console.error("Supabase sync error:", err);
    return NextResponse.json({ error: "sync_failed" }, { status: 500 });
  }
}
