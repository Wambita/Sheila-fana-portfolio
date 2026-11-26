import { describe, expect, it } from "vitest";

import type { ItemSummary } from "@/lib/content/schemas";

import { itemWhen } from "./ItemRow";

// Fake items for testing only.
const base = {
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
} satisfies Omit<ItemSummary, "type">;

describe("itemWhen", () => {
  it("shows an open-ended role as ongoing", () => {
    expect(
      itemWhen({ ...base, type: "experience", startedOn: "2024-04-01" }),
    ).toBe("Apr 2024 – present");
  });

  it("never shows a one-off engagement as ongoing", () => {
    expect(
      itemWhen({ ...base, type: "engagement", startedOn: "2024-04-01" }),
    ).toBe("Apr 2024");
  });

  it("uses the year for publications and the month for credentials", () => {
    expect(itemWhen({ ...base, type: "publication", year: 2023 })).toBe("2023");
    expect(
      itemWhen({
        ...base,
        type: "certification",
        startedOn: "2023-06-01",
        endedOn: "2023-06-01",
      }),
    ).toBe("Jun 2023");
  });

  it("shows nothing when no date was given", () => {
    expect(itemWhen({ ...base, type: "publication" })).toBeNull();
  });
});
