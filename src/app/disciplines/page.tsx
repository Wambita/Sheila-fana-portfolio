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
      <ul className="flex max-w-[68ch] flex-col gap-6">
        {disciplines.map((discipline) => (
          <li key={discipline.slug} className="border-t border-border pt-6">
            <h2 className="text-xl">
              <Link href={`/disciplines/${discipline.slug}`}>
                {discipline.name}
              </Link>
            </h2>
            {discipline.tagline ? (
              <p className="mt-2 text-fg-muted">{discipline.tagline}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
}
