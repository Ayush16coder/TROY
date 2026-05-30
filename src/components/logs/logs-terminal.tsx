"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Terminal, Trash2, Download, Filter } from "lucide-react";

interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
}

const LEVEL_COLORS: Record<string, string> = {
  info: "text-blue-400",
  warn: "text-amber-400",
  error: "text-rose-400",
  debug: "text-zinc-500",
};

interface Props {
  deployments: { id: string; label: string }[];
  selectedDeploymentId?: string;
  initialLogs: LogEntry[];
}

export function LogsTerminal({ deployments, selectedDeploymentId, initialLogs }: Props) {
  const router = useRouter();
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const bottomRef = useRef<HTMLDivElement>(null);

  const logs = initialLogs.map((l, i) => ({ ...l, id: String(i) }));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length]);

  const filtered = logs.filter((l) => filterLevel === "all" || l.level === filterLevel);

  function exportLogs() {
    const text = filtered.map((l) => `[${l.timestamp}] ${l.level.toUpperCase()} ${l.message}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `troy-logs-${selectedDeploymentId ?? "export"}.txt`;
    a.click();
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-[#0c0c0c] overflow-hidden min-h-[480px]">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/50 bg-[#111]">
        <Terminal className="w-4 h-4 text-emerald-500" />
        <span className="text-xs font-mono text-zinc-400">troy@logs</span>
        <div className="ml-auto flex items-center gap-2">
          {deployments.length > 0 && (
            <select
              value={selectedDeploymentId ?? ""}
              onChange={(e) => router.push(`/dashboard/logs?deployment=${e.target.value}`)}
              className="text-xs bg-[#1a1a1a] border border-border rounded px-2 py-1 text-zinc-300"
            >
              {deployments.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          )}
          <Filter className="w-3.5 h-3.5 text-zinc-600" />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="text-xs bg-[#1a1a1a] border border-border rounded px-2 py-1 text-zinc-300"
          >
            <option value="all">All levels</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
            <option value="debug">Debug</option>
          </select>
          <button onClick={exportLogs} className="p-1.5 rounded hover:bg-white/10 text-zinc-500" title="Export">
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-[12px] leading-relaxed min-h-[400px]">
        {filtered.length === 0 ? (
          <p className="text-zinc-600">
            {deployments.length === 0
              ? "No deployments yet. Connect Vercel and sync deployments."
              : "No logs stored for this deployment."}
          </p>
        ) : (
          filtered.map((log) => (
            <div key={log.id} className="flex gap-3 py-0.5 hover:bg-white/[0.02]">
              <span className="text-zinc-600 flex-shrink-0 w-[70px]">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={cn("flex-shrink-0 w-12 uppercase", LEVEL_COLORS[log.level] ?? "text-zinc-400")}>
                {log.level}
              </span>
              <span className="text-zinc-300 break-all">{log.message}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
