"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, CheckCircle2, GitBranch, Zap, Database, Terminal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const FRAMEWORKS = [
  { id: "nextjs", name: "Next.js", icon: "N" },
  { id: "react", name: "React", icon: "R" },
  { id: "vue", name: "Vue", icon: "V" },
  { id: "svelte", name: "SvelteKit", icon: "S" },
];

export default function NewProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [framework, setFramework] = useState("nextjs");
  const [isDeploying, setIsDeploying] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();

  const STEPS = [
    { name: "Initializing project configuration", icon: Terminal },
    { name: "Creating GitHub repository", icon: GitBranch },
    { name: "Provisioning Vercel deployment", icon: Zap },
    { name: "Bootstrapping Supabase database", icon: Database },
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setIsDeploying(true);
    setStep(0);

    try {
      // Create project API call
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName, framework }),
      });

      if (!res.ok) throw new Error("Failed to create project");

      // Simulate step progression for the UI
      for (let i = 1; i <= STEPS.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setStep(i);
      }

      // Briefly show completion state before redirect
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setIsDeploying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <div>
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 -ml-2 p-2 w-fit rounded-lg hover:bg-secondary"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Create a new Project</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          TROY will automatically provision a GitHub repository, Vercel deployment, and Supabase database.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        {isDeploying ? (
          <div className="p-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Orchestrating Infrastructure</h2>
              <p className="text-sm text-muted-foreground">Please wait while we set up your unified environment.</p>
            </div>

            <div className="bg-zinc-950 rounded-xl border border-white/10 overflow-hidden font-mono text-sm">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/40">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-zinc-500 text-xs">Deployment Logs</span>
              </div>
              <div className="p-5 space-y-4">
                {STEPS.map((s, i) => {
                  const isActive = step === i;
                  const isCompleted = step > i;
                  const isPending = step < i;

                  return (
                    <div 
                      key={i} 
                      className={cn(
                        "flex items-start gap-3 transition-opacity duration-300",
                        isPending ? "opacity-30" : "opacity-100"
                      )}
                    >
                      <div className="mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : isActive ? (
                          <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-700" />
                        )}
                      </div>
                      <div>
                        <span className={cn(
                          "font-medium",
                          isCompleted ? "text-emerald-400" : isActive ? "text-blue-400" : "text-zinc-500"
                        )}>
                          {s.name}...
                        </span>
                        {isActive && (
                          <div className="text-xs text-zinc-500 mt-1 animate-pulse">
                            Establishing API connections and generating templates
                          </div>
                        )}
                        {isCompleted && (
                          <div className="text-xs text-zinc-600 mt-1">
                            Done in {(Math.random() * 2 + 1).toFixed(2)}s
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground">Project Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. my-awesome-app"
                  className="w-full h-11 px-4 bg-zinc-100 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground">Framework</label>
              <div className="grid grid-cols-2 gap-4">
                {FRAMEWORKS.map((fw) => (
                  <button
                    key={fw.id}
                    type="button"
                    onClick={() => setFramework(fw.id)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                      framework === fw.id
                        ? "bg-primary/5 border-primary/30 ring-1 ring-primary/30"
                        : "bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-black/40 flex items-center justify-center font-bold text-foreground">
                      {fw.icon}
                    </div>
                    <span className="font-medium text-sm text-foreground">{fw.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-white/10">
              <button
                type="submit"
                disabled={!projectName.trim()}
                className="w-full h-11 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Create Project
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
