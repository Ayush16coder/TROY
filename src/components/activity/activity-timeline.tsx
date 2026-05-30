"use client";

import { motion } from "framer-motion";
import {
  Rocket, GitCommit, RefreshCw, Network, Cpu, Users, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EVENTS = [
  { type: "deployment", action: "Deployed troy-web to production", user: "Alex Chen", time: "2m ago", icon: Rocket },
  { type: "commit", action: "Pushed 3 commits to main", user: "Sarah Kim", time: "15m ago", icon: GitCommit },
  { type: "sync", action: "Vercel webhook sync completed", user: "System", time: "22m ago", icon: RefreshCw },
  { type: "infra", action: "Scaled worker replicas to 4", user: "Alex Chen", time: "1h ago", icon: Network },
  { type: "ai", action: "AI analyzed deployment failure", user: "TROY AI", time: "1h ago", icon: Cpu },
  { type: "team", action: "Invited jordan@acme.com as Developer", user: "Sarah Kim", time: "3h ago", icon: Users },
  { type: "security", action: "API key rotated for staging", user: "Alex Chen", time: "5h ago", icon: Shield },
];

const typeColors: Record<string, string> = {
  deployment: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  commit: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  sync: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  infra: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  ai: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  team: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  security: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export function ActivityTimeline() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-5 border-b border-border">
        <h3 className="text-sm font-semibold">Realtime Activity</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Live feed across your workspace</p>
      </div>
      <div className="divide-y divide-border">
        {EVENTS.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors"
          >
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", typeColors[e.type])}>
              <e.icon className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{e.action}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {e.user} · {e.time}
              </p>
            </div>
            <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full capitalize", typeColors[e.type])}>
              {e.type}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
