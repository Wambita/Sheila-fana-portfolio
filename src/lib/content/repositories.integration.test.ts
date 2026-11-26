/**
 * Runs the real repositories against the local Supabase stack seeded by supabase/seed.sql.
 * Run with `npm run test:integration` after `npx supabase start` (and `npx supabase db reset`
 * if the seed has changed). Reads the local URL and anon key from .env.local.
 */
import { existsSync } from "node:fs";

import { describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));

if (!process.env.NEXT_PUBLIC_SUPABASE_URL && existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

const {
  getDiscipline,
  getProfile,
  getProject,
  listDisciplineSkills,
  listDisciplines,
  listFeaturedExperience,
  listItemsByType,
  listItemsForDiscipline,
  listProjects,
  listSkillOverview,
} = await import("./index");

describe("content repositories against local Supabase (seed data)", () => {
  it("lists only published projects, featured first", async () => {
    const projects = await listProjects();
    expect(projects.map((p) => p.slug)).toEqual([
      "sample-project-one",
      "sample-project-two",
    ]);
    expect(projects[0]).toMatchObject({
      featured: true,
      role: "[Sample] Role",
    });
  });

  it("loads a project with its evidence, skills and published highlights only", async () => {
    const project = await getProject("sample-project-one");
    expect(project?.evidence.map((e) => e.section)).toEqual([
      "context",
      "problem",
    ]);
    expect(project?.skills.map((s) => s.slug)).toEqual([
      "sample-skill-one",
      "sample-skill-two",
    ]);
    expect(project?.highlights).toEqual(["[Sample] Highlight one."]);
    expect(project?.disciplines[0]).toEqual({
      slug: "sample-discipline-a",
      name: "[Sample] Discipline A",
      isPrimary: true,
    });
  });

  it("hides draft projects", async () => {
    await expect(getProject("sample-draft-project")).resolves.toBeNull();
  });

  it("lists only published disciplines in order", async () => {
    const disciplines = await listDisciplines();
    expect(disciplines.map((d) => d.slug)).toEqual([
      "sample-discipline-a",
      "sample-discipline-b",
    ]);
    await expect(getDiscipline("sample-draft-discipline")).resolves.toBeNull();
  });

  it("lists published items of every type for a discipline, featured first", async () => {
    const items = await listItemsForDiscipline("sample-discipline-a");
    expect(items.map((i) => `${i.type}:${i.slug}`)).toEqual([
      "experience:sample-experience",
      "project:sample-project-one",
      "article:sample-article",
      "publication:sample-publication",
    ]);
    const other = await listItemsForDiscipline("sample-discipline-b");
    expect(other.map((i) => i.slug)).toEqual([
      "sample-project-one",
      "sample-certification",
      "sample-engagement",
      "sample-project-two",
    ]);
  });

  it("carries the details each portfolio section needs", async () => {
    const items = await listItemsForDiscipline("sample-discipline-a");
    const bySlug = Object.fromEntries(items.map((i) => [i.slug, i]));
    // A case study in A, a plain project in B.
    expect(bySlug["sample-project-one"]).toMatchObject({
      featuredHere: true,
      role: "[Sample] Role",
      startedOn: "2000-01-01",
    });
    expect(bySlug["sample-experience"]).toMatchObject({
      role: "[Sample] Role",
      organisation: "[Sample] Organisation",
    });
    expect(bySlug["sample-publication"]).toMatchObject({
      organisation: "[Sample] Venue",
      year: 2000,
      externalUrl: "https://example.com/sample-publication",
    });
    expect(bySlug["sample-article"]).toMatchObject({
      organisation: "dev.to",
      startedOn: "2000-07-01",
      externalUrl: "https://example.com/sample-article",
    });
    const b = await listItemsForDiscipline("sample-discipline-b");
    expect(b.find((i) => i.slug === "sample-project-one")?.featuredHere).toBe(
      false,
    );
    expect(b.find((i) => i.slug === "sample-certification")).toMatchObject({
      organisation: "[Sample] Issuer",
      startedOn: "2000-06-01",
    });
  });

  it("loads each portfolio's own section order and capabilities", async () => {
    const [a, b] = await listDisciplines();
    expect(a.capabilities).toEqual([
      "[Sample] Capability one",
      "[Sample] Capability two",
    ]);
    expect(b.sections).toEqual([
      "skills",
      "credentials",
      "experience",
      "projects",
    ]);
  });

  it("lists a portfolio's skills in priority order with their kind", async () => {
    await expect(listDisciplineSkills("sample-discipline-b")).resolves.toEqual([
      {
        slug: "sample-skill-three",
        name: "[Sample] Skill three",
        kind: "competency",
      },
      {
        slug: "sample-skill-one",
        name: "[Sample] Skill one",
        kind: "technical",
      },
    ]);
    await expect(
      listDisciplineSkills("sample-draft-discipline"),
    ).resolves.toEqual([]);
  });

  it("builds the homepage skill overview from highlighted skills only", async () => {
    const overview = await listSkillOverview();
    expect(overview).toEqual([
      {
        slug: "sample-category-a",
        name: "[Sample] Category A",
        discipline: {
          slug: "sample-discipline-a",
          name: "[Sample] Discipline A",
        },
        skills: [{ slug: "sample-skill-one", name: "[Sample] Skill one" }],
      },
      {
        slug: "sample-category-b",
        name: "[Sample] Category B",
        discipline: {
          slug: "sample-discipline-b",
          name: "[Sample] Discipline B",
        },
        skills: [{ slug: "sample-skill-three", name: "[Sample] Skill three" }],
      },
    ]);
  });

  it("lists featured experience for the homepage", async () => {
    const items = await listFeaturedExperience();
    expect(items.map((i) => i.slug)).toEqual(["sample-experience"]);
    expect(items[0].organisation).toBe("[Sample] Organisation");
  });

  it("lists the full record of a type, including items in no portfolio", async () => {
    const publications = await listItemsByType(["publication"]);
    expect(publications.map((i) => i.slug)).toEqual([
      "sample-unlinked-publication",
      "sample-publication",
    ]);
    const inPortfolios = [
      ...(await listItemsForDiscipline("sample-discipline-a")),
      ...(await listItemsForDiscipline("sample-discipline-b")),
    ].map((i) => i.slug);
    expect(inPortfolios).not.toContain("sample-unlinked-publication");
  });

  it("lists nothing for a draft discipline", async () => {
    await expect(
      listItemsForDiscipline("sample-draft-discipline"),
    ).resolves.toEqual([]);
  });

  it("includes technologies on project summaries", async () => {
    const [first] = await listProjects();
    expect(first.skills.map((s) => s.slug)).toEqual([
      "sample-skill-one",
      "sample-skill-two",
    ]);
  });

  it("loads the profile", async () => {
    await expect(getProfile()).resolves.toMatchObject({
      fullName: "[Sample] Profile name",
    });
  });
});
