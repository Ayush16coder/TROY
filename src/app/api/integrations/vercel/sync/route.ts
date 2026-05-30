import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { requireWorkspace } from "@/lib/workspace";
import { getIntegrationToken } from "@/lib/integrations/store";

type VercelDeployment = {
  uid: string;
  name: string;
  url: string;
  state: string;
  created: number;
  buildingAt?: number;
  ready?: number;
  meta?: { githubCommitRef?: string; githubCommitSha?: string; githubCommitMessage?: string };
  target?: string;
};

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
    const token = await getIntegrationToken(workspace.workspaceId, "vercel");

    if (!token) {
      return NextResponse.json({ error: "vercel_not_connected" }, { status: 400 });
    }

    const depRes = await fetch("https://api.vercel.com/v6/deployments?limit=20", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!depRes.ok) {
      return NextResponse.json({ error: "vercel_api_failed" }, { status: 502 });
    }

    const { deployments } = (await depRes.json()) as { deployments: VercelDeployment[] };
    const admin = createServiceClient();

    let synced = 0;

    for (const dep of deployments ?? []) {
      const { data: project } = await admin
        .from("projects")
        .select("id")
        .eq("workspace_id", workspace.workspaceId)
        .eq("slug", dep.name)
        .maybeSingle();

      let projectId = project?.id;

      if (!projectId) {
        const { data: created } = await admin
          .from("projects")
          .insert({
            workspace_id: workspace.workspaceId,
            name: dep.name,
            slug: dep.name,
            framework: "unknown",
            status: "active",
            created_by: user.id,
          })
          .select("id")
          .single();
        projectId = created?.id;
      }

      if (!projectId) continue;

      const statusMap: Record<string, string> = {
        READY: "ready",
        BUILDING: "building",
        QUEUED: "queued",
        ERROR: "error",
        CANCELED: "cancelled",
      };

      const buildDuration =
        dep.ready && dep.buildingAt ? dep.ready - dep.buildingAt : null;

      const payload = {
        project_id: projectId,
        workspace_id: workspace.workspaceId,
        provider: "vercel" as const,
        provider_deployment_id: dep.uid,
        status: (statusMap[dep.state] ?? "queued") as "queued" | "building" | "ready" | "error" | "cancelled",
        environment: (dep.target === "production" ? "production" : "preview") as "production" | "preview" | "development",
        branch: dep.meta?.githubCommitRef ?? null,
        commit_sha: dep.meta?.githubCommitSha ?? null,
        commit_message: dep.meta?.githubCommitMessage ?? null,
        url: dep.url ? `https://${dep.url}` : null,
        build_duration_ms: buildDuration,
        triggered_by: user.id,
        completed_at: dep.ready ? new Date(dep.ready).toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      const { data: existing } = await admin
        .from("deployments")
        .select("id")
        .eq("workspace_id", workspace.workspaceId)
        .eq("provider", "vercel")
        .eq("provider_deployment_id", dep.uid)
        .maybeSingle();

      if (existing?.id) {
        await admin.from("deployments").update(payload).eq("id", existing.id);
      } else {
        await admin.from("deployments").insert(payload);
      }

      synced++;
    }

    return NextResponse.json({ success: true, synced });
  } catch (err) {
    console.error("Vercel sync error:", err);
    return NextResponse.json({ error: "sync_failed" }, { status: 500 });
  }
}
