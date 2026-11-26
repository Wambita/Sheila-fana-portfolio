import type { PostgrestError } from "@supabase/supabase-js";
import type { z } from "zod";

/**
 * Turns a Supabase result into validated domain data. Query errors and schema mismatches
 * throw, so a broken read fails the build or request instead of silently rendering nothing.
 */
export function parseRows<T extends z.ZodType>(
  what: string,
  result: { data: unknown[] | null; error: PostgrestError | null },
  schema: T,
): Array<z.output<T>> {
  if (result.error)
    throw new Error(`Failed to load ${what}: ${result.error.message}`);
  return (result.data ?? []).map((row) => schema.parse(row));
}

export function parseRow<T extends z.ZodType>(
  what: string,
  result: { data: unknown; error: PostgrestError | null },
  schema: T,
): z.output<T> | null {
  if (result.error)
    throw new Error(`Failed to load ${what}: ${result.error.message}`);
  return result.data == null ? null : schema.parse(result.data);
}
