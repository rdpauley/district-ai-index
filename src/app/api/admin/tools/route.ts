import { NextRequest, NextResponse } from "next/server";
import { tools as seedTools } from "@/lib/seed-data";

/**
 * GET /api/admin/tools — list all tools
 * POST /api/admin/tools — create a new tool
 *
 * When Supabase is configured: reads/writes to database.
 * When not configured: returns seed data (read-only).
 */

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const { data, error } = await supabase
      .from("tools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ tools: data });
  }

  // Seed data fallback
  return NextResponse.json({ tools: seedTools, readonly: true });
}

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase not configured. Connect a database to create tools." },
      { status: 503 }
    );
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

  try {
    const body = await req.json();

    // Generate slug from name
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+$/g, "");

    const { data, error } = await supabase
      .from("tools")
      .insert({
        name: body.name,
        slug,
        vendor: body.vendor || "",
        description: body.description || "",
        website_url: body.website_url || "",
        pricing_type: body.pricing_type || "Freemium",
        privacy_level: body.privacy_level || "Medium",
        accessibility_level: body.accessibility_level || "Moderate",
        ease_of_use_score: body.ease_of_use_score || 5,
        instructional_value_score: body.instructional_value_score || 5,
        privacy_score: body.privacy_score || 5,
        accessibility_score: body.accessibility_score || 5,
        overall_score: body.overall_score || 5,
        status: "pending",
        grade_levels: body.grade_levels || [],
        tags: body.tags || [],
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ tool: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
