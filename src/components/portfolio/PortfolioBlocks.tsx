import Link from "next/link";

import { Section } from "@/components/layout/Section";
import type { ItemSummary } from "@/lib/content/schemas";
import { formatDateRange } from "@/lib/format";
import {
  sectionNavLabels,
  sectionTitles,
  skillKindTitles,
  type PortfolioBlock,
  type SkillGroup,
} from "@/lib/portfolio";

import { ItemList } from "./ItemRow";

/** Renders a discipline portfolio's sections in the order the discipline chose. */
export function PortfolioBlocks({ blocks }: { blocks: PortfolioBlock[] }) {
  return blocks.map((block) => (
    <Section
      key={block.key}
      id={block.key.replace("_", "-")}
      title={sectionTitles[block.key]}
      navLabel={sectionNavLabels[block.key] ?? sectionTitles[block.key]}
    >
      {block.key === "capabilities" ? (
        <Capabilities capabilities={block.capabilities} />
      ) : block.key === "skills" ? (
        <Skills groups={block.groups} />
      ) : block.key === "case_studies" ? (
        <CaseStudies items={block.items} />
      ) : (
        <ItemList items={block.items} />
      )}
    </Section>
  ));
}

function Capabilities({ capabilities }: { capabilities: string[] }) {
  return (
    <ol className="grid gap-x-10 border-b border-border md:grid-cols-2">
      {capabilities.map((capability, index) => (
        <li key={index} className="flex gap-6 border-t border-border py-4">
          <span
            aria-hidden="true"
            className="pt-1 font-mono text-xs text-fg-subtle"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{capability}</span>
        </li>
      ))}
    </ol>
  );
}

/** Grouped by kind as plain lists, not badges (brand guide §6). */
function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
      {groups.map(({ kind, skills }) => (
        <div key={kind}>
          <h3 className="font-mono text-xs font-normal text-fg-subtle">
            {skillKindTitles[kind]}
          </h3>
          <ul className="mt-3 border-b border-border">
            {skills.map((skill) => (
              <li key={skill.slug} className="border-t border-border py-2.5">
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Featured projects for this portfolio, given more room than the plain list. */
function CaseStudies({ items }: { items: ItemSummary[] }) {
  return (
    <ol className="border-b border-border">
      {items.map((item, index) => {
        const dates = formatDateRange(item.startedOn, item.endedOn);
        const meta = [item.role, dates].filter(Boolean).join(" · ");
        return (
          <li
            key={item.slug}
            className="grid gap-x-8 gap-y-3 border-t border-border py-10 md:grid-cols-[2.5rem_minmax(0,1fr)]"
          >
            <span
              aria-hidden="true"
              className="font-mono text-xs text-fg-subtle md:pt-3"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="max-w-[68ch] min-w-0">
              <h3 className="text-[clamp(1.6rem,1.3rem+1vw,2.25rem)] leading-tight">
                <Link
                  href={`/projects/${item.slug}`}
                  className="decoration-fg-subtle hover:decoration-current"
                >
                  {item.title}
                </Link>
              </h3>
              {meta ? (
                <p className="mt-2 text-sm text-fg-muted">{meta}</p>
              ) : null}
              {(item.emphasisNote ?? item.summary) ? (
                <p className="mt-4 text-lg text-fg-muted">
                  {item.emphasisNote ?? item.summary}
                </p>
              ) : null}
              <p className="mt-5 text-sm">
                <Link href={`/projects/${item.slug}`}>
                  Read the case study
                  <span className="sr-only">: {item.title}</span>
                </Link>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
