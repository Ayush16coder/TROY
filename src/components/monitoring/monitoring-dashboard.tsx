"use client";

import { MetricCard } from "@/components/dashboard/metric-card";
import { Server, AlertTriangle, Timer, Globe } from "lucide-react";

export function MonitoringDashboard({
  stats,
  errorDeployments,
}: {
  stats: { uptime: string; activeAlerts: string; p99Latency: string; requestsPerMin: string };
  errorDeployments: number;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Deploy Success Rate" value={stats.uptime} icon={Server} accent="emerald" index={0} />
        <MetricCard label="Failed Deployments" value={stats.activeAlerts} icon={AlertTriangle} accent="amber" index={1} />
        <MetricCard label="Avg Build Time" value={stats.p99Latency} icon={Timer} accent="blue" index={2} />
        <MetricCard label="Total Deployments" value={stats.requestsPerMin} icon={Globe} accent="cyan" index={3} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold mb-2">Incidents</h3>
        {errorDeployments === 0 ? (
          <p className="text-sm text-muted-foreground">No failed deployments in recent history.</p>
        ) : (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            {errorDeployments} deployment(s) failed — review on the Deployments page.
          </p>
        )}
      </div>
    </div>
  );
}
