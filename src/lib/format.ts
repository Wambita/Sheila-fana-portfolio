/**
 * Formatting for content metadata. Dates arrive as ISO `YYYY-MM-DD` strings and are
 * formatted in UTC so the output never shifts with the server's or reader's timezone.
 */

const monthYear = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatMonthYear(isoDate: string): string {
  return monthYear.format(new Date(`${isoDate}T00:00:00Z`));
}

/** Year of an ISO date string, or null. */
export function yearOf(isoDate: string | null): number | null {
  return isoDate ? Number(isoDate.slice(0, 4)) : null;
}

/**
 * "Jan 2024 – Apr 2026", "Jan 2024 – present" (no end), or "Jan 2024" (same month).
 * Returns null when there is no start date; nothing is guessed.
 */
export function formatDateRange(
  startedOn: string | null,
  endedOn: string | null,
  { ongoingLabel = "present" }: { ongoingLabel?: string } = {},
): string | null {
  if (!startedOn) return endedOn ? formatMonthYear(endedOn) : null;
  const start = formatMonthYear(startedOn);
  if (!endedOn) return `${start} – ${ongoingLabel}`;
  const end = formatMonthYear(endedOn);
  return start === end ? start : `${start} – ${end}`;
}

/** Splits plain text into paragraphs on blank lines. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
