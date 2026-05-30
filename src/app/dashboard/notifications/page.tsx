import { PageHeader } from "@/components/dashboard/page-header";
import { NotificationsList } from "@/components/notifications/notifications-list";

export const metadata = { title: "Notifications" };

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Notifications" description="Deployment alerts, infrastructure warnings, sync failures, and AI insights." />
      <NotificationsList />
    </div>
  );
}
