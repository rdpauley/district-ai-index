import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/submit
 *
 * Submit a new tool for review.
 *
 * When Supabase is configured: inserts into submissions table.
 * When not configured: returns success (dev mode).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const required = ["tool_name", "website", "contact_name", "contact_email", "category", "pricing"];
    const missing = required.filter((f) => !body[f]?.trim());
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.contact_email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      const { error } = await supabase.from("submissions").insert({
        tool_name: body.tool_name.trim(),
        website_url: body.website.trim(),
        contact_name: body.contact_name.trim(),
        contact_email: body.contact_email.trim().toLowerCase(),
        category: body.category || null,
        use_cases: body.use_cases || null,
        pricing_type: body.pricing || null,
        privacy_docs: body.privacy_docs || false,
        accessibility_docs: body.accessibility_docs || false,
        requested_tier: body.requested_tier || "basic",
        status: "pending",
      });

      if (error) {
        console.error("[submit] Supabase error:", error.message);
        return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
      }
    }

    return NextResponse.json({
      status: "received",
      tool_name: body.tool_name,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
