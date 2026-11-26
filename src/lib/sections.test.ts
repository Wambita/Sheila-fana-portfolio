import { describe, expect, it } from "vitest";

import { activeSectionId, sameSections } from "./sections";

const tops = (...values: number[]) =>
  values.map((top, i) => ({ id: `s${i}`, top }));

describe("activeSectionId", () => {
  it("is null before the first section reaches the threshold", () => {
    expect(activeSectionId(tops(400, 900), 200, false)).toBeNull();
  });

  it("picks the last section that has passed the threshold", () => {
    expect(activeSectionId(tops(-500, 150, 600), 200, false)).toBe("s1");
    expect(activeSectionId(tops(-900, -300, 199), 200, false)).toBe("s2");
  });

  it("activates the last section at the bottom of the page", () => {
    expect(activeSectionId(tops(-300, 100, 500), 200, true)).toBe("s2");
  });

  it("handles pages without sections", () => {
    expect(activeSectionId([], 200, true)).toBeNull();
  });
});

describe("sameSections", () => {
  it("compares ids and labels in order", () => {
    const a = [{ id: "x", label: "X" }];
    expect(sameSections(a, [{ id: "x", label: "X" }])).toBe(true);
    expect(sameSections(a, [{ id: "x", label: "Y" }])).toBe(false);
    expect(sameSections(a, [])).toBe(false);
  });
});
