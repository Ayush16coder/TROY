"use client";

import { Globe, Lock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ENVIRONMENTS = [
  { name: "Production", type: "production", vars: 24, project: "troy-web", protected: true },
  { name: "Preview", type: "preview", vars: 18, project: "troy-web", protected: false },
  { name: "Development", type: "development", vars: 12, project: "troy-web", protected: false },
  { name: "Production", type: "production", vars: 31, project: "api-gateway", protected: true },
  { name: "Staging", type: "preview", vars: 28, project: "api-gateway", protected: true },
];

const typeStyles: Record<string, string> = {
  production: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  preview: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  development: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

export function EnvironmentsView() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Environment</Button>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/30 border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Environment</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Variables</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ENVIRONMENTS.map((env, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/20">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{env.name}</span>
                    {env.protected && <Lock className="w-3 h-3 text-muted-foreground" />}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{env.project}</td>
                <td className="px-4 py-3">
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize", typeStyles[env.type])}>
                    {env.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{env.vars} variables</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm">Configure</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
