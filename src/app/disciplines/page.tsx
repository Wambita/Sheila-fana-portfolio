import type { Metadata } from "next";
import Link from "next/link";

import { InDevelopment } from "@/components/layout/InDevelopment";
import { PageIntro } from "@/components/layout/PageIntro";
import { listDisciplines } from "@/lib/content";

export const metadata: Metadata = { title: "Disciplines" };

export default async function Page() {
  const disciplines = await listDisciplines();
  if (disciplines.length === 0) return <InDevelopment title="Disciplines" />;

  return (
    <>
      <PageIntro title="Disciplines">
        <p>One body of work, organised by discipline.</p>
      </PageIntro>
      <ol className="border-b border-border">
        {disciplines.map((discipline, index) => (
          <li
            key={discipline.slug}
            className="grid gap-x-8 gap-y-2 border-t border-border py-8 md:grid-cols-[2.5rem_minmax(0,1fr)] xl:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,1fr)]"
          >
            <span
              aria-hidden="true"
              className="font-mono text-xs text-fg-subtle md:pt-2.5"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="text-2xl md:text-[1.75rem]">
              <Link
                href={`/disciplines/${discipline.slug}`}
                className="decoration-fg-subtle hover:decoration-current"
              >
                {discipline.name}
              </Link>
            </h2>
            {discipline.tagline ? (
              <p className="text-fg-muted md:col-start-2 xl:col-start-3 xl:pt-2">
                {discipline.tagline}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </>
  );
}
