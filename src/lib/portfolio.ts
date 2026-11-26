import type {
  Discipline,
  DisciplineSkill,
  ItemSummary,
  PortfolioSection,
  ProjectSummary,
  SkillKind,
} from "@/lib/content/schemas";

/**
 * Discipline portfolios (ADR-019): one template, but each discipline chooses which
 * sections appear and in what order. Everything is filtered from shared data via
 * item_disciplines, so a portfolio is complete on its own for a recruiter.
 */

export const sectionTitles: Record<PortfolioSection, string> = {
  capabilities: "Capabilities",
  case_studies: "Case studies",
  projects: "Projects",
  skills: "Skills",
  experience: "Experience",
  publications: "Publications",
  writing: "Writing",
  credentials: "Education and credentials",
};

/** Shorter labels for the sidebar's section links. */
export const sectionNavLabels: Partial<Record<PortfolioSection, string>> = {
  credentials: "Credentials",
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
      key: Exclude<PortfolioSection, "capabilities" | "skills">;
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
 * The portfolio's sections in the discipline's order, each with its content. Sections
 * with nothing published are dropped (doc 03: empty groups are hidden).
 */
export function buildPortfolio(
  discipline: Pick<Discipline, "sections" | "capabilities">,
  items: ItemSummary[],
  skills: DisciplineSkill[],
): PortfolioBlock[] {
  const ofTypes = (...types: ItemSummary["type"][]) =>
    items.filter((item) => types.includes(item.type));
  const projects = ofTypes("project");
  // Case studies only split off when the portfolio shows that section.
  const showsCaseStudies = discipline.sections.includes("case_studies");
  const caseStudies = showsCaseStudies
    ? projects.filter((p) => p.featuredHere)
    : [];

  const blocks = discipline.sections.map((key): PortfolioBlock => {
    switch (key) {
      case "capabilities":
        return { key, capabilities: discipline.capabilities };
      case "skills":
        return { key, groups: groupSkills(skills) };
      case "case_studies":
        return { key, items: caseStudies };
      case "projects":
        return {
          key,
          items: projects.filter((p) => !caseStudies.includes(p)),
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

  return blocks.filter((block) =>
    "capabilities" in block
      ? block.capabilities.length > 0
      : "groups" in block
        ? block.groups.length > 0
        : block.items.length > 0,
  );
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
