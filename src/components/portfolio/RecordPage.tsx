import { InDevelopment } from "@/components/layout/InDevelopment";
import { PageIntro } from "@/components/layout/PageIntro";
import { Section } from "@/components/layout/Section";
import type { ItemSummary } from "@/lib/content/schemas";

import { ItemList } from "./ItemRow";

export type RecordGroup = { id: string; title: string; items: ItemSummary[] };

/**
 * A "full record" page (ADR-019): everything of one kind across all disciplines,
 * including work that fits no portfolio. Groups without published items are hidden;
 * a page with nothing published shows the in-development notice.
 */
export function RecordPage({
  title,
  groups,
}: {
  title: string;
  groups: RecordGroup[];
}) {
  const visible = groups.filter((group) => group.items.length > 0);
  if (visible.length === 0) return <InDevelopment title={title} />;

  return (
    <>
      <PageIntro title={title} eyebrow="Full record">
        <p>
          Everything across all portfolios, including work that sits outside
          them.
        </p>
      </PageIntro>
      {visible.length === 1 && groups.length === 1 ? (
        <ItemList items={visible[0].items} headingLevel="h2" />
      ) : (
        visible.map((group) => (
          <Section key={group.id} id={group.id} title={group.title}>
            <ItemList items={group.items} />
          </Section>
        ))
      )}
    </>
  );
}
