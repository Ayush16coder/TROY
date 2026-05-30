"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  accent?: "blue" | "violet" | "emerald" | "amber" | "cyan" | "rose" | "neutral";
  index?: number;
}

const accents = {
  blue: { icon: "text-blue-500", bg: "bg-blue-500/8", border: "border-blue-500/15" },
  violet: { icon: "text-violet-500", bg: "bg-violet-500/8", border: "border-violet-500/15" },
  emerald: { icon: "text-emerald-500", bg: "bg-emerald-500/8", border: "border-emerald-500/15" },
  amber: { icon: "text-amber-500", bg: "bg-amber-500/8", border: "border-amber-500/15" },
  cyan: { icon: "text-cyan-500", bg: "bg-cyan-500/8", border: "border-cyan-500/15" },
  rose: { icon: "text-rose-500", bg: "bg-rose-500/8", border: "border-rose-500/15" },
  neutral: { icon: "text-muted-foreground", bg: "bg-secondary/50", border: "border-border" },
};

export function MetricCard({ label, value, delta, icon: Icon, accent = "neutral", index = 0 }: MetricCardProps) {
  const a = accents[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className={cn("p-4 rounded-xl border bg-card", a.bg, a.border)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-background/60 border border-border/50")}>
          <Icon className={cn("w-4 h-4", a.icon)} strokeWidth={1.75} />
        </div>
        {delta && (
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">{delta}</span>
        )}
      </div>
      <p className="text-xl font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1 leading-tight">{label}</p>
    </motion.div>
  );
}
