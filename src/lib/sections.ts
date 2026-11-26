/**
 * Section navigation (sidebar "on this page" links). Pages mark sections with
 * `data-section="<label>"` and an `id`; see components/layout/Section.tsx.
 */
export type PageSection = { id: string; label: string };

/**
 * Which section is being read: the last one whose top has scrolled past `threshold`
 * pixels from the viewport top. At the very bottom of the page the last section wins,
 * so a short final section can still become active. Null before the first section.
 */
export function activeSectionId(
  tops: Array<{ id: string; top: number }>,
  threshold: number,
  atBottom: boolean,
): string | null {
  if (tops.length === 0) return null;
  if (atBottom) return tops[tops.length - 1].id;
  let active: string | null = null;
  for (const { id, top } of tops) {
    if (top <= threshold) active = id;
    else break;
  }
  return active;
}

export function sameSections(a: PageSection[], b: PageSection[]): boolean {
  return (
    a.length === b.length &&
    a.every((s, i) => s.id === b[i].id && s.label === b[i].label)
  );
}
