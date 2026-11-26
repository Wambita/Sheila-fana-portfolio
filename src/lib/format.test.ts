import { describe, expect, it } from "vitest";

import { formatDateRange, formatMonthYear, paragraphs, yearOf } from "./format";

describe("formatMonthYear", () => {
  it("formats in UTC so dates never shift", () => {
    expect(formatMonthYear("2024-01-01")).toBe("Jan 2024");
    expect(formatMonthYear("2026-04-30")).toBe("Apr 2026");
  });
});

describe("formatDateRange", () => {
  it("formats a closed range", () => {
    expect(formatDateRange("2024-04-01", "2026-04-01")).toBe(
      "Apr 2024 – Apr 2026",
    );
  });

  it("marks an open range as ongoing", () => {
    expect(formatDateRange("2024-04-01", null)).toBe("Apr 2024 – present");
  });

  it("collapses a range within one month", () => {
    expect(formatDateRange("2024-04-01", "2024-04-20")).toBe("Apr 2024");
  });

  it("never guesses a missing start", () => {
    expect(formatDateRange(null, null)).toBeNull();
    expect(formatDateRange(null, "2024-04-01")).toBe("Apr 2024");
  });
});

describe("yearOf", () => {
  it("reads the year", () => {
    expect(yearOf("2025-12-31")).toBe(2025);
    expect(yearOf(null)).toBeNull();
  });
});

describe("paragraphs", () => {
  it("splits on blank lines and drops empty ones", () => {
    expect(paragraphs("One\nstill one\n\n\nTwo\r\n\r\nThree ")).toEqual([
      "One\nstill one",
      "Two",
      "Three",
    ]);
  });
});
