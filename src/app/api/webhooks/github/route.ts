import { NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceClient } from "@/lib/supabase/service";
import { processSyncEngineEvent } from "@/lib/sync-engine";

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

function verifyGitHubSignature(payload: string, signature: string | null): boolean {
  if (!GITHUB_WEBHOOK_SECRET || !signature) return false;
  
  try {
    const hmac = crypto.createHmac("sha256", GITHUB_WEBHOOK_SECRET);
    const digest = "sha256=" + hmac.update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const payloadText = await req.text();
    const signature = req.headers.get("x-hub-signature-256");
    const eventType = req.headers.get("x-github-event") || "unknown";

    if (!verifyGitHubSignature(payloadText, signature)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = JSON.parse(payloadText);
    const admin = createServiceClient();

    // Store the webhook event
    const { data: event, error } = await admin.from("webhook_events").insert({
      provider: "github",
      event_type: eventType,
      payload: payload,
      status: "pending",
    }).select("id").single();

    if (error || !event) {
      console.error("Failed to store webhook event:", error);
      return NextResponse.json({ error: "Failed to store event" }, { status: 500 });
    }

    // Trigger internal sync engine asynchronously (fire and forget)
    // In a real environment with Trigger.dev/Inngest this would be a job dispatch.
    // For Vercel/Next.js, we invoke our own background processor without awaiting.
    processSyncEngineEvent(event.id).catch(err => {
      console.error("Background sync processor failed:", err);
    });

    return NextResponse.json({ success: true, eventId: event.id });
  } catch (error) {
    console.error("GitHub webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
