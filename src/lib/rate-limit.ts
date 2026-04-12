/**
 * In-memory rate limiter for Edge Runtime / Serverless Functions.
 *
 * Limitations:
 * - State is per-instance, not shared across Vercel regions.
 * - Good enough for MVP / anti-brute-force / basic abuse prevention.
 * - For production-scale, upgrade to Upstash Redis or Vercel KV.
 *
 * Usage:
 *   const result = await rateLimit(req, { key: "login", max: 5, windowMs: 60_000 });
 *   if (!result.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

import type { NextRequest } from "next/server";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

// Auto-cleanup old buckets every 5 minutes (best-effort)
let lastCleanup = Date.now();
function maybeCleanup() {
  if (Date.now() - lastCleanup < 5 * 60_000) return;
  lastCleanup = Date.now();
  for (const [key, b] of buckets.entries()) {
    if (b.resetAt < Date.now()) buckets.delete(key);
  }
}

function getClientId(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || "unknown";
  return ip;
}

export interface RateLimitOptions {
  /** Identifier for the bucket (e.g., "login", "api:submit"). */
  key: string;
  /** Max requests within window. */
  max: number;
  /** Window size in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(req: NextRequest, opts: RateLimitOptions): RateLimitResult {
  maybeCleanup();
  const ip = getClientId(req);
  const bucketKey = `${opts.key}:${ip}`;
  const now = Date.now();

  let bucket = buckets.get(bucketKey);
  if (!bucket || bucket.resetAt < now) {
    bucket = { count: 0, resetAt: now + opts.windowMs };
    buckets.set(bucketKey, bucket);
  }

  bucket.count += 1;
  const allowed = bucket.count <= opts.max;
  return {
    allowed,
    remaining: Math.max(0, opts.max - bucket.count),
    resetAt: bucket.resetAt,
  };
}
