import { Search, Plus, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

function GithubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const REPOSITORIES = [
  {
    id: 1,
    name: "nexusforge-web",
    description: "Main web application frontend for NexusForge",
    visibility: "private",
    language: "TypeScript",
    updated: "2 hours ago",
    connected: true,
  },
  {
    id: 2,
    name: "nexusforge-api",
    description: "Core backend services and workers",
    visibility: "private",
    language: "Go",
    updated: "5 hours ago",
    connected: true,
  },
  {
    id: 3,
    name: "ui-components",
    description: "Shared React component library",
    visibility: "public",
    language: "TypeScript",
    updated: "1 day ago",
    connected: false,
  },
];

export default function RepositoriesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Repositories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage connected GitHub repositories and automatic deployments.
          </p>
        </div>
        <button className="h-9 px-4 flex items-center justify-center gap-2 bg-foreground text-background hover:opacity-90 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Import Repository
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 dark:border-white/10 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search repositories..."
              className="w-full h-9 pl-9 pr-4 bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-white/10">
          {REPOSITORIES.map((repo) => (
            <div key={repo.id} className="p-4 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex-shrink-0 text-zinc-900 dark:text-white">
                  <GithubLogo className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{repo.name}</h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border border-zinc-200 dark:border-white/10 text-muted-foreground">
                      {repo.visibility === "private" ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                      <span className="capitalize">{repo.visibility}</span>
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 sm:mb-0 line-clamp-1">{repo.description}</p>
                  
                  <div className="flex items-center gap-4 text-[12px] text-muted-foreground sm:hidden mt-2">
                    <span className="flex items-center gap-1.5">
                      <span className={cn("w-2 h-2 rounded-full", repo.language === "TypeScript" ? "bg-blue-500" : "bg-cyan-500")} />
                      {repo.language}
                    </span>
                    <span>Updated {repo.updated}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                <div className="hidden sm:flex items-center gap-6 text-[13px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className={cn("w-2 h-2 rounded-full", repo.language === "TypeScript" ? "bg-blue-500" : "bg-cyan-500")} />
                    {repo.language}
                  </span>
                  <span className="min-w-[100px]">Updated {repo.updated}</span>
                </div>
                
                {repo.connected ? (
                  <button className="h-8 px-3 text-xs font-medium bg-zinc-100 dark:bg-white/10 text-foreground rounded-md hover:bg-zinc-200 dark:hover:bg-white/20 transition-colors">
                    Configure
                  </button>
                ) : (
                  <button className="h-8 px-3 text-xs font-medium bg-foreground text-background hover:opacity-90 rounded-md transition-colors">
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
