/**
 * Simple session-based admin auth — Edge Runtime compatible
 *
 * Uses Web Crypto API (available in both Node and Edge runtimes).
 * Signed session token stored in an HTTP-only cookie.
 */

const SESSION_COOKIE_NAME = "dai_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "dev-secret-change-in-production";
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "DAI-Admin-2026-ChangeMe!";
}

// Constant-time string comparison (works in Edge Runtime)
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export function verifyPassword(candidate: string): boolean {
  return constantTimeEqual(candidate, getAdminPassword());
}

// Base64 URL encoding (Edge-safe)
function toBase64Url(data: ArrayBuffer | string): string {
  const bytes = typeof data === "string"
    ? new TextEncoder().encode(data)
    : new Uint8Array(data);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return toBase64Url(signature);
}

/**
 * Create a signed session token.
 */
export async function createSessionToken(): Promise<string> {
  // Generate a random nonce
  const nonceBytes = new Uint8Array(8);
  crypto.getRandomValues(nonceBytes);
  const nonce = Array.from(nonceBytes).map(b => b.toString(16).padStart(2, "0")).join("");

  const payload = {
    admin: true,
    exp: Date.now() + SESSION_DURATION_MS,
    nonce,
  };
  const payloadB64 = toBase64Url(JSON.stringify(payload));
  const signature = await hmacSign(payloadB64, getSecret());
  return `${payloadB64}.${signature}`;
}

/**
 * Verify a session token from a cookie.
 */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, signature] = parts;

  // Verify signature
  const expected = await hmacSign(payloadB64, getSecret());
  if (!constantTimeEqual(signature, expected)) return false;

  // Check expiration
  try {
    const payload = JSON.parse(fromBase64Url(payloadB64));
    if (!payload.admin || payload.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export { SESSION_COOKIE_NAME, SESSION_DURATION_MS };
