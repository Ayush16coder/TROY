"use client";

import { Rocket, GitBranch, Plus, Cpu, Key, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const ACTIONS = [
  { icon: Plus, label: "New Project", desc: "Create from template or repo", href: "/dashboard/projects/new", color: "text-blue-400", border: "border-blue-500/20", bg: "hover:bg-blue-500/5" },
  { icon: Rocket, label: "Trigger Deploy", desc: "Deploy latest commit now", href: "/dashboard/deployments/new", color: "text-emerald-400", border: "border-emerald-500/20", bg: "hover:bg-emerald-500/5" },
  { icon: GitBranch, label: "Sync Repos", desc: "Pull latest from GitHub", href: "/dashboard/repositories", color: "text-violet-400", border: "border-violet-500/20", bg: "hover:bg-violet-500/5" },
  { icon: Cpu, label: "Ask AI", desc: "Debug with GPT-4 or Claude", href: "/dashboard/ai", color: "text-amber-400", border: "border-amber-500/20", bg: "hover:bg-amber-500/5" },
  { icon: Key, label: "Add Integration", desc: "Connect a new provider", href: "/dashboard/integrations", color: "text-cyan-400", border: "border-cyan-500/20", bg: "hover:bg-cyan-500/5" },
];

export function QuickActions() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {ACTIONS.map((a, i) => (
        <motion.div
          key={a.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="flex-shrink-0"
        >
          <Link
            href={a.href}
            className={`group flex items-center gap-3 px-4 py-3 rounded-xl border ${a.border} bg-[#0d1117] ${a.bg} transition-all duration-200 min-w-[200px]`}
          >
            <a.icon className={`w-4 h-4 ${a.color} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white">{a.label}</p>
              <p className="text-[11px] text-zinc-500 truncate">{a.desc}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
