import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProjectsView } from "@/components/projects/projects-view";
import { getWorkspaceForUser } from "@/lib/workspace";
import { fetchProjects } from "@/lib/data/dashboard";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const workspace = await getWorkspaceForUser(user.id);
  if (!workspace) redirect("/onboarding");

  const projects = await fetchProjects(workspace.workspaceId);

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Projects"
        description="Projects provisioned in your workspace from TROY and connected providers."
      />
      <ProjectsView projects={projects as Parameters<typeof ProjectsView>[0]["projects"]} />
    </div>
  );
}
