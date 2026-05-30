import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { getWorkspaceForUser } from "@/lib/workspace";
import { fetchTeamMembers } from "@/lib/data/dashboard";

export const metadata = { title: "Team" };

export default async function TeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const workspace = await getWorkspaceForUser(user.id);
  if (!workspace) redirect("/onboarding");

  const members = await fetchTeamMembers(workspace.workspaceId);

  return (
    <div className="max-w-[900px] mx-auto">
      <PageHeader title="Team" description={`Members of ${workspace.workspaceName}`} />
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {members.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No team members found.</p>
        ) : (
          members.map((m) => {
            const raw = m.users as unknown;
            const u = (Array.isArray(raw) ? raw[0] : raw) as {
              email: string;
              full_name: string | null;
              github_username: string | null;
            } | null;
            return (
              <div key={m.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-foreground">{u?.full_name ?? u?.email ?? "Member"}</p>
                  <p className="text-sm text-muted-foreground">{u?.email}</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary capitalize">
                  {m.role}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
