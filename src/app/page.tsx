import Link from "next/link";

import { Prose } from "@/components/content/Prose";
import { ArrowRight } from "@/components/icons";
import { ProjectList } from "@/components/content/ProjectCard";
import { Section } from "@/components/layout/Section";
import { ItemList } from "@/components/portfolio/ItemRow";
import { PortfolioList } from "@/components/portfolio/PortfolioList";
import {
  getProfile,
  listDisciplines,
  listFeaturedExperience,
  listProjects,
  listSkillOverview,
} from "@/lib/content";
import { disciplineHref, recordPages } from "@/lib/navigation";
import { pickAcrossDisciplines } from "@/lib/portfolio";
import { site } from "@/lib/site";

const SELECTED_PROJECTS = 4;
const KEY_EXPERIENCE = 4;

/**
 * The overall portfolio summary (ADR-019): who Sheila is, the disciplines she works in
 * (each a standalone portfolio), selected work across them, key skills and experience,
 * and the full record. A snapshot, not a copy of each portfolio. Sections without
 * published content are hidden. The CV download appears once the CV exists (Phase 5).
 */
export default async function Home() {
  const [profile, disciplines, projects, skillOverview, experience] =
    await Promise.all([
      getProfile(),
      listDisciplines(),
      listProjects(),
      listSkillOverview(),
      listFeaturedExperience(),
    ]);
  const selected = pickAcrossDisciplines(projects, SELECTED_PROJECTS);
  const keyExperience = experience.slice(0, KEY_EXPERIENCE);

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
      {profile?.overview ? (
        <Prose text={profile.overview} className="mt-8" />
      ) : null}

      {disciplines.length > 0 ? (
        <Section id="disciplines" title="Disciplines">
          <PortfolioList disciplines={disciplines} />
        </Section>
      ) : null}

      {selected.length > 0 ? (
        <Section id="selected-work" title="Selected work">
          <ProjectList projects={selected} />
          <p className="mt-8">
            <Link href="/projects">All projects</Link>
          </p>
        </Section>
      ) : null}

      {skillOverview.length > 0 ? (
        <Section id="skills" title="Skills">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {skillOverview.map((category) => (
              <div
                key={category.slug}
                className="flex flex-col rounded-xl bg-tile p-6"
              >
                <h3 className="text-xl">{category.name}</h3>
                <p className="mt-2 text-fg-muted">
                  {category.skills.map((s) => s.name).join(", ")}
                </p>
                {category.discipline ? (
                  <p className="mt-auto pt-4 text-sm">
                    <Link
                      href={disciplineHref(category.discipline.slug)}
                      className="inline-flex items-center gap-1.5"
                    >
                      Explore {category.discipline.name}
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {keyExperience.length > 0 ? (
        <Section id="experience" title="Key experience">
          <ItemList items={keyExperience} showSummary={false} />
          <p className="mt-8">
            <Link href="/experience">All experience</Link>
          </p>
        </Section>
      ) : null}

      <Section id="full-record" title="Full record">
        <p className="max-w-[60ch] text-fg-muted">
          Everything across all disciplines, including work that sits outside
          them.
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          {recordPages.map((page) => (
            <li key={page.href}>
              <Link href={page.href}>{page.label}</Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
