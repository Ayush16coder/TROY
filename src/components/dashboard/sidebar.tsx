"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  LayoutDashboard, GitBranch, Rocket, Terminal,
  Cpu, Settings, Zap, ChevronDown,
  Activity, Key, Users, FolderGit2, LogOut,
} from "lucide-react";
import type { User } from "@/types/database";

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard",              icon: LayoutDashboard, label: "Overview"     },
      { href: "/dashboard/deployments",  icon: Rocket,          label: "Deployments"  },
      { href: "/dashboard/logs",         icon: Terminal,        label: "Logs"         },
      { href: "/dashboard/ai",           icon: Cpu,             label: "AI Workspace" },
    ],
  },
  {
    label: "Integrations",
    items: [
      { href: "/dashboard/integrations", icon: Key,             label: "Integrations" },
      { href: "/dashboard/repositories", icon: GitBranch,       label: "Repositories" },
      { href: "/dashboard/team",         icon: Users,           label: "Team"         },
    ],
  },
];

interface Props {
  user: User | null;
}

export function DashboardSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex items-center px-4 py-4 border-b border-border">
        <div className="flex items-baseline select-none flex-1">
          <span className="text-xl font-extrabold tracking-tighter font-serif text-foreground">T</span>
          <span className="text-lg font-light tracking-widest font-sans text-muted-foreground">R</span>
          <span className="text-xl font-black font-mono text-primary">O</span>
          <span className="text-lg font-medium italic font-serif text-foreground">Y</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label }) => {
                const isActive = href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150",
                      isActive
                        ? "text-foreground bg-secondary border border-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-lg bg-secondary border border-border -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Settings */}
        <div>
          <p className="px-3 pb-2 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
            System
          </p>
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150",
              pathname.startsWith("/dashboard/settings")
                ? "text-foreground bg-secondary border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Settings className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} />
            Settings
          </Link>
        </div>
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-border">
        <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground text-xs font-semibold flex-shrink-0">
            {user?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-foreground truncate">
              {user?.full_name ?? "User"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
          <LogOut className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </button>
      </div>
    </aside>
  );
}
