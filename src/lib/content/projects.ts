import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { createPublicClient } from "@/lib/supabase/public-client";

import { parseRow, parseRows } from "./query";
import {
  projectSchema,
  projectSummarySchema,
  type Project,
  type ProjectSummary,
} from "./schemas";
import { contentTags } from "./tags";

// The cover FK is named explicitly: content_items also reaches media_assets through item_media.
const COVER =
  "cover:media_assets!content_items_cover_media_id_fkey(storage_path, alt_text, width, height)";
const DISCIPLINES =
  "disciplines:item_disciplines(is_primary, sort_order, discipline:disciplines(slug, name))";
const SKILLS = "skills:item_skills(skill:skills(slug, name))";

const SUMMARY_COLUMNS = `slug, title, summary, featured, sort_date, ${COVER},
  project:projects(role, project_status, started_on, ended_on), ${DISCIPLINES}, ${SKILLS}`;

const DETAIL_COLUMNS = `slug, title, summary, body, seo, featured, sort_date, ${COVER},
  project:projects(role, project_status, started_on, ended_on, repo_url, demo_url,
    context, problem, process, decisions, implementation, outcomes),
  ${DISCIPLINES}, ${SKILLS},
  highlights:item_highlights(text, sort_order)`;

/** Published projects: featured first, then newest. */
export async function listProjects(): Promise<ProjectSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(contentTags.all, contentTags.type("project"));

  const result = await createPublicClient()
    .from("content_items")
    .select(SUMMARY_COLUMNS)
    .eq("type", "project")
    .order("featured", { ascending: false })
    .order("sort_date", { ascending: false, nullsFirst: false })
    .order("title");

  return parseRows("projects", result, projectSummarySchema);
}

/** A published project with its evidence, skills and highlights, or null. */
export async function getProject(slug: string): Promise<Project | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(
    contentTags.all,
    contentTags.type("project"),
    contentTags.item("project", slug),
  );

  const result = await createPublicClient()
    .from("content_items")
    .select(DETAIL_COLUMNS)
    .eq("type", "project")
    .eq("slug", slug)
    .maybeSingle();

  return parseRow(`project "${slug}"`, result, projectSchema);
}
