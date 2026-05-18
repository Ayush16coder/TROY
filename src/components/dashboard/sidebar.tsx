"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, GitBranch, Rocket, Terminal,
  Cpu, Settings, Zap, ChevronDown,
  Activity, Key, Users, FolderGit2,
} from "lucide-react";
import type { User } from "@/types/database";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/projects", icon: FolderGit2, label: "Projects" },
  { href: "/dashboard/deployments", icon: Rocket, label: "Deployments" },
  { href: "/dashboard/repositories", icon: GitBranch, label: "Repositories" },
  { href: "/dashboard/logs", icon: Terminal, label: "Logs" },
  { href: "/dashboard/ai", icon: Cpu, label: "AI Workspace" },
  { href: "/dashboard/activity", icon: Activity, label: "Activity" },
  { href: "/dashboard/integrations", icon: Key, label: "Integrations" },
  { href: "/dashboard/team", icon: Users, label: "Team" },
];

interface Props {
  user: User | null;
}

export function DashboardSidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col border-r border-[#1e2d40] bg-[#080a0f]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[#1e2d40]">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-white text-sm tracking-tight">NexusForge</span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-600 ml-auto" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
          Workspace
        </p>
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn("sidebar-item", isActive && "active")}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}

        <div className="pt-3">
          <p className="px-3 pb-2 text-[10px] font-semibold tracking-widest text-zinc-600 uppercase">
            System
          </p>
          <Link
            href="/dashboard/settings"
            className={cn("sidebar-item", pathname.startsWith("/dashboard/settings") && "active")}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            Settings
          </Link>
        </div>
      </nav>

      {/* User */}
      <div className="p-3 border-t border-[#1e2d40]">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#1a2236] transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.full_name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">
              {user?.full_name ?? "User"}
            </p>
            <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
