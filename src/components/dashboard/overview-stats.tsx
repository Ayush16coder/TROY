"use client";

import {
  Rocket, GitBranch, CheckCircle2, Clock, TrendingUp, AlertCircle, Users, Cpu,
} from "lucide-react";
import { MetricCard } from "./metric-card";

export type OverviewStatsData = {
  totalDeployments: string;
  successRate: string;
  activeProjects: string;
  connectedProviders: string;
  avgBuildTime: string;
  activeIncidents: string;
  teamMembers: string;
  aiUsage: string;
};

const CONFIG = [
  { key: "totalDeployments" as const, label: "Total Deployments", icon: Rocket, accent: "blue" as const },
  { key: "successRate" as const, label: "Success Rate", icon: CheckCircle2, accent: "emerald" as const },
  { key: "activeProjects" as const, label: "Active Projects", icon: GitBranch, accent: "violet" as const },
  { key: "connectedProviders" as const, label: "Connected Providers", icon: TrendingUp, accent: "cyan" as const },
  { key: "avgBuildTime" as const, label: "Avg Build Time", icon: Clock, accent: "amber" as const },
  { key: "activeIncidents" as const, label: "Active Incidents", icon: AlertCircle, accent: "neutral" as const },
  { key: "teamMembers" as const, label: "Team Members", icon: Users, accent: "violet" as const },
  { key: "aiUsage" as const, label: "AI Sessions", icon: Cpu, accent: "rose" as const },
];

export function OverviewStats({ stats }: { stats: OverviewStatsData }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {CONFIG.map((s, i) => (
        <MetricCard
          key={s.key}
          label={s.label}
          value={stats[s.key]}
          icon={s.icon}
          accent={s.accent}
          index={i}
        />
      ))}
    </div>
  );
}
