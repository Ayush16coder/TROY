import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { IntegrationsGrid } from "@/components/integrations/integrations-grid";
import { getWorkspaceIntegrations, getWorkspaceForUser, isGithubConnected } from "@/lib/workspace";

export const metadata = { title: "Providers" };

export default async function ProvidersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const workspace = await getWorkspaceForUser(user.id);
  const integrations = workspace ? await getWorkspaceIntegrations(workspace.workspaceId) : [];

  return (
    <div className="max-w-[1200px] mx-auto">
      <PageHeader
        title="Providers"
        description="Manage connected infrastructure providers, permissions, and health status."
      />
      <Suspense fallback={null}>
        <IntegrationsGrid integrations={integrations} githubLinked={isGithubConnected(user)} />
      </Suspense>
    </div>
  );
}
