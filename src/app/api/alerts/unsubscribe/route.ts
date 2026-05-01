import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getAdminDb } from "@/lib/firebase/admin";

/**
 * GET /api/alerts/unsubscribe?token=<uuid>
 * Marks an alert subscription as unsubscribed (soft-delete via timestamp).
 */
export async function GET(req: NextRequest) {
  const limit = rateLimit(req, { key: "alerts-unsubscribe", max: 30, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const token = req.nextUrl.searchParams.get("token");
  if (!token || token.length > 64) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const db = getAdminDb();
  if (!db) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    const snap = await db.collection("tool_alerts").where("unsubscribe_token", "==", token).limit(1).get();
    if (snap.empty) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 });
    }
    const doc = snap.docs[0];
    const data = doc.data();
    if (!data.unsubscribed_at) {
      await doc.ref.update({ unsubscribed_at: new Date().toISOString() });
    }
    return NextResponse.json({ status: "unsubscribed", email: data.email });
  } catch (err) {
    console.error("[alerts/unsubscribe] firestore error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });
  }
}
