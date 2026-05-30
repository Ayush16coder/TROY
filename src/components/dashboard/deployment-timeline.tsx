"use client";

import { motion } from "framer-motion";
import { ProviderIcon, type ProviderSlug } from "@/components/ui/provider-icon";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Deployment } from "@/types/database";

type DeploymentWithProject = Deployment & { projects?: { name: string; slug: string } | null };

const PROVIDER_SLUG: Record<string, ProviderSlug> = {
  vercel: "vercel",
  netlify: "netlify",
  railway: "railway",
  render: "render",
  aws: "aws",
};

export function DeploymentTimeline({ deployments }: { deployments: DeploymentWithProject[] }) {
  if (deployments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-2">Deployment Timeline</h3>
        <p className="text-sm text-muted-foreground">No deployments yet. Connect Vercel and sync to populate.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Deployment Timeline</h3>
      <div className="relative pl-4 border-l border-border space-y-4">
        {deployments.slice(0, 6).map((e, i) => {
          const slug = PROVIDER_SLUG[e.provider] ?? "vercel";
          const duration = e.build_duration_ms
            ? `${Math.round(e.build_duration_ms / 1000)}s`
            : e.status === "error"
              ? "failed"
              : "—";
          return (
            <motion.div
              key={e.id}
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
                  e.status === "error" && "bg-rose-500",
                  (e.status === "queued" || e.status === "cancelled") && "bg-muted-foreground"
                )}
              />
              <ProviderIcon provider={slug} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">
                    {e.projects?.name ?? e.project_id.slice(0, 8)}
                  </span>
                  {e.branch && (
                    <span className="text-[11px] font-mono text-muted-foreground">{e.branch}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatRelativeTime(e.created_at)} · {duration}
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
          );
        })}
      </div>
    </div>
  );
}
