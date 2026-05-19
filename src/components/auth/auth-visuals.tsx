"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2, Clock, XCircle, AlertCircle,
  GitBranch, Search, Filter, Bell, Settings,
  LayoutDashboard, Rocket, Activity, Box, ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const DEPLOYMENTS = [
  { name: "api-gateway",    branch: "main",        env: "prod",    status: "success", time: "2m ago" },
  { name: "web-frontend",   branch: "feat/ui-v2",  env: "staging", status: "running", time: "5m ago" },
  { name: "auth-service",   branch: "main",        env: "prod",    status: "success", time: "12m ago" },
  { name: "worker-queue",   branch: "hotfix/mem",  env: "prod",    status: "failed",  time: "18m ago" },
  { name: "data-pipeline",  branch: "dev",         env: "dev",     status: "queued",  time: "24m ago" },
  { name: "cdn-edge",       branch: "main",        env: "prod",    status: "success", time: "31m ago" },
];

const STATUS_MAP = {
  success: { label: "Live",      lightColor: "#16a34a", lightBg: "#dcfce7", darkColor: "#22c55e", darkBg: "rgba(34,197,94,0.12)", Icon: CheckCircle2 },
  running: { label: "Deploying", lightColor: "#d97706", lightBg: "#fef3c7", darkColor: "#f59e0b", darkBg: "rgba(245,158,11,0.12)", Icon: Clock        },
  failed:  { label: "Failed",    lightColor: "#dc2626", lightBg: "#fee2e2", darkColor: "#ef4444", darkBg: "rgba(239,68,68,0.12)", Icon: XCircle      },
  queued:  { label: "Queued",    lightColor: "#4b5563", lightBg: "#f3f4f6", darkColor: "#9ca3af", darkBg: "rgba(107,114,128,0.12)", Icon: AlertCircle  },
};

const ENV_MAP: Record<string, { lightColor: string; lightBg: string; darkColor: string; darkBg: string }> = {
  prod:    { lightColor: "#4f46e5", lightBg: "#e0e7ff", darkColor: "#818cf8", darkBg: "rgba(129,140,248,0.12)" },
  staging: { lightColor: "#ea580c", lightBg: "#ffedd5", darkColor: "#fb923c", darkBg: "rgba(251,146,60,0.12)" },
  dev:     { lightColor: "#4b5563", lightBg: "#f3f4f6", darkColor: "#9ca3af", darkBg: "rgba(107,114,128,0.12)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status as keyof typeof STATUS_MAP] ?? STATUS_MAP.queued;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10px] font-semibold whitespace-nowrap"
    >
      <style>{`
        .status-${status} { color: ${s.lightColor}; background: ${s.lightBg}; }
        .dark .status-${status} { color: ${s.darkColor}; background: ${s.darkBg}; }
      `}</style>
      <span className={`status-${status} inline-flex items-center gap-1 px-2 py-[3px] rounded-full`}>
        <s.Icon className="w-[9px] h-[9px]" />
        {s.label}
      </span>
    </span>
  );
}

function EnvBadge({ env }: { env: string }) {
  const e = ENV_MAP[env] ?? ENV_MAP.dev;
  return (
    <span
      className="text-[10px] font-mono font-medium"
    >
      <style>{`
        .env-${env} { color: ${e.lightColor}; background: ${e.lightBg}; }
        .dark .env-${env} { color: ${e.darkColor}; background: ${e.darkBg}; }
      `}</style>
      <span className={`env-${env} px-2 py-[3px] rounded-full`}>
        {env}
      </span>
    </span>
  );
}

export function AuthVisuals() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="hidden lg:flex flex-col w-[54%] max-w-[720px] relative overflow-visible bg-transparent">
      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col h-full p-10 justify-center">

        {/* Floating app card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="rounded-2xl overflow-hidden bg-white dark:bg-[#0c0d10] border border-transparent dark:border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05),0_-10px_40px_rgba(99,102,241,0.05)] dark:shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)] transition-colors duration-300"
        >
          {/* ── Sidebar + main two-column layout ── */}
          <div className="flex min-h-[420px]">

            {/* Sidebar */}
            <div className="w-16 flex flex-col items-center py-5 gap-1.5 flex-shrink-0 bg-slate-50 dark:bg-[#0f1014] border-r border-slate-200 dark:border-white/5 transition-colors duration-300">
              {/* logo mark */}
              <div className="w-10 h-10 rounded-[10px] mb-4 flex items-center justify-center shadow-sm bg-gradient-to-br from-indigo-500 to-blue-500 dark:shadow-[0_0_16px_rgba(99,102,241,0.35)]">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              {[
                { Icon: LayoutDashboard, active: false },
                { Icon: Rocket,          active: true  },
                { Icon: Activity,        active: false },
                { Icon: Box,             active: false },
              ].map(({ Icon, active }, i) => (
                <div key={i}
                  className={`w-10 h-10 rounded-[10px] flex items-center justify-center cursor-pointer transition-colors ${
                    active 
                      ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" 
                      : "text-slate-500 dark:text-white/30 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.5 : 2} />
                </div>
              ))}
              <div className="flex-1" />
              {[Bell, Settings].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-[10px] flex items-center justify-center text-slate-500 dark:text-white/30 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>

            {/* Main panel */}
            <div className="flex-1 flex flex-col bg-white dark:bg-[#0c0d10] transition-colors duration-300">
              {/* Top bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5 transition-colors duration-300">
                <div>
                  <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1 transition-colors">
                    TROY / DEPLOYMENTS
                  </div>
                  <div className="text-[15px] font-semibold text-zinc-900 dark:text-white tracking-tight transition-colors">Deployments</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-zinc-500 dark:text-zinc-400 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors">
                    <Search className="w-[13px] h-[13px]" />
                    <span>Search</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium text-zinc-500 dark:text-zinc-400 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors">
                    <Filter className="w-[13px] h-[13px]" />
                    <span>Filter</span>
                  </div>
                </div>
              </div>

              {/* Table header */}
              <div className="grid px-6 py-2.5 border-b border-slate-100 dark:border-white/5 transition-colors duration-300" style={{ gridTemplateColumns: "1fr 100px 80px 90px 60px" }}>
                {["Name", "Branch", "Env", "Status", ""].map((h) => (
                  <div key={h} className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500 transition-colors">{h}</div>
                ))}
              </div>

              {/* Rows */}
              <div className="flex-1 overflow-hidden">
                {DEPLOYMENTS.map((d, i) => (
                  <motion.div
                    key={d.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.07, ease: "easeOut" }}
                    className="grid px-6 py-3 items-center group cursor-pointer border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-300"
                    style={{ gridTemplateColumns: "1fr 100px 80px 90px 60px" }}
                  >
                    {/* name */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 transition-colors duration-300">
                        <Rocket className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-zinc-900 dark:text-zinc-200 transition-colors">{d.name}</div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-500 transition-colors">{d.time}</div>
                      </div>
                    </div>
                    {/* branch */}
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 transition-colors">
                      <GitBranch className="w-3 h-3" />
                      <span className="truncate">{d.branch}</span>
                    </div>
                    {/* env */}
                    <div><EnvBadge env={d.env} /></div>
                    {/* status */}
                    <div><StatusBadge status={d.status} /></div>
                    {/* arrow */}
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-600" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer bar */}
              <div className="flex items-center justify-between px-6 py-3 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-500 transition-colors">{DEPLOYMENTS.length} deployments</span>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-[11px] font-medium text-green-600 dark:text-green-500 transition-colors">All systems operational</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
