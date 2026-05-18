import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DeploymentsList } from "@/components/deployments/deployments-list";

export const metadata = { title: "Deployments" };

export default async function DeploymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: deployments } = await supabase
    .from("deployments")
    .select("*, projects(name, slug)")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Deployments</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Monitor and manage all deployments across every provider
          </p>
        </div>
      </div>
      <DeploymentsList deployments={deployments ?? []} />
    </div>
  );
}
