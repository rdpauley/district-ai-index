import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getAdminDb } from "@/lib/firebase/admin";
import { getToolById } from "@/lib/seed-data";

const VALID_EVENTS = new Set([
  "tool_view",
  "compare_add",
  "rfp_generate",
  "affiliate_click",
  "scorecard_view",
]);

/**
 * POST /api/track-event
 * Body: { tool_id: string, event_type: string }
 *
 * Fire-and-forget event logger. Writes to Firestore tool_events when configured.
 * Returns 204 immediately even when Firestore is unavailable so the client
 * never sees a failure.
 */
export async function POST(req: NextRequest) {
  const limit = rateLimit(req, { key: "track-event", max: 60, windowMs: 60_000 });
  if (!limit.allowed) {
    return new NextResponse(null, { status: 204 });
  }

  let body: { tool_id?: unknown; event_type?: unknown };
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  const toolId = typeof body.tool_id === "string" ? body.tool_id : "";
  const eventType = typeof body.event_type === "string" ? body.event_type : "";

  if (!toolId || !eventType || !VALID_EVENTS.has(eventType)) {
    return new NextResponse(null, { status: 204 });
  }
  if (!getToolById(toolId)) {
    return new NextResponse(null, { status: 204 });
  }

  const db = getAdminDb();
  if (!db) return new NextResponse(null, { status: 204 });

  try {
    await db.collection("tool_events").add({
      tool_id: toolId,
      event_type: eventType,
      occurred_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[track-event] firestore error:", err instanceof Error ? err.message : "unknown");
  }

  return new NextResponse(null, { status: 204 });
}
