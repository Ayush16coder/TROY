"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Settings, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConnectGithubButton } from "@/components/dashboard/settings/connect-github";
import type { IntegrationRow } from "@/lib/workspace";

function GithubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function VercelLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 76 65" fill="currentColor" className={className}>
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

function SupabaseLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 109 113" fill="none" className={className}>
      <path d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627H99.3819C107.659 40.0627 112.198 49.7351 106.943 55.9467L63.7076 110.284Z" fill="url(#sb1)" />
      <path d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.04075L54.4849 72.2922H9.07688C0.803704 72.2922-3.73825 62.6198 1.51677 56.4082L45.317 2.07103Z" fill="#3ECF8E" />
      <defs>
        <linearGradient id="sb1" x1="53.9738" y1="54.974" x2="94.1635" y2="71.8295" gradientUnits="userSpaceOnUse">
          <stop stopColor="#249361" /><stop offset="1" stopColor="#3ECF8E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const PROVIDERS = [
  {
    id: "github",
    name: "GitHub",
    description: "Sync repositories, track commits, and trigger deployments on push.",
    icon: GithubLogo,
    bg: "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900",
    oauth: false as const,
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Deploy Next.js apps globally. Stream build logs and preview URLs.",
    icon: VercelLogo,
    bg: "bg-black dark:bg-white text-white dark:text-zinc-900",
    oauth: true as const,
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Manage PostgreSQL databases, auth, and realtime from TROY.",
    icon: SupabaseLogo,
    bg: "bg-emerald-600",
    oauth: true as const,
  },
] as const;

interface Props {
  integrations: IntegrationRow[];
  githubLinked: boolean;
}

export function IntegrationsGrid({ integrations, githubLinked }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);

  const statusMap = Object.fromEntries(integrations.map((i) => [i.provider, i.status]));

  const isConnected = (id: string) => {
    if (id === "github") return githubLinked || statusMap.github === "connected";
    return statusMap[id] === "connected";
  };

  const handleConnect = async (id: string) => {
    if (id === "github") return;

    if (PROVIDERS.find((p) => p.id === id)?.oauth) {
      window.location.href = `/api/integrations/${id}/connect?next=/dashboard/integrations`;
      return;
    }
  };

  const handleDisconnect = async (id: string) => {
    setLoading(id);
    try {
      if (id === "github") {
        toast.info("Disconnect GitHub from Supabase Auth in your account settings.");
        return;
      }
      const res = await fetch(`/api/integrations/${id}/disconnect`, { method: "POST" });
      if (!res.ok) throw new Error("Disconnect failed");
      toast.success(`Disconnected ${id}`);
      router.refresh();
    } catch {
      toast.error("Failed to disconnect");
    } finally {
      setLoading(null);
    }
  };

  const handleSync = async (id: string) => {
    setLoading(`sync-${id}`);
    try {
      const res = await fetch(`/api/integrations/${id}/sync`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Synced ${data.count ?? data.synced ?? 0} items from ${id}`);
      router.refresh();
    } catch {
      toast.error(`Sync failed for ${id}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      {searchParams.get("connected") && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-700 dark:text-emerald-400">
          Successfully connected {searchParams.get("connected")}.
        </div>
      )}
      {searchParams.get("error") && (
        <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-sm text-rose-700 dark:text-rose-400">
          Connection error: {searchParams.get("error")}. Check your API credentials in `.env.local`.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROVIDERS.map((integration) => {
          const connected = isConnected(integration.id);
          return (
            <div
              key={integration.id}
              className="bg-card p-5 rounded-2xl border border-border hover:border-primary/30 transition-all flex flex-col shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", integration.bg)}>
                  <integration.icon className="w-6 h-6" />
                </div>
                {connected ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-secondary text-muted-foreground border border-border">
                    Not Connected
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-foreground text-base mb-1.5">{integration.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{integration.description}</p>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-2">
                {connected && integration.id !== "github" && (
                  <button
                    onClick={() => handleSync(integration.id)}
                    disabled={!!loading}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {loading === `sync-${integration.id}` ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Settings className="w-3.5 h-3.5" />
                    )}
                    Sync
                  </button>
                )}
                <div className="flex-1" />
                {integration.id === "github" && !connected ? (
                  <ConnectGithubButton />
                ) : integration.id === "github" && connected ? (
                  <button
                    onClick={() => handleSync("github")}
                    disabled={!!loading}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-secondary hover:bg-secondary/80"
                  >
                    {loading === "sync-github" ? "Syncing..." : "Sync Repos"}
                  </button>
                ) : (
                  <button
                    onClick={() => (connected ? handleDisconnect(integration.id) : handleConnect(integration.id))}
                    disabled={loading === integration.id}
                    className={cn(
                      "px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50",
                      connected
                        ? "bg-secondary hover:bg-secondary/80 text-foreground"
                        : "bg-foreground text-background hover:opacity-90"
                    )}
                  >
                    {loading === integration.id ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : connected ? (
                      "Disconnect"
                    ) : (
                      "Connect"
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
