import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Prose } from "@/components/content/Prose";
import { ArrowUpRight } from "@/components/icons";
import { Loading } from "@/components/layout/Loading";
import { Section } from "@/components/layout/Section";
import { getProject, listProjects, type EvidenceSection } from "@/lib/content";
import { formatDateRange } from "@/lib/format";
import { portfolioHref } from "@/lib/navigation";
import { placeholderParam } from "@/lib/static-params";

const evidenceHeadings: Record<EvidenceSection, string> = {
  context: "Context",
  problem: "Problem",
  process: "Process",
  decisions: "Decisions",
  implementation: "Implementation",
  outcomes: "Outcomes",
};

export async function generateStaticParams() {
  const projects = await listProjects();
  return placeholderParam(projects.map(({ slug }) => ({ slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return { title: "Page not found" };
  return {
    title: project.seo.title ?? project.title,
    description: project.seo.description ?? project.summary ?? undefined,
  };
}

/**
 * The static shell (back link) renders instantly on navigation; slug-dependent content
 * streams in behind Suspense (Partial Prefetching). Prerendered slugs are fully static.
 */
export default function Page({ params }: PageProps<"/projects/[slug]">) {
  return (
    <article>
      <p className="mb-5 font-mono text-xs">
        <Link href="/projects">← All work</Link>
      </p>
      <Suspense fallback={<Loading />}>
        <ProjectContent params={params} />
      </Suspense>
    </article>
  );
}

async function ProjectContent({
  params,
}: Pick<PageProps<"/projects/[slug]">, "params">) {
  const project = await getProject((await params).slug);
  if (!project) notFound();

  const dates = formatDateRange(project.startedOn, project.endedOn);
  const facts = [
    { term: "Role", value: project.role },
    { term: "Dates", value: dates },
    { term: "Status", value: project.projectStatus },
    {
      term: "Technologies",
      value: project.skills.map((s) => s.name).join(", ") || null,
    },
  ].filter((fact): fact is { term: string; value: string } => !!fact.value);

  return (
    <>
      <header className="max-w-[68ch]">
        <h1 className="text-[clamp(2.25rem,1.6rem+2.6vw,3.75rem)] leading-[1.08]">
          {project.title}
        </h1>
        {project.summary ? (
          <p className="mt-5 text-lg text-fg-muted md:text-xl">
            {project.summary}
          </p>
        ) : null}
      </header>

      {/* Key facts: a quiet index, spreading into columns on wider screens. */}
      {facts.length > 0 || project.disciplines.length > 0 ? (
        <dl className="mt-12 grid gap-x-10 gap-y-6 rounded-xl bg-tile p-6 text-sm sm:grid-cols-2 md:p-8 xl:grid-cols-4">
          {facts.map(({ term, value }) => (
            <div key={term}>
              <dt className="font-mono text-xs text-fg-subtle">{term}</dt>
              <dd className="mt-1.5">{value}</dd>
            </div>
          ))}
          {project.disciplines.length > 0 ? (
            <div>
              <dt className="font-mono text-xs text-fg-subtle">Portfolios</dt>
              <dd className="mt-1.5">
                {project.disciplines.map((d, index) => (
                  <span key={d.slug}>
                    {index > 0 ? ", " : null}
                    <Link href={portfolioHref(d.slug)}>{d.name}</Link>
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {project.repoUrl || project.demoUrl ? (
        <ul className="mt-8 flex flex-wrap gap-3 text-sm">
          {project.repoUrl ? (
            <li>
              <a
                href={project.repoUrl}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-tile px-5 no-underline hover:bg-tile-hover hover:text-fg"
              >
                Source code
                <ArrowUpRight />
              </a>
            </li>
          ) : null}
          {project.demoUrl ? (
            <li>
              <a
                href={project.demoUrl}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-on-accent no-underline hover:bg-accent-hover hover:text-on-accent"
              >
                Live demo
                <ArrowUpRight />
              </a>
            </li>
          ) : null}
        </ul>
      ) : null}

      <div className="max-w-[68ch]">
        {project.body ? <Prose text={project.body} className="mt-12" /> : null}

        {project.evidence.map(({ section, text }) => (
          <Section key={section} id={section} title={evidenceHeadings[section]}>
            <Prose text={text} />
          </Section>
        ))}

        {project.highlights.length > 0 ? (
          <Section id="highlights" title="Highlights">
            <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-fg-subtle">
              {project.highlights.map((text, index) => (
                <li key={index}>{text}</li>
              ))}
            </ul>
          </Section>
        ) : null}
      </div>
    </>
  );
}
