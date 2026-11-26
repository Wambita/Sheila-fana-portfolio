import Link from "next/link";

import type { ProjectSummary } from "@/lib/content/schemas";
import { formatDateRange } from "@/lib/format";

/**
 * Project summary for lists (brand guide §6): title, role, dates and a short description.
 * Disciplines are plain-text metadata, not pills.
 */
export function ProjectCard({
  project,
  headingLevel = "h3",
}: {
  project: ProjectSummary;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const meta = [
    project.role,
    formatDateRange(project.startedOn, project.endedOn),
  ].filter(Boolean);

  return (
    <article className="border-t border-border pt-6">
      <Heading className="text-xl">
        <Link href={`/projects/${project.slug}`}>{project.title}</Link>
      </Heading>
      {meta.length > 0 ? (
        <p className="mt-1 text-sm text-fg-muted">{meta.join(" · ")}</p>
      ) : null}
      {project.summary ? (
        <p className="mt-3 max-w-[68ch]">{project.summary}</p>
      ) : null}
      {project.disciplines.length > 0 ? (
        <p className="mt-3 text-sm text-fg-muted">
          <span className="sr-only">Disciplines: </span>
          {project.disciplines.map((d) => d.name).join(", ")}
        </p>
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
    <ul className="flex max-w-[68ch] flex-col gap-8">
      {projects.map((project) => (
        <li key={project.slug}>
          <ProjectCard project={project} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
