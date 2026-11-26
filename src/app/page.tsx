import Link from "next/link";

import { ProjectList } from "@/components/content/ProjectCard";
import { Section } from "@/components/layout/Section";
import { getProfile, listDisciplines, listProjects } from "@/lib/content";
import { site } from "@/lib/site";

const FEATURED_LIMIT = 3;

/**
 * Recruiter-useful first screen (FR-01): who Sheila is, what she does, selected work and
 * where to explore next. Typography-led until a portrait exists (brand guide §7).
 * Sections without published content are hidden.
 */
export default async function Home() {
  const [profile, disciplines, projects] = await Promise.all([
    getProfile(),
    listDisciplines(),
    listProjects(),
  ]);
  const featured = projects
    .filter((project) => project.featured)
    .slice(0, FEATURED_LIMIT);

  return (
    <>
      <header className="max-w-[22ch] md:pt-6">
        <h1 className="text-[clamp(2.75rem,1.8rem+4vw,5.25rem)] leading-[1.02] tracking-[-0.02em]">
          {profile?.fullName ?? site.name}
        </h1>
      </header>
      <p className="mt-8 max-w-[52ch] text-lg text-fg-muted md:text-xl">
        {profile?.headline ?? site.positioning}
      </p>

      {featured.length > 0 ? (
        <Section id="selected-work" title="Selected work">
          <ProjectList projects={featured} />
          <p className="mt-8">
            <Link href="/projects">All work</Link>
          </p>
        </Section>
      ) : null}

      {disciplines.length > 0 ? (
        <Section id="disciplines" title="Disciplines">
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {disciplines.map((discipline) => (
              <li key={discipline.slug} className="border-t border-border">
                <Link
                  href={`/disciplines/${discipline.slug}`}
                  className="flex min-h-14 items-center text-lg decoration-fg-subtle hover:decoration-current"
                >
                  {discipline.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section id="get-in-touch" title="Get in touch">
        <p>
          <Link href="/contact">Contact Sheila</Link>
        </p>
      </Section>
    </>
  );
}
