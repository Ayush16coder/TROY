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

export function RecentDeployments({ deployments }: Props) {
  const data = deployments;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground text-sm">Recent Deployments</h2>
        </div>
        <Link href="/dashboard/deployments" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          View all →
        </Link>
      </div>
      <div className="divide-y divide-border">
        {data.length === 0 && (
          <p className="px-5 py-8 text-sm text-muted-foreground text-center">
            No deployments yet. Connect Vercel and run Sync from Integrations.
          </p>
        )}
        {data.map((d) => (
          <div key={d.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-secondary/40 transition-colors">
            <div className="flex-shrink-0">
              <span className={`text-xs font-mono font-bold capitalize ${PROVIDER_COLORS[d.provider] ?? "text-zinc-400"}`}>
                {d.provider[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {(d as any).projects?.name ?? d.project_id}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${getStatusBadgeClass(d.status)}`}>
                  {d.status}
                </span>
              </div>
              {d.commit_sha && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <GitCommit className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-mono">{d.commit_sha.slice(0, 7)}</span>
                  <span className="text-xs text-muted-foreground/80 truncate max-w-[180px]">{d.commit_message}</span>
                </div>
              )}
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-xs text-muted-foreground">{formatRelativeTime(d.created_at)}</p>
              {d.url && (
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-primary hover:opacity-80 transition-colors mt-0.5">
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
