import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Prose } from "@/components/content/Prose";
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

/** One template for every discipline (FR-03): the data decides what appears. */
export default async function Page({
  params,
}: PageProps<"/disciplines/[slug]">) {
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
      <div className="mb-10 max-w-[68ch]">
        <p className="mb-4 text-sm">
          <Link href="/disciplines">All disciplines</Link>
        </p>
        <h1 className="text-3xl sm:text-4xl">{discipline.name}</h1>
        {discipline.tagline ? (
          <p className="mt-4 text-lg text-fg-muted">{discipline.tagline}</p>
        ) : null}
        {discipline.intro ? (
          <Prose text={discipline.intro} className="mt-6" />
        ) : null}
      </div>

      {groups.length === 0 ? (
        <p className="max-w-[68ch]">
          Work for this discipline will appear here once it has been reviewed.
        </p>
      ) : (
        groups.map((group) => (
          <section
            key={group.heading}
            aria-labelledby={`group-${group.heading}`}
            className="mt-12 max-w-[68ch]"
          >
            <h2 id={`group-${group.heading}`} className="text-2xl">
              {group.heading}
            </h2>
            <ul className="mt-4 flex flex-col gap-6">
              {group.items.map((item) => {
                const href = itemHref(item.type, item.slug);
                return (
                  <li
                    key={`${item.type}:${item.slug}`}
                    className="border-t border-border pt-4"
                  >
                    <h3 className="text-lg">
                      {href ? (
                        <Link href={href}>{item.title}</Link>
                      ) : (
                        item.title
                      )}
                    </h3>
                    {(item.emphasisNote ?? item.summary) ? (
                      <p className="mt-1">
                        {item.emphasisNote ?? item.summary}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </>
  );
}
