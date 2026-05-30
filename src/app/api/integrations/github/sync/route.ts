import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { requireWorkspace, isGithubConnected } from "@/lib/workspace";
import { upsertIntegration } from "@/lib/integrations/store";

interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  description: string | null;
  language: string | null;
  updated_at: string;
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isGithubConnected(user)) {
    return NextResponse.json(
      {
        error: "github_not_linked",
        message: "Connect GitHub in Settings first.",
      },
      { status: 400 }
    );
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const providerToken = sessionData.session?.provider_token;

  if (!providerToken) {
    return NextResponse.json(
      {
        error: "no_provider_token",
        message:
          "Enable 'Store provider tokens' for GitHub in Supabase Auth settings, then reconnect GitHub.",
      },
      { status: 400 }
    );
  }

  try {
    const workspace = await requireWorkspace(user);
    const admin = createServiceClient();

    const ghRes = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        Authorization: `Bearer ${providerToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!ghRes.ok) {
      const err = await ghRes.text();
      console.error("GitHub API error:", err);
      return NextResponse.json({ error: "github_api_failed" }, { status: 502 });
    }

    const repos: GithubRepo[] = await ghRes.json();

    const identity = user.identities?.find((i) => i.provider === "github");
    const githubUsername =
      (identity?.identity_data?.user_name as string) ??
      (identity?.identity_data?.preferred_username as string) ??
      user.email?.split("@")[0] ??
      "user";

    await upsertIntegration(workspace.workspaceId, "github", {
      status: "connected",
      metadata: {
        username: githubUsername,
        repo_count: repos.length,
        synced_at: new Date().toISOString(),
      },
      accessToken: providerToken,
    });

    await admin.from("users").update({ github_username: githubUsername }).eq("id", user.id);

    for (const repo of repos) {
      await admin.from("repositories").upsert(
        {
          workspace_id: workspace.workspaceId,
          github_id: repo.id,
          full_name: repo.full_name,
          name: repo.name,
          private: repo.private,
          default_branch: repo.default_branch ?? "main",
          synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "workspace_id,github_id" }
      );
    }

    await createServiceClient().from("activity_logs").insert({
      workspace_id: workspace.workspaceId,
      user_id: user.id,
      action: "repository.synced",
      resource_type: "repository",
      metadata: { count: repos.length, provider: "github" },
    });

    return NextResponse.json({ success: true, count: repos.length });
  } catch (err) {
    console.error("GitHub sync error:", err);
    return NextResponse.json({ error: "sync_failed" }, { status: 500 });
  }
}
