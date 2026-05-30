"use client";

import { motion } from "framer-motion";
import { ProviderIcon, type ProviderSlug, type ProviderStatus } from "@/components/ui/provider-icon";
import { cn } from "@/lib/utils";
import type { ProviderHealthItem } from "@/lib/data/dashboard";

const SLUG_MAP: Record<string, ProviderSlug> = {
  github: "github",
  vercel: "vercel",
  supabase: "supabase",
  railway: "railway",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  cloudflare: "cloudflare",
};

export function ProviderHealth({ providers }: { providers: ProviderHealthItem[] }) {
  const connected = providers.filter((p) => p.status === "connected").length;

  if (providers.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Connect providers in Integrations to see health status.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Provider Health</h3>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
          {connected}/{providers.length} operational
        </span>
      </div>
      <div className="space-y-2">
        {providers.map((p, i) => {
          const slug = SLUG_MAP[p.provider];
          if (!slug) return null;
          return (
            <motion.div
              key={p.provider}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <ProviderIcon provider={slug} size="sm" status={p.status as ProviderStatus} />
              <span className="text-sm font-medium text-foreground flex-1 capitalize">{p.provider}</span>
              <span
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full capitalize",
                  p.status === "connected" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  p.status === "idle" && "bg-muted text-muted-foreground"
                )}
              >
                {p.status}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
