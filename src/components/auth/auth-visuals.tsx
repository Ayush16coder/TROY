"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2, Clock, XCircle, AlertCircle,
  Search, Bell, TrendingUp, TrendingDown, Hexagon, Settings,
  Home, Table, Terminal, Database, Lock, Folder, Activity, MousePointer2,
  Lightbulb, Telescope, List, LayoutGrid
} from "lucide-react";
import { useEffect, useState } from "react";
import { ProviderIcon, ProviderSlug } from "@/components/ui/provider-icon";

const DEPLOYMENTS: { name: string; branch: string; env: string; status: string; time: string; provider: ProviderSlug }[] = [
  { name: "api-gateway",    branch: "main",        env: "prod",    status: "success", time: "2m ago", provider: "vercel" },
  { name: "web-frontend",   branch: "feat/ui-v2",  env: "staging", status: "running", time: "5m ago", provider: "github" },
  { name: "auth-service",   branch: "main",        env: "prod",    status: "success", time: "12m ago", provider: "docker" },
  { name: "worker-queue",   branch: "hotfix/mem",  env: "prod",    status: "failed",  time: "18m ago", provider: "aws" },
  { name: "data-pipeline",  branch: "dev",         env: "dev",     status: "queued",  time: "24m ago", provider: "cloudflare" },
  { name: "cdn-edge",       branch: "main",        env: "prod",    status: "success", time: "31m ago", provider: "cloudflare" },
  { name: "payment-api",    branch: "main",        env: "prod",    status: "success", time: "1h ago", provider: "stripe" },
  { name: "search-indexer", branch: "fix/search",  env: "staging", status: "queued",  time: "2h ago", provider: "docker" },
];

const STATUS_MAP = {
  success: { label: "Live",      lightColor: "#16a34a", lightBg: "#dcfce7", darkColor: "#22c55e", darkBg: "rgba(34,197,94,0.12)", Icon: CheckCircle2 },
  running: { label: "Deploying", lightColor: "#d97706", lightBg: "#fef3c7", darkColor: "#f59e0b", darkBg: "rgba(245,158,11,0.12)", Icon: Clock        },
  failed:  { label: "Failed",    lightColor: "#dc2626", lightBg: "#fee2e2", darkColor: "#ef4444", darkBg: "rgba(239,68,68,0.12)", Icon: XCircle      },
  queued:  { label: "Queued",    lightColor: "#4b5563", lightBg: "#f3f4f6", darkColor: "#9ca3af", darkBg: "rgba(107,114,128,0.12)", Icon: AlertCircle  },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status as keyof typeof STATUS_MAP] ?? STATUS_MAP.queued;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10px] font-semibold whitespace-nowrap">
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

