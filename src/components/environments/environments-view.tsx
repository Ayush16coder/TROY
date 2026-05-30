import { Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type EnvRow = {
  id: string;
  name: string;
  type: string;
  variables_count: number;
  projects?: { name: string; slug: string } | null;
};

const typeStyles: Record<string, string> = {
  production: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  preview: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  development: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

export function EnvironmentsView({ environments }: { environments: EnvRow[] }) {
  if (environments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        No environments configured. Create a project with Vercel or Supabase connected.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-secondary/30 border-b border-border">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Environment</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Variables</th>
          </tr>
        </thead>
        <tbody>
          {environments.map((env) => (
            <tr key={env.id} className="border-b border-border last:border-0 hover:bg-secondary/20">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{env.name}</span>
                  {env.type === "production" && <Lock className="w-3 h-3 text-muted-foreground" />}
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {env.projects?.slug ?? "—"}
              </td>
              <td className="px-4 py-3">
                <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize", typeStyles[env.type])}>
                  {env.type}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{env.variables_count} variables</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
