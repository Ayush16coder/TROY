"use client";

import { motion } from "framer-motion";
import { ProviderIcon, type ProviderSlug } from "@/components/ui/provider-icon";
import { cn } from "@/lib/utils";

const EVENTS = [
  { project: "troy-web", branch: "main", status: "ready", provider: "vercel" as ProviderSlug, time: "2m ago", duration: "42s" },
  { project: "api-gateway", branch: "feat/auth", status: "building", provider: "railway" as ProviderSlug, time: "5m ago", duration: "—" },
  { project: "docs", branch: "main", status: "ready", provider: "netlify" as ProviderSlug, time: "18m ago", duration: "28s" },
  { project: "worker", branch: "fix/queue", status: "error", provider: "render" as ProviderSlug, time: "1h ago", duration: "failed" },
];

export function DeploymentTimeline() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Deployment Timeline</h3>
      <div className="relative pl-4 border-l border-border space-y-4">
        {EVENTS.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="relative flex items-start gap-3"
          >
            <span
              className={cn(
                "absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background",
                e.status === "ready" && "bg-emerald-500",
                e.status === "building" && "bg-amber-500 animate-pulse",
                e.status === "error" && "bg-rose-500"
              )}
            />
            <ProviderIcon provider={e.provider} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground">{e.project}</span>
                <span className="text-[11px] font-mono text-muted-foreground">{e.branch}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {e.time} · {e.duration}
              </p>
            </div>
            <span
              className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                e.status === "ready" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                e.status === "building" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                e.status === "error" && "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              )}
            >
              {e.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
