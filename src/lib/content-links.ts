import type { ContentType } from "@/lib/content/tags";

/**
 * Where an item lives on this site, or null while it has no page of its own. Items
 * without a page link to their canonical source instead (see ItemRow), so there are
 * never links to missing pages.
 */
export function itemHref(type: ContentType, slug: string): string | null {
  switch (type) {
    case "project":
      return `/projects/${slug}`;
    default:
      return null;
  }
}
