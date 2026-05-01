import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getAdminDb } from "@/lib/firebase/admin";

/**
 * GET /api/vendor/verify?token=<uuid>
 * Marks a pending vendor claim as verified and returns the dashboard token
 * (which the client uses to redirect to /vendor/<dashboard_token>).
 */
export async function GET(req: NextRequest) {
  const limit = rateLimit(req, { key: "vendor-verify", max: 30, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const token = req.nextUrl.searchParams.get("token");
  if (!token || token.length > 64) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const db = getAdminDb();
  if (!db) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  try {
    const snap = await db.collection("vendor_claims").where("verify_token", "==", token).limit(1).get();
    if (snap.empty) return NextResponse.json({ error: "Invalid or expired token" }, { status: 404 });
    const doc = snap.docs[0];
    const data = doc.data();
    if (!data.verified_at) {
      await doc.ref.update({ verified_at: new Date().toISOString() });
    }
    return NextResponse.json({
      status: "verified",
      dashboard_token: data.dashboard_token,
      tool_slug: data.tool_slug,
    });
  } catch (err) {
    console.error("[vendor/verify] firestore error:", err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "Failed to verify" }, { status: 500 });
  }
}
