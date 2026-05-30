"use client";

import { motion } from "framer-motion";
import { ProviderIcon, type ProviderSlug, type ProviderStatus } from "@/components/ui/provider-icon";
import { cn } from "@/lib/utils";

const PROVIDERS: { slug: ProviderSlug; status: ProviderStatus; latency: string }[] = [
  { slug: "github", status: "connected", latency: "12ms" },
  { slug: "vercel", status: "connected", latency: "24ms" },
  { slug: "supabase", status: "syncing", latency: "31ms" },
  { slug: "railway", status: "connected", latency: "45ms" },
  { slug: "docker", status: "connected", latency: "18ms" },
  { slug: "kubernetes", status: "idle", latency: "—" },
  { slug: "aws", status: "connected", latency: "52ms" },
  { slug: "cloudflare", status: "connected", latency: "8ms" },
];

export function ProviderHealth() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Provider Health</h3>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">7/8 operational</span>
      </div>
      <div className="space-y-2">
        {PROVIDERS.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <ProviderIcon provider={p.slug} size="sm" status={p.status} />
            <span className="text-sm font-medium text-foreground flex-1 capitalize">{p.slug}</span>
            <span className="text-[11px] font-mono text-muted-foreground">{p.latency}</span>
            <span
              className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                p.status === "connected" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                p.status === "syncing" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                p.status === "idle" && "bg-muted text-muted-foreground"
              )}
            >
              {p.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
