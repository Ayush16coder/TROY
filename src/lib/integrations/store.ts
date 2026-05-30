import { createServiceClient } from "@/lib/supabase/service";
import { encryptToken, decryptToken } from "@/lib/encryption";

export async function upsertIntegration(
  workspaceId: string,
  provider: string,
  options: {
    name?: string;
    status?: "connected" | "disconnected" | "error" | "pending";
    metadata?: Record<string, unknown>;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: string;
    scopes?: string[];
  }
) {
  const admin = createServiceClient();

  const { data: integration, error: intError } = await admin
    .from("provider_connections")
    .upsert(
      {
        workspace_id: workspaceId,
        provider,
        name: options.name ?? provider.charAt(0).toUpperCase() + provider.slice(1),
        status: options.status ?? "connected",
        metadata: options.metadata ?? {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: "workspace_id,provider" }
    )
    .select("id")
    .single();

  if (intError || !integration) {
    throw new Error(intError?.message ?? "Failed to save integration");
  }

  if (options.accessToken) {
    const { error: tokError } = await admin.from("provider_tokens").upsert(
      {
        connection_id: integration.id,
        workspace_id: workspaceId,
        access_token_encrypted: encryptToken(options.accessToken),
        refresh_token_encrypted: options.refreshToken ? encryptToken(options.refreshToken) : null,
        expires_at: options.expiresAt ?? null,
        scopes: options.scopes ?? [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "connection_id" }
    );

    if (tokError) throw new Error(tokError.message);
  }

  return integration.id;
}

export async function disconnectIntegration(workspaceId: string, provider: string) {
  const admin = createServiceClient();

  const { data: integration } = await admin
    .from("provider_connections")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("provider", provider)
    .maybeSingle();

  if (integration?.id) {
    await admin.from("provider_tokens").delete().eq("connection_id", integration.id);
    await admin
      .from("provider_connections")
      .update({ status: "disconnected", updated_at: new Date().toISOString() })
      .eq("id", integration.id);
  }
}

export async function getIntegrationToken(
  workspaceId: string,
  provider: string
): Promise<string | null> {
  const admin = createServiceClient();

  const { data } = await admin
    .from("provider_connections")
    .select("id, provider_tokens(access_token_encrypted)")
    .eq("workspace_id", workspaceId)
    .eq("provider", provider)
    .eq("status", "connected")
    .maybeSingle();

  const tokens = data?.provider_tokens as { access_token_encrypted: string }[] | { access_token_encrypted: string } | null;
  if (!tokens) return null;
  
  let encryptedToken: string | null = null;
  if (Array.isArray(tokens)) {
    encryptedToken = tokens[0]?.access_token_encrypted ?? null;
  } else {
    encryptedToken = tokens.access_token_encrypted ?? null;
  }
  
  return encryptedToken ? decryptToken(encryptedToken) : null;
}
