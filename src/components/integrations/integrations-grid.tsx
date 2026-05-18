"use client";

import { useState } from "react";
import { GitBranch, Zap, Database, Settings, Cloud, ExternalLink, CheckCircle2, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const INTEGRATIONS = [
  {
    id: "github",
    name: "GitHub",
    description: "Sync repositories, track commits, and trigger deployments automatically on push.",
    icon: GitBranch,
    status: "connected",
    color: "text-white",
    bg: "bg-zinc-800",
  },
  {
    id: "vercel",
    name: "Vercel",
    description: "Deploy Next.js apps globally. View preview URLs and live streaming build logs.",
    icon: Zap,
    status: "connected",
    color: "text-white",
    bg: "bg-black",
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Connect your PostgreSQL database, authentication, and realtime subscriptions.",
    icon: Database,
    status: "disconnected",
    color: "text-emerald-400",
    bg: "bg-[#1f2d26]",
  },
  {
    id: "railway",
    name: "Railway",
    description: "Deploy backend services, worker dynos, and databases instantly.",
    icon: Server,
    status: "disconnected",
    color: "text-violet-400",
    bg: "bg-[#291e3d]",
  },
  {
    id: "render",
    name: "Render",
    description: "Unified cloud to build and run all your apps and websites.",
    icon: Cloud,
    status: "disconnected",
    color: "text-cyan-400",
    bg: "bg-[#1a3033]",
  },
  {
    id: "aws",
    name: "AWS EC2",
    description: "Deploy and manage containerized infrastructure on Amazon Web Services.",
    icon: Cloud,
    status: "disconnected",
    color: "text-orange-400",
    bg: "bg-[#332214]",
  },
];

export function IntegrationsGrid() {
  const [loading, setLoading] = useState<string | null>(null);

  const toggleConnection = (id: string) => {
    setLoading(id);
    // Simulate API call
    setTimeout(() => {
      setLoading(null);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {INTEGRATIONS.map((integration) => (
        <div
          key={integration.id}
          className="glass-raised p-5 rounded-2xl border border-[#1e2d40] hover:border-blue-500/30 transition-all group flex flex-col"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", integration.bg)}>
              <integration.icon className={cn("w-6 h-6", integration.color)} />
            </div>
            {integration.status === "connected" ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" />
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
                Not Connected
              </span>
            )}
          </div>
          
          <h3 className="font-semibold text-white text-base mb-1.5">{integration.name}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed flex-1">
            {integration.description}
          </p>

          <div className="mt-6 pt-4 border-t border-[#1e2d40] flex items-center justify-between">
            <button className="text-xs font-medium text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Configure
            </button>
            <button
              onClick={() => toggleConnection(integration.id)}
              disabled={loading === integration.id}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-50",
                integration.status === "connected"
                  ? "bg-[#1e2d40] hover:bg-[#2d4060] text-white"
                  : "bg-white text-black hover:bg-zinc-200"
              )}
            >
              {loading === integration.id 
                ? "Connecting..." 
                : integration.status === "connected" ? "Disconnect" : "Connect"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
