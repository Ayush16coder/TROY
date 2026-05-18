"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Terminal, Pause, Play, Trash2, Download, Filter } from "lucide-react";

interface LogEntry {
  id: string;
  level: "info" | "warn" | "error" | "debug" | "success";
  message: string;
  timestamp: string;
  source: string;
}

const SOURCES = ["vercel", "railway", "netlify", "github"];

const MOCK_STREAM: Omit<LogEntry, "id" | "timestamp">[] = [
  { level: "info", message: "Build started for commit a3f8c91 on branch main", source: "vercel" },
  { level: "info", message: "Installing dependencies (npm ci)...", source: "vercel" },
  { level: "debug", message: "Cache hit: node_modules restored from cache layer", source: "vercel" },
  { level: "info", message: "Running build command: next build", source: "vercel" },
  { level: "info", message: "  ▲ Next.js 15.0.0", source: "vercel" },
  { level: "info", message: "  - Environments: .env.production", source: "vercel" },
  { level: "info", message: "  Creating an optimized production build ...", source: "vercel" },
  { level: "success", message: "  ✓ Compiled successfully in 34.2s", source: "vercel" },
  { level: "info", message: "  Route (app): /dashboard — 142 kB", source: "vercel" },
  { level: "info", message: "  Route (app): /dashboard/deployments — 98 kB", source: "vercel" },
  { level: "warn", message: "  ⚠ Large page size detected on /dashboard/ai (>100kB)", source: "vercel" },
  { level: "info", message: "Deployment ready at https://my-app.vercel.app", source: "vercel" },
  { level: "info", message: "Webhook received: push event on main", source: "github" },
  { level: "info", message: "Railway deploy triggered: api-server@b7d2e44", source: "railway" },
  { level: "info", message: "Provisioning build container...", source: "railway" },
  { level: "success", message: "Container ready. Starting build...", source: "railway" },
  { level: "error", message: "npm ERR! Cannot find module '@prisma/client'", source: "railway" },
  { level: "error", message: "Build failed. Exit code 1.", source: "railway" },
];

const LEVEL_COLORS: Record<string, string> = {
  info: "log-info",
  warn: "log-warn",
  error: "log-error",
  debug: "log-debug",
  success: "log-success",
};

const LEVEL_PREFIX: Record<string, string> = {
  info: "INFO ",
  warn: "WARN ",
  error: "ERR  ",
  debug: "DBG  ",
  success: "OK   ",
};

const SOURCE_COLORS: Record<string, string> = {
  vercel: "text-white",
  railway: "text-violet-400",
  netlify: "text-teal-400",
  github: "text-zinc-400",
};

export function LogsTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [streamIdx, setStreamIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  // Simulate streaming logs
  useEffect(() => {
    const interval = setInterval(() => {
      if (pausedRef.current) return;
      setStreamIdx((prev) => {
        const idx = prev % MOCK_STREAM.length;
        const entry = MOCK_STREAM[idx];
        setLogs((l) => [
          ...l.slice(-200),
          {
            ...entry,
            id: `${Date.now()}-${idx}`,
            timestamp: new Date().toISOString(),
          },
        ]);
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!paused) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, paused]);

  const filtered = logs.filter((l) =>
    (filterLevel === "all" || l.level === filterLevel) &&
    (filterSource === "all" || l.source === filterSource)
  );

  return (
    <div className="flex-1 flex flex-col glass rounded-2xl overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#1e2d40] bg-[#0d1117] flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-amber-500/70" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
        </div>
        <Terminal className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-xs text-zinc-600 font-mono">nexusforge — live logs</span>

        <div className="flex items-center gap-1 ml-auto">
          {/* Level filter */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="text-xs bg-[#111827] border border-[#1e2d40] text-zinc-400 rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value="all">All levels</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
            <option value="debug">Debug</option>
          </select>
          {/* Source filter */}
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="text-xs bg-[#111827] border border-[#1e2d40] text-zinc-400 rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value="all">All sources</option>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <button
            onClick={() => setPaused(!paused)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium transition-all",
              paused
                ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                : "border-[#1e2d40] text-zinc-500 hover:text-zinc-300"
            )}
          >
            {paused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={() => setLogs([])}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-[#1a2236] transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 font-mono flex-shrink-0">
          <span className={cn("w-1.5 h-1.5 rounded-full", paused ? "bg-zinc-600" : "bg-emerald-400 pulse-dot")} />
          {paused ? "PAUSED" : "LIVE"}
        </div>
      </div>

      {/* Log output */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-6 min-h-0">
        <AnimatePresence initial={false}>
          {filtered.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 hover:bg-white/[0.02] rounded px-1 group"
            >
              <span className="text-zinc-700 flex-shrink-0 select-none">
                {new Date(log.timestamp).toLocaleTimeString("en-US", { hour12: false })}
              </span>
              <span className={cn("flex-shrink-0 font-semibold select-none", SOURCE_COLORS[log.source] ?? "text-zinc-500")}>
                [{log.source}]
              </span>
              <span className={cn("flex-shrink-0 select-none", LEVEL_COLORS[log.level])}>
                {LEVEL_PREFIX[log.level]}
              </span>
              <span className={cn("flex-1 break-all", LEVEL_COLORS[log.level])}>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32 text-zinc-700">
            Waiting for log entries...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[#1e2d40] bg-[#0a0d14] flex-shrink-0">
        <span className="text-[11px] text-zinc-700 font-mono">{filtered.length} entries</span>
        <span className="text-[11px] text-zinc-700 font-mono">
          {logs.filter((l) => l.level === "error").length} errors ·{" "}
          {logs.filter((l) => l.level === "warn").length} warnings
        </span>
      </div>
    </div>
  );
}
