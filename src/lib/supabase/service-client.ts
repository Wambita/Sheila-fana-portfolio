import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "./database.types";
import { getPublicSupabaseEnv } from "./env";

/**
 * Service-role client. It bypasses RLS, so it is restricted to server-only modules
 * (article sync, contact form inserts). Never import it from UI code or cached reads.
 */
export function createServiceClient(): SupabaseClient<Database> {
  const { url } = getPublicSupabaseEnv();
  const key = z
    .string()
    .min(1)
    .safeParse(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!key.success) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set (server-only; see .env.example).",
    );
  }
  return createClient<Database>(url, key.data, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
