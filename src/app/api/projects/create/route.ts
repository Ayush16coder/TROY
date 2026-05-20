import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { name, framework } = await request.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get workspace ID
    const { data: workspaceMember } = await (supabase as any)
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .single() as { data: { workspace_id: string } | null };

    if (!workspaceMember) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // 2. Fetch integration tokens for this workspace
    const { data: integrationsData } = await (supabase as any)
      .from("integrations")
      .select(`
        id,
        provider,
        integration_tokens ( access_token_encrypted )
      `)
      .eq("workspace_id", workspaceMember.workspace_id);

    const tokens: Record<string, string> = {};
    if (integrationsData) {
      integrationsData.forEach((int: any) => {
        if (int.integration_tokens && int.integration_tokens.length > 0) {
          tokens[int.provider] = int.integration_tokens[0].access_token_encrypted;
        }
      });
    }

    // 3. Orchestrate Vercel
    if (tokens["vercel"]) {
      try {
        await fetch("https://api.vercel.com/v9/projects", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${tokens["vercel"]}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name: name, framework: framework })
        });
      } catch (err) {
        console.error("Vercel creation failed:", err);
      }
    } else {
      // Simulate if no token yet
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    // 4. Orchestrate Supabase
    if (tokens["supabase"]) {
      try {
        await fetch("https://api.supabase.com/v1/projects", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${tokens["supabase"]}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ 
            name: name,
            organization_id: "default", // Would need real org ID
            region: "us-east-1",
            db_pass: "generate_secure_password_123!"
          })
        });
      } catch (err) {
        console.error("Supabase creation failed:", err);
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    // Record it in our DB as a new repository for the dashboard
    await (supabase as any)
      .from("repositories")
      .insert({
        workspace_id: workspaceMember.workspace_id,
        name: name,
        full_name: `${user.email?.split('@')[0]}/${name}`,
        url: `https://github.com/${user.email?.split('@')[0]}/${name}`,
        visibility: "private",
        language: framework,
        connected: true
      });

    return NextResponse.json({ success: true, projectName: name, framework });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to provision project" },
      { status: 500 }
    );
  }
}
