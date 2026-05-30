"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
  LayoutDashboard, GitBranch, Rocket, Terminal, Cpu, Settings,
  Activity, Key, Users, FolderKanban, Network, BarChart3,
  RefreshCw, Bell, CreditCard, Shield, LogOut, ChevronDown,
  Boxes, Globe,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { User } from "@/types/database";

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
      { href: "/dashboard/deployments", label: "Deployments", icon: Rocket },
      { href: "/dashboard/infrastructure", label: "Infrastructure", icon: Network },
      { href: "/dashboard/monitoring", label: "Monitoring", icon: BarChart3 },
      { href: "/dashboard/logs", label: "Logs", icon: Terminal },
      { href: "/dashboard/ai", label: "AI Workspace", icon: Cpu },
    ],
  },
  {
    label: "Integrations",
    items: [
      { href: "/dashboard/integrations", label: "Integrations", icon: Key },
      { href: "/dashboard/providers", label: "Providers", icon: Boxes },
      { href: "/dashboard/repositories", label: "Repositories", icon: GitBranch },
      { href: "/dashboard/environments", label: "Environments", icon: Globe },
      { href: "/dashboard/sync", label: "Sync Engine", icon: RefreshCw },
    ],
  },
  {
    label: "Collaboration",
    items: [
      { href: "/dashboard/team", label: "Team", icon: Users },
      { href: "/dashboard/activity", label: "Activity", icon: Activity },
      { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
      { href: "/dashboard/security", label: "Security", icon: Shield },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
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

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col border-r border-border bg-sidebar">
      <div className="flex items-center px-4 h-14 border-b border-border">
        <Link href="/dashboard" className="flex items-baseline select-none flex-1 group">
          <span className="text-lg font-extrabold tracking-tighter font-serif text-foreground">T</span>
          <span className="text-base font-light tracking-widest font-sans text-muted-foreground">R</span>
          <span className="text-lg font-black font-mono text-primary">O</span>
          <span className="text-base font-medium italic font-serif text-foreground">Y</span>
        </Link>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground opacity-50" />
      </div>

      <nav className="flex-1 px-2 py-3 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label, exact }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-150",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-lg bg-sidebar-accent border border-sidebar-border -z-10"
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
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Theme</span>
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground text-xs font-semibold flex-shrink-0">
            {user?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[13px] font-medium text-foreground truncate">
              {user?.full_name ?? "User"}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
          <LogOut className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </aside>
  );
}
