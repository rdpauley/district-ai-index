import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin routes (not /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Guard admin API routes too
  if (pathname.startsWith("/api/admin/") &&
      pathname !== "/api/admin/login" &&
      pathname !== "/api/admin/logout") {

    // Allow Vercel Cron to bypass auth using the CRON_SECRET Bearer token
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
      return NextResponse.next();
    }

    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
