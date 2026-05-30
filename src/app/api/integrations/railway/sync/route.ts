import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspace } from "@/lib/workspace";
import { getIntegrationToken } from "@/lib/integrations/store";
import { createServiceClient } from "@/lib/supabase/service";

const RAILWAY_GRAPHQL_URL = "https://backboard.railway.app/graphql/v2";

const PROJECTS_QUERY = `
  query {
    me {
      projects {
        edges {
          node {
            id
            name
            description
            createdAt
            updatedAt
            environments {
              edges { node { id name } }
            }
            services {
              edges { node { id name } }
            }
            deployments(first: 3) {
              edges {
                node {
                  id
                  status
                  createdAt
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const workspace = await requireWorkspace(user);
    const token = await getIntegrationToken(workspace.workspaceId, "railway");
    if (!token) return NextResponse.json({ error: "railway_not_connected" }, { status: 400 });

    const res = await fetch(RAILWAY_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: PROJECTS_QUERY }),
    });

    if (!res.ok) {
      console.error("Railway API error:", res.status, await res.text());
      return NextResponse.json({ error: "railway_api_failed" }, { status: 502 });
    }

    const json = await res.json();
    if (json.errors) {
      console.error("Railway GraphQL errors:", json.errors);
      return NextResponse.json({ error: "railway_graphql_error", details: json.errors }, { status: 502 });
    }

    const projects = json.data?.me?.projects?.edges?.map((e: any) => e.node) ?? [];
    const admin = createServiceClient();

    const { data: connection } = await admin
      .from("provider_connections")
      .select("id")
      .eq("workspace_id", workspace.workspaceId)
      .eq("provider", "railway")
      .maybeSingle();

    if (connection) {
      for (const project of projects) {
        await admin.from("provider_projects").upsert(
          {
            connection_id: connection.id,
            workspace_id: workspace.workspaceId,
            provider_project_id: project.id,
            name: project.name,
            metadata: {
              description: project.description,
              environments: project.environments?.edges?.map((e: any) => e.node) ?? [],
              services: project.services?.edges?.map((e: any) => e.node) ?? [],
              latest_deployments: project.deployments?.edges?.map((e: any) => e.node) ?? [],
              created_at: project.createdAt,
              updated_at: project.updatedAt,
            },
            updated_at: new Date().toISOString(),
          },
          { onConflict: "connection_id,provider_project_id" }
        );
      }

      await admin.from("provider_health").upsert(
        {
          connection_id: connection.id,
          workspace_id: workspace.workspaceId,
          status: "healthy",
          last_check_at: new Date().toISOString(),
          metadata: { project_count: projects.length },
        },
        { onConflict: "connection_id" }
      );
    }

    await admin.from("activity_logs").insert({
      workspace_id: workspace.workspaceId,
      user_id: user.id,
      action: "integration.synced",
      resource_type: "integration",
      metadata: { provider: "railway", project_count: projects.length },
    });

    return NextResponse.json({ success: true, count: projects.length });
  } catch (err) {
    console.error("Railway sync error:", err);
    return NextResponse.json({ error: "sync_failed" }, { status: 500 });
  }
}
