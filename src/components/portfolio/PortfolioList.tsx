import Link from "next/link";

import { ArrowRight } from "@/components/icons";
import type { Discipline } from "@/lib/content/schemas";
import { disciplineHref } from "@/lib/navigation";

/**
 * The disciplines as a gallery of tiles (ADR-020, ADR-024). Each tile is one link (the
 * stretched name) to a discipline's standalone page.
 */
export function PortfolioList({
  disciplines,
  headingLevel = "h3",
}: {
  disciplines: Discipline[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {disciplines.map((discipline, index) => (
        <li
          key={discipline.slug}
          className="group relative flex min-h-40 flex-col rounded-xl bg-tile p-6 transition-colors hover:bg-tile-hover md:p-8"
        >
          <span aria-hidden="true" className="font-mono text-xs text-fg-subtle">
            {String(index + 1).padStart(2, "0")}
          </span>
          <Heading className="mt-6 text-2xl md:text-[1.75rem]">
            <Link
              href={disciplineHref(discipline.slug)}
              className="no-underline after:absolute after:inset-0 after:rounded-xl hover:text-fg"
            >
              {discipline.name}
            </Link>
          </Heading>
          {discipline.tagline ? (
            <p className="mt-2 text-fg-muted">{discipline.tagline}</p>
          ) : null}
          <span
            aria-hidden="true"
            className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm text-fg-muted transition-colors group-hover:text-fg"
          >
            Explore
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </li>
      ))}
    </ol>
  );
}
