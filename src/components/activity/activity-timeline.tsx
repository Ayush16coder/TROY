"use client";

import { motion } from "framer-motion";
import {
  Rocket, GitCommit, RefreshCw, Network, Cpu, Users, Shield, Activity,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { ActivityLog } from "@/types/database";

const ICON_MAP: Record<string, React.ElementType> = {
  deployment: Rocket,
  repository: GitCommit,
  integration: RefreshCw,
  project: Network,
  team: Users,
  security: Shield,
  ai: Cpu,
};

const typeColors: Record<string, string> = {
  deployment: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  repository: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  integration: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  project: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  team: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  security: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

function formatAction(action: string, meta: Record<string, unknown>): string {
  const parts = action.split(".");
  const verb = parts.slice(1).join(" ").replace(/_/g, " ") || action;
  if (meta?.project) return `${verb}: ${meta.project}`;
  if (meta?.provider) return `${verb}: ${meta.provider}`;
  if (meta?.count != null) return `${verb} (${meta.count} items)`;
  if (meta?.email) return `${verb}: ${meta.email}`;
  return verb;
}

export function ActivityTimeline({ activities }: { activities: ActivityLog[] }) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No activity recorded yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-semibold">Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {activities.map((item, i) => {
          const resourceType = item.resource_type as string;
          const Icon = ICON_MAP[resourceType] ?? Activity;
          const meta = (item.metadata ?? {}) as Record<string, unknown>;
          const color = typeColors[resourceType] ?? "bg-secondary text-muted-foreground";

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-start gap-4 p-4 hover:bg-secondary/30"
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", color)}>
                <Icon className="w-4 h-4" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{formatAction(item.action, meta)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatRelativeTime(item.created_at)}</p>
              </div>
              <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize", color)}>
                {resourceType}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
