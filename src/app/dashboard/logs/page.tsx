import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { LogsTerminal } from "@/components/logs/logs-terminal";
import { getWorkspaceForUser } from "@/lib/workspace";
import { fetchDeploymentLogs } from "@/lib/data/dashboard";

export const metadata = { title: "Logs" };

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ deployment?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const workspace = await getWorkspaceForUser(user.id);
  if (!workspace) redirect("/onboarding");

  const params = await searchParams;

  const { data: deploymentsRaw } = await supabase
    .from("deployments")
    .select("id, provider, status, created_at, project_id")
    .eq("workspace_id", workspace.workspaceId)
    .order("created_at", { ascending: false })
    .limit(20);

  const deployments = (deploymentsRaw ?? []) as {
    id: string;
    provider: string;
    project_id: string;
  }[];

  const projectIds = [...new Set(deployments.map((d) => d.project_id))];
  const { data: projects } = projectIds.length
    ? await supabase.from("projects").select("id, name").in("id", projectIds)
    : { data: [] };

  const projectNames = Object.fromEntries(
    ((projects ?? []) as { id: string; name: string }[]).map((p) => [p.id, p.name])
  );

  const selectedId = params.deployment ?? deployments[0]?.id;
  const logs = selectedId ? await fetchDeploymentLogs(selectedId) : [];

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <PageHeader title="Logs" description="Deployment logs from your workspace database." />
      <LogsTerminal
        deployments={deployments.map((d) => ({
          id: d.id,
          label: `${projectNames[d.project_id] ?? d.id.slice(0, 8)} · ${d.provider}`,
        }))}
        selectedDeploymentId={selectedId}
        initialLogs={logs.map((l) => ({
          level: l.level,
          message: l.message,
          timestamp: l.timestamp,
        }))}
      />
    </div>
  );
}
