/**
 * List months that have notes.
 * Returns: { months: [{ yearMonth, updated_at, length }] }
 */

import { NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export async function GET() {
  if (!isFirebaseAdminConfigured() || !adminDb) return NextResponse.json({ months: [] });
  const snap = await adminDb.collection("monthly_notes").get();
  const months = snap.docs.map((d) => {
    const data = d.data() as { body?: string; updated_at?: string };
    return {
      yearMonth: d.id,
      updated_at: data.updated_at || null,
      length: (data.body || "").length,
    };
  }).sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));
  return NextResponse.json({ months });
}
