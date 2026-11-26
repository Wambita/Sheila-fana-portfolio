import { describe, expect, it } from "vitest";

import type {
  DisciplineSkill,
  ItemSummary,
  ProjectSummary,
} from "@/lib/content/schemas";

import {
  buildPortfolio,
  groupSkills,
  pickAcrossDisciplines,
} from "./portfolio";

// Fake items for testing only.
function item(overrides: Partial<ItemSummary>): ItemSummary {
  return {
    type: "project",
    slug: "x",
    title: "X",
    summary: null,
    featured: false,
    sortDate: null,
    featuredHere: false,
    emphasisNote: null,
    role: null,
    organisation: null,
    location: null,
    startedOn: null,
    endedOn: null,
    year: null,
    externalUrl: null,
    ...overrides,
  };
}

const items = [
  item({ slug: "case", featuredHere: true }),
  item({ slug: "plain" }),
  item({ slug: "old-job", type: "experience", startedOn: "2020-01-01" }),
  item({ slug: "new-talk", type: "engagement", startedOn: "2024-01-01" }),
  item({ slug: "cert", type: "certification", startedOn: "2023-01-01" }),
  item({ slug: "degree", type: "education", startedOn: "2018-01-01" }),
];

const skills: DisciplineSkill[] = [
  { slug: "a", name: "A", kind: "competency" },
  { slug: "b", name: "B", kind: "technical" },
  { slug: "c", name: "C", kind: "technical" },
];

describe("buildPortfolio", () => {
  it("follows the discipline's own section order and drops empty sections", () => {
    const blocks = buildPortfolio(
      {
        sections: [
          "skills",
          "publications",
          "experience",
          "case_studies",
          "projects",
        ],
        capabilities: [],
      },
      items,
      skills,
    );
    expect(blocks.map((b) => b.key)).toEqual([
      "skills",
      "experience",
      "case_studies",
      "projects",
    ]);
  });

  it("splits case studies from other projects", () => {
    const blocks = buildPortfolio(
      { sections: ["case_studies", "projects"], capabilities: [] },
      items,
      [],
    );
    const slugs = blocks.map((b) =>
      "items" in b ? b.items.map((i) => i.slug) : [],
    );
    expect(slugs).toEqual([["case"], ["plain"]]);
  });

  it("keeps featured projects in Projects when there is no case-study section", () => {
    const [projects] = buildPortfolio(
      { sections: ["projects"], capabilities: [] },
      items,
      [],
    );
    expect("items" in projects && projects.items.map((i) => i.slug)).toEqual([
      "case",
      "plain",
    ]);
  });

  it("combines roles and engagements, and education and certifications, newest first", () => {
    const blocks = buildPortfolio(
      { sections: ["experience", "credentials"], capabilities: [] },
      items,
      [],
    );
    expect(
      blocks.map((b) => ("items" in b ? b.items.map((i) => i.slug) : [])),
    ).toEqual([
      ["new-talk", "old-job"],
      ["cert", "degree"],
    ]);
  });

  it("shows capabilities only when there are some", () => {
    expect(
      buildPortfolio({ sections: ["capabilities"], capabilities: [] }, [], []),
    ).toEqual([]);
    expect(
      buildPortfolio(
        { sections: ["capabilities"], capabilities: ["One"] },
        [],
        [],
      ),
    ).toEqual([{ key: "capabilities", capabilities: ["One"] }]);
  });
});

describe("groupSkills", () => {
  it("groups by kind in a fixed order, keeping priority within each group", () => {
    expect(groupSkills(skills)).toEqual([
      { kind: "technical", skills: [skills[1], skills[2]] },
      { kind: "competency", skills: [skills[0]] },
    ]);
  });
});

describe("pickAcrossDisciplines", () => {
  const project = (slug: string, discipline: string, featured = true) =>
    ({
      slug,
      featured,
      disciplines: [{ slug: discipline, name: discipline, isPrimary: true }],
    }) as unknown as ProjectSummary;

  it("prefers one featured project per primary discipline", () => {
    const picked = pickAcrossDisciplines(
      [
        project("a1", "a"),
        project("a2", "a"),
        project("b1", "b"),
        project("c1", "c", false),
      ],
      2,
    );
    expect(picked.map((p) => p.slug)).toEqual(["a1", "b1"]);
  });

  it("fills up with further featured projects", () => {
    const picked = pickAcrossDisciplines(
      [project("a1", "a"), project("a2", "a"), project("b1", "b")],
      3,
    );
    expect(picked.map((p) => p.slug)).toEqual(["a1", "b1", "a2"]);
  });
});
