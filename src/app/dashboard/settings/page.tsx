import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Check, ExternalLink, Hexagon } from "lucide-react";
import { ConnectGithubButton } from "@/components/dashboard/settings/connect-github";

function GithubLogo({ size = 20 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function VercelLogo({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 76 65" width={size} height={size} fill="currentColor">
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

function SupabaseLogo({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 109 113" width={size} height={size} fill="none">
      <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627H99.3819C107.659 40.0627 112.198 49.7351 106.943 55.9467L63.7076 110.284Z" fill="url(#sb1)" />
      <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627H99.3819C107.659 40.0627 112.198 49.7351 106.943 55.9467L63.7076 110.284Z" fill="url(#sb2)" fillOpacity="0.2" />
      <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.04075L54.4849 72.2922H9.07688C0.803704 72.2922 -3.73825 62.6198 1.51677 56.4082L45.317 2.07103Z" fill="#3ECF8E" />
      <defs>
        <linearGradient id="sb1" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
          <stop stopColor="#249361" /><stop offset="1" stopColor="#3ECF8E" />
        </linearGradient>
        <linearGradient id="sb2" x1="36.1558" y1="30.578" x2="54.4844" y2="65.0806" gradientUnits="userSpaceOnUse">
          <stop /><stop offset="1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Get workspace
  const { data: workspaceMember } = await (supabase as any)
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)
    .single() as { data: { workspace_id: string } | null };

  const workspaceId = workspaceMember?.workspace_id;

  // Get integrations
  let integrations: any[] = [];
  if (workspaceId) {
    const { data } = await (supabase as any)
      .from("provider_connections")
      .select("*")
      .eq("workspace_id", workspaceId);
    integrations = data || [];
  }

  const isGithubConnected = user?.identities?.some((id) => id.provider === "github");
  const isVercelConnected = integrations.some(i => i.provider === "vercel");
  const isSupabaseConnected = integrations.some(i => i.provider === "supabase");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your workspace integrations and preferences.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-white/10">
          <h2 className="text-lg font-medium text-foreground">Connected Integrations</h2>
          <p className="text-sm text-muted-foreground">Link external platforms to enable seamless deployments and syncing.</p>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-white/10">
          {/* GitHub */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
                <GithubLogo size={24} />
              </div>
              <div>
                <h3 className="font-medium text-foreground">GitHub</h3>
                <p className="text-sm text-muted-foreground">Import repositories and enable auto-deployments.</p>
              </div>
            </div>
            {isGithubConnected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-500/20 text-sm font-medium">
                <Check className="w-4 h-4" />
                Connected
              </div>
            ) : (
              <ConnectGithubButton />
            )}
          </div>

          {/* Vercel */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center">
                <VercelLogo size={20} />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Vercel</h3>
                <p className="text-sm text-muted-foreground">Deploy and manage your projects directly from TROY.</p>
              </div>
            </div>
            {isVercelConnected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-500/20 text-sm font-medium">
                <Check className="w-4 h-4" />
                Connected
              </div>
            ) : (
              <a href={`/api/integrations/vercel/connect?next=/dashboard/settings`} className="h-9 px-4 flex items-center justify-center bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-lg text-sm font-medium transition-colors">
                Connect Vercel
              </a>
            )}
          </div>

          {/* Supabase */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
                <SupabaseLogo size={24} />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Supabase</h3>
                <p className="text-sm text-muted-foreground">Manage databases, auth, and storage natively.</p>
              </div>
            </div>
            {isSupabaseConnected ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-500/20 text-sm font-medium">
                <Check className="w-4 h-4" />
                Connected
              </div>
            ) : (
              <a href={`/api/integrations/supabase/connect?next=/dashboard/settings`} className="h-9 px-4 flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
                Connect Supabase
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
