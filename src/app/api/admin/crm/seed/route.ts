import { NextResponse } from "next/server";
import { adminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { tools } from "@/lib/seed-data";

/**
 * POST /api/admin/crm/seed
 *
 * Seed CRM contacts from the 64 tools already in the directory.
 * Idempotent — won't create duplicates (keyed on linked_tool_slug).
 */
export async function POST() {
  if (!isFirebaseAdminConfigured() || !adminDb) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const existing = await adminDb.collection("contacts").where("contact_type", "==", "vendor").get();
  const existingSlugs = new Set(existing.docs.map((d) => d.data().linked_tool_slug).filter(Boolean));

  const now = new Date().toISOString();
  const batch = adminDb.batch();
  let created = 0;
  let skipped = 0;

  for (const tool of tools) {
    if (existingSlugs.has(tool.slug)) { skipped++; continue; }
    const docRef = adminDb.collection("contacts").doc();
    batch.set(docRef, {
      name: `${tool.vendor} — ${tool.name}`,
      company: tool.vendor,
      contact_type: "vendor" as const,
      stage: "cold" as const,
      tags: [tool.categories[0], `score-${tool.overall_score}`, `${tool.pricing_type.toLowerCase()}-tier`],
      linked_tool_slug: tool.slug,
      source: "Directory seed",
      notes: `Tool: ${tool.name}\nScore: ${tool.overall_score}/10\nPrivacy: ${tool.privacy_flag}\nWebsite: ${tool.website}\n\nEditorial verdict: ${tool.editorial_verdict}`,
      created_at: now,
      updated_at: now,
    });
    created++;
  }

  if (created > 0) await batch.commit();
  return NextResponse.json({ created, skipped, total: created + skipped });
}
