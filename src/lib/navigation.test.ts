import { describe, expect, it } from "vitest";
import { isActive } from "./navigation";

describe("isActive", () => {
  it("matches the exact page and its children", () => {
    expect(isActive("/projects", "/projects")).toBe(true);
    expect(isActive("/projects", "/projects/some-project")).toBe(true);
  });

  it("does not match sibling paths sharing a prefix", () => {
    expect(isActive("/projects", "/projects-archive")).toBe(false);
  });

  it("treats home as exact-match only", () => {
    expect(isActive("/", "/")).toBe(true);
    expect(isActive("/", "/about")).toBe(false);
  });

  it("handles a missing pathname", () => {
    expect(isActive("/about", null)).toBe(false);
  });
});
