/**
 * Firebase Client SDK — for browser-side reads
 */

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "district-ai-index",
  appId: "1:679640744609:web:ecb50de9a01d816814e6e0",
  storageBucket: "district-ai-index.firebasestorage.app",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDum5Ca0BEJ1tHwzfL6gizNcmz0YLKSTeA",
  authDomain: "district-ai-index.firebaseapp.com",
  messagingSenderId: "679640744609",
  measurementId: "G-Q2YMGC06VW",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
