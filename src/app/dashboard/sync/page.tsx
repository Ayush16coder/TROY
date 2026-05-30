import { PageHeader } from "@/components/dashboard/page-header";
import { SyncEngine } from "@/components/sync/sync-engine";

export const metadata = { title: "Sync Engine" };

export default function SyncPage() {
  return (
    <div className="max-w-[900px] mx-auto">
      <PageHeader
        title="Sync Engine"
        description="Real-time provider synchronization, webhook processing, and event queue."
      />
      <SyncEngine />
    </div>
  );
}
