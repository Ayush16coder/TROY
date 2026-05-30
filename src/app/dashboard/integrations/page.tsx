import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { IntegrationsGrid } from "@/components/integrations/integrations-grid";
import { GithubSyncOnMount } from "@/components/integrations/github-sync";
import { getWorkspaceIntegrations, getWorkspaceForUser, isGithubConnected } from "@/lib/workspace";

export const metadata = { title: "Integrations" };

export default async function IntegrationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const workspace = await getWorkspaceForUser(user.id);
  const integrations = workspace ? await getWorkspaceIntegrations(workspace.workspaceId) : [];
  const githubLinked = isGithubConnected(user);

  return (
    <div className="max-w-[1200px] mx-auto">
      <GithubSyncOnMount />
      <PageHeader
        title="Integrations"
        description="Connect GitHub, Vercel, and Supabase with real OAuth. Credentials are stored securely per workspace."
      />
      <Suspense fallback={<div className="text-muted-foreground text-sm">Loading...</div>}>
        <IntegrationsGrid integrations={integrations} githubLinked={githubLinked} />
      </Suspense>
    </div>
  );
}
