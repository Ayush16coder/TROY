import { PageHeader } from "@/components/dashboard/page-header";
import { SecurityDashboard } from "@/components/security/security-dashboard";

export const metadata = { title: "Security" };

export default function SecurityPage() {
  return (
    <div className="max-w-[900px] mx-auto">
      <PageHeader title="Security" description="API keys, OAuth connections, audit logs, sessions, and access controls." />
      <SecurityDashboard />
    </div>
  );
}
