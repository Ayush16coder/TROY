"use client";

import { motion } from "framer-motion";
import { ProviderIcon, type ProviderSlug } from "@/components/ui/provider-icon";
import { cn } from "@/lib/utils";

const PIPELINE: { provider: ProviderSlug; label: string }[] = [
  { provider: "github", label: "Source Control" },
  { provider: "vercel", label: "Edge Deploy" },
  { provider: "supabase", label: "Database" },
  { provider: "aws", label: "Cloud" },
  { provider: "docker", label: "Containers" },
  { provider: "kubernetes", label: "Orchestration" },
];

export function InfraTopology({ className }: { className?: string }) {
  return (
    <div className={cn("relative rounded-xl border border-border bg-card overflow-hidden", className)}>
      <div className="absolute inset-0 infra-grid opacity-40 pointer-events-none" />
      <div className="relative p-8 md:p-12">
        <div className="flex flex-col items-center gap-0">
          {PIPELINE.map((node, i) => (
            <div key={node.provider} className="flex flex-col items-center w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                className="flex flex-col items-center gap-2 z-10"
              >
                <div className="relative">
                  <ProviderIcon provider={node.provider} size="lg" status="connected" />
                  <motion.div
                    className="absolute -inset-2 rounded-2xl border border-primary/20"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                  />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">{node.label}</span>
              </motion.div>
              {i < PIPELINE.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.12 + 0.2, duration: 0.3 }}
                  className="flex flex-col items-center py-3 origin-top"
                >
                  <div className="w-px h-8 bg-gradient-to-b from-border via-primary/40 to-border" />
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-primary mt-0"
                    animate={{ y: [0, 24, 0], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}
                  />
                </motion.div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-6 flex-wrap">
          {(["cloudflare", "anthropic", "gemini"] as ProviderSlug[]).map((p) => (
            <ProviderIcon key={p} provider={p} size="sm" status="connected" showLabel />
          ))}
        </div>
      </div>
    </div>
  );
}
