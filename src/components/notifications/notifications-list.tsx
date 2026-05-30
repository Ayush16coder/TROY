"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, AlertTriangle, RefreshCw, Shield, Cpu, Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NOTIFICATIONS = [
  { id: "1", type: "deployment", title: "Production deploy succeeded", message: "troy-web deployed to vercel in 42s", time: "2m ago", read: false, icon: Rocket },
  { id: "2", type: "alert", title: "Elevated error rate detected", message: "api-gateway 5xx rate above 1% threshold", time: "12m ago", read: false, icon: AlertTriangle },
  { id: "3", type: "sync", title: "GitHub sync completed", message: "12 repositories synchronized", time: "1h ago", read: true, icon: RefreshCw },
  { id: "4", type: "security", title: "New login from Chrome on macOS", message: "San Francisco, CA · 192.168.x.x", time: "2h ago", read: true, icon: Shield },
  { id: "5", type: "ai", title: "AI insight: optimize build cache", message: "Potential 34% build time reduction", time: "3h ago", read: false, icon: Cpu },
  { id: "6", type: "team", title: "Jordan accepted invitation", message: "Joined as Developer", time: "5h ago", read: true, icon: Users },
];

export function NotificationsList() {
  const [items, setItems] = useState(NOTIFICATIONS);
  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{unread} unread</span>
        <Button variant="ghost" size="sm" onClick={markAllRead} disabled={unread === 0}>
          <Check className="w-3.5 h-3.5 mr-1" /> Mark all read
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {items.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className={cn(
              "flex items-start gap-4 p-4 hover:bg-secondary/30 transition-colors cursor-pointer",
              !n.read && "bg-primary/[0.02]"
            )}
          >
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <n.icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
              <p className="text-[11px] text-muted-foreground/70 mt-1">{n.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
