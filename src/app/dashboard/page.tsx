import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { RecentDeployments } from "@/components/dashboard/recent-deployments";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ProviderHealth } from "@/components/dashboard/provider-health";
import { AIRecommendations } from "@/components/dashboard/ai-recommendations";
import { DeploymentTimeline } from "@/components/dashboard/deployment-timeline";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata = { title: "Overview" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [deploymentsRes, activityRes] = await Promise.all([
    supabase
      .from("deployments")
      .select("*, projects(name, slug)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Overview"
        description="Your infrastructure control center — synchronized across all connected providers."
      />

      <OverviewStats />
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <RecentDeployments deployments={deploymentsRes.data ?? []} />
          <DeploymentTimeline />
        </div>
        <div className="space-y-5">
          <ActivityFeed activities={activityRes.data ?? []} />
          <ProviderHealth />
          <AIRecommendations />
        </div>
      </div>
    </div>
  );
}
