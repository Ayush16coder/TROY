"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function GithubSyncOnMount() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ran = useRef(false);

  const shouldRun =
    searchParams.get("sync") === "github" || searchParams.get("connected") === "github";

  useEffect(() => {
    if (!shouldRun || ran.current) return;
    ran.current = true;

    fetch("/api/integrations/github/sync", { method: "POST" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          if (data.message) toast.error(data.message);
          else toast.error("GitHub sync failed");
          return;
        }
        toast.success(`Synced ${data.count} repositories from GitHub`);
        router.replace("/dashboard/integrations");
        router.refresh();
      })
      .catch(() => toast.error("Failed to sync GitHub repositories"));
  }, [shouldRun, router]);

  return null;
}
