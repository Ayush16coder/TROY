"use client";

import { motion } from "framer-motion";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Cpu, MemoryStick, Globe, AlertTriangle, Timer, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const METRICS = [
  { label: "CPU Usage", value: "34%", trend: [40, 35, 38, 34, 32, 34], color: "bg-blue-500" },
  { label: "Memory", value: "62%", trend: [55, 58, 60, 62, 61, 62], color: "bg-violet-500" },
  { label: "API Latency", value: "124ms", trend: [140, 130, 125, 124, 122, 124], color: "bg-emerald-500" },
  { label: "Error Rate", value: "0.02%", trend: [0.05, 0.03, 0.02, 0.02, 0.01, 0.02], color: "bg-rose-500" },
];

function MiniChart({ trend, color }: { trend: number[]; color: string }) {
  const max = Math.max(...trend);
  return (
    <div className="flex items-end gap-0.5 h-8 mt-3">
      {trend.map((v, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ delay: i * 0.05 }}
          className={cn("flex-1 rounded-sm min-h-[4px]", color)}
          style={{ opacity: 0.4 + (i / trend.length) * 0.6 }}
        />
      ))}
    </div>
  );
}

const INCIDENTS = [
  { title: "Elevated 5xx on api-gateway", severity: "warning", time: "12m ago", status: "investigating" },
  { title: "Redis memory threshold", severity: "info", time: "2h ago", status: "resolved" },
];

export function MonitoringDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Uptime" value="99.98%" icon={Server} accent="emerald" index={0} />
        <MetricCard label="Active Alerts" value="1" icon={AlertTriangle} accent="amber" index={1} />
        <MetricCard label="P99 Latency" value="248ms" icon={Timer} accent="blue" index={2} />
        <MetricCard label="Requests/min" value="12.4k" icon={Globe} accent="cyan" index={3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{m.label}</span>
              {m.label.includes("CPU") && <Cpu className="w-3.5 h-3.5 text-muted-foreground" />}
              {m.label.includes("Memory") && <MemoryStick className="w-3.5 h-3.5 text-muted-foreground" />}
            </div>
            <p className="text-2xl font-semibold mt-1 tabular-nums">{m.value}</p>
            <MiniChart trend={m.trend} color={m.color} />
          </motion.div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold mb-4">Incidents</h3>
        <div className="space-y-3">
          {INCIDENTS.map((inc) => (
            <div key={inc.title} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/40 border border-border/50">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  inc.severity === "warning" ? "bg-amber-500" : "bg-blue-500"
                )}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{inc.title}</p>
                <p className="text-xs text-muted-foreground">{inc.time}</p>
              </div>
              <span className="text-xs capitalize text-muted-foreground">{inc.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
