import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Prose } from "@/components/content/Prose";
import { Loading } from "@/components/layout/Loading";
import { PortfolioBlocks } from "@/components/portfolio/PortfolioBlocks";
import {
  getDiscipline,
  listDisciplineSkills,
  listDisciplines,
  listItemsForDiscipline,
} from "@/lib/content";
import { buildPortfolio } from "@/lib/portfolio";
import { placeholderParam } from "@/lib/static-params";

export async function generateStaticParams() {
  const disciplines = await listDisciplines();
  return placeholderParam(disciplines.map(({ slug }) => ({ slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const discipline = await getDiscipline((await params).slug);
  if (!discipline) return { title: "Page not found" };
  return {
    title: discipline.name,
    description: discipline.tagline ?? undefined,
  };
}

/**
 * A standalone, shareable portfolio for one discipline (ADR-019). One template for every
 * discipline (FR-03), but each discipline's data decides which sections appear and in
 * what order, so the page can follow the nature of the field. The back link is the
 * instant static shell; slug-dependent content streams in behind Suspense.
 */
export default function Page({ params }: PageProps<"/portfolio/[slug]">) {
  return (
    <>
      {/* No link away from the portfolio: a shared link should stand on its own. */}
      <p className="mb-5 font-mono text-xs text-fg-subtle">Portfolio</p>
      <Suspense fallback={<Loading />}>
        <PortfolioContent params={params} />
      </Suspense>
    </>
  );
}

async function PortfolioContent({
  params,
}: Pick<PageProps<"/portfolio/[slug]">, "params">) {
  const { slug } = await params;
  const [discipline, items, skills] = await Promise.all([
    getDiscipline(slug),
    listItemsForDiscipline(slug),
    listDisciplineSkills(slug),
  ]);
  if (!discipline) notFound();

  const blocks = buildPortfolio(discipline, items, skills);

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

      {blocks.length === 0 ? (
        <p className="mt-16 max-w-[68ch]">
          Work for this portfolio will appear here once it has been reviewed.
        </p>
      ) : (
        <PortfolioBlocks blocks={blocks} />
      )}
    </>
  );
}
