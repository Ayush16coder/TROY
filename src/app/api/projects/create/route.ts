import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { requireWorkspace } from "@/lib/workspace";
import { getIntegrationToken } from "@/lib/integrations/store";

export async function POST(request: Request) {
  try {
    const { name, framework } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Project name required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await requireWorkspace(user);
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const vercelToken = await getIntegrationToken(workspace.workspaceId, "vercel");
    const supabaseToken = await getIntegrationToken(workspace.workspaceId, "supabase");

    if (vercelToken) {
      const res = await fetch("https://api.vercel.com/v9/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: slug, framework: framework ?? null }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("Vercel project create:", err);
      }
    }

    if (supabaseToken) {
      const orgRes = await fetch("https://api.supabase.com/v1/organizations", {
        headers: { Authorization: `Bearer ${supabaseToken}` },
      });
      if (orgRes.ok) {
        const orgs = await orgRes.json();
        const orgId = orgs?.[0]?.id;
        if (orgId) {
          const dbPass = crypto.randomUUID().replace(/-/g, "") + "Aa1!";
          await fetch("https://api.supabase.com/v1/projects", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${supabaseToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: slug,
              organization_id: orgId,
              region: "us-east-1",
              db_pass: dbPass,
            }),
          });
        }
      }
    }

    const admin = createServiceClient();
    const { data: project, error } = await admin
      .from("projects")
      .insert({
        workspace_id: workspace.workspaceId,
        name,
        slug,
        framework: framework ?? null,
        status: "active",
        created_by: user.id,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await createServiceClient().from("activity_logs").insert({
      workspace_id: workspace.workspaceId,
      user_id: user.id,
      action: "project.created",
      resource_type: "project",
      resource_id: project.id,
      metadata: { name, framework },
    });

    return NextResponse.json({ success: true, projectId: project.id, projectName: name, framework });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to provision project" }, { status: 500 });
  }
}
