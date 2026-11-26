import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { createPublicClient } from "@/lib/supabase/public-client";

import { parseRows } from "./query";
import {
  disciplineSkillSchema,
  skillCategorySchema,
  type DisciplineSkill,
  type SkillCategory,
} from "./schemas";
import { contentTags } from "./tags";

/** Skills relevant to a published discipline, in the owner's priority order. */
export async function listDisciplineSkills(
  slug: string,
): Promise<DisciplineSkill[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(contentTags.all, contentTags.skills, contentTags.discipline(slug));

  const result = await createPublicClient()
    .from("discipline_skills")
    .select(
      "sort_order, skill:skills!inner(slug, name, kind), discipline:disciplines!inner(slug)",
    )
    .eq("discipline.slug", slug)
    .order("sort_order");

  return parseRows(`skills for "${slug}"`, result, disciplineSkillSchema);
}

/**
 * Homepage overview: categories with their highlighted skills (key strengths only),
 * each linked to its portfolio when that portfolio is published. Empty categories
 * are dropped.
 */
export async function listSkillOverview(): Promise<SkillCategory[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(contentTags.all, contentTags.skills);

  const result = await createPublicClient()
    .from("skill_categories")
    .select(
      "slug, name, sort_order, discipline:disciplines(slug, name), skills(slug, name, highlighted)",
    )
    .order("sort_order")
    .order("name");

  return parseRows("skill overview", result, skillCategorySchema).filter(
    (category) => category.skills.length > 0,
  );
}
