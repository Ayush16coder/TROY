import { PageHeader } from "@/components/dashboard/page-header";
import { IntegrationsGrid } from "@/components/integrations/integrations-grid";

export const metadata = { title: "Providers" };

export default function ProvidersPage() {
  return (
    <div className="max-w-[1200px] mx-auto">
      <PageHeader
        title="Providers"
        description="Manage connected infrastructure providers, permissions, and health status."
      />
      <IntegrationsGrid />
    </div>
  );
}
