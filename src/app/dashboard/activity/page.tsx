import { PageHeader } from "@/components/dashboard/page-header";
import { ActivityTimeline } from "@/components/activity/activity-timeline";

export const metadata = { title: "Activity" };

export default function ActivityPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Activity" description="Deployments, commits, sync events, infrastructure updates, and team actions." />
      <ActivityTimeline />
    </div>
  );
}
