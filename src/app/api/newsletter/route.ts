import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254; // RFC 5321

/**
 * POST /api/newsletter
 *
 * Subscribe an email to the newsletter.
 * Security: rate limited, input validated, length capped.
 */
export async function POST(req: NextRequest) {
  const limit = rateLimit(req, { key: "newsletter", max: 10, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source = typeof body.source === "string" && body.source.length <= 50 ? body.source : "website";

    if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
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
        console.error("[newsletter] insert error");
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
      }
    }

    return NextResponse.json({ status: "subscribed" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
