import Link from "next/link";

import type { ItemSummary } from "@/lib/content/schemas";
import { itemHref } from "@/lib/content-links";
import { formatDateRange, formatMonthYear } from "@/lib/format";

/** When the item happened, as plain text: a range, a single month or a year. */
export function itemWhen(item: ItemSummary): string | null {
  if (item.type === "certification" || item.type === "article") {
    return item.startedOn ? formatMonthYear(item.startedOn) : null;
  }
  if (item.type === "publication") return item.year ? String(item.year) : null;
  // Engagements are one-off activities: no end date means a single date, never
  // "present" (that would claim something is ongoing).
  if (item.type === "engagement" && item.startedOn && !item.endedOn) {
    return formatMonthYear(item.startedOn);
  }
  return formatDateRange(item.startedOn, item.endedOn);
}

/**
 * One item in a portfolio or shared list: a date column (mono) and the title, with
 * role / organisation and a short note. Titles link to the item's page on this site
 * when there is one, otherwise to its canonical source (publication, credential
 * verification, original article).
 */
export function ItemRow({
  item,
  headingLevel = "h3",
  showSummary = true,
}: {
  item: ItemSummary;
  headingLevel?: "h2" | "h3" | "h4";
  showSummary?: boolean;
}) {
  const Heading = headingLevel;
  const href = itemHref(item.type, item.slug);
  const when = itemWhen(item);
  const byline = [item.role, item.organisation].filter(Boolean).join(" · ");
  const note = item.emphasisNote ?? (showSummary ? item.summary : null);

  return (
    <li className="grid gap-x-8 gap-y-1 border-t border-border py-6 md:grid-cols-[9rem_minmax(0,1fr)]">
      <p className="font-mono text-xs text-fg-subtle md:pt-1.5">
        {when ?? <span className="sr-only">Date not given</span>}
      </p>
      <div className="max-w-[68ch] min-w-0">
        <Heading className="text-xl">
          {href ? (
            <Link
              href={href}
              className="decoration-fg-subtle hover:decoration-current"
            >
              {item.title}
            </Link>
          ) : item.externalUrl ? (
            <a
              href={item.externalUrl}
              className="decoration-fg-subtle hover:decoration-current"
            >
              {item.title}
              <span aria-hidden="true"> ↗</span>
              <span className="sr-only"> (external site)</span>
            </a>
          ) : (
            item.title
          )}
        </Heading>
        {byline ? <p className="mt-1 text-sm text-fg-muted">{byline}</p> : null}
        {note ? <p className="mt-2 text-fg-muted">{note}</p> : null}
      </div>
    </li>
  );
}

export function ItemList({
  items,
  headingLevel,
  showSummary,
}: {
  items: ItemSummary[];
  headingLevel?: "h2" | "h3" | "h4";
  showSummary?: boolean;
}) {
  return (
    <ol className="border-b border-border">
      {items.map((item) => (
        <ItemRow
          key={`${item.type}:${item.slug}`}
          item={item}
          headingLevel={headingLevel}
          showSummary={showSummary}
        />
      ))}
    </ol>
  );
}
