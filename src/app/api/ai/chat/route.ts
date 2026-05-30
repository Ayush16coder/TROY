import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { requireWorkspace } from "@/lib/workspace";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

const MODEL_MAP = {
  "gpt-4o": () => openai("gpt-4o"),
  "claude-3-5-sonnet": () => anthropic("claude-3-5-sonnet-20241022"),
  "gemini-1.5-pro": () => google("gemini-1.5-pro"),
} as const;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, model = "gpt-4o", sessionId } = await request.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const modelKey = model as keyof typeof MODEL_MAP;
  if (!MODEL_MAP[modelKey]) {
    return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  }

  if (modelKey === "gpt-4o" && !process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured" }, { status: 503 });
  }
  if (modelKey === "claude-3-5-sonnet" && !process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 503 });
  }
  if (modelKey === "gemini-1.5-pro" && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json({ error: "GOOGLE_GENERATIVE_AI_API_KEY not configured" }, { status: 503 });
  }

  try {
    const workspace = await requireWorkspace(user);
    const db = createServiceClient();

    let activeSessionId = sessionId as string | undefined;
    if (!activeSessionId) {
      const { data: session } = await db.from("ai_sessions").insert({
        workspace_id: workspace.workspaceId,
        user_id: user.id,
        title: message.slice(0, 80),
        model,
        context_type: "general",
      }).select("id").single();
      activeSessionId = session?.id;
    }

    if (!activeSessionId) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    await db.from("ai_messages").insert({
      session_id: activeSessionId,
      role: "user",
      content: message,
      model,
    });

    const { text } = await generateText({
      model: MODEL_MAP[modelKey](),
      prompt: `You are TROY, an infrastructure and DevOps assistant. Help debug deployments, analyze logs, and suggest infrastructure improvements. Be concise and actionable.\n\nUser: ${message}`,
    });

    await db.from("ai_messages").insert({
      session_id: activeSessionId,
      role: "assistant",
      content: text,
      model,
    });

    return NextResponse.json({ content: text, sessionId: activeSessionId });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
