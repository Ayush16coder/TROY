import { createServiceClient } from "@/lib/supabase/service";
import { syncGitHubEvent } from "@/lib/integrations/github";
// import { syncVercelEvent } from "@/lib/integrations/vercel";

export async function processSyncEngineEvent(eventId: string) {
  const admin = createServiceClient();
  
  // 1. Lock the event
  const { data: event, error: lockError } = await admin
    .from("webhook_events")
    .update({ status: "processing" })
    .eq("id", eventId)
    .eq("status", "pending")
    .select()
    .single();

  if (lockError || !event) {
    console.log(`Event ${eventId} could not be locked for processing.`);
    return;
  }

  try {
    // 2. Process based on provider
    if (event.provider === "github") {
      await syncGitHubEvent(event);
    } else if (event.provider === "vercel") {
      // await syncVercelEvent(event);
    } else {
      throw new Error(`Unknown provider: ${event.provider}`);
    }

    // 3. Mark completed
    await admin
      .from("webhook_events")
      .update({ status: "completed", processed_at: new Date().toISOString() })
      .eq("id", eventId);

  } catch (err: any) {
    console.error(`Failed to process event ${eventId}:`, err);
    // 4. Mark failed
    await admin
      .from("webhook_events")
      .update({ status: "failed", error: err.message, processed_at: new Date().toISOString() })
      .eq("id", eventId);
  }
}
