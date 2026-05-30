import { PageHeader } from "@/components/dashboard/page-header";
import { EnvironmentsView } from "@/components/environments/environments-view";

export const metadata = { title: "Environments" };

export default function EnvironmentsPage() {
  return (
    <div className="max-w-[1000px] mx-auto">
      <PageHeader title="Environments" description="Production, preview, and development environment variables across projects." />
      <EnvironmentsView />
    </div>
  );
}
