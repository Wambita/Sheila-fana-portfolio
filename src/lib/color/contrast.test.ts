import { describe, expect, it } from "vitest";
import { contrastRatio, relativeLuminance } from "./contrast";

describe("contrast", () => {
  it("computes the extremes", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1);
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#47796f", "#f5f3ed")).toBeCloseTo(
      contrastRatio("#f5f3ed", "#47796f"),
    );
  });

  it("matches the Phase 0 measurement of the original Research Teal on Warm Paper", () => {
    expect(contrastRatio("#47796f", "#f5f3ed")).toBeCloseTo(4.47, 2);
  });

  it("rejects malformed colours", () => {
    expect(() => relativeLuminance("teal")).toThrow();
  });
});
