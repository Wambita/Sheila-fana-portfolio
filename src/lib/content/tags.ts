import type { Database } from "@/lib/supabase/database.types";

export type ContentType = Database["public"]["Enums"]["content_type"];

/**
 * Cache tags for `cacheTag` / `revalidateTag` / `updateTag` (ADR-013).
 * `all` invalidates every public read at once, e.g. after a bulk edit.
 */
export const contentTags = {
  all: "content",
  profile: "content:profile",
  disciplines: "content:disciplines",
  discipline: (slug: string) => `content:discipline:${slug}`,
  type: (type: ContentType) => `content:type:${type}`,
  item: (type: ContentType, slug: string) => `content:item:${type}:${slug}`,
} as const;
