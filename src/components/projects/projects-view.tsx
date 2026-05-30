"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutGrid, List, Plus, GitBranch, Rocket, MoreHorizontal } from "lucide-react";
import { ProviderIcon, type ProviderSlug } from "@/components/ui/provider-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PROJECTS = [
  { name: "troy-web", slug: "troy-web", framework: "Next.js", repo: "acme/troy-web", provider: "vercel" as ProviderSlug, status: "active", deployments: 142, lastDeploy: "2m ago" },
  { name: "api-gateway", slug: "api-gateway", framework: "Node.js", repo: "acme/api-gateway", provider: "railway" as ProviderSlug, status: "active", deployments: 89, lastDeploy: "1h ago" },
  { name: "worker", slug: "worker", framework: "Rust", repo: "acme/worker", provider: "render" as ProviderSlug, status: "paused", deployments: 34, lastDeploy: "3d ago" },
  { name: "docs", slug: "docs", framework: "Astro", repo: "acme/docs", provider: "netlify" as ProviderSlug, status: "active", deployments: 56, lastDeploy: "18m ago" },
  { name: "mobile-api", slug: "mobile-api", framework: "Go", repo: "acme/mobile-api", provider: "aws" as ProviderSlug, status: "active", deployments: 201, lastDeploy: "45m ago" },
  { name: "design-system", slug: "design-system", framework: "React", repo: "acme/design-system", provider: "vercel" as ProviderSlug, status: "archived", deployments: 12, lastDeploy: "2w ago" },
];

export function ProjectsView() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex rounded-lg border border-border p-0.5 bg-secondary/30">
          <button
            onClick={() => setView("grid")}
            className={cn("p-2 rounded-md transition-colors", view === "grid" ? "bg-background shadow-sm" : "text-muted-foreground")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("p-2 rounded-md transition-colors", view === "list" ? "bg-background shadow-sm" : "text-muted-foreground")}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/new"><Plus className="w-4 h-4 mr-1" /> New Project</Link>
        </Button>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <ProviderIcon provider={p.provider} size="md" />
                  <div>
                    <h3 className="font-semibold text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground">{p.framework}</p>
                  </div>
                </div>
                <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <GitBranch className="w-3 h-3" />
                <span className="font-mono truncate">{p.repo}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Rocket className="w-3 h-3" />
                  {p.deployments} deploys
                </div>
                <span className="text-[11px] text-muted-foreground">{p.lastDeploy}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Repository</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Provider</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Last Deploy</th>
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((p) => (
                <tr key={p.slug} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{p.repo}</td>
                  <td className="px-4 py-3"><ProviderIcon provider={p.provider} size="sm" /></td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{p.status}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{p.lastDeploy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
