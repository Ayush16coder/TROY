import { PageHeader } from "@/components/dashboard/page-header";
import { BillingDashboard } from "@/components/billing/billing-dashboard";

export const metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <div className="max-w-[1000px] mx-auto">
      <PageHeader title="Billing" description="Subscription, usage, team billing, and invoice history." />
      <BillingDashboard />
    </div>
  );
}
