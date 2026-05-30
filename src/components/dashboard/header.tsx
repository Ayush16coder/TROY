"use client";

import { Bell, Search, Plus, RefreshCw, ChevronDown, Command } from "lucide-react";
import type { User } from "@/types/database";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { useUIStore, useWorkspaceStore } from "@/lib/store/workspace-store";

interface Props {
  user: User | null;
}

export function DashboardHeader({ user }: Props) {
  const [syncing, setSyncing] = useState(false);
  const { setCommandPaletteOpen } = useUIStore();
  const { workspaceName, syncStatus, setSyncStatus } = useWorkspaceStore();

  function handleSync() {
    setSyncing(true);
    setSyncStatus("syncing");
    setTimeout(() => {
      setSyncing(false);
      setSyncStatus("synced");
    }, 2200);
  }

  const syncLabel =
    syncing || syncStatus === "syncing"
      ? "Syncing..."
      : syncStatus === "error"
        ? "Sync failed"
        : "All synced";

  return (
    <header className="flex items-center gap-3 px-5 h-14 border-b border-border bg-background/80 backdrop-blur-md flex-shrink-0">
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex-1 relative max-w-md group"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        <div className="w-full pl-9 pr-20 py-2 rounded-lg bg-secondary/80 border border-border text-sm text-muted-foreground text-left group-hover:border-ring/30 transition-all">
          Search projects, deployments, logs...
        </div>
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 px-1.5 flex items-center gap-0.5 text-[10px] font-medium text-muted-foreground bg-background border border-border rounded select-none">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 hover:bg-secondary transition-colors">
        <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
          {workspaceName[0]}
        </div>
        <span className="text-xs font-medium text-foreground max-w-[120px] truncate">{workspaceName}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>

      <div className="flex items-center gap-1.5 ml-auto">
        <button
          onClick={handleSync}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all border",
            syncing
              ? "text-primary border-primary/20 bg-primary/5"
              : "text-muted-foreground hover:text-foreground border-transparent hover:border-border hover:bg-secondary"
          )}
        >
          <RefreshCw className={cn("w-3.5 h-3.5", syncing && "animate-spin")} />
          <span className="hidden sm:inline">{syncLabel}</span>
          {!syncing && syncStatus === "synced" && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 hidden sm:block" />
          )}
        </button>

        <div className="h-4 w-px bg-border hidden sm:block" />

        <ThemeToggle />

        <Link
          href="/dashboard/notifications"
          className="relative p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-background" />
        </Link>

        <Link
          href="/dashboard/new"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New</span>
        </Link>

        <Link
          href="/dashboard/settings"
          className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-semibold text-foreground hover:border-ring/50 transition-colors ml-1"
          title={user?.email ?? "Profile"}
        >
          {user?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U"}
        </Link>
      </div>
    </header>
  );
}
