"use client";

import { motion } from "framer-motion";
import { RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";
import { ProviderIcon, type ProviderSlug } from "@/components/ui/provider-icon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const SYNC_EVENTS = [
  { provider: "github" as ProviderSlug, event: "repository.push", status: "completed", time: "2m ago", duration: "1.2s" },
  { provider: "vercel" as ProviderSlug, event: "deployment.ready", status: "completed", time: "5m ago", duration: "0.8s" },
  { provider: "supabase" as ProviderSlug, event: "database.migration", status: "processing", time: "now", duration: "—" },
  { provider: "railway" as ProviderSlug, event: "service.scale", status: "completed", time: "12m ago", duration: "2.1s" },
  { provider: "cloudflare" as ProviderSlug, event: "dns.update", status: "failed", time: "1h ago", duration: "timeout" },
];

const statusIcon = {
  completed: CheckCircle2,
  processing: RefreshCw,
  failed: XCircle,
  pending: Clock,
};

export function SyncEngine() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
        <div>
          <p className="text-sm font-medium">Sync Engine Status</p>
          <p className="text-xs text-muted-foreground mt-0.5">Processing events via WebSocket · PostgreSQL logical replication</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
          <Button size="sm" variant="outline">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Force Sync
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-secondary/30">
          <h3 className="text-sm font-semibold">Recent Sync Events</h3>
        </div>
        <div className="divide-y divide-border">
          {SYNC_EVENTS.map((e, i) => {
            const Icon = statusIcon[e.status as keyof typeof statusIcon] ?? Clock;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 hover:bg-secondary/20"
              >
                <ProviderIcon provider={e.provider} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-foreground">{e.event}</p>
                  <p className="text-xs text-muted-foreground">{e.time}</p>
                </div>
                <Icon
                  className={cn(
                    "w-4 h-4 flex-shrink-0",
                    e.status === "completed" && "text-emerald-500",
                    e.status === "processing" && "text-blue-500 animate-spin",
                    e.status === "failed" && "text-rose-500"
                  )}
                />
                <span className="text-xs font-mono text-muted-foreground w-16 text-right">{e.duration}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
