"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rocket, AlertTriangle, RefreshCw, Shield, Cpu, Check } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};

const ICON_MAP: Record<string, React.ElementType> = {
  deployment: Rocket,
  alert: AlertTriangle,
  sync: RefreshCw,
  security: Shield,
  ai: Cpu,
};

export function NotificationsList({ notifications: initial }: { notifications: Notification[] }) {
  const [items, setItems] = useState(initial);
  const router = useRouter();
  const supabase = createClient();
  const unread = items.filter((n) => !n.read).length;

  const markAllRead = async () => {
    const ids = items.filter((n) => !n.read).map((n) => n.id);
    if (ids.length === 0) return;
    await supabase.from("notifications").update({ read: true }).in("id", ids);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No notifications yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{unread} unread</span>
        <Button variant="ghost" size="sm" onClick={markAllRead} disabled={unread === 0}>
          <Check className="w-3.5 h-3.5 mr-1" /> Mark all read
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {items.map((n) => {
          const Icon = ICON_MAP[n.type] ?? AlertTriangle;
          return (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-4 p-4 hover:bg-secondary/30",
                !n.read && "bg-primary/[0.02]"
              )}
            >
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{n.title}</p>
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-1">{formatRelativeTime(n.created_at)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
