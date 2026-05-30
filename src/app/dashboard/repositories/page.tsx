import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Lock, Globe, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { getWorkspaceForUser, isGithubConnected } from "@/lib/workspace";
import { fetchRepositories } from "@/lib/data/dashboard";
import { formatRelativeTime } from "@/lib/utils";
import { ConnectGithubButton } from "@/components/dashboard/settings/connect-github";
import { SyncGithubButton } from "@/components/integrations/sync-github-button";

function GithubLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export const metadata = { title: "Repositories" };

export default async function RepositoriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const workspace = await getWorkspaceForUser(user.id);
  if (!workspace) redirect("/onboarding");

  const repos = await fetchRepositories(workspace.workspaceId);
  const githubLinked = isGithubConnected(user);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Repositories"
        description="GitHub repositories synced to your workspace."
        actions={
          githubLinked ? (
            <SyncGithubButton />
          ) : (
            <ConnectGithubButton />
          )
        }
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {repos.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            {githubLinked
              ? "No repositories synced yet. Click Sync from GitHub above."
              : "Connect GitHub to import repositories."}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <GithubLogo className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{repo.full_name}</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border border-border text-muted-foreground">
                        {repo.private ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                        {repo.private ? "private" : "public"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      {repo.default_branch}
                      {repo.last_commit_sha && ` · ${repo.last_commit_sha.slice(0, 7)}`}
                    </p>
                    {repo.last_commit_message && (
                      <p className="text-sm text-muted-foreground truncate mt-1">{repo.last_commit_message}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {repo.synced_at ? formatRelativeTime(repo.synced_at) : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
