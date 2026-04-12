import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/[^\s]+$/;

const MAX = {
  tool_name: 120,
  website: 500,
  contact_name: 120,
  contact_email: 254,
  category: 80,
  use_cases: 2000,
  pricing_type: 30,
};

const ALLOWED_PRICING = new Set(["Free", "Freemium", "Paid"]);
const ALLOWED_TIERS = new Set(["basic", "featured", "verified"]);

function sanitizeString(v: unknown, maxLength: number): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) return null;
  return trimmed;
}

/**
 * POST /api/submit
 *
 * Submit a new tool for review.
 * Security: rate limited (3/hour/IP), strict input validation, size caps.
 */
export async function POST(req: NextRequest) {
  // Rate limit: max 3 submissions per hour per IP
  const limit = rateLimit(req, { key: "tool-submit", max: 3, windowMs: 60 * 60 * 1000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Try again in an hour." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    // Validate and sanitize
    const tool_name = sanitizeString(body.tool_name, MAX.tool_name);
    const website = sanitizeString(body.website, MAX.website);
    const contact_name = sanitizeString(body.contact_name, MAX.contact_name);
    const contact_email = sanitizeString(body.contact_email, MAX.contact_email)?.toLowerCase();
    const category = sanitizeString(body.category, MAX.category);
    const use_cases = typeof body.use_cases === "string" && body.use_cases.length <= MAX.use_cases
      ? body.use_cases.trim() : null;
    const pricing = typeof body.pricing === "string" && ALLOWED_PRICING.has(body.pricing) ? body.pricing : null;
    const requested_tier = typeof body.requested_tier === "string" && ALLOWED_TIERS.has(body.requested_tier)
      ? body.requested_tier : "basic";

    // Required field check
    if (!tool_name || !website || !contact_name || !contact_email || !category || !pricing) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    // Format checks
    if (!EMAIL_RE.test(contact_email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    if (!URL_RE.test(website)) {
      return NextResponse.json({ error: "Invalid website URL" }, { status: 400 });
    }

    // Block javascript:, data:, file: URLs (SSRF / phishing defense)
    const websiteLower = website.toLowerCase();
    if (websiteLower.startsWith("javascript:") || websiteLower.startsWith("data:") ||
        websiteLower.startsWith("file:") || websiteLower.startsWith("vbscript:")) {
      return NextResponse.json({ error: "Invalid website URL" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

      const { error } = await supabase.from("submissions").insert({
        tool_name,
        website_url: website,
        contact_name,
        contact_email,
        category,
        use_cases,
        pricing_type: pricing,
        privacy_docs: body.privacy_docs === true,
        accessibility_docs: body.accessibility_docs === true,
        requested_tier,
        status: "pending",
      });

      if (error) {
        console.error("[submit] insert error");
        return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
      }
    }

    return NextResponse.json({ status: "received", tool_name });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
