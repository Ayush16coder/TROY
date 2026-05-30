import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { EnvironmentsView } from "@/components/environments/environments-view";
import { getWorkspaceForUser } from "@/lib/workspace";
import { fetchEnvironments } from "@/lib/data/dashboard";

export const metadata = { title: "Environments" };

export default async function EnvironmentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const workspace = await getWorkspaceForUser(user.id);
  if (!workspace) redirect("/onboarding");

  const environments = await fetchEnvironments(workspace.workspaceId);

  return (
    <div className="max-w-[1000px] mx-auto">
      <PageHeader title="Environments" description="Environment configuration per project." />
      <EnvironmentsView environments={environments as Parameters<typeof EnvironmentsView>[0]["environments"]} />
    </div>
  );
}
