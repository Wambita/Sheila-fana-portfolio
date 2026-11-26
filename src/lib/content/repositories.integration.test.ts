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

const { getDiscipline, getProfile, getProject, listDisciplines, listProjects } =
  await import("./index");

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

  it("loads the profile", async () => {
    await expect(getProfile()).resolves.toMatchObject({
      fullName: "[Sample] Profile name",
    });
  });
});
