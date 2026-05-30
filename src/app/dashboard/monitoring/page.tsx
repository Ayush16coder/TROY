import { PageHeader } from "@/components/dashboard/page-header";
import { MonitoringDashboard } from "@/components/monitoring/monitoring-dashboard";

export const metadata = { title: "Monitoring" };

export default function MonitoringPage() {
  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Monitoring"
        description="CPU, memory, API latency, deployment health, and incident tracking across your infrastructure."
      />
      <MonitoringDashboard />
    </div>
  );
}
