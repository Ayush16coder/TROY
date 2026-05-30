import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { NotificationsList } from "@/components/notifications/notifications-list";
import { fetchNotifications } from "@/lib/data/dashboard";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const notifications = await fetchNotifications(user.id);

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Notifications" description="Deployment alerts, sync events, and workspace updates." />
      <NotificationsList notifications={notifications} />
    </div>
  );
}
