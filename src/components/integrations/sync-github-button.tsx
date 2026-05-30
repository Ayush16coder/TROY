"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function SyncGithubButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSync() {
    setLoading(true);
    try {
      const res = await fetch("/api/integrations/github/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error);
      toast.success(`Synced ${data.count} repositories`);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSync}
      disabled={loading}
      className="h-9 px-4 flex items-center gap-2 bg-foreground text-background rounded-lg text-sm font-medium disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
      Sync from GitHub
    </button>
  );
}
