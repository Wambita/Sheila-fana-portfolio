import type { Metadata } from "next";
import { Suspense } from "react";

import { ProjectList } from "@/components/content/ProjectCard";
import { ProjectFilters } from "@/components/content/ProjectFilters";
import { InDevelopment } from "@/components/layout/InDevelopment";
import { PageIntro } from "@/components/layout/PageIntro";
import { listProjects } from "@/lib/content";

export const metadata: Metadata = { title: "Work" };

export default async function Page() {
  const projects = await listProjects();
  if (projects.length === 0) return <InDevelopment title="Work" />;

  return (
    <>
      <PageIntro title="Work">
        <p>
          Projects across all portfolios, each with its context, role and
          evidence.
        </p>
      </PageIntro>
      {/* The full list is the static fallback; filters hydrate on top of it. */}
      <Suspense
        fallback={
          <>
            <p className="mb-6 text-sm text-fg-muted">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </p>
            <ProjectList projects={projects} headingLevel="h2" />
          </>
        }
      >
        <ProjectFilters projects={projects} />
      </Suspense>
    </>
  );
}
