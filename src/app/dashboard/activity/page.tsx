import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { ActivityTimeline } from "@/components/activity/activity-timeline";
import { getWorkspaceForUser } from "@/lib/workspace";

export const metadata = { title: "Activity" };

export default async function ActivityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const workspace = await getWorkspaceForUser(user.id);
  if (!workspace) redirect("/onboarding");

  const { data: activities } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("workspace_id", workspace.workspaceId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Activity" description="Workspace audit trail from deployments, syncs, and integrations." />
      <ActivityTimeline activities={activities ?? []} />
    </div>
  );
}
