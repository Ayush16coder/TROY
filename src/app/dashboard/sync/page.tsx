import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { SyncEngine } from "@/components/sync/sync-engine";
import { getWorkspaceForUser } from "@/lib/workspace";
import { fetchSyncEvents } from "@/lib/data/dashboard";

export const metadata = { title: "Sync Engine" };

export default async function SyncPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const workspace = await getWorkspaceForUser(user.id);
  if (!workspace) redirect("/onboarding");

  const events = await fetchSyncEvents(workspace.workspaceId);

  return (
    <div className="max-w-[900px] mx-auto">
      <PageHeader title="Sync Engine" description="Real-time sync events from webhooks and provider APIs." />
      <SyncEngine events={events} />
    </div>
  );
}
