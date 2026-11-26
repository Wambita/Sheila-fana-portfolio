import type { Metadata } from "next";

import { RecordPage } from "@/components/portfolio/RecordPage";
import { listItemsByType } from "@/lib/content";

export const metadata: Metadata = { title: "Writing" };

/**
 * Full record: every article. The daily dev.to and Medium sync (ADR-007) fills this in
 * a later slice; article pages on the site come with it.
 */
export default async function Page() {
  const items = await listItemsByType(["article"]);
  return (
    <RecordPage
      title="Writing"
      groups={[{ id: "articles", title: "Articles", items }]}
    />
  );
}
