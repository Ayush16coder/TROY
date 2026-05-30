"use client";

import { useState } from "react";
import { Key, Shield, Monitor, FileText, Lock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "keys", label: "API Keys", icon: Key },
  { id: "oauth", label: "OAuth", icon: Shield },
  { id: "sessions", label: "Sessions", icon: Monitor },
  { id: "audit", label: "Audit Logs", icon: FileText },
] as const;

const API_KEYS = [
  { name: "Production Deploy", prefix: "troy_prod_••••8f2a", created: "Mar 12, 2026", lastUsed: "2m ago" },
  { name: "CI Pipeline", prefix: "troy_ci_••••3b91", created: "Feb 28, 2026", lastUsed: "1h ago" },
];

const SESSIONS = [
  { device: "Chrome on macOS", location: "San Francisco, CA", current: true, lastActive: "Active now" },
  { device: "TROY CLI", location: "—", current: false, lastActive: "3h ago" },
];

const AUDIT = [
  { action: "api_key.created", user: "alex@acme.com", time: "Mar 12, 14:22" },
  { action: "integration.connected", user: "sarah@acme.com", time: "Mar 11, 09:15" },
  { action: "member.invited", user: "alex@acme.com", time: "Mar 10, 16:40" },
];

export function SecurityDashboard() {
  const [tab, setTab] = useState<typeof TABS[number]["id"]>("keys");

  return (
    <div className="space-y-6">
      <div className="flex gap-1 p-1 rounded-lg border border-border bg-secondary/30 w-fit flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              tab === t.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "keys" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Create API Key</Button>
          </div>
          <div className="rounded-xl border border-border divide-y divide-border">
            {API_KEYS.map((k) => (
              <div key={k.name} className="flex items-center justify-between p-4 hover:bg-secondary/30">
                <div>
                  <p className="text-sm font-medium">{k.name}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">{k.prefix}</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>Created {k.created}</p>
                  <p>Last used {k.lastUsed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "oauth" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <p className="text-sm text-muted-foreground">Manage OAuth connections for GitHub, Google, and Discord.</p>
          {["GitHub", "Google", "Discord"].map((p) => (
            <div key={p} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <span className="font-medium">{p}</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400">Connected</span>
            </div>
          ))}
        </div>
      )}

      {tab === "sessions" && (
        <div className="rounded-xl border border-border divide-y divide-border">
          {SESSIONS.map((s) => (
            <div key={s.device} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium flex items-center gap-2">
                  {s.device}
                  {s.current && <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded">Current</span>}
                </p>
                <p className="text-xs text-muted-foreground">{s.location} · {s.lastActive}</p>
              </div>
              {!s.current && <Button variant="ghost" size="sm" className="text-destructive">Revoke</Button>}
            </div>
          ))}
        </div>
      )}

      {tab === "audit" && (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary/30 border-b border-border">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Time</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT.map((a) => (
                <tr key={a.time} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{a.action}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.user}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <Lock className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Two-Factor Authentication</p>
          <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
        </div>
        <Button variant="outline" size="sm">Enable 2FA</Button>
      </div>
    </div>
  );
}
