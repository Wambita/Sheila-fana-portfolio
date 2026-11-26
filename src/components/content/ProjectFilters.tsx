"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useMemo } from "react";

import type { ProjectSummary } from "@/lib/content/schemas";
import {
  filterOptions,
  filterProjects,
  filtersFromParams,
  filtersToQuery,
  type ProjectFilterState,
} from "@/lib/project-filters";

import { ProjectList } from "./ProjectCard";

/**
 * Filter bar for the projects index (FR-04). Filters live in the URL so a filtered view
 * is shareable. The server renders the full list as the Suspense fallback, so the page
 * works without JavaScript; this component takes over once it hydrates.
 */
export function ProjectFilters({ projects }: { projects: ProjectSummary[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = useId();

  const options = useMemo(() => filterOptions(projects), [projects]);
  const filters = filtersFromParams(
    new URLSearchParams(searchParams.toString()),
    options,
  );
  const visible = filterProjects(projects, filters);
  const active = Object.values(filters).some(Boolean);

  function update(next: Partial<ProjectFilterState>) {
    router.replace(`${pathname}${filtersToQuery({ ...filters, ...next })}`, {
      scroll: false,
    });
  }

  const fields = [
    { key: "discipline", label: "Discipline", list: options.disciplines },
    { key: "technology", label: "Technology", list: options.technologies },
    { key: "year", label: "Year", list: options.years },
  ] as const;

  return (
    <>
      <form
        role="search"
        aria-label="Filter projects"
        className="mb-10 flex flex-wrap items-end gap-x-4 gap-y-3"
        onSubmit={(event) => event.preventDefault()}
      >
        {fields.map(({ key, label, list }) =>
          list.length > 1 ? (
            <div key={key} className="flex flex-col gap-1">
              <label
                htmlFor={`${id}-${key}`}
                className="font-mono text-xs text-fg-muted"
              >
                {label}
              </label>
              <select
                id={`${id}-${key}`}
                value={filters[key]}
                onChange={(event) => update({ [key]: event.target.value })}
                className="min-h-11 min-w-44 rounded-md border border-control bg-surface px-3 text-fg transition-colors hover:bg-surface-2"
              >
                <option value="">All</option>
                {list.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null,
        )}
        {active ? (
          <button
            type="button"
            onClick={() => update({ discipline: "", technology: "", year: "" })}
            className="min-h-11 px-1 text-sm text-link underline underline-offset-[0.22em] hover:text-link-hover"
          >
            Clear filters
          </button>
        ) : null}
      </form>

      <p role="status" className="mb-6 text-sm text-fg-muted">
        {active
          ? `Showing ${visible.length} of ${projects.length} projects`
          : `${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
      </p>

      {visible.length > 0 ? (
        <ProjectList projects={visible} headingLevel="h2" />
      ) : (
        <p>No projects match these filters.</p>
      )}
    </>
  );
}
