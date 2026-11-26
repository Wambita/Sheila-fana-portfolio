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
    overview: optionalText,
    bio: optionalText,
    location: optionalText,
    links: z.record(z.string(), z.url()),
    avatar: mediaSchema.nullable(),
  })
  .transform((row) => ({
    fullName: row.full_name,
    headline: row.headline,
    overview: row.overview,
    bio: row.bio,
    location: row.location,
    links: row.links,
    avatar: row.avatar,
  }));
export type Profile = z.output<typeof profileSchema>;

// ---------------------------------------------------------------------------
// Disciplines
// ---------------------------------------------------------------------------

/** Portfolio sections a discipline can show, in the order it chooses (ADR-019). */
export const PORTFOLIO_SECTIONS = [
  "capabilities",
  "case_studies",
  "projects",
  "skills",
  "experience",
  "publications",
  "writing",
  "credentials",
] as const;
export type PortfolioSection = (typeof PORTFOLIO_SECTIONS)[number];

export const disciplineSchema = z
  .object({
    slug: z.string(),
    name: z.string(),
    tagline: optionalText,
    intro: optionalText,
    sort_order: z.number().int(),
    capabilities: z.array(z.string()),
    sections: z.array(z.enum(PORTFOLIO_SECTIONS)),
  })
  .transform((row) => ({
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    intro: row.intro,
    sortOrder: row.sort_order,
    capabilities: row.capabilities.map((c) => c.trim()).filter(Boolean),
    sections: row.sections,
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
// Any content item, as listed in a portfolio, on the homepage or on a shared page
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

const detail = <T extends z.ZodRawShape>(shape: T) =>
  oneOrNone(z.object(shape));
const dateOrNull = isoDate.nullable();

const articleSourceLabels = { devto: "dev.to", medium: "Medium" } as const;

type ItemDetails = {
  role: string | null;
  /** Organisation, host, venue, institution, issuer or source. */
  organisation: string | null;
  location: string | null;
  startedOn: string | null;
  endedOn: string | null;
  year: number | null;
  /** Canonical outside link: publication, credential verification or original article. */
  externalUrl: string | null;
};

export const itemSummarySchema = z
  .object({
    type: contentTypeSchema,
    slug: z.string(),
    title: z.string(),
    summary: optionalText,
    featured: z.boolean(),
    sort_date: isoDate.nullable(),
    // The link row for the discipline being listed, when listed in a portfolio.
    link: z
      .array(
        z.object({
          emphasis_note: optionalText,
          sort_order: z.number().int(),
          featured: z.boolean(),
        }),
      )
      .optional(),
    project: detail({
      role: optionalText,
      started_on: dateOrNull,
      ended_on: dateOrNull,
    }),
    experience: detail({
      organisation: z.string(),
      role: z.string(),
      location: optionalText,
      started_on: dateOrNull,
      ended_on: dateOrNull,
    }),
    engagement: detail({
      host_org: optionalText,
      role: optionalText,
      location: optionalText,
      started_on: dateOrNull,
      ended_on: dateOrNull,
    }),
    publication: detail({
      venue: optionalText,
      year: z.number().int().nullable(),
      url: z.url().nullable(),
      doi: optionalText,
    }),
    education: detail({
      institution: z.string(),
      qualification: optionalText,
      field: optionalText,
      started_on: dateOrNull,
      ended_on: dateOrNull,
    }),
    certification: detail({
      issuer: z.string(),
      issued_on: dateOrNull,
      verify_url: z.url().nullable(),
    }),
    article: detail({
      source: z.enum(["devto", "medium"]),
      source_url: z.url(),
      published_at: z.string(),
    }),
  })
  .transform((row) => {
    const link = row.link?.[0];
    const details: ItemDetails = {
      role: null,
      organisation: null,
      location: null,
      startedOn: null,
      endedOn: null,
      year: null,
      externalUrl: null,
    };
    const p = row.project;
    const x = row.experience;
    const g = row.engagement;
    const pub = row.publication;
    const edu = row.education;
    const cert = row.certification;
    const art = row.article;
    if (p) {
      Object.assign(details, {
        role: p.role,
        startedOn: p.started_on,
        endedOn: p.ended_on,
      });
    } else if (x) {
      Object.assign(details, {
        role: x.role,
        organisation: x.organisation,
        location: x.location,
        startedOn: x.started_on,
        endedOn: x.ended_on,
      });
    } else if (g) {
      Object.assign(details, {
        role: g.role,
        organisation: g.host_org,
        location: g.location,
        startedOn: g.started_on,
        endedOn: g.ended_on,
      });
    } else if (pub) {
      Object.assign(details, {
        organisation: pub.venue,
        year: pub.year,
        externalUrl: pub.url ?? (pub.doi ? `https://doi.org/${pub.doi}` : null),
      });
    } else if (edu) {
      Object.assign(details, {
        role: [edu.qualification, edu.field].filter(Boolean).join(", ") || null,
        organisation: edu.institution,
        startedOn: edu.started_on,
        endedOn: edu.ended_on,
      });
    } else if (cert) {
      // A single date: shown as the issue month, not a range.
      Object.assign(details, {
        organisation: cert.issuer,
        startedOn: cert.issued_on,
        endedOn: cert.issued_on,
        externalUrl: cert.verify_url,
      });
    } else if (art) {
      const date = art.published_at.slice(0, 10);
      Object.assign(details, {
        organisation: articleSourceLabels[art.source],
        startedOn: date,
        endedOn: date,
        externalUrl: art.source_url,
      });
    }
    return {
      type: row.type,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      featured: row.featured,
      sortDate: row.sort_date,
      /** Featured within the portfolio being listed (case study / highlight). */
      featuredHere: link?.featured ?? false,
      emphasisNote: link?.emphasis_note ?? null,
      ...details,
    };
  });
export type ItemSummary = z.output<typeof itemSummarySchema>;

/** Detail columns selected alongside every item summary. */
export const ITEM_DETAIL_COLUMNS = `project:projects(role, started_on, ended_on),
  experience:experiences(organisation, role, location, started_on, ended_on),
  engagement:engagements(host_org, role, location, started_on, ended_on),
  publication:publications(venue, year, url, doi),
  education:education(institution, qualification, field, started_on, ended_on),
  certification:certifications(issuer, issued_on, verify_url),
  article:articles(source, source_url, published_at)`;

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export const SKILL_KINDS = ["technical", "tool", "competency"] as const;
export type SkillKind = (typeof SKILL_KINDS)[number];

export const disciplineSkillSchema = z
  .object({
    sort_order: z.number().int(),
    skill: z.object({
      slug: z.string(),
      name: z.string(),
      kind: z.enum(SKILL_KINDS),
    }),
  })
  .transform(({ skill }) => skill);
export type DisciplineSkill = z.output<typeof disciplineSkillSchema>;

export const skillCategorySchema = z
  .object({
    slug: z.string(),
    name: z.string(),
    sort_order: z.number().int(),
    // Null when there is no linked portfolio or it is unpublished (RLS).
    discipline: z.object({ slug: z.string(), name: z.string() }).nullable(),
    skills: z.array(
      z.object({
        slug: z.string(),
        name: z.string(),
        highlighted: z.boolean(),
      }),
    ),
  })
  .transform((row) => ({
    slug: row.slug,
    name: row.name,
    discipline: row.discipline,
    /** Key strengths only: the homepage is an overview, not an inventory. */
    skills: row.skills
      .filter((skill) => skill.highlighted)
      .map(({ slug, name }) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  }));
export type SkillCategory = z.output<typeof skillCategorySchema>;
