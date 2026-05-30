"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Settings, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
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

function RailwayLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
      <line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
  );
}

function DockerLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.186.186 0 00-.185.186v1.887c0 .102.083.185.185.185m-2.81 0h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.186.186 0 00-.185.186v1.887c0 .102.082.185.185.185m0-2.81h2.118a.186.186 0 00.186-.186V6.196a.186.186 0 00-.186-.185h-2.118a.186.186 0 00-.185.185v1.886c0 .102.082.186.185.186m-2.81 2.81h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186H8.363a.186.186 0 00-.185.186v1.887c0 .102.082.185.185.185m-2.81 0h2.119a.186.186 0 00.185-.185V9.006a.186.186 0 00-.185-.186H5.553a.186.186 0 00-.186.186v1.887c0 .102.083.185.186.185m0-2.81h2.119a.186.186 0 00.185-.186V6.196a.186.186 0 00-.185-.185H5.553a.186.186 0 00-.186.185v1.886c0 .102.083.186.186.186m-2.81 2.81h2.119a.186.186 0 00.185-.185V9.006a.186.186 0 00-.185-.186H2.743a.186.186 0 00-.186.186v1.887c0 .102.083.185.186.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.534-1.716-2.566l-.344-.199-.196.352c-.186.33-.343.68-.469 1.042-.396-.107-.806-.16-1.222-.16h-14.4c-.035 0-.069.011-.097.031a.17.17 0 00-.067.09C1.883 9.497.106 14.162.008 14.426a.2.2 0 00.088.232c.307.179 2.072 1.157 5.097 1.157 2.053 0 4.148-.485 5.76-1.325a17.433 17.433 0 003.882 1.34c1.782.35 3.59.52 5.4.502h.11c1.24 0 2.47-.11 3.69-.328a.194.194 0 00.147-.117.195.195 0 00-.022-.187c-1.121-1.558-1.583-2.91-1.666-3.262-.314-1.322-.12-2.31.597-3.037.07-.07.098-.168.066-.263z"/>
    </svg>
  );
}

function AwsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.996 0C5.371 0 0 5.373 0 12c0 6.628 5.371 12 11.996 12 6.627 0 11.996-5.372 11.996-12 0-6.627-5.369-12-11.996-12zM17.4 16.5c-1.3.9-3.2 1.4-5.3 1.4-2 0-3.9-.4-5.1-1.3.1-.1.2-.2.2-.4.7.4 2.1 1.1 4.5 1.1 2.3 0 3.7-.7 4.5-1.1.2.2.3.4.4.4.7-.2.9-.4.9-.7 0-.3-.3-.4-.7-.4-.3 0-.6.1-.9.2-.6.4-1.8 1-4.2 1-2.4 0-3.6-.6-4.2-1-.3-.2-.6-.3-.9-.3-.3 0-.6.2-.6.4s.2.5.9.7c1.4.9 3.4 1.4 5.3 1.4 2.2 0 4.2-.6 5.5-1.5.2-.1.3-.3.2-.5-.1-.3-.4-.3-.6-.2-.3.2-.6.4-.9.5.3-.1.5-.3.5-.5z"/>
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
    oauth: true as const,
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
    bg: "bg-emerald-600 text-white",
    oauth: true as const,
  },
  {
    id: "railway",
    name: "Railway",
    description: "Deploy infrastructure and databases instantly with full CI/CD.",
    icon: RailwayLogo,
    bg: "bg-purple-600 text-white",
    oauth: true as const,
  },
  {
    id: "docker",
    name: "Docker",
    description: "Sync Docker Hub repositories and monitor image updates.",
    icon: DockerLogo,
    bg: "bg-blue-600 text-white",
    oauth: false as const,
  },
  {
    id: "aws",
    name: "AWS",
    description: "Sync AWS ECS, Lambda, and S3 resources.",
    icon: AwsLogo,
    bg: "bg-orange-500 text-white",
    oauth: false as const,
  },
] as const;

interface Props {
  integrations: IntegrationRow[];
}

export function IntegrationsGrid({ integrations }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);

  const statusMap = Object.fromEntries(integrations.map((i) => [i.provider, i.status]));

  const isConnected = (id: string) => statusMap[id] === "connected";

  const handleConnect = async (id: string) => {
    const provider = PROVIDERS.find((p) => p.id === id);
    if (!provider) return;

    if (provider.oauth) {
      window.location.href = `/api/integrations/${id}/connect?next=/dashboard/integrations`;
      return;
    }
    
    // Token-based providers
    let token = "";
    if (id === "docker") {
        token = window.prompt("Enter your Docker Hub Access Token:") || "";
    } else if (id === "aws") {
        token = window.prompt('Enter AWS Credentials as JSON: {"accessKeyId":"...","secretAccessKey":"...","region":"us-east-1"}') || "";
    }
    
    if (!token) return;
    
    setLoading(id);
    try {
        const res = await fetch(`/api/integrations/${id}/connect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        });
        if (!res.ok) throw new Error(await res.text());
        toast.success(`Connected ${id}`);
        router.refresh();
    } catch (err) {
        toast.error(`Failed to connect ${id}`);
    } finally {
        setLoading(null);
    }
  };

  const handleDisconnect = async (id: string) => {
    setLoading(id);
    try {
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
      if (!res.ok) throw new Error(data.error || "Sync failed");
      toast.success(`Synced ${data.count ?? data.synced ?? 0} items from ${id}`);
      router.refresh();
    } catch (err: any) {
      toast.error(`Sync failed for ${id}: ${err.message}`);
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
          Connection error: <strong>{searchParams.get("error")}</strong>
          {searchParams.get("detail") && (
            <span className="ml-1 opacity-80">— {decodeURIComponent(searchParams.get("detail")!)}</span>
          )}
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
                {connected && (
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
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
