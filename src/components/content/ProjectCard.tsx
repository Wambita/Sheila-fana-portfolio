import Link from "next/link";

import type { ProjectSummary } from "@/lib/content/schemas";
import { formatDateRange } from "@/lib/format";

/**
 * One project as an editorial row rather than a card (brand guide §5–6): a quiet index
 * number, a large serif title and summary, and plain-text metadata that moves into its
 * own column on wide screens. Disciplines are text, not pills.
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
    <article className="grid gap-x-8 gap-y-3 border-t border-border py-8 md:grid-cols-[2.5rem_minmax(0,1fr)] xl:grid-cols-[2.5rem_minmax(0,1fr)_14rem]">
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
            className="decoration-fg-subtle hover:decoration-current"
          >
            {project.title}
          </Link>
        </Heading>
        {project.summary ? (
          <p className="mt-3 max-w-[60ch] text-fg-muted">{project.summary}</p>
        ) : null}
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
    <ol className="border-b border-border">
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
