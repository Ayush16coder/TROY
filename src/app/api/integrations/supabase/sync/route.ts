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

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const workspace = await requireWorkspace(user);
    const token = await getIntegrationToken(workspace.workspaceId, "supabase");

    if (!token) {
      return NextResponse.json({ error: "supabase_not_connected" }, { status: 400 });
    }

    const res = await fetch("https://api.supabase.com/v1/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "supabase_api_failed" }, { status: 502 });
    }

    const projects = await res.json();
    const count = Array.isArray(projects) ? projects.length : 0;

    await createServiceClient().from("activity_logs").insert({
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
