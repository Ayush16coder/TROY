import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { InfraTopology } from "@/components/infrastructure/infra-topology";
import { ProviderHealth } from "@/components/dashboard/provider-health";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Network, Zap, Shield, RefreshCw } from "lucide-react";
import { getWorkspaceForUser, getWorkspaceIntegrations } from "@/lib/workspace";
import { buildProviderHealth } from "@/lib/data/dashboard";

export const metadata = { title: "Infrastructure" };

export default async function InfrastructurePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const workspace = await getWorkspaceForUser(user.id);
  if (!workspace) redirect("/onboarding");

  const integrations = await getWorkspaceIntegrations(workspace.workspaceId);
  const providers = buildProviderHealth(integrations, user);
  const connected = providers.filter((p) => p.status === "connected").length;

  const { count: projectCount } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspace.workspaceId);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Infrastructure"
        description="Your connected provider pipeline and sync health."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Projects" value={String(projectCount ?? 0)} icon={Network} accent="blue" index={0} />
        <MetricCard label="Connected" value={`${connected}/${providers.length}`} icon={Zap} accent="emerald" index={1} />
        <MetricCard label="Providers" value={`${connected} active`} icon={Shield} accent="cyan" index={2} />
        <MetricCard label="Integrations" value={String(integrations.length)} icon={RefreshCw} accent="amber" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <InfraTopology />
        </div>
        <ProviderHealth providers={providers} />
      </div>
    </div>
  );
}
