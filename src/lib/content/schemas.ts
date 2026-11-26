import { z } from "zod";

/**
 * Zod schemas for the rows the repositories select, transformed into camelCase domain types.
 * The UI depends only on the domain types exported here, never on database rows.
 */

const isoDate = z.iso.date();

/** Empty or whitespace-only text is treated as missing, so the UI can hide it. */
const optionalText = z
  .string()
  .nullable()
  .transform((value) => (value && value.trim().length > 0 ? value : null));

/** PostgREST returns 1:1 detail rows reached through a composite FK as a one-element array. */
function oneOrNone<T extends z.ZodType>(schema: T) {
  return z
    .union([schema, z.array(schema).max(1)])
    .nullable()
    .transform((value): z.output<T> | null =>
      Array.isArray(value) ? (value[0] ?? null) : value,
    );
}

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

export const mediaSchema = z
  .object({
    storage_path: z.string(),
    alt_text: z.string(),
    width: z.number().int().nullable(),
    height: z.number().int().nullable(),
  })
  .transform((row) => ({
    storagePath: row.storage_path,
    altText: row.alt_text,
    width: row.width,
    height: row.height,
  }));
export type Media = z.output<typeof mediaSchema>;

const disciplineLinkSchema = z
  .object({
    is_primary: z.boolean(),
    sort_order: z.number().int(),
    // Null when the discipline is not visible (RLS); such links are dropped.
    discipline: z.object({ slug: z.string(), name: z.string() }).nullable(),
  })
  .transform((row) =>
    row.discipline
      ? {
          slug: row.discipline.slug,
          name: row.discipline.name,
          isPrimary: row.is_primary,
          sortOrder: row.sort_order,
        }
      : null,
  );

export type DisciplineRef = { slug: string; name: string; isPrimary: boolean };

function toDisciplineRefs(
  links: Array<z.output<typeof disciplineLinkSchema>>,
): DisciplineRef[] {
  return links
    .filter((link) => link !== null)
    .sort(
      (a, b) =>
        Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder,
    )
    .map(({ slug, name, isPrimary }) => ({ slug, name, isPrimary }));
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export const profileSchema = z
  .object({
    full_name: z.string(),
    headline: optionalText,
    bio: optionalText,
    location: optionalText,
    links: z.record(z.string(), z.url()),
    avatar: mediaSchema.nullable(),
  })
  .transform((row) => ({
    fullName: row.full_name,
    headline: row.headline,
    bio: row.bio,
    location: row.location,
    links: row.links,
    avatar: row.avatar,
  }));
export type Profile = z.output<typeof profileSchema>;

// ---------------------------------------------------------------------------
// Disciplines
// ---------------------------------------------------------------------------

export const disciplineSchema = z
  .object({
    slug: z.string(),
    name: z.string(),
    tagline: optionalText,
    intro: optionalText,
    sort_order: z.number().int(),
  })
  .transform((row) => ({
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    intro: row.intro,
    sortOrder: row.sort_order,
  }));
export type Discipline = z.output<typeof disciplineSchema>;

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

/** Evidence sections in display order (doc 03). */
export const EVIDENCE_SECTIONS = [
  "context",
  "problem",
  "process",
  "decisions",
  "implementation",
  "outcomes",
] as const;
export type EvidenceSection = (typeof EVIDENCE_SECTIONS)[number];

const skillLinkSchema = z
  .object({ skill: z.object({ slug: z.string(), name: z.string() }) })
  .transform(({ skill }) => skill);
export type SkillRef = z.output<typeof skillLinkSchema>;

/** Optional per-item SEO overrides (`content_items.seo`); unknown keys are ignored. */
const seoSchema = z.record(z.string(), z.unknown()).transform((seo) => ({
  title: typeof seo.title === "string" && seo.title.trim() ? seo.title : null,
  description:
    typeof seo.description === "string" && seo.description.trim()
      ? seo.description
      : null,
}));
export type Seo = z.output<typeof seoSchema>;

const projectSummaryDetailSchema = z.object({
  role: optionalText,
  project_status: optionalText,
  started_on: isoDate.nullable(),
  ended_on: isoDate.nullable(),
});

const projectSummaryRowSchema = z.object({
  slug: z.string(),
  title: z.string(),
  summary: optionalText,
  featured: z.boolean(),
  sort_date: isoDate.nullable(),
  cover: mediaSchema.nullable(),
  project: oneOrNone(projectSummaryDetailSchema),
  disciplines: z.array(disciplineLinkSchema),
  skills: z.array(skillLinkSchema),
});

function toProjectSummary(row: z.output<typeof projectSummaryRowSchema>) {
  return {
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    featured: row.featured,
    sortDate: row.sort_date,
    cover: row.cover,
    role: row.project?.role ?? null,
    projectStatus: row.project?.project_status ?? null,
    startedOn: row.project?.started_on ?? null,
    endedOn: row.project?.ended_on ?? null,
    disciplines: toDisciplineRefs(row.disciplines),
    skills: [...row.skills].sort((a, b) => a.name.localeCompare(b.name)),
  };
}

export const projectSummarySchema =
  projectSummaryRowSchema.transform(toProjectSummary);
export type ProjectSummary = z.output<typeof projectSummarySchema>;

const projectDetailSchema = projectSummaryDetailSchema.extend({
  repo_url: z.url().nullable(),
  demo_url: z.url().nullable(),
  context: optionalText,
  problem: optionalText,
  process: optionalText,
  decisions: optionalText,
  implementation: optionalText,
  outcomes: optionalText,
});

export const projectSchema = projectSummaryRowSchema
  .extend({
    body: optionalText,
    seo: seoSchema,
    project: oneOrNone(projectDetailSchema),
    highlights: z.array(
      z.object({ text: z.string(), sort_order: z.number().int() }),
    ),
  })
  .transform((row) => {
    const detail = row.project;
    return {
      ...toProjectSummary(row),
      body: row.body,
      seo: row.seo,
      repoUrl: detail?.repo_url ?? null,
      demoUrl: detail?.demo_url ?? null,
      // Only sections with owner-supplied text; empty ones are hidden (CLAUDE.md).
      evidence: EVIDENCE_SECTIONS.flatMap((section) => {
        const text = detail?.[section] ?? null;
        return text ? [{ section, text }] : [];
      }),
      highlights: [...row.highlights]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(({ text }) => text),
    };
  });
export type Project = z.output<typeof projectSchema>;

// ---------------------------------------------------------------------------
// Any content item, as listed on a discipline page
// ---------------------------------------------------------------------------

const contentTypeSchema = z.enum([
  "project",
  "experience",
  "publication",
  "education",
  "certification",
  "article",
  "engagement",
  "interest",
]);

export const itemSummarySchema = z
  .object({
    type: contentTypeSchema,
    slug: z.string(),
    title: z.string(),
    summary: optionalText,
    featured: z.boolean(),
    sort_date: isoDate.nullable(),
    // The link row for the discipline being listed (filtered to one row by the query).
    link: z.array(
      z.object({ emphasis_note: optionalText, sort_order: z.number().int() }),
    ),
  })
  .transform((row) => ({
    type: row.type,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    featured: row.featured,
    sortDate: row.sort_date,
    emphasisNote: row.link[0]?.emphasis_note ?? null,
  }));
export type ItemSummary = z.output<typeof itemSummarySchema>;
