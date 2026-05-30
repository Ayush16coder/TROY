import { PageHeader } from "@/components/dashboard/page-header";
import { ProjectsView } from "@/components/projects/projects-view";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Projects"
        description="Manage repositories, deployments, environments, and team access across your stack."
      />
      <ProjectsView />
    </div>
  );
}
