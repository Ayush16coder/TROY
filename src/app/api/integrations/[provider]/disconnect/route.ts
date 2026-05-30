import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspace } from "@/lib/workspace";
import { disconnectIntegration } from "@/lib/integrations/store";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const workspace = await requireWorkspace(user);
    await disconnectIntegration(workspace.workspaceId, provider);

    await createServiceClient().from("activity_logs").insert({
      workspace_id: workspace.workspaceId,
      user_id: user.id,
      action: "integration.disconnected",
      resource_type: "integration",
      metadata: { provider },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Disconnect error:", err);
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}
