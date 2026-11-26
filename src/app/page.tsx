import Link from "next/link";

import { ProjectList } from "@/components/content/ProjectCard";
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
    <div className="max-w-[68ch]">
      <h1 className="text-4xl sm:text-5xl">{profile?.fullName ?? site.name}</h1>
      <p className="mt-6 text-xl text-fg-muted">
        {profile?.headline ?? site.positioning}
      </p>

      {disciplines.length > 0 ? (
        <section
          aria-labelledby="disciplines-heading"
          className="mt-14 border-t border-border pt-8"
        >
          <h2 id="disciplines-heading" className="text-2xl">
            Disciplines
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {disciplines.map((discipline) => (
              <li key={discipline.slug}>
                <Link href={`/disciplines/${discipline.slug}`}>
                  {discipline.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {featured.length > 0 ? (
        <section
          aria-labelledby="featured-heading"
          className="mt-14 border-t border-border pt-8"
        >
          <h2 id="featured-heading" className="text-2xl">
            Selected work
          </h2>
          <div className="mt-6">
            <ProjectList projects={featured} />
          </div>
          <p className="mt-8">
            <Link href="/projects">All work</Link>
          </p>
        </section>
      ) : null}

      <section
        aria-labelledby="contact-heading"
        className="mt-14 border-t border-border pt-8"
      >
        <h2 id="contact-heading" className="text-2xl">
          Get in touch
        </h2>
        <p className="mt-4">
          <Link href="/contact">Contact Sheila</Link>
        </p>
      </section>
    </div>
  );
}
