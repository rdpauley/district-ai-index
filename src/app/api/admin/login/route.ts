import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME, SESSION_DURATION_MS } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const ALLOWED_ORIGINS = new Set([
  "https://districtaiindex.com",
  "https://www.districtaiindex.com",
  "http://localhost:3000",
]);

export async function POST(req: NextRequest) {
  // ── CSRF: same-origin check ───────────────────────────
  const origin = req.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  }

  // ── Rate limit: 5 attempts per IP per minute ──────────
  const limit = rateLimit(req, { key: "admin-login", max: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again in a minute." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.floor(limit.resetAt / 1000)),
        },
      }
    );
  }

  try {
    const body = await req.json();
    const password = body.password;

    if (typeof password !== "string" || password.length < 1 || password.length > 500) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = await createSessionToken();
    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
