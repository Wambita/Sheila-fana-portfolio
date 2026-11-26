import type {
  Discipline,
  DisciplineSkill,
  ItemSummary,
  PortfolioSection,
  ProjectSummary,
  SkillKind,
} from "@/lib/content/schemas";

/**
 * A discipline's page (ADR-019, ADR-024): one template, but each discipline chooses
 * which sections appear and in what order. Its **Portfolio** is its projects (case
 * studies first, then the rest); the other sections are the shared content filtered to
 * this discipline. Everything comes from shared data via item_disciplines, so the page
 * is complete on its own for a recruiter.
 */

/** Rendered blocks. `case_studies` and `projects` in the data both feed `portfolio`. */
export type BlockKey =
  Exclude<PortfolioSection, "case_studies" | "projects"> | "portfolio";

export const sectionTitles: Record<BlockKey, string> = {
  capabilities: "Capabilities",
  portfolio: "Portfolio",
  skills: "Skills",
  experience: "Experience",
  publications: "Publications",
  writing: "Writing",
  credentials: "Education and credentials",
};

/** Shorter labels for the sidebar's section links. */
export const sectionNavLabels: Partial<Record<BlockKey, string>> = {
  credentials: "Education",
};

export const skillKindTitles: Record<SkillKind, string> = {
  technical: "Technical skills",
  tool: "Tools",
  competency: "Professional competencies",
};

export type SkillGroup = { kind: SkillKind; skills: DisciplineSkill[] };

export type PortfolioBlock =
  | { key: "capabilities"; capabilities: string[] }
  | { key: "skills"; groups: SkillGroup[] }
  | {
      key: "portfolio";
      /** Shown large, first (projects featured for this discipline). */
      caseStudies: ItemSummary[];
      projects: ItemSummary[];
    }
  | {
      key: Exclude<BlockKey, "capabilities" | "skills" | "portfolio">;
      items: ItemSummary[];
    };

/** Newest first by start date; items without dates go last. */
function byStartDesc(a: ItemSummary, b: ItemSummary): number {
  const x = a.startedOn ?? a.sortDate ?? "";
  const y = b.startedOn ?? b.sortDate ?? "";
  return y.localeCompare(x);
}

export function groupSkills(skills: DisciplineSkill[]): SkillGroup[] {
  return (["technical", "tool", "competency"] as const)
    .map((kind) => ({ kind, skills: skills.filter((s) => s.kind === kind) }))
    .filter((group) => group.skills.length > 0);
}

/**
 * The discipline's sections in its own order, each with its content. The Portfolio
 * appears where `case_studies` or `projects` first appears in `sections`; featured
 * projects are case studies only when `case_studies` is listed. Sections with nothing
 * published are dropped (doc 03: empty groups are hidden).
 */
export function buildPortfolio(
  discipline: Pick<Discipline, "sections" | "capabilities">,
  items: ItemSummary[],
  skills: DisciplineSkill[],
): PortfolioBlock[] {
  const ofTypes = (...types: ItemSummary["type"][]) =>
    items.filter((item) => types.includes(item.type));
  const projects = ofTypes("project");
  const showsCaseStudies = discipline.sections.includes("case_studies");
  const caseStudies = showsCaseStudies
    ? projects.filter((p) => p.featuredHere)
    : [];

  const keys: BlockKey[] = [];
  for (const section of discipline.sections) {
    const key: BlockKey =
      section === "case_studies" || section === "projects"
        ? "portfolio"
        : section;
    if (!keys.includes(key)) keys.push(key);
  }

  const blocks = keys.map((key): PortfolioBlock => {
    switch (key) {
      case "capabilities":
        return { key, capabilities: discipline.capabilities };
      case "skills":
        return { key, groups: groupSkills(skills) };
      case "portfolio":
        return {
          key,
          caseStudies,
          projects: projects.filter((p) => !caseStudies.includes(p)),
        };
      case "experience":
        return {
          key,
          items: ofTypes("experience", "engagement").sort(byStartDesc),
        };
      case "publications":
        return { key, items: ofTypes("publication") };
      case "writing":
        return { key, items: ofTypes("article").sort(byStartDesc) };
      case "credentials":
        return {
          key,
          items: ofTypes("education", "certification").sort(byStartDesc),
        };
    }
  });

  return blocks.filter((block) => {
    switch (block.key) {
      case "capabilities":
        return block.capabilities.length > 0;
      case "skills":
        return block.groups.length > 0;
      case "portfolio":
        return block.caseStudies.length + block.projects.length > 0;
      default:
        return block.items.length > 0;
    }
  });
}

/**
 * Homepage "selected projects": featured projects, preferring one per primary
 * discipline so the selection spans disciplines, then filling up with the rest.
 */
export function pickAcrossDisciplines(
  projects: ProjectSummary[],
  limit: number,
): ProjectSummary[] {
  const featured = projects.filter((p) => p.featured);
  const picked: ProjectSummary[] = [];
  const seen = new Set<string>();
  for (const project of featured) {
    const primary = project.disciplines[0]?.slug ?? `none:${project.slug}`;
    if (!seen.has(primary)) {
      seen.add(primary);
      picked.push(project);
    }
  }
  for (const project of featured) {
    if (!picked.includes(project)) picked.push(project);
  }
  return picked.slice(0, limit);
}
