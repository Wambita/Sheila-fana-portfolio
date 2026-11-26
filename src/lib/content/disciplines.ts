import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { createPublicClient } from "@/lib/supabase/public-client";

import { parseRow, parseRows } from "./query";
import { disciplineSchema, type Discipline } from "./schemas";
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
