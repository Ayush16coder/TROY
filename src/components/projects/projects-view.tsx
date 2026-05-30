"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutGrid, List, Plus, GitBranch, Rocket, MoreHorizontal } from "lucide-react";
import { ProviderIcon, type ProviderSlug } from "@/components/ui/provider-icon";
import { Button } from "@/components/ui/button";
import { cn, formatRelativeTime } from "@/lib/utils";

type ProjectRow = {
  id: string;
  name: string;
  slug: string;
  framework: string | null;
  status: string;
  updated_at: string;
  deployments?: { id: string; status: string; created_at: string; provider: string }[];
};

const PROVIDER_SLUG: Record<string, ProviderSlug> = {
  vercel: "vercel",
  netlify: "netlify",
  railway: "railway",
  render: "render",
  aws: "aws",
};

export function ProjectsView({ projects }: { projects: ProjectRow[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground mb-4">No projects yet. Create one to get started.</p>
        <Button asChild>
          <Link href="/dashboard/new"><Plus className="w-4 h-4 mr-1" /> New Project</Link>
        </Button>
      </div>
    );
  }

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
          {projects.map((p, i) => {
            const lastDep = p.deployments?.[0];
            const provider = lastDep?.provider ?? "vercel";
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ProviderIcon provider={PROVIDER_SLUG[provider] ?? "vercel"} size="md" />
                    <div>
                      <h3 className="font-semibold text-foreground">{p.name}</h3>
                      <p className="text-xs text-muted-foreground">{p.framework ?? "—"}</p>
                    </div>
                  </div>
                  <span className="text-[10px] capitalize text-muted-foreground">{p.status}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Rocket className="w-3 h-3" />
                    {p.deployments?.length ?? 0} deploys
                  </span>
                  <span>{formatRelativeTime(p.updated_at)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Framework</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.framework ?? "—"}</td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{p.status}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">{formatRelativeTime(p.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
