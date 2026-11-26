import { beforeEach, describe, expect, it, vi } from "vitest";

import { fakeQuery } from "./test-utils";

const state = vi.hoisted(() => ({ client: null as unknown }));

vi.mock("next/cache", () => ({ cacheLife: vi.fn(), cacheTag: vi.fn() }));
vi.mock("@/lib/supabase/public-client", () => ({
  createPublicClient: () => state.client,
}));

const { cacheTag } = await import("next/cache");
const { getDiscipline, getProfile, getProject, listDisciplines, listProjects } =
  await import("./index");

// Fake rows only: shapes mirror what PostgREST returns from the local stack.
const projectRow = {
  slug: "test-project",
  title: "Test project",
  summary: "  ",
  body: null,
  seo: {},
  featured: true,
  sort_date: "2000-01-01",
  cover: null,
  project: [
    {
      role: "Test role",
      project_status: null,
      started_on: "2000-01-01",
      ended_on: null,
      repo_url: "https://example.com/repo",
      demo_url: null,
      context: "Test context",
      problem: "",
      process: null,
      decisions: null,
      implementation: null,
      outcomes: "Test outcome",
    },
  ],
  disciplines: [
    { is_primary: false, sort_order: 0, discipline: { slug: "b", name: "B" } },
    { is_primary: true, sort_order: 5, discipline: { slug: "a", name: "A" } },
    { is_primary: false, sort_order: 1, discipline: null },
  ],
  skills: [{ skill: { slug: "test-skill", name: "Test skill" } }],
  highlights: [
    { text: "Second", sort_order: 2 },
    { text: "First", sort_order: 1 },
  ],
};

beforeEach(() => {
  vi.mocked(cacheTag).mockClear();
});

describe("getProject", () => {
  it("maps a row into a domain project", async () => {
    const { client } = fakeQuery({ data: projectRow, error: null });
    state.client = client;

    const project = await getProject("test-project");

    expect(project).toMatchObject({
      slug: "test-project",
      summary: null, // whitespace-only text is treated as missing
      role: "Test role",
      startedOn: "2000-01-01",
      endedOn: null,
      repoUrl: "https://example.com/repo",
      skills: [{ slug: "test-skill", name: "Test skill" }],
      highlights: ["First", "Second"],
    });
  });

  it("returns only evidence sections that have text, in display order", async () => {
    state.client = fakeQuery({ data: projectRow, error: null }).client;
    const project = await getProject("test-project");
    expect(project?.evidence).toEqual([
      { section: "context", text: "Test context" },
      { section: "outcomes", text: "Test outcome" },
    ]);
  });

  it("orders disciplines primary first and drops hidden ones", async () => {
    state.client = fakeQuery({ data: projectRow, error: null }).client;
    const project = await getProject("test-project");
    expect(project?.disciplines).toEqual([
      { slug: "a", name: "A", isPrimary: true },
      { slug: "b", name: "B", isPrimary: false },
    ]);
  });

  it("queries by type and slug and tags the cache entry", async () => {
    const query = fakeQuery({ data: projectRow, error: null });
    state.client = query.client;
    await getProject("test-project");

    expect(query.calls).toContainEqual(["from", "content_items"]);
    expect(query.calls).toContainEqual(["eq", "type", "project"]);
    expect(query.calls).toContainEqual(["eq", "slug", "test-project"]);
    expect(cacheTag).toHaveBeenCalledWith(
      "content",
      "content:type:project",
      "content:item:project:test-project",
    );
  });

  it("returns null when the project is missing or unpublished", async () => {
    state.client = fakeQuery({ data: null, error: null }).client;
    await expect(getProject("missing")).resolves.toBeNull();
  });

  it("throws on query errors instead of rendering nothing", async () => {
    state.client = fakeQuery({ data: null, error: { message: "boom" } }).client;
    await expect(getProject("x")).rejects.toThrow(
      'Failed to load project "x": boom',
    );
  });

  it("throws when a row doesn't match the schema", async () => {
    state.client = fakeQuery({
      data: { ...projectRow, sort_date: "not a date" },
      error: null,
    }).client;
    await expect(getProject("test-project")).rejects.toThrow();
  });
});

describe("listProjects", () => {
  it("maps summaries and accepts a missing detail row", async () => {
    const summary = { ...projectRow, project: [] };
    state.client = fakeQuery({ data: [summary], error: null }).client;

    const [project] = await listProjects();
    expect(project).toMatchObject({
      slug: "test-project",
      role: null,
      startedOn: null,
    });
    expect(project).not.toHaveProperty("evidence");
  });
});

describe("disciplines", () => {
  const row = {
    slug: "test",
    name: "Test",
    tagline: null,
    intro: "Intro",
    sort_order: 1,
    capabilities: ["  One  ", "", "Two"],
    sections: ["skills", "projects"],
  };

  it("lists disciplines in order", async () => {
    const query = fakeQuery({ data: [row], error: null });
    state.client = query.client;
    await expect(listDisciplines()).resolves.toEqual([
      {
        slug: "test",
        name: "Test",
        tagline: null,
        intro: "Intro",
        sortOrder: 1,
        // Trimmed, blanks dropped; the discipline's own section order is kept.
        capabilities: ["One", "Two"],
        sections: ["skills", "projects"],
      },
    ]);
    expect(query.calls).toContainEqual(["order", "sort_order"]);
  });

  it("gets one discipline by slug", async () => {
    state.client = fakeQuery({ data: row, error: null }).client;
    await expect(getDiscipline("test")).resolves.toMatchObject({
      slug: "test",
    });
    expect(cacheTag).toHaveBeenCalledWith(
      "content",
      "content:disciplines",
      "content:discipline:test",
    );
  });
});

describe("getProfile", () => {
  it("returns null before a profile exists", async () => {
    state.client = fakeQuery({ data: null, error: null }).client;
    await expect(getProfile()).resolves.toBeNull();
  });

  it("rejects links that aren't URLs", async () => {
    state.client = fakeQuery({
      data: {
        full_name: "Test",
        headline: null,
        bio: null,
        location: null,
        links: { github: "not a url" },
        avatar: null,
      },
      error: null,
    }).client;
    await expect(getProfile()).rejects.toThrow();
  });
});
