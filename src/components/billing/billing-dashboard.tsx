"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    features: ["3 projects", "5 team members", "Basic integrations", "7-day log retention"],
    current: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    features: ["Unlimited projects", "25 team members", "All integrations", "AI workspace", "90-day logs", "Priority support"],
    current: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["SSO & SAML", "Dedicated support", "Custom SLAs", "Audit logs", "VPC deployment", "SOC 2 reports"],
    current: false,
  },
];

const USAGE = [
  { label: "Deployments", used: 847, limit: 2000, pct: 42 },
  { label: "AI Tokens", used: 1.2, limit: 5, pct: 24, unit: "M" },
  { label: "Log Storage", used: 12, limit: 50, pct: 24, unit: "GB" },
  { label: "Team Seats", used: 8, limit: 25, pct: 32 },
];

export function BillingDashboard() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold mb-4">Current Plan</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold">Pro</span>
          <span className="text-muted-foreground">$49/month · Renews Jun 30, 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {USAGE.map((u) => (
          <div key={u.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{u.label}</span>
              <span className="font-mono text-foreground">
                {u.used}{u.unit ?? ""} / {u.limit}{u.unit ?? ""}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${u.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "rounded-xl border p-6 flex flex-col",
              plan.current ? "border-primary bg-primary/5" : "border-border bg-card"
            )}
          >
            <h3 className="font-semibold text-lg">{plan.name}</h3>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
            </div>
            <ul className="space-y-2 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant={plan.current ? "outline" : "default"} disabled={plan.current} className="w-full">
              {plan.current ? "Current plan" : plan.name === "Enterprise" ? "Contact sales" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
