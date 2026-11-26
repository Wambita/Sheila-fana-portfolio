import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";
import { getPublicSupabaseEnv } from "./env";

export type PublicClient = SupabaseClient<Database>;

/**
 * Bypasses Next.js's fetch Data Cache. Caching belongs to the repositories' `"use cache"`
 * scopes, which are per deployment and invalidated by tag. Left on, the Data Cache would
 * persist Supabase responses across builds and deployments and serve stale content.
 */
export const uncachedFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: "no-store" });

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
    global: { fetch: uncachedFetch },
  });
}
