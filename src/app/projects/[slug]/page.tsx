import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Prose } from "@/components/content/Prose";
import { Loading } from "@/components/layout/Loading";
import { getProject, listProjects, type EvidenceSection } from "@/lib/content";
import { formatDateRange } from "@/lib/format";
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
    <article className="max-w-[68ch]">
      <p className="mb-4 text-sm">
        <Link href="/projects">All work</Link>
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
      <h1 className="text-3xl sm:text-4xl">{project.title}</h1>
      {project.summary ? (
        <p className="mt-4 text-lg text-fg-muted">{project.summary}</p>
      ) : null}

      {facts.length > 0 ? (
        <dl className="mt-8 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 border-t border-border pt-6 text-sm">
          {facts.map(({ term, value }) => (
            <div key={term} className="contents">
              <dt className="text-fg-muted">{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {project.disciplines.length > 0 ? (
        <p className="mt-4 text-sm">
          <span className="text-fg-muted">Disciplines: </span>
          {project.disciplines.map((d, index) => (
            <span key={d.slug}>
              {index > 0 ? ", " : null}
              <Link href={`/disciplines/${d.slug}`}>{d.name}</Link>
            </span>
          ))}
        </p>
      ) : null}

      {project.repoUrl || project.demoUrl ? (
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {project.repoUrl ? (
            <li>
              <a href={project.repoUrl}>Source code</a>
            </li>
          ) : null}
          {project.demoUrl ? (
            <li>
              <a href={project.demoUrl}>Live demo</a>
            </li>
          ) : null}
        </ul>
      ) : null}

      {project.body ? <Prose text={project.body} className="mt-10" /> : null}

      {project.evidence.map(({ section, text }) => (
        <section
          key={section}
          aria-labelledby={`${section}-heading`}
          className="mt-10"
        >
          <h2 id={`${section}-heading`} className="text-2xl">
            {evidenceHeadings[section]}
          </h2>
          <Prose text={text} className="mt-3" />
        </section>
      ))}

      {project.highlights.length > 0 ? (
        <section aria-labelledby="highlights-heading" className="mt-10">
          <h2 id="highlights-heading" className="text-2xl">
            Highlights
          </h2>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
            {project.highlights.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
