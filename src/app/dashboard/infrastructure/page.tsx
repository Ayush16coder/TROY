import { PageHeader } from "@/components/dashboard/page-header";
import { InfraTopology } from "@/components/infrastructure/infra-topology";
import { ProviderHealth } from "@/components/dashboard/provider-health";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Network, Zap, Shield, RefreshCw } from "lucide-react";

export const metadata = { title: "Infrastructure" };

export default function InfrastructurePage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Infrastructure"
        description="Visualize your deployment pipeline, provider connections, and sync health in real time."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Active Nodes" value="24" icon={Network} accent="blue" index={0} />
        <MetricCard label="Sync Latency" value="38ms" delta="-12ms" icon={Zap} accent="emerald" index={1} />
        <MetricCard label="Health Score" value="99.2%" icon={Shield} accent="cyan" index={2} />
        <MetricCard label="Pending Syncs" value="2" icon={RefreshCw} accent="amber" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <InfraTopology />
        </div>
        <ProviderHealth />
      </div>
    </div>
  );
}
