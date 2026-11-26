import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { createPublicClient } from "@/lib/supabase/public-client";

import { parseRows } from "./query";
import {
  ITEM_DETAIL_COLUMNS,
  itemSummarySchema,
  type ItemSummary,
} from "./schemas";
import { contentTags, type ContentType } from "./tags";

/**
 * Key experience for the homepage: published roles and engagements the owner has marked
 * as featured, newest first.
 */
export async function listFeaturedExperience(): Promise<ItemSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(
    contentTags.all,
    contentTags.type("experience"),
    contentTags.type("engagement"),
  );

  const result = await createPublicClient()
    .from("content_items")
    .select(
      `type, slug, title, summary, featured, sort_date, ${ITEM_DETAIL_COLUMNS}`,
    )
    .in("type", ["experience", "engagement"])
    .eq("featured", true)
    .order("sort_date", { ascending: false, nullsFirst: false })
    .order("title");

  return parseRows("featured experience", result, itemSummarySchema);
}

/**
 * Every published item of the given types, across all disciplines and including items
 * linked to no portfolio: the "full record" pages (ADR-019). Newest first.
 */
export async function listItemsByType(
  types: ContentType[],
): Promise<ItemSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(contentTags.all, ...types.map((type) => contentTags.type(type)));

  const result = await createPublicClient()
    .from("content_items")
    .select(
      `type, slug, title, summary, featured, sort_date, ${ITEM_DETAIL_COLUMNS}`,
    )
    .in("type", types)
    .order("sort_date", { ascending: false, nullsFirst: false })
    .order("title");

  return parseRows(`${types.join(", ")} items`, result, itemSummarySchema);
}
