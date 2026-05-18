"use client";

import { useState } from "react";
import { getStatusBadgeClass, formatRelativeTime } from "@/lib/utils";
import { Rocket, GitCommit, ExternalLink, RefreshCw, Filter, ChevronDown } from "lucide-react";
import type { Deployment } from "@/types/database";
import { motion, AnimatePresence } from "framer-motion";

const MOCK: (Deployment & { projects?: { name: string; slug: string } | null })[] = [
  { id: "1", project_id: "p1", workspace_id: "w1", provider: "vercel", provider_deployment_id: "dpl_a1", status: "ready", environment: "production", branch: "main", commit_sha: "a3f8c91", commit_message: "feat: add AI workspace", url: "https://my-app.vercel.app", build_duration_ms: 42000, triggered_by: null, created_at: new Date(Date.now() - 120000).toISOString(), updated_at: new Date().toISOString(), completed_at: new Date().toISOString(), projects: { name: "my-app", slug: "my-app" } },
  { id: "2", project_id: "p2", workspace_id: "w1", provider: "railway", provider_deployment_id: "rly_b2", status: "building", environment: "production", branch: "main", commit_sha: "b7d2e44", commit_message: "fix: resolve connection timeout", url: null, build_duration_ms: null, triggered_by: null, created_at: new Date(Date.now() - 60000).toISOString(), updated_at: new Date().toISOString(), completed_at: null, projects: { name: "api-server", slug: "api-server" } },
  { id: "3", project_id: "p3", workspace_id: "w1", provider: "netlify", provider_deployment_id: "ntl_c3", status: "error", environment: "preview", branch: "feature/dark-mode", commit_sha: "c1a9b33", commit_message: "ui: dark mode toggle", url: null, build_duration_ms: 31000, triggered_by: null, created_at: new Date(Date.now() - 300000).toISOString(), updated_at: new Date().toISOString(), completed_at: new Date(Date.now() - 270000).toISOString(), projects: { name: "marketing-site", slug: "marketing-site" } },
  { id: "4", project_id: "p1", workspace_id: "w1", provider: "vercel", provider_deployment_id: "dpl_d4", status: "ready", environment: "preview", branch: "feat/auth", commit_sha: "d5c3b22", commit_message: "auth: add GitHub OAuth", url: "https://my-app-git-feat-auth.vercel.app", build_duration_ms: 38000, triggered_by: null, created_at: new Date(Date.now() - 3600000).toISOString(), updated_at: new Date().toISOString(), completed_at: new Date(Date.now() - 3560000).toISOString(), projects: { name: "my-app", slug: "my-app" } },
  { id: "5", project_id: "p4", workspace_id: "w1", provider: "render", provider_deployment_id: "rnd_e5", status: "cancelled", environment: "production", branch: "main", commit_sha: "e9f1a00", commit_message: "chore: upgrade dependencies", url: null, build_duration_ms: null, triggered_by: null, created_at: new Date(Date.now() - 7200000).toISOString(), updated_at: new Date().toISOString(), completed_at: null, projects: { name: "worker", slug: "worker" } },
];

const PROVIDER_BADGE: Record<string, string> = {
  vercel: "bg-zinc-800 text-white",
  netlify: "bg-teal-500/15 text-teal-400",
  railway: "bg-violet-500/15 text-violet-400",
  render: "bg-emerald-500/15 text-emerald-400",
  aws: "bg-orange-500/15 text-orange-400",
};

const ENV_COLORS: Record<string, string> = {
  production: "text-red-400",
  preview: "text-blue-400",
  development: "text-zinc-400",
};

type Filter = "all" | "ready" | "building" | "error";

interface Props {
  deployments: (Deployment & { projects?: { name: string; slug: string } | null })[];
}

export function DeploymentsList({ deployments }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const data = deployments.length > 0 ? deployments : MOCK;
  const filtered = filter === "all" ? data : data.filter((d) => d.status === filter);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-zinc-600" />
        {(["all", "ready", "building", "error"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              filter === f
                ? "bg-blue-500/15 text-blue-400 border border-blue-500/25"
                : "text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-zinc-700"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-zinc-600">{filtered.length} deployments</span>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_120px_100px_100px_80px_100px] gap-4 px-5 py-2.5 border-b border-[#1e2d40] text-[11px] font-semibold tracking-wider text-zinc-600 uppercase">
          <span>Project / Commit</span>
          <span>Provider</span>
          <span>Environment</span>
          <span>Status</span>
          <span>Duration</span>
          <span>Time</span>
        </div>
        <AnimatePresence mode="popLayout">
          {filtered.map((d) => (
            <motion.div
              key={d.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-[1fr_120px_100px_100px_80px_100px] gap-4 items-center px-5 py-3.5 border-b border-[#1e2d40]/60 last:border-0 hover:bg-[#0d1117]/50 transition-colors"
            >
              {/* Project */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Rocket className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-white truncate">
                    {(d as any).projects?.name ?? d.project_id}
                  </span>
                  {d.url && (
                    <a href={d.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 text-zinc-600 hover:text-blue-400 transition-colors" />
                    </a>
                  )}
                </div>
                {d.commit_sha && (
                  <div className="flex items-center gap-1.5 mt-0.5 ml-5">
                    <GitCommit className="w-3 h-3 text-zinc-700" />
                    <span className="text-[11px] font-mono text-zinc-600">{d.commit_sha.slice(0, 7)}</span>
                    <span className="text-[11px] text-zinc-600 truncate max-w-[240px]">{d.commit_message}</span>
                  </div>
                )}
              </div>

              {/* Provider */}
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold capitalize ${PROVIDER_BADGE[d.provider] ?? "bg-zinc-800 text-zinc-400"}`}>
                {d.provider}
              </span>

              {/* Env */}
              <span className={`text-xs font-medium capitalize ${ENV_COLORS[d.environment] ?? "text-zinc-400"}`}>
                {d.environment}
              </span>

              {/* Status */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border capitalize ${getStatusBadgeClass(d.status)}`}>
                {d.status === "building" && <RefreshCw className="w-2.5 h-2.5 animate-spin" />}
                {d.status}
              </span>

              {/* Duration */}
              <span className="text-xs text-zinc-500 font-mono">
                {d.build_duration_ms ? `${Math.round(d.build_duration_ms / 1000)}s` : "—"}
              </span>

              {/* Time */}
              <span className="text-xs text-zinc-500">{formatRelativeTime(d.created_at)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-zinc-600 text-sm">
            No deployments match this filter
          </div>
        )}
      </div>
    </div>
  );
}
