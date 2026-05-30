import { createClient } from "@/lib/supabase/server";
import type { IntegrationRow } from "@/lib/workspace";
import { isGithubConnected } from "@/lib/workspace";
import type { User } from "@supabase/supabase-js";

export async function fetchOverviewStats(workspaceId: string) {
  const supabase = await createClient();

  const [
    deploymentsRes,
    projectsRes,
    integrationsRes,
    membersRes,
    incidentsRes,
    aiSessionsRes,
  ] = await Promise.all([
    supabase.from("deployments").select("id, status, build_duration_ms", { count: "exact" }).eq("workspace_id", workspaceId),
    supabase.from("projects").select("id", { count: "exact" }).eq("workspace_id", workspaceId).eq("status", "active"),
    supabase.from("integrations").select("id, status").eq("workspace_id", workspaceId).eq("status", "connected"),
    supabase.from("workspace_members").select("id", { count: "exact" }).eq("workspace_id", workspaceId),
    supabase.from("deployments").select("id", { count: "exact" }).eq("workspace_id", workspaceId).eq("status", "error"),
    supabase.from("ai_sessions").select("id", { count: "exact" }).eq("workspace_id", workspaceId),
  ]);

  const deployments = deploymentsRes.data ?? [];
  const total = deploymentsRes.count ?? deployments.length;
  const ready = deployments.filter((d) => d.status === "ready").length;
  const successRate = total > 0 ? ((ready / total) * 100).toFixed(1) : "—";
  const durations = deployments
    .map((d) => d.build_duration_ms)
    .filter((ms): ms is number => ms != null);
  const avgBuild =
    durations.length > 0
      ? `${Math.round(durations.reduce((a, b) => a + b, 0) / durations.length / 1000)}s`
      : "—";

  return {
    totalDeployments: String(total),
    successRate: total > 0 ? `${successRate}%` : "—",
    activeProjects: String(projectsRes.count ?? 0),
    connectedProviders: String(integrationsRes.data?.length ?? 0),
    avgBuildTime: avgBuild,
    activeIncidents: String(incidentsRes.count ?? 0),
    teamMembers: String(membersRes.count ?? 0),
    aiUsage: String(aiSessionsRes.count ?? 0),
  };
}

export type ProviderHealthItem = {
  provider: string;
  status: "connected" | "syncing" | "deploying" | "failed" | "idle";
  latency: string;
};

export function buildProviderHealth(
  integrations: IntegrationRow[],
  user: User
): ProviderHealthItem[] {
  const map = Object.fromEntries(integrations.map((i) => [i.provider, i]));
  const providers = ["github", "vercel", "supabase", "railway", "docker", "kubernetes", "aws", "cloudflare"];

  return providers.map((provider) => {
    if (provider === "github") {
      const connected = isGithubConnected(user) || map.github?.status === "connected";
      return {
        provider,
        status: connected ? "connected" : "idle",
        latency: connected ? "—" : "—",
      };
    }
    const int = map[provider];
    const connected = int?.status === "connected";
    return {
      provider,
      status: connected ? "connected" : "idle",
      latency: connected ? "—" : "—",
    };
  });
}

export async function fetchProjects(workspaceId: string) {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, slug, framework, status, updated_at")
    .eq("workspace_id", workspaceId)
    .order("updated_at", { ascending: false });

  const list = (projects ?? []) as {
    id: string;
    name: string;
    slug: string;
    framework: string | null;
    status: string;
    updated_at: string;
  }[];

  if (list.length === 0) return [];

  const { data: deps } = await supabase
    .from("deployments")
    .select("id, status, created_at, provider, project_id")
    .in(
      "project_id",
      list.map((p) => p.id)
    )
    .order("created_at", { ascending: false });

  const depMap: Record<string, unknown[]> = {};
  for (const d of (deps ?? []) as { project_id: string }[]) {
    if (!depMap[d.project_id]) depMap[d.project_id] = [];
    depMap[d.project_id].push(d);
  }

  return list.map((p) => ({
    ...p,
    deployments: (depMap[p.id] ?? []).slice(0, 5),
  }));
}

export async function fetchRepositories(workspaceId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("repositories")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("updated_at", { ascending: false });

  return data ?? [];
}

export async function fetchTeamMembers(workspaceId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("workspace_members")
    .select("id, role, joined_at, users(id, email, full_name, avatar_url, github_username)")
    .eq("workspace_id", workspaceId);

  return data ?? [];
}

export async function fetchNotifications(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  return data ?? [];
}

export async function fetchEnvironments(workspaceId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("environments")
    .select("*, projects(name, slug)")
    .eq("workspace_id", workspaceId);

  return data ?? [];
}

export async function fetchSyncEvents(workspaceId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sync_events")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(30);

  return data ?? [];
}

export async function fetchDeploymentLogs(deploymentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("deployment_logs")
    .select("level, message, timestamp")
    .eq("deployment_id", deploymentId)
    .order("timestamp", { ascending: true })
    .limit(500);

  return (data ?? []) as { level: string; message: string; timestamp: string }[];
}
