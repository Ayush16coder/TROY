"use client";

import { getStatusBadgeClass, formatRelativeTime } from "@/lib/utils";
import { Rocket, ExternalLink, GitCommit } from "lucide-react";
import Link from "next/link";
import type { Deployment } from "@/types/database";

interface Props {
  deployments: (Deployment & { projects?: { name: string; slug: string } | null })[];
}

const PROVIDER_COLORS: Record<string, string> = {
  vercel: "text-white",
  netlify: "text-teal-400",
  railway: "text-violet-400",
  render: "text-emerald-400",
  aws: "text-orange-400",
};

// Mock data for demo when DB is empty
const MOCK: Props["deployments"] = [
  { id: "1", project_id: "p1", workspace_id: "w1", provider: "vercel", provider_deployment_id: "dpl_xyz", status: "ready", environment: "production", branch: "main", commit_sha: "a3f8c91", commit_message: "feat: add AI workspace", url: "https://my-app.vercel.app", build_duration_ms: 42000, triggered_by: null, created_at: new Date(Date.now() - 120000).toISOString(), updated_at: new Date().toISOString(), completed_at: new Date().toISOString(), projects: { name: "my-app", slug: "my-app" } },
  { id: "2", project_id: "p2", workspace_id: "w1", provider: "railway", provider_deployment_id: "rly_abc", status: "building", environment: "production", branch: "main", commit_sha: "b7d2e44", commit_message: "fix: resolve connection timeout", url: null, build_duration_ms: null, triggered_by: null, created_at: new Date(Date.now() - 60000).toISOString(), updated_at: new Date().toISOString(), completed_at: null, projects: { name: "api-server", slug: "api-server" } },
  { id: "3", project_id: "p3", workspace_id: "w1", provider: "netlify", provider_deployment_id: "ntl_def", status: "error", environment: "preview", branch: "feature/dark-mode", commit_sha: "c1a9b33", commit_message: "ui: dark mode toggle", url: null, build_duration_ms: 31000, triggered_by: null, created_at: new Date(Date.now() - 300000).toISOString(), updated_at: new Date().toISOString(), completed_at: new Date(Date.now() - 270000).toISOString(), projects: { name: "marketing-site", slug: "marketing-site" } },
];

export function RecentDeployments({ deployments }: Props) {
  const data = deployments.length > 0 ? deployments : MOCK;

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d40]">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-blue-400" />
          <h2 className="font-semibold text-white text-sm">Recent Deployments</h2>
        </div>
        <Link href="/dashboard/deployments" className="text-xs text-zinc-500 hover:text-blue-400 transition-colors">
          View all →
        </Link>
      </div>
      <div className="divide-y divide-[#1e2d40]">
        {data.map((d) => (
          <div key={d.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#0d1117]/50 transition-colors">
            <div className="flex-shrink-0">
              <span className={`text-xs font-mono font-bold capitalize ${PROVIDER_COLORS[d.provider] ?? "text-zinc-400"}`}>
                {d.provider[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white truncate">
                  {(d as any).projects?.name ?? d.project_id}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${getStatusBadgeClass(d.status)}`}>
                  {d.status}
                </span>
              </div>
              {d.commit_sha && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <GitCommit className="w-3 h-3 text-zinc-600" />
                  <span className="text-xs text-zinc-500 font-mono">{d.commit_sha.slice(0, 7)}</span>
                  <span className="text-xs text-zinc-600 truncate max-w-[180px]">{d.commit_message}</span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-zinc-500">{formatRelativeTime(d.created_at)}</p>
              {d.url && (
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors mt-0.5">
                  <ExternalLink className="w-3 h-3" /> Visit
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
