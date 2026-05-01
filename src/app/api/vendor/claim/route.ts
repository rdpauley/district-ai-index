import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { rateLimit } from "@/lib/rate-limit";
import { getAdminDb } from "@/lib/firebase/admin";
import { getToolBySlug } from "@/lib/seed-data";
import { emailMatchesToolDomain } from "@/lib/vendor";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 254;

/**
 * POST /api/vendor/claim
 * Body: { tool_slug, vendor_name, contact_email }
 *
 * Creates a pending vendor claim. The contact_email must be at the same
 * domain as the tool's website (or a subdomain) — this is a lightweight
 * proof of ownership before issuing a verification token.
 */
export async function POST(req: NextRequest) {
  const limit = rateLimit(req, { key: "vendor-claim", max: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { tool_slug?: unknown; vendor_name?: unknown; contact_email?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const toolSlug = typeof body.tool_slug === "string" ? body.tool_slug.trim() : "";
  const vendorName = typeof body.vendor_name === "string" ? body.vendor_name.trim().slice(0, 200) : "";
  const contactEmail = typeof body.contact_email === "string" ? body.contact_email.trim().toLowerCase() : "";

  if (!toolSlug) return NextResponse.json({ error: "Missing tool" }, { status: 400 });
  if (!vendorName) return NextResponse.json({ error: "Vendor name required" }, { status: 400 });
  if (!contactEmail || contactEmail.length > MAX_LEN || !EMAIL_RE.test(contactEmail)) {
    return NextResponse.json({ error: "Valid contact email required" }, { status: 400 });
  }

  const tool = getToolBySlug(toolSlug);
  if (!tool) return NextResponse.json({ error: "Unknown tool" }, { status: 404 });

  if (!emailMatchesToolDomain(contactEmail, tool.website)) {
    return NextResponse.json(
      {
        error: `Contact email must be at the same domain as the tool's website (${new URL(tool.website).hostname.replace(/^www\./, "")}). This proves you control the company.`,
      },
      { status: 400 }
    );
  }

  const verifyToken = randomUUID();
  const dashboardToken = randomUUID();
  const now = new Date().toISOString();

  const db = getAdminDb();
  if (db) {
    try {
      await db.collection("vendor_claims").add({
        tool_id: tool.id,
        tool_slug: toolSlug,
        vendor_name: vendorName,
        contact_email: contactEmail,
        verify_token: verifyToken,
        dashboard_token: dashboardToken,
        verified_at: null,
        revoked_at: null,
        created_at: now,
      });
    } catch (err) {
      console.error("[vendor/claim] firestore error:", err instanceof Error ? err.message : "unknown");
      return NextResponse.json({ error: "Failed to create claim" }, { status: 500 });
    }
  }

  // Dispatch verification email via n8n
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://districtaiindex.com";
  const verifyUrl = `${siteUrl}/vendor/verify?token=${verifyToken}`;
  const n8nUrl = process.env.N8N_VENDOR_WEBHOOK_URL;
  const n8nSecret = process.env.N8N_WEBHOOK_SECRET;

  if (n8nUrl && n8nSecret) {
    try {
      await fetch(n8nUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-webhook-secret": n8nSecret },
        body: JSON.stringify({
          action: "send_vendor_verification",
          to: contactEmail,
          tool_name: tool.name,
          vendor_name: vendorName,
          verify_url: verifyUrl,
        }),
      });
    } catch (err) {
      console.error("[vendor/claim] n8n dispatch failed:", err instanceof Error ? err.message : "unknown");
    }
  }

  return NextResponse.json({
    status: "pending_verification",
    message: `Sent a verification link to ${contactEmail}. Click it to access your dashboard.`,
  });
}
