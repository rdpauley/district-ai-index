/**
 * Firebase Admin SDK — for server-side writes (API routes, imports)
 * Uses service account credentials from environment variable
 */

import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
    return initializeApp({ credential: cert(serviceAccount) });
  } catch {
    return null;
  }
}

const app = getAdminApp();
export const adminDb = app ? getFirestore(app) : null;

export function isFirebaseAdminConfigured(): boolean {
  return adminDb !== null;
}
