import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state") || `/dashboard/settings`;
  const nextPath = decodeURIComponent(state);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  if (code) {
    // 1. Get workspace ID
    const { data: workspaceMember } = await (supabase as any)
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .single() as { data: { workspace_id: string } | null };

    if (!workspaceMember) {
      return NextResponse.redirect(`${origin}/dashboard?error=no_workspace`);
    }

    // 2. Exchange code for token (mocked if no client secret)
    let accessToken = "simulated_access_token";
    let refreshToken = "simulated_refresh_token";

    const hasSecret = provider === "supabase" 
      ? !!process.env.SUPABASE_MANAGEMENT_CLIENT_SECRET 
      : !!process.env[`${provider.toUpperCase()}_CLIENT_SECRET`];

    if (hasSecret && code !== "simulated_code") {
      try {
        if (provider === "vercel") {
          const tokenRes = await fetch("https://api.vercel.com/v2/oauth/access_token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.VERCEL_CLIENT_ID!,
              client_secret: process.env.VERCEL_CLIENT_SECRET!,
              code: code,
              redirect_uri: `${origin}/api/integrations/vercel/callback`,
            }),
          });
          const tokenData = await tokenRes.json();
          if (tokenData.access_token) {
            accessToken = tokenData.access_token;
            // Vercel doesn't always provide a refresh token depending on the configuration
            if (tokenData.refresh_token) refreshToken = tokenData.refresh_token;
          }
        } else if (provider === "supabase") {
          const authHeader = Buffer.from(`${process.env.SUPABASE_MANAGEMENT_CLIENT_ID}:${process.env.SUPABASE_MANAGEMENT_CLIENT_SECRET}`).toString('base64');
          const tokenRes = await fetch("https://api.supabase.com/v1/oauth/token", {
            method: "POST",
            headers: { 
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": `Basic ${authHeader}`
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: code,
              redirect_uri: `${origin}/api/integrations/supabase/callback`,
            }),
          });
          const tokenData = await tokenRes.json();
          if (tokenData.access_token) {
            accessToken = tokenData.access_token;
            if (tokenData.refresh_token) refreshToken = tokenData.refresh_token;
          }
        }
      } catch (err) {
        console.error(`Failed to exchange token for ${provider}:`, err);
      }
    }

    // 3. Upsert into integrations table
    const { data: integration, error: intError } = await (supabase as any)
      .from("integrations")
      .upsert({
        workspace_id: workspaceMember.workspace_id,
        provider: provider,
        name: provider.charAt(0).toUpperCase() + provider.slice(1),
        status: "connected",
        metadata: { connected_by: user.email }
      }, { onConflict: "workspace_id, provider" })
      .select("id")
      .single();

    // 4. Store tokens
    if (integration && !intError) {
      await (supabase as any)
        .from("integration_tokens")
        .upsert({
          integration_id: integration.id,
          workspace_id: workspaceMember.workspace_id,
          access_token_encrypted: accessToken,
          refresh_token_encrypted: refreshToken,
        }, { onConflict: "integration_id" });
    }
  }

  return NextResponse.redirect(`${origin}${nextPath}`);
}
