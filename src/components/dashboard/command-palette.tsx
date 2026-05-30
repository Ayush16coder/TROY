"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Rocket, Terminal, Cpu, Key, GitBranch, Users,
  Activity, Bell, CreditCard, Shield, Settings, FolderKanban,
  Network, BarChart3, RefreshCw, Plus, Search,
} from "lucide-react";
import { useUIStore } from "@/lib/store/workspace-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { group: "Workspace", items: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard, shortcut: "G O" },
    { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    { label: "Deployments", href: "/dashboard/deployments", icon: Rocket },
    { label: "Infrastructure", href: "/dashboard/infrastructure", icon: Network },
    { label: "Monitoring", href: "/dashboard/monitoring", icon: BarChart3 },
    { label: "Logs", href: "/dashboard/logs", icon: Terminal },
    { label: "AI Workspace", href: "/dashboard/ai", icon: Cpu },
  ]},
  { group: "Integrations", items: [
    { label: "Integrations", href: "/dashboard/integrations", icon: Key },
    { label: "Repositories", href: "/dashboard/repositories", icon: GitBranch },
    { label: "Sync Engine", href: "/dashboard/sync", icon: RefreshCw },
  ]},
  { group: "Collaboration", items: [
    { label: "Team", href: "/dashboard/team", icon: Users },
    { label: "Activity", href: "/dashboard/activity", icon: Activity },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  ]},
  { group: "System", items: [
    { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { label: "Security", href: "/dashboard/security", icon: Shield },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ]},
  { group: "Actions", items: [
    { label: "New Project", href: "/dashboard/new", icon: Plus },
    { label: "Connect Provider", href: "/dashboard/integrations", icon: Key },
  ]},
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();

  const toggle = useCallback(() => {
    setCommandPaletteOpen(!commandPaletteOpen);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") setCommandPaletteOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle, setCommandPaletteOpen]);

  const navigate = (href: string) => {
    setCommandPaletteOpen(false);
    router.push(href);
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-[18%] z-50 w-full max-w-lg -translate-x-1/2 px-4"
          >
            <Command
              className="rounded-xl border border-border bg-popover shadow-2xl overflow-hidden"
              loop
            >
              <div className="flex items-center gap-2 border-b border-border px-4">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Command.Input
                  placeholder="Search commands, pages, actions..."
                  className="flex-1 h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  autoFocus
                />
                <kbd className="hidden sm:flex h-5 px-1.5 items-center text-[10px] font-medium text-muted-foreground bg-secondary border border-border rounded">
                  ESC
                </kbd>
              </div>
              <Command.List className="max-h-[min(400px,50vh)] overflow-y-auto p-2">
                <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>
                {NAV_ITEMS.map((group) => (
                  <Command.Group key={group.group} heading={group.group} className="mb-2">
                    <p className="px-2 py-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground/70 uppercase">
                      {group.group}
                    </p>
                    {group.items.map((item) => (
                      <Command.Item
                        key={item.href + item.label}
                        value={item.label}
                        onSelect={() => navigate(item.href)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer",
                          "text-foreground aria-selected:bg-secondary aria-selected:text-foreground"
                        )}
                      >
                        <item.icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
                        <span className="flex-1">{item.label}</span>
                        {"shortcut" in item && item.shortcut && (
                          <kbd className="text-[10px] text-muted-foreground font-mono">{item.shortcut}</kbd>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
