"use client";

import { formatRelativeTime } from "@/lib/utils";
import { Activity, GitBranch, Rocket, Key, Users, Settings } from "lucide-react";
import type { ActivityLog } from "@/types/database";

const ICON_MAP: Record<string, React.ElementType> = {
  deployment: Rocket,
  repository: GitBranch,
  integration: Key,
  team: Users,
  settings: Settings,
};

const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: "1", workspace_id: "w1", user_id: "u1", action: "deployment.created", resource_type: "deployment", resource_id: "d1", metadata: { project: "my-app", provider: "vercel" }, created_at: new Date(Date.now() - 120000).toISOString() },
  { id: "2", workspace_id: "w1", user_id: "u1", action: "repository.synced", resource_type: "repository", resource_id: "r1", metadata: { repo: "org/my-app" }, created_at: new Date(Date.now() - 300000).toISOString() },
  { id: "3", workspace_id: "w1", user_id: "u2", action: "integration.connected", resource_type: "integration", resource_id: "i1", metadata: { provider: "Railway" }, created_at: new Date(Date.now() - 900000).toISOString() },
  { id: "4", workspace_id: "w1", user_id: "u1", action: "team.member_invited", resource_type: "team", resource_id: null, metadata: { email: "dev@acme.com" }, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "5", workspace_id: "w1", user_id: "u1", action: "deployment.rolled_back", resource_type: "deployment", resource_id: "d2", metadata: { project: "api-server" }, created_at: new Date(Date.now() - 7200000).toISOString() },
];

function formatAction(action: string, meta: Record<string, unknown>): string {
  const parts = action.split(".");
  const verb = parts[1]?.replace(/_/g, " ") ?? action;
  if (meta?.project) return `${verb} on ${meta.project}`;
  if (meta?.repo) return `${verb}: ${meta.repo}`;
  if (meta?.provider) return `${verb} ${meta.provider}`;
  if (meta?.email) return `${verb}: ${meta.email}`;
  return verb;
}

interface Props { activities: ActivityLog[] }

export function ActivityFeed({ activities }: Props) {
  const data = activities.length > 0 ? activities : MOCK_ACTIVITIES;
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden h-full">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
        <Activity className="w-4 h-4 text-violet-500" />
        <h2 className="font-semibold text-foreground text-sm">Activity Feed</h2>
        <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
      <div className="divide-y divide-border">
        {data.map((item) => {
          const resourceType = item.resource_type as string;
          const Icon = ICON_MAP[resourceType] ?? Activity;
          const meta = (item.metadata ?? {}) as Record<string, unknown>;
          return (
            <div key={item.id} className="flex items-start gap-3 px-5 py-3 hover:bg-secondary/40 transition-colors">
              <div className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-snug">
                  {formatAction(item.action, meta)}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {formatRelativeTime(item.created_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
