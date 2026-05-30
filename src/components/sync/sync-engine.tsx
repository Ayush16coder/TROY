"use client";

import { RefreshCw, CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { ProviderIcon, type ProviderSlug } from "@/components/ui/provider-icon";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type SyncEvent = {
  id: string;
  event_type: string;
  provider: string;
  status: string;
  error: string | null;
  created_at: string;
  processed_at: string | null;
};

const PROVIDER_SLUG: Record<string, ProviderSlug> = {
  github: "github",
  vercel: "vercel",
  supabase: "supabase",
};

const statusIcon = {
  completed: CheckCircle2,
  processing: Loader2,
  failed: XCircle,
  pending: Clock,
};

export function SyncEngine({ events }: { events: SyncEvent[] }) {
  const router = useRouter();
  const [syncing, setSyncing] = useState(false);

  async function forceSync() {
    setSyncing(true);
    try {
      await Promise.all([
        fetch("/api/integrations/github/sync", { method: "POST" }),
        fetch("/api/integrations/vercel/sync", { method: "POST" }),
        fetch("/api/integrations/supabase/sync", { method: "POST" }),
      ]);
      toast.success("Sync completed");
      router.refresh();
    } catch {
      toast.error("Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
        <div>
          <p className="text-sm font-medium">Sync Engine</p>
          <p className="text-xs text-muted-foreground mt-0.5">Webhook events and provider sync history</p>
        </div>
        <Button size="sm" variant="outline" onClick={forceSync} disabled={syncing}>
          {syncing ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-1" />}
          Force Sync All
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-secondary/30">
          <h3 className="text-sm font-semibold">Sync Events</h3>
        </div>
        {events.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            No sync events yet. Connect GitHub webhooks or run Force Sync.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {events.map((e) => {
              const Icon = statusIcon[e.status as keyof typeof statusIcon] ?? Clock;
              const slug = PROVIDER_SLUG[e.provider] ?? "github";
              return (
                <div key={e.id} className="flex items-center gap-4 p-4 hover:bg-secondary/20">
                  <ProviderIcon provider={slug} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono">{e.event_type}</p>
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(e.created_at)}</p>
                    {e.error && <p className="text-xs text-rose-500 mt-0.5">{e.error}</p>}
                  </div>
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      e.status === "completed" && "text-emerald-500",
                      e.status === "processing" && "text-blue-500 animate-spin",
                      e.status === "failed" && "text-rose-500"
                    )}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
