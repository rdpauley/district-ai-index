/**
 * Firebase Admin SDK — for server-side writes (API routes, imports)
 * Uses service account credentials from environment variable.
 * Lazy-initialized so env vars are read at request time, not build time.
 */

import { initializeApp, getApps, cert, type App, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;
let initAttempted = false;

function getAdminApp(): App | null {
  if (cachedApp) return cachedApp;
  if (initAttempted) return null;
  initAttempted = true;

  // Reuse existing app if another module initialized it
  if (getApps().length > 0) {
    cachedApp = getApps()[0];
    return cachedApp;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    console.warn("[firebase-admin] FIREBASE_SERVICE_ACCOUNT_KEY not set");
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
    cachedApp = initializeApp({ credential: cert(serviceAccount) });
    return cachedApp;
  } catch (err) {
    console.error("[firebase-admin] failed to parse service account:", err instanceof Error ? err.message : "unknown");
    return null;
  }
}

/**
 * Get the admin Firestore instance. Lazy-initialized.
 * Returns null if not configured.
 */
export function getAdminDb(): Firestore | null {
  if (cachedDb) return cachedDb;
  const app = getAdminApp();
  if (!app) return null;
  cachedDb = getFirestore(app);
  return cachedDb;
}

// Compatibility shim — existing code uses `adminDb` directly.
// This proxy ensures lazy initialization.
export const adminDb: Firestore | null = new Proxy({} as Firestore, {
  get(_target, prop) {
    const db = getAdminDb();
    if (!db) return undefined;
    return (db as unknown as Record<string | symbol, unknown>)[prop as string];
  },
}) as unknown as Firestore;

export function isFirebaseAdminConfigured(): boolean {
  return getAdminDb() !== null;
}
