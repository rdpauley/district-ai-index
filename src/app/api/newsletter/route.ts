import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/newsletter
 *
 * Subscribe an email to the newsletter.
 *
 * When Supabase is configured: inserts into newsletter_subscribers table.
 * When not configured: returns success (dev mode).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email as string)?.trim().toLowerCase();
    const source = (body.source as string) || "website";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      const { error } = await supabase
        .from("newsletter_subscribers")
        .upsert({ email, source, status: "active" }, { onConflict: "email" });

      if (error) {
        console.error("[newsletter] Supabase error:", error.message);
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
      }
    }

    return NextResponse.json({ status: "subscribed", email });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
