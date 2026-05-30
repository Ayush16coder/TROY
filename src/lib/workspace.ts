import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type WorkspaceContext = {
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  role: string;
};

export async function getWorkspaceForUser(userId: string): Promise<WorkspaceContext | null> {
  const supabase = await createClient();

  const { data: member } = await supabase
    .from("workspace_members")
    .select("workspace_id, role")
    .eq("user_id", userId)
    .order("joined_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!member?.workspace_id) return null;

  const { data: ws } = await supabase
    .from("workspaces")
    .select("name, slug")
    .eq("id", member.workspace_id)
    .single();

  return {
    workspaceId: member.workspace_id,
    workspaceName: ws?.name ?? "Workspace",
    workspaceSlug: ws?.slug ?? "workspace",
    role: member.role,
  };
}

export async function requireWorkspace(user: User): Promise<WorkspaceContext> {
  const ctx = await getWorkspaceForUser(user.id);
  if (!ctx) throw new Error("NO_WORKSPACE");
  return ctx;
}

export type IntegrationRow = {
  id: string;
  provider: string;
  name: string;
  status: string;
  metadata: Record<string, unknown> | null;
  updated_at: string;
};

export async function getWorkspaceIntegrations(workspaceId: string): Promise<IntegrationRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("provider_connections")
    .select("id, provider, name, status, metadata, updated_at")
    .eq("workspace_id", workspaceId);

  return (data ?? []) as IntegrationRow[];
}

export function isGithubConnected(user: User): boolean {
  return user.identities?.some((i) => i.provider === "github") ?? false;
}

export function getIntegrationMap(integrations: IntegrationRow[]): Record<string, IntegrationRow> {
  return Object.fromEntries(integrations.map((i) => [i.provider, i]));
}
