import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";
import { getPublicSupabaseEnv } from "./env";

export type PublicClient = SupabaseClient<Database>;

/**
 * Anon client: every read goes through RLS, so it can only ever see published content.
 * Only `src/lib/content/` repositories should import this (ADR-005).
 */
export function createPublicClient(): PublicClient {
  const { url, anonKey } = getPublicSupabaseEnv();
  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
