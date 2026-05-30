import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { RecentDeployments } from "@/components/dashboard/recent-deployments";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ProviderHealth } from "@/components/dashboard/provider-health";
import { DeploymentTimeline } from "@/components/dashboard/deployment-timeline";
import { PageHeader } from "@/components/dashboard/page-header";
import { getWorkspaceForUser, getWorkspaceIntegrations } from "@/lib/workspace";
import { fetchOverviewStats, buildProviderHealth } from "@/lib/data/dashboard";

export const metadata = { title: "Overview" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const workspace = await getWorkspaceForUser(user.id);
  if (!workspace) redirect("/onboarding");

  const [deploymentsRes, activityRes, stats, integrations] = await Promise.all([
    supabase
      .from("deployments")
      .select("*, projects(name, slug)")
      .eq("workspace_id", workspace.workspaceId)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("activity_logs")
      .select("*")
      .eq("workspace_id", workspace.workspaceId)
      .order("created_at", { ascending: false })
      .limit(10),
    fetchOverviewStats(workspace.workspaceId),
    getWorkspaceIntegrations(workspace.workspaceId),
  ]);

  const providerHealth = buildProviderHealth(integrations, user);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Overview"
        description={`${workspace.workspaceName} — synchronized across connected providers.`}
      />

      <OverviewStats stats={stats} />
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <RecentDeployments deployments={deploymentsRes.data ?? []} workspaceId={workspace.workspaceId} />
          <DeploymentTimeline deployments={deploymentsRes.data ?? []} />
        </div>
        <div className="space-y-5">
          <ActivityFeed activities={activityRes.data ?? []} workspaceId={workspace.workspaceId} />
          <ProviderHealth providers={providerHealth} />
        </div>
      </div>
    </div>
  );
}
