import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspace } from "@/lib/workspace";
import { upsertIntegration } from "@/lib/integrations/store";
import { createServiceClient } from "@/lib/supabase/service";

const OAUTH_PROVIDERS = ["vercel", "supabase", "github", "railway"] as const;
const TOKEN_PROVIDERS = ["docker", "aws"] as const;

function appOrigin(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  return url.replace(/\/$/, "");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(request.url);
  const origin = appOrigin(request);
  const nextUrl = searchParams.get("next") || "/dashboard/integrations";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  if (!OAUTH_PROVIDERS.includes(provider as (typeof OAUTH_PROVIDERS)[number])) {
    return NextResponse.redirect(
      `${origin}${nextUrl}?error=unsupported_provider`
    );
  }

  const state = nextUrl;

  if (provider === "vercel") {
    const clientId = process.env.VERCEL_CLIENT_ID;
    const clientSecret = process.env.VERCEL_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return new NextResponse(null, {
        status: 307,
        headers: { Location: `${origin}${nextUrl}?error=vercel_not_configured` },
      });
    }
    const redirectUri = `${origin}/api/integrations/vercel/callback`;
    const authUrl = new URL("https://vercel.com/oauth/authorize");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("state", state);
    
    return new NextResponse(null, {
      status: 307,
      headers: { Location: authUrl.toString() },
    });
  }

  if (provider === "supabase") {
    const clientId = process.env.SUPABASE_MANAGEMENT_CLIENT_ID;
    const clientSecret = process.env.SUPABASE_MANAGEMENT_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return new NextResponse(null, {
        status: 307,
        headers: { Location: `${origin}${nextUrl}?error=supabase_not_configured` },
      });
    }
    const redirectUri = `${origin}/api/integrations/supabase/callback`;
    const authUrl = new URL("https://api.supabase.com/v1/oauth/authorize");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    
    return new NextResponse(null, {
      status: 307,
      headers: { Location: authUrl.toString() },
    });
  }

  if (provider === "github") {
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientId) {
      return new NextResponse(null, {
        status: 307,
        headers: { Location: `${origin}${nextUrl}?error=github_not_configured` },
      });
    }
    const redirectUri = `${origin}/api/integrations/github/callback`;
    const scopes = "repo read:user user:email admin:repo_hook";
    const authUrl = new URL("https://github.com/login/oauth/authorize");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("scope", scopes);
    
    return new NextResponse(null, {
      status: 307,
      headers: { Location: authUrl.toString() },
    });
  }

  if (provider === "railway") {
    const clientId = process.env.RAILWAY_CLIENT_ID;
    if (!clientId) {
      return new NextResponse(null, {
        status: 307,
        headers: { Location: `${origin}${nextUrl}?error=railway_not_configured` },
      });
    }
    const redirectUri = `${origin}/api/integrations/railway/callback`;
    const authUrl = new URL("https://railway.com/oauth/authorize");
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("response_type", "code");
    
    return new NextResponse(null, {
      status: 307,
      headers: { Location: authUrl.toString() },
    });
  }

  return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;

  if (!TOKEN_PROVIDERS.includes(provider as (typeof TOKEN_PROVIDERS)[number])) {
    return NextResponse.json(
      { error: "This provider does not support token-based connection. Use the OAuth flow instead." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { token } = body;
  if (!token || typeof token !== "string" || token.trim().length === 0) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const workspace = await requireWorkspace(user);

    await upsertIntegration(workspace.workspaceId, provider, {
      status: "connected",
      metadata: {
        connected_by: user.email,
        connected_at: new Date().toISOString(),
        auth_method: "api_token",
      },
      accessToken: token.trim(),
    });

    await createServiceClient().from("activity_logs").insert({
      workspace_id: workspace.workspaceId,
      user_id: user.id,
      action: "integration.connected",
      resource_type: "integration",
      metadata: { provider, auth_method: "api_token" },
    });

    return NextResponse.json({ success: true, provider });
  } catch (err) {
    console.error(`Token connect ${provider}:`, err);
    return NextResponse.json({ error: "connect_failed" }, { status: 500 });
  }
}
