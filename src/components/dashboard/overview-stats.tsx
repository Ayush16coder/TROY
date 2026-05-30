"use client";

import {
  Rocket, GitBranch, CheckCircle2, Clock, TrendingUp, AlertCircle,
  Users, Cpu,
} from "lucide-react";
import { MetricCard } from "./metric-card";

const STATS = [
  { label: "Total Deployments", value: "1,247", delta: "+12%", icon: Rocket, accent: "blue" as const },
  { label: "Success Rate", value: "98.3%", delta: "+0.4%", icon: CheckCircle2, accent: "emerald" as const },
  { label: "Active Projects", value: "24", delta: "+2", icon: GitBranch, accent: "violet" as const },
  { label: "Connected Providers", value: "12", icon: TrendingUp, accent: "cyan" as const },
  { label: "Avg Build Time", value: "47s", delta: "-8s", icon: Clock, accent: "amber" as const },
  { label: "Active Incidents", value: "0", icon: AlertCircle, accent: "neutral" as const },
  { label: "Team Members", value: "8", icon: Users, accent: "violet" as const },
  { label: "AI Usage", value: "2.4k", delta: "+18%", icon: Cpu, accent: "rose" as const },
];

export function OverviewStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {STATS.map((s, i) => (
        <MetricCard key={s.label} {...s} index={i} />
      ))}
    </div>
  );
}
