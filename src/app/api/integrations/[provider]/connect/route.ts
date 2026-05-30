import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const OAUTH_PROVIDERS = ["vercel", "supabase"] as const;

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

  const state = encodeURIComponent(nextUrl);

  if (provider === "vercel") {
    const clientId = process.env.VERCEL_CLIENT_ID;
    const clientSecret = process.env.VERCEL_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        `${origin}${nextUrl}?error=vercel_not_configured`
      );
    }
    const redirectUri = `${origin}/api/integrations/vercel/callback`;
    const authUrl = `https://vercel.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    return NextResponse.redirect(authUrl);
  }

  if (provider === "supabase") {
    const clientId = process.env.SUPABASE_MANAGEMENT_CLIENT_ID;
    const clientSecret = process.env.SUPABASE_MANAGEMENT_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        `${origin}${nextUrl}?error=supabase_not_configured`
      );
    }
    const redirectUri = `${origin}/api/integrations/supabase/callback`;
    const authUrl = `https://api.supabase.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
}
