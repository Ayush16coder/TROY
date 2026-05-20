"use client";

import { Bell, Search, Plus, RefreshCw } from "lucide-react";
import type { User } from "@/types/database";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

interface Props {
  user: User | null;
}

export function DashboardHeader({ user }: Props) {
  const [syncing, setSyncing] = useState(false);

  function handleSync() {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  }

  return (
    <header className="flex items-center gap-3 px-6 h-14 border-b border-border bg-background/80 backdrop-blur-sm flex-shrink-0">
      {/* Search */}
      <div className="flex-1 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          id="global-search"
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-12 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-ring/50 focus:ring-1 focus:ring-ring/20 transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
          <span className="text-xs leading-none">⌘</span>
          <span className="leading-none">K</span>
        </kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Sync status */}
        <button
          onClick={handleSync}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent hover:border-border transition-all"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", syncing && "animate-spin text-primary")} />
          <span className="hidden sm:inline">{syncing ? "Syncing..." : "Synced"}</span>
        </button>

        <div className="h-4 w-px bg-border" />

        <ThemeToggle />

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-background" />
        </button>

        {/* New project */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium hover:bg-foreground/90 hover:scale-105 transition-all shadow-sm">
          <Plus className="w-3.5 h-3.5" /> New
        </button>
      </div>
    </header>
  );
}
