import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getAdminDb } from "@/lib/firebase/admin";

/**
 * GET /api/alerts/confirm?token=<uuid>
 * Marks a pending alert subscription as confirmed.
 * Idempotent — already-confirmed tokens return success.
 */
export async function GET(req: NextRequest) {
  const limit = rateLimit(req, { key: "alerts-confirm", max: 30, windowMs: 60_000 });
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
    const snap = await db.collection("tool_alerts").where("confirm_token", "==", token).limit(1).get();
    if (snap.empty) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 });
    }
    const doc = snap.docs[0];
    const data = doc.data();
    if (!data.confirmed_at) {
      await doc.ref.update({ confirmed_at: new Date().toISOString() });
    }
    return NextResponse.json({ status: "confirmed", email: data.email });
  } catch (err) {
    console.error("[alerts/confirm] firestore error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Failed to confirm" }, { status: 500 });
  }
}
