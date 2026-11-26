import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Prose } from "@/components/content/Prose";
import { Loading } from "@/components/layout/Loading";
import { Section } from "@/components/layout/Section";
import {
  getDiscipline,
  listDisciplines,
  listItemsForDiscipline,
} from "@/lib/content";
import { itemHref, typeGroups } from "@/lib/content-links";
import { placeholderParam } from "@/lib/static-params";

export async function generateStaticParams() {
  const disciplines = await listDisciplines();
  return placeholderParam(disciplines.map(({ slug }) => ({ slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/disciplines/[slug]">): Promise<Metadata> {
  const discipline = await getDiscipline((await params).slug);
  if (!discipline) return { title: "Page not found" };
  return {
    title: discipline.name,
    description: discipline.tagline ?? undefined,
  };
}

/**
 * One template for every discipline (FR-03): the data decides what appears. The back
 * link is the instant static shell; slug-dependent content streams in behind Suspense.
 */
export default function Page({ params }: PageProps<"/disciplines/[slug]">) {
  return (
    <>
      <p className="mb-5 font-mono text-xs">
        <Link href="/disciplines">← All disciplines</Link>
      </p>
      <Suspense fallback={<Loading />}>
        <DisciplineContent params={params} />
      </Suspense>
    </>
  );
}

async function DisciplineContent({
  params,
}: Pick<PageProps<"/disciplines/[slug]">, "params">) {
  const { slug } = await params;
  const discipline = await getDiscipline(slug);
  if (!discipline) notFound();

  const items = await listItemsForDiscipline(slug);
  const groups = typeGroups
    .map((group) => ({
      ...group,
      items: items.filter((item) => group.types.includes(item.type)),
    }))
    // Empty groups are hidden (doc 03).
    .filter((group) => group.items.length > 0);

  return (
    <>
      <header className="max-w-[68ch]">
        <h1 className="text-[clamp(2.25rem,1.6rem+2.6vw,3.75rem)] leading-[1.08]">
          {discipline.name}
        </h1>
        {discipline.tagline ? (
          <p className="mt-5 text-lg text-fg-muted md:text-xl">
            {discipline.tagline}
          </p>
        ) : null}
        {discipline.intro ? (
          <Prose text={discipline.intro} className="mt-8" />
        ) : null}
      </header>

      {groups.length === 0 ? (
        <p className="mt-16 max-w-[68ch]">
          Work for this discipline will appear here once it has been reviewed.
        </p>
      ) : (
        groups.map((group) => (
          <Section
            key={group.heading}
            id={group.heading.toLowerCase()}
            title={group.heading}
          >
            <ol className="border-b border-border">
              {group.items.map((item, index) => {
                const href = itemHref(item.type, item.slug);
                const note = item.emphasisNote ?? item.summary;
                return (
                  <li
                    key={`${item.type}:${item.slug}`}
                    className="grid gap-x-8 gap-y-2 border-t border-border py-6 md:grid-cols-[2.5rem_minmax(0,1fr)]"
                  >
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs text-fg-subtle md:pt-1.5"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="max-w-[68ch] min-w-0">
                      <h3 className="text-xl">
                        {href ? (
                          <Link
                            href={href}
                            className="decoration-fg-subtle hover:decoration-current"
                          >
                            {item.title}
                          </Link>
                        ) : (
                          item.title
                        )}
                      </h3>
                      {note ? (
                        <p className="mt-2 text-fg-muted">{note}</p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Section>
        ))
      )}
    </>
  );
}
