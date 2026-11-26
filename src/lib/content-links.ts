import type { ContentType } from "@/lib/content/tags";

/** Section headings and order for items grouped by type on a discipline page (doc 03). */
export const typeGroups: ReadonlyArray<{
  heading: string;
  types: readonly ContentType[];
}> = [
  { heading: "Projects", types: ["project"] },
  { heading: "Experience", types: ["experience", "engagement"] },
  { heading: "Writing", types: ["article"] },
  { heading: "Publications", types: ["publication"] },
  { heading: "Credentials", types: ["education", "certification"] },
];

/**
 * Where an item lives on the site, or null while its page doesn't exist yet. Only types
 * with a real destination get a link, so there are never links to missing pages.
 */
export function itemHref(type: ContentType, slug: string): string | null {
  switch (type) {
    case "project":
      return `/projects/${slug}`;
    default:
      // Experience, writing, publications and credentials pages arrive later in Phase 3.
      return null;
  }
}
