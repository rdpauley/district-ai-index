/**
 * Supabase Admin Client
 *
 * Uses the service_role key — bypasses RLS.
 * ONLY use server-side: API routes, n8n webhooks, import scripts.
 * NEVER expose this key to the browser.
 */

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
