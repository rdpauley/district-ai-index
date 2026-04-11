/**
 * Supabase Browser Client
 *
 * Used in Client Components (hooks, event handlers, interactive UI).
 * Uses the public anon key — safe to expose in the browser.
 * Respects Row-Level Security policies.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true },
  });
}

export const supabase = createBrowserClient();

/**
 * Check if Supabase is configured.
 * When false, the app falls back to seed data.
 */
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey;
}
