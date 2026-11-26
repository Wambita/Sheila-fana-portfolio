import type { ProjectSummary } from "@/lib/content/schemas";
import { yearOf } from "@/lib/format";

/** Project filters (FR-04): discipline, technology and year. Empty string means "all". */
export type ProjectFilterState = {
  discipline: string;
  technology: string;
  year: string;
};

export const emptyFilters: ProjectFilterState = {
  discipline: "",
  technology: "",
  year: "",
};

type Option = { value: string; label: string };

/**
 * Years a project counts for: from its start to its end, or just its start year when it
 * has no end date. Falls back to `sortDate` when there's no start date.
 */
export function projectYears(project: ProjectSummary): number[] {
  const start = yearOf(project.startedOn) ?? yearOf(project.sortDate);
  if (start === null) return [];
  const end = yearOf(project.endedOn) ?? start;
  const years: number[] = [];
  for (let year = start; year <= Math.max(start, end); year++) years.push(year);
  return years;
}

/** Options built from the projects themselves, so a filter never offers an empty result. */
export function filterOptions(projects: ProjectSummary[]): {
  disciplines: Option[];
  technologies: Option[];
  years: Option[];
} {
  const disciplines = new Map<string, string>();
  const technologies = new Map<string, string>();
  const years = new Set<number>();
  for (const project of projects) {
    for (const d of project.disciplines) disciplines.set(d.slug, d.name);
    for (const s of project.skills) technologies.set(s.slug, s.name);
    for (const y of projectYears(project)) years.add(y);
  }
  const byLabel = (a: Option, b: Option) => a.label.localeCompare(b.label);
  return {
    disciplines: [...disciplines]
      .map(([value, label]) => ({ value, label }))
      .sort(byLabel),
    technologies: [...technologies]
      .map(([value, label]) => ({ value, label }))
      .sort(byLabel),
    years: [...years]
      .sort((a, b) => b - a)
      .map((y) => ({ value: String(y), label: String(y) })),
  };
}

export function filterProjects(
  projects: ProjectSummary[],
  filters: ProjectFilterState,
): ProjectSummary[] {
  return projects.filter(
    (project) =>
      (!filters.discipline ||
        project.disciplines.some((d) => d.slug === filters.discipline)) &&
      (!filters.technology ||
        project.skills.some((s) => s.slug === filters.technology)) &&
      (!filters.year || projectYears(project).includes(Number(filters.year))),
  );
}

/** Reads filters from the URL, ignoring values that aren't valid options. */
export function filtersFromParams(
  params: URLSearchParams,
  options: ReturnType<typeof filterOptions>,
): ProjectFilterState {
  const pick = (key: string, list: Option[]) => {
    const value = params.get(key) ?? "";
    return list.some((o) => o.value === value) ? value : "";
  };
  return {
    discipline: pick("discipline", options.disciplines),
    technology: pick("technology", options.technologies),
    year: pick("year", options.years),
  };
}

export function filtersToQuery(filters: ProjectFilterState): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}
