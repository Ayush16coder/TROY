"use client";

import { Bell, Search, Plus, RefreshCw } from "lucide-react";
import type { User } from "@/types/database";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
    <header className="flex items-center gap-3 px-6 py-3.5 border-b border-[#1e2d40] bg-[#080a0f]/80 backdrop-blur-sm flex-shrink-0">
      {/* Search */}
      <div className="flex-1 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
        <input
          id="global-search"
          type="text"
          placeholder="Search projects, deployments, logs..."
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#0d1117] border border-[#1e2d40] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/15 transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 border border-zinc-700 rounded px-1 py-0.5 font-mono">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Sync status */}
        <button
          onClick={handleSync}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-[#1a2236] border border-transparent hover:border-[#1e2d40] transition-all"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", syncing && "animate-spin text-blue-400")} />
          {syncing ? "Syncing..." : "Synced"}
        </button>

        {/* New project */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all duration-200">
          <Plus className="w-3.5 h-3.5" /> New Project
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[#1a2236] text-zinc-400 hover:text-white transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#080a0f]" />
        </button>
      </div>
    </header>
  );
}
