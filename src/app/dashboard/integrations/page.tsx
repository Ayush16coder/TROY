export const metadata = { title: "Integrations" };
import { IntegrationsGrid } from "@/components/integrations/integrations-grid";

export default function IntegrationsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Integrations</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Connect your providers — GitHub, Vercel, Railway, Supabase and more
        </p>
      </div>
      <IntegrationsGrid />
    </div>
  );
}
