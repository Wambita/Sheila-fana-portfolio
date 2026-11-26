import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { createPublicClient } from "@/lib/supabase/public-client";

import { parseRow, parseRows } from "./query";
import {
  disciplineSchema,
  itemSummarySchema,
  type Discipline,
  type ItemSummary,
} from "./schemas";
import { contentTags } from "./tags";

const DISCIPLINE_COLUMNS = "slug, name, tagline, intro, sort_order";

/** Published disciplines in display order. */
export async function listDisciplines(): Promise<Discipline[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(contentTags.all, contentTags.disciplines);

  const result = await createPublicClient()
    .from("disciplines")
    .select(DISCIPLINE_COLUMNS)
    .order("sort_order")
    .order("name");

  return parseRows("disciplines", result, disciplineSchema);
}

/** A published discipline, or null when it doesn't exist or is a draft. */
export async function getDiscipline(slug: string): Promise<Discipline | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(
    contentTags.all,
    contentTags.disciplines,
    contentTags.discipline(slug),
  );

  const result = await createPublicClient()
    .from("disciplines")
    .select(DISCIPLINE_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  return parseRow(`discipline "${slug}"`, result, disciplineSchema);
}

/**
 * Every published item linked to a published discipline, featured first, then newest
 * (doc 03, "How a discipline page is assembled"). Grouping by type is up to the page.
 */
export async function listItemsForDiscipline(
  slug: string,
): Promise<ItemSummary[]> {
  "use cache";
  cacheLife("hours");
  // Items of every type appear here, so any content change can affect this list.
  cacheTag(contentTags.all, contentTags.discipline(slug));

  const result = await createPublicClient()
    .from("content_items")
    .select(
      `type, slug, title, summary, featured, sort_date,
       link:item_disciplines!inner(emphasis_note, sort_order, discipline:disciplines!inner(slug))`,
    )
    .eq("link.discipline.slug", slug)
    .neq("type", "interest")
    .order("featured", { ascending: false })
    .order("sort_date", { ascending: false, nullsFirst: false })
    .order("title");

  return parseRows(`items for discipline "${slug}"`, result, itemSummarySchema);
}
