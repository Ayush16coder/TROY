import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OverviewStats } from "@/components/dashboard/overview-stats";
import { RecentDeployments } from "@/components/dashboard/recent-deployments";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { QuickActions } from "@/components/dashboard/quick-actions";

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
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Your workspace at a glance — real-time synchronized
        </p>
      </div>

      <OverviewStats />
      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentDeployments deployments={deploymentsRes.data ?? []} />
        </div>
        <div>
          <ActivityFeed activities={activityRes.data ?? []} />
        </div>
      </div>
    </div>
  );
}
