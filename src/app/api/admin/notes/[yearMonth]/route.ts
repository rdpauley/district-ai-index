/**
 * Monthly notes — one doc per YYYY-MM.
 * Firestore collection: monthly_notes, doc id = "2026-04".
 * Admin-gated by middleware.
 */

import { NextRequest, NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

const YM_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const MAX_BODY = 200_000; // 200 KB of text is plenty for a month of notes

export async function GET(_req: NextRequest, { params }: { params: Promise<{ yearMonth: string }> }) {
  const { yearMonth } = await params;
  if (!YM_RE.test(yearMonth)) return NextResponse.json({ error: "Invalid yearMonth format (expected YYYY-MM)" }, { status: 400 });
  if (!isFirebaseAdminConfigured() || !adminDb) return NextResponse.json({ yearMonth, body: "", updated_at: null });

  const doc = await adminDb.collection("monthly_notes").doc(yearMonth).get();
  if (!doc.exists) return NextResponse.json({ yearMonth, body: "", updated_at: null });
  const data = doc.data() as { body?: string; updated_at?: string };
  return NextResponse.json({ yearMonth, body: data.body || "", updated_at: data.updated_at || null });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ yearMonth: string }> }) {
  const { yearMonth } = await params;
  if (!YM_RE.test(yearMonth)) return NextResponse.json({ error: "Invalid yearMonth format" }, { status: 400 });
  if (!isFirebaseAdminConfigured() || !adminDb) return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });

  let body: string;
  try {
    const json = await req.json();
    body = typeof json?.body === "string" ? json.body : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (body.length > MAX_BODY) {
    return NextResponse.json({ error: `Body too large (max ${MAX_BODY} chars)` }, { status: 413 });
  }

  const updated_at = new Date().toISOString();
  await adminDb.collection("monthly_notes").doc(yearMonth).set({ body, updated_at }, { merge: true });
  return NextResponse.json({ yearMonth, body, updated_at });
}
