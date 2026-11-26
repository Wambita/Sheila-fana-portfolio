import { describe, expect, it } from "vitest";

import type { ProjectSummary } from "@/lib/content/schemas";

import {
  emptyFilters,
  filterOptions,
  filterProjects,
  filtersFromParams,
  filtersToQuery,
  projectYears,
} from "./project-filters";

// Fake projects for testing only.
function project(overrides: Partial<ProjectSummary>): ProjectSummary {
  return {
    slug: "p",
    title: "P",
    summary: null,
    featured: false,
    sortDate: null,
    cover: null,
    role: null,
    projectStatus: null,
    startedOn: null,
    endedOn: null,
    disciplines: [],
    skills: [],
    ...overrides,
  };
}

const a = project({
  slug: "a",
  startedOn: "2023-05-01",
  endedOn: "2025-01-01",
  disciplines: [{ slug: "design", name: "Design", isPrimary: true }],
  skills: [{ slug: "figma", name: "Figma" }],
});
const b = project({
  slug: "b",
  sortDate: "2026-02-01",
  disciplines: [{ slug: "security", name: "Security", isPrimary: true }],
  skills: [{ slug: "python", name: "Python" }],
});
const c = project({ slug: "c" });

describe("projectYears", () => {
  it("spans start to end", () => {
    expect(projectYears(a)).toEqual([2023, 2024, 2025]);
  });
  it("falls back to the sort date", () => {
    expect(projectYears(b)).toEqual([2026]);
  });
  it("is empty without dates", () => {
    expect(projectYears(c)).toEqual([]);
  });
});

describe("filterOptions", () => {
  it("offers only values the projects have", () => {
    expect(filterOptions([a, b, c])).toEqual({
      portfolios: [
        { value: "design", label: "Design" },
        { value: "security", label: "Security" },
      ],
      technologies: [
        { value: "figma", label: "Figma" },
        { value: "python", label: "Python" },
      ],
      years: ["2026", "2025", "2024", "2023"].map((y) => ({
        value: y,
        label: y,
      })),
    });
  });
});

describe("filterProjects", () => {
  it("returns everything with no filters", () => {
    expect(filterProjects([a, b, c], emptyFilters)).toHaveLength(3);
  });
  it("combines filters", () => {
    const slugs = (filters: Partial<typeof emptyFilters>) =>
      filterProjects([a, b, c], { ...emptyFilters, ...filters }).map(
        (p) => p.slug,
      );
    expect(slugs({ portfolio: "design" })).toEqual(["a"]);
    expect(slugs({ technology: "python" })).toEqual(["b"]);
    expect(slugs({ year: "2024" })).toEqual(["a"]);
    expect(slugs({ portfolio: "design", year: "2026" })).toEqual([]);
  });
});

describe("URL round trip", () => {
  const options = filterOptions([a, b]);
  it("reads valid values and ignores unknown ones", () => {
    expect(
      filtersFromParams(
        new URLSearchParams("portfolio=design&technology=nope&year=2026"),
        options,
      ),
    ).toEqual({ portfolio: "design", technology: "", year: "2026" });
  });
  it("writes only set filters", () => {
    expect(filtersToQuery({ ...emptyFilters, year: "2024" })).toBe(
      "?year=2024",
    );
    expect(filtersToQuery(emptyFilters)).toBe("");
  });
});
