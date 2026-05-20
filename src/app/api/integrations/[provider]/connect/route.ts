import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams, origin } = new URL(request.url);
  const nextUrl = searchParams.get("next") || "/dashboard/settings";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  let authUrl = "";
  
  if (provider === "vercel") {
    const clientId = process.env.VERCEL_CLIENT_ID;
    if (!clientId) {
      // Simulate OAuth locally if credentials are not set
      return NextResponse.redirect(`${origin}/api/integrations/vercel/callback?code=simulated_code&state=${encodeURIComponent(nextUrl)}`);
    }
    const state = encodeURIComponent(nextUrl);
    authUrl = `https://vercel.com/oauth/authorize?client_id=${clientId}&state=${state}`;
  } else if (provider === "supabase") {
    const clientId = process.env.SUPABASE_MANAGEMENT_CLIENT_ID;
    if (!clientId) {
      // Simulate OAuth locally if credentials are not set
      return NextResponse.redirect(`${origin}/api/integrations/supabase/callback?code=simulated_code&state=${encodeURIComponent(nextUrl)}`);
    }
    const state = encodeURIComponent(nextUrl);
    authUrl = `https://api.supabase.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${origin}/api/integrations/supabase/callback`;
  } else {
    return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
  }

  return NextResponse.redirect(authUrl);
}
