import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspace } from "@/lib/workspace";
import { upsertIntegration } from "@/lib/integrations/store";
import { createServiceClient } from "@/lib/supabase/service";

function appOrigin(request: NextRequest) {
  return process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(request.url);
  const origin = appOrigin(request);
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const state = searchParams.get("state") || "/dashboard/integrations";
  const nextPath = decodeURIComponent(state);

  if (errorParam) {
    return NextResponse.redirect(
      `${origin}${nextPath}?error=${encodeURIComponent(errorParam)}`
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}${nextPath}?error=missing_code`);
  }

  try {
    const workspace = await requireWorkspace(user);
    let accessToken = "";
    let refreshToken: string | undefined;

    if (provider === "vercel") {
      const tokenRes = await fetch("https://api.vercel.com/v2/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.VERCEL_CLIENT_ID!,
          client_secret: process.env.VERCEL_CLIENT_SECRET!,
          code,
          redirect_uri: `${origin}/api/integrations/vercel/callback`,
        }),
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        console.error("Vercel token exchange:", tokenData);
        return NextResponse.redirect(`${origin}${nextPath}?error=vercel_token_failed`);
      }
      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token;
    } else if (provider === "supabase") {
      const authHeader = Buffer.from(
        `${process.env.SUPABASE_MANAGEMENT_CLIENT_ID}:${process.env.SUPABASE_MANAGEMENT_CLIENT_SECRET}`
      ).toString("base64");
      const tokenRes = await fetch("https://api.supabase.com/v1/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authHeader}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: `${origin}/api/integrations/supabase/callback`,
        }),
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        console.error("Supabase token exchange:", tokenData);
        return NextResponse.redirect(`${origin}${nextPath}?error=supabase_token_failed`);
      }
      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token;
    } else if (provider === "github") {
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${origin}/api/integrations/github/callback`,
        }),
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        console.error("GitHub token exchange:", tokenData);
        return NextResponse.redirect(`${origin}${nextPath}?error=github_token_failed`);
      }
      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token; // usually undefined for GitHub default flow
    } else if (provider === "railway") {
      const tokenRes = await fetch("https://railway.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.RAILWAY_CLIENT_ID!,
          client_secret: process.env.RAILWAY_CLIENT_SECRET!,
          code,
          redirect_uri: `${origin}/api/integrations/railway/callback`,
          grant_type: "authorization_code",
        }),
      });
      const tokenData = await tokenRes.json();
      if (!tokenData.access_token) {
        console.error("Railway token exchange:", tokenData);
        return NextResponse.redirect(`${origin}${nextPath}?error=railway_token_failed`);
      }
      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token;
    } else {
      return NextResponse.redirect(`${origin}${nextPath}?error=unsupported_provider`);
    }

    await upsertIntegration(workspace.workspaceId, provider, {
      status: "connected",
      metadata: { connected_by: user.email, connected_at: new Date().toISOString() },
      accessToken,
      refreshToken,
    });

    await createServiceClient().from("activity_logs").insert({
      workspace_id: workspace.workspaceId,
      user_id: user.id,
      action: "integration.connected",
      resource_type: "integration",
      metadata: { provider },
    });

    // Trigger provider sync
    const syncUrl = `${origin}/api/integrations/${provider}/sync`;
    fetch(syncUrl, {
      method: "POST",
      headers: { cookie: request.headers.get("cookie") ?? "" },
    }).catch(() => {});

    return NextResponse.redirect(`${origin}${nextPath}?connected=${provider}`);
  } catch (err: any) {
    console.error(`OAuth callback ${provider}:`, err?.message ?? err);
    const detail = encodeURIComponent(err?.message ?? "unknown");
    return NextResponse.redirect(`${origin}${nextPath}?error=callback_failed&detail=${detail}`);
  }
}