function MiniSparkline({ data, color }: { data: number[], color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const width = 100;
  const height = 30;
  const step = width / (data.length - 1);
  
  const points = data.map((d, i) => {
    const y = height - ((d - min) / (range || 1)) * height;
    return `${i * step},${y}`;
  }).join(" ");

  return (
    <svg width="100%" height="100%" viewBox={`0 -5 ${width} ${height + 10}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#gradient-${color.replace('#', '')})`} />
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const METRICS = [
  { label: "Total Requests", value: "1.2M", change: "+12.5%", trend: "up", color: "#6366f1", data: [4, 5, 3, 6, 8, 7, 10, 12] },
  { label: "Avg Latency", value: "42ms", change: "-5.2%", trend: "down", color: "#22c55e", data: [60, 55, 48, 52, 45, 42, 40, 42] },
  { label: "Error Rate", value: "0.12%", change: "-0.04%", trend: "down", color: "#f59e0b", data: [0.5, 0.4, 0.2, 0.3, 0.15, 0.1, 0.12, 0.12] },
  { label: "Active Nodes", value: "24", change: "+2", trend: "up", color: "#3b82f6", data: [20, 20, 22, 22, 24, 24, 24, 24] },
];

export function AuthVisuals() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="hidden lg:flex flex-col w-[54%] max-w-[720px] relative overflow-visible bg-transparent">
      <div className="relative z-10 w-full h-full">
        <div className="absolute top-1/2 -translate-y-1/2 -left-8 lg:-left-24">
          <motion.div
            initial={{ opacity: 0, x: 50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="w-[1100px] h-[640px] rounded-l-3xl overflow-hidden bg-[#f8fafc] dark:bg-[#0c0d10] border-y border-l border-transparent dark:border-white/10 shadow-[-40px_0px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-[-40px_0px_120px_-20px_rgba(0,0,0,0.8)] transition-colors duration-300 flex pointer-events-none select-none"
          >
            {/* ── Sidebar ── */}
            <div className="w-[64px] flex flex-col items-center py-6 gap-6 flex-shrink-0 bg-white dark:bg-[#0f1014] border-r border-slate-200 dark:border-white/5 z-10 transition-colors duration-300">
              
              {/* Group 1 */}
              <div className="flex flex-col gap-4 w-full items-center">
                {[Home, Table, Terminal].map((Icon, i) => (
                  <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${i === 0 ? 'bg-indigo-50 dark:bg-white/5 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-200'}`}>
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                ))}
              </div>
              
              <div className="w-8 h-px bg-slate-200 dark:bg-white/5" />

              {/* Group 2 */}
              <div className="flex flex-col gap-4 w-full items-center">
                {[Database, Lock, Folder, Activity, MousePointer2].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-200 transition-colors">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                ))}
              </div>

              <div className="w-8 h-px bg-slate-200 dark:bg-white/5" />

              {/* Group 3 */}
              <div className="flex flex-col gap-4 w-full items-center">
                {[Lightbulb, Telescope, List, LayoutGrid].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-200 transition-colors">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                ))}
              </div>
              
              <div className="flex-1" />
              
              <div className="w-8 h-px bg-slate-200 dark:bg-white/5" />

              <div className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-200 transition-colors">
                <Settings className="w-5 h-5" strokeWidth={1.5} />
              </div>
            </div>

            {/* ── Main Panel ── */}
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#0c0d10] overflow-hidden transition-colors duration-300">
              {/* Top Bar */}
              <div className="h-16 flex items-center justify-between px-8 bg-white dark:bg-[#0f1014] border-b border-slate-200 dark:border-white/5 flex-shrink-0 transition-colors duration-300">
                <div className="flex items-center gap-6">
                  {/* TROY Unified Logo */}
                  <div className="flex items-center gap-1.5 select-none mr-2">
                    <Hexagon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                    <div className="flex items-baseline">
                      <span className="text-xl font-extrabold tracking-tighter font-serif text-foreground transition-colors">T</span>
                      <span className="text-lg font-light tracking-widest font-sans text-muted-foreground transition-colors ml-0.5">R</span>
                      <span className="text-xl font-black font-mono text-primary transition-colors">O</span>
                      <span className="text-lg font-medium italic font-serif text-foreground transition-colors">Y</span>
                    </div>
                  </div>
                  <div className="h-4 w-px bg-slate-200 dark:bg-white/10 transition-colors" />
                  <div className="flex items-center gap-6 text-[13px] font-medium text-slate-500 dark:text-zinc-400">
                    <div className="text-zinc-900 dark:text-white transition-colors border-b-2 border-indigo-500 pb-5 translate-y-[10px]">Dashboard</div>
                    <div className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors pb-5 translate-y-[10px] border-b-2 border-transparent">Analytics</div>
                    <div className="hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-colors pb-5 translate-y-[10px] border-b-2 border-transparent">Settings</div>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-[12px] text-slate-500 dark:text-zinc-400 transition-colors">
                    <Search className="w-3.5 h-3.5" />
                    <span className="pr-4">Search infrastructure...</span>
                  </div>
                  <Bell className="w-4 h-4 text-slate-500 dark:text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors" />
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                    JD
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
                
                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-4 flex-shrink-0">
                  {METRICS.map((m) => (
                    <div key={m.label} className="p-4 rounded-xl bg-white dark:bg-[#14151a] border border-slate-200 dark:border-white/5 shadow-sm transition-colors duration-300">
                      <div className="text-[12px] font-medium text-slate-500 dark:text-zinc-400 mb-2 transition-colors">{m.label}</div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight transition-colors">{m.value}</div>
                          <div className={`text-[11px] font-medium mt-1 flex items-center gap-0.5 ${m.trend === 'up' ? (m.label === 'Error Rate' ? 'text-red-500' : 'text-emerald-500') : (m.label === 'Error Rate' ? 'text-emerald-500' : 'text-emerald-500')}`}>
                            {m.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {m.change}
                          </div>
                        </div>
                        <div className="w-20 h-10 -mb-1">
                          <MiniSparkline data={m.data} color={m.color} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Main Panels */}
                <div className="flex-1 flex gap-6 min-h-0">
                  
                  {/* Realistic Graph Area */}
                  <div className="flex-[5] flex flex-col rounded-xl bg-white dark:bg-[#14151a] border border-slate-200 dark:border-white/5 shadow-sm p-6 transition-colors duration-300 overflow-hidden">
                    <div className="flex items-center justify-between mb-2 flex-shrink-0">
                      <div className="text-[15px] font-semibold text-zinc-900 dark:text-white transition-colors">Network Traffic (TB)</div>
                      <div className="flex gap-2 p-1 rounded-lg bg-slate-100 dark:bg-white/5">
                        {["1H", "24H", "7D", "30D"].map((t, i) => (
                          <div key={t} className={`px-3 py-1 text-[11px] font-medium rounded-md cursor-pointer transition-all ${i === 1 ? 'bg-white dark:bg-[#27272a] text-zinc-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 relative w-full mt-4 ml-2">
                      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" className="absolute inset-0 overflow-visible">
                        <defs>
                          <linearGradient id="area-grad-1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="area-grad-2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        
                        {/* Grid lines & Y-axis */}
                        {[20, 40, 60, 80].map((y) => (
                          <g key={y}>
                            <line x1="0" y1={y} x2="100" y2={y} stroke="currentColor" className="text-slate-200 dark:text-white/10 transition-colors" strokeWidth="0.5" strokeDasharray="1 2" />
                            <text x="-3" y={y + 1} textAnchor="end" fontSize="3.5" className="fill-slate-400 dark:fill-zinc-500 font-mono">{(100 - y) * 2}k</text>
                          </g>
                        ))}
                        
                        {/* X-axis */}
                        {["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"].map((time, i) => (
                          <text key={time} x={i * 20} y="106" textAnchor="middle" fontSize="3.5" className="fill-slate-400 dark:fill-zinc-500 font-mono">{time}</text>
                        ))}

                        {/* Area 2 (Back) */}
                        <path d="M0,85 C10,80 15,60 25,65 C35,70 40,40 50,45 C60,50 70,30 80,35 C90,40 95,20 100,10 L100,100 L0,100 Z" fill="url(#area-grad-2)" />
                        <path d="M0,85 C10,80 15,60 25,65 C35,70 40,40 50,45 C60,50 70,30 80,35 C90,40 95,20 100,10" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeLinecap="round" />

                        {/* Area 1 (Front) */}
                        <path d="M0,70 C10,65 15,40 25,45 C35,50 40,20 50,25 C60,30 70,10 80,15 C90,20 95,5 100,0 L100,100 L0,100 Z" fill="url(#area-grad-1)" />
                        <path d="M0,70 C10,65 15,40 25,45 C35,50 40,20 50,25 C60,30 70,10 80,15 C90,20 95,5 100,0" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
                        
                        {/* Tooltip dot */}
                        <circle cx="80" cy="15" r="1.5" fill="#fff" stroke="#6366f1" strokeWidth="0.8" className="shadow-sm" />
                      </svg>
                    </div>
                  </div>

                  {/* Deployments List */}
                  <div className="flex-[3] flex flex-col rounded-xl bg-white dark:bg-[#14151a] border border-slate-200 dark:border-white/5 shadow-sm p-5 transition-colors duration-300 overflow-hidden">
                    <div className="flex items-center justify-between mb-5">
                      <div className="text-[14px] font-semibold text-zinc-900 dark:text-white transition-colors">Recent Deployments</div>
                      <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline transition-colors">View All</div>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-3">
                      {DEPLOYMENTS.map((d, i) => (
                        <div
                          key={d.name}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-200 group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <ProviderIcon provider={d.provider} size="sm" variant="ghost" />
                            <div>
                              <div className="text-[13px] font-medium text-zinc-900 dark:text-zinc-200 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{d.name}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-zinc-500 font-mono transition-colors">{d.branch}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700 transition-colors" />
                                <span className="text-[10px] text-zinc-500 transition-colors">{d.time}</span>
                              </div>
                            </div>
                          </div>
                          <StatusBadge status={d.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
