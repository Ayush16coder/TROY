import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { MonitoringDashboard } from "@/components/monitoring/monitoring-dashboard";
import { getWorkspaceForUser } from "@/lib/workspace";

export const metadata = { title: "Monitoring" };

export default async function MonitoringPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const workspace = await getWorkspaceForUser(user.id);
  if (!workspace) redirect("/onboarding");

  const { data: deployments } = await supabase
    .from("deployments")
    .select("status, build_duration_ms, created_at")
    .eq("workspace_id", workspace.workspaceId)
    .order("created_at", { ascending: false })
    .limit(100);

  const deps = deployments ?? [];
  const total = deps.length;
  const ready = deps.filter((d) => d.status === "ready").length;
  const errors = deps.filter((d) => d.status === "error").length;
  const durations = deps.map((d) => d.build_duration_ms).filter((ms): ms is number => ms != null);
  const avgMs = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  const stats = {
    uptime: total > 0 ? `${((ready / total) * 100).toFixed(1)}%` : "—",
    activeAlerts: String(errors),
    p99Latency: avgMs ? `${avgMs}ms` : "—",
    requestsPerMin: String(total),
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader title="Monitoring" description="Metrics derived from your deployment history." />
      <MonitoringDashboard stats={stats} errorDeployments={deps.filter((d) => d.status === "error").length} />
    </div>
  );
}
