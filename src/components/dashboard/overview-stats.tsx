"use client";

import { Rocket, GitBranch, CheckCircle2, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const STATS = [
  { label: "Total Deployments", value: "1,247", delta: "+12%", icon: Rocket, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { label: "Repositories", value: "34", delta: "+3", icon: GitBranch, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
  { label: "Success Rate", value: "98.3%", delta: "+0.4%", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { label: "Avg Build Time", value: "47s", delta: "-8s", icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { label: "Active Providers", value: "6", delta: null, icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  { label: "Active Incidents", value: "0", delta: null, icon: AlertCircle, color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/20" },
];

export function OverviewStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className={`p-4 rounded-xl border ${s.border} ${s.bg}`}
        >
          <div className="flex items-center justify-between mb-2">
            <s.icon className={`w-4 h-4 ${s.color}`} />
            {s.delta && (
              <span className="text-[10px] text-emerald-400 font-mono">{s.delta}</span>
            )}
          </div>
          <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
