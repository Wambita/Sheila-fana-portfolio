import Link from "next/link";

import { ArrowRight } from "@/components/icons";
import type { ProjectSummary } from "@/lib/content/schemas";
import { formatDateRange } from "@/lib/format";

/**
 * One project as a gallery tile (ADR-020): tone instead of hairlines, a quiet index
 * number, a large serif title and summary, and plain-text metadata in its own column on
 * wide screens. The title link is stretched over the tile, so the whole tile is the
 * target while assistive tech still hears one link.
 */
export function ProjectCard({
  project,
  index,
  headingLevel = "h3",
}: {
  project: ProjectSummary;
  index?: number;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const dates = formatDateRange(project.startedOn, project.endedOn);

  return (
    <article className="group relative grid gap-x-8 gap-y-3 rounded-xl bg-tile p-6 transition-colors hover:bg-tile-hover md:grid-cols-[2.5rem_minmax(0,1fr)] md:p-8 xl:grid-cols-[2.5rem_minmax(0,1fr)_14rem]">
      {index !== undefined ? (
        <p
          aria-hidden="true"
          className="font-mono text-xs text-fg-subtle md:pt-2.5"
        >
          {String(index + 1).padStart(2, "0")}
        </p>
      ) : (
        <span className="hidden md:block" />
      )}
      <div className="min-w-0">
        <Heading className="text-2xl md:text-[1.75rem]">
          <Link
            href={`/projects/${project.slug}`}
            className="no-underline after:absolute after:inset-0 after:rounded-xl hover:text-fg"
          >
            {project.title}
          </Link>
        </Heading>
        {project.summary ? (
          <p className="mt-3 max-w-[60ch] text-fg-muted">{project.summary}</p>
        ) : null}
        <p
          aria-hidden="true"
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors group-hover:text-fg"
        >
          View project
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
      {project.role || dates || project.disciplines.length > 0 ? (
        <dl className="grid content-start gap-y-1 text-sm md:col-start-2 xl:col-start-3 xl:pt-2">
          {project.role ? (
            <div>
              <dt className="sr-only">Role</dt>
              <dd>{project.role}</dd>
            </div>
          ) : null}
          {dates ? (
            <div>
              <dt className="sr-only">Dates</dt>
              <dd className="text-fg-muted">{dates}</dd>
            </div>
          ) : null}
          {project.disciplines.length > 0 ? (
            <div>
              <dt className="sr-only">Disciplines</dt>
              <dd className="text-fg-muted">
                {project.disciplines.map((d) => d.name).join(", ")}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </article>
  );
}

export function ProjectList({
  projects,
  headingLevel,
}: {
  projects: ProjectSummary[];
  headingLevel?: "h2" | "h3";
}) {
  return (
    <ol className="flex flex-col gap-3">
      {projects.map((project, index) => (
        <li key={project.slug}>
          <ProjectCard
            project={project}
            index={index}
            headingLevel={headingLevel}
          />
        </li>
      ))}
    </ol>
  );
}
