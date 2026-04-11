import { NextRequest, NextResponse } from "next/server";

/**
 * PUT /api/admin/tools/[id] — update a tool
 * DELETE /api/admin/tools/[id] — archive a tool
 */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

  try {
    const body = await req.json();

    // Only allow updating safe fields
    const allowedFields = [
      "name", "vendor", "description", "overview", "why_it_matters",
      "website_url", "affiliate_url", "logo_url",
      "ease_of_use_score", "instructional_value_score", "privacy_score", "accessibility_score", "overall_score",
      "pricing_type", "pricing_details", "privacy_level", "accessibility_level",
      "grade_levels", "audiences", "tags", "integrations",
      "best_for", "not_ideal_for", "key_features",
      "instructional_fit", "implementation_notes", "privacy_notes", "accessibility_notes",
      "admin_integration_notes", "editorial_verdict", "reviewer_notes",
      "listing_tier", "featured_flag", "featured_rank", "is_sponsored",
      "status", "last_reviewed_at",
      "vpat_status", "vpat_url", "vpat_notes",
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("tools")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ tool: data });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

  // Soft delete — set status to archived
  const { error } = await supabase
    .from("tools")
    .update({ status: "archived" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ status: "archived", id });
}
