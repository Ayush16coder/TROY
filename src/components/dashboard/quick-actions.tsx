"use client";

import { Rocket, GitBranch, Plus, Cpu, Key, ArrowRight, FolderPlus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const ACTIONS = [
  { icon: Plus, label: "New Project", desc: "Create from template or repo", href: "/dashboard/new" },
  { icon: Rocket, label: "Deploy", desc: "Trigger production deploy", href: "/dashboard/deployments" },
  { icon: Key, label: "Connect Provider", desc: "GitHub, Vercel, AWS...", href: "/dashboard/integrations" },
  { icon: Cpu, label: "Ask AI", desc: "Debug with GPT, Claude, Gemini", href: "/dashboard/ai" },
  { icon: GitBranch, label: "Sync Repos", desc: "Pull latest from GitHub", href: "/dashboard/repositories" },
  { icon: FolderPlus, label: "Create Workspace", desc: "Spin up a new workspace", href: "/dashboard/settings" },
];

export function QuickActions() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
      {ACTIONS.map((a, i) => (
        <motion.div
          key={a.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex-shrink-0"
        >
          <Link
            href={a.href}
            className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-secondary/80 hover:border-primary/20 transition-all duration-200 min-w-[200px]"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <a.icon className="w-4 h-4 text-foreground" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">{a.label}</p>
              <p className="text-[11px] text-muted-foreground truncate">{a.desc}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
