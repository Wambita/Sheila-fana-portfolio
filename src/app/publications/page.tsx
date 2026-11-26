import type { Metadata } from "next";

import { RecordPage } from "@/components/portfolio/RecordPage";
import { listItemsByType } from "@/lib/content";

export const metadata: Metadata = { title: "Publications" };

/** Full record: every publication, including ones outside the portfolios. */
export default async function Page() {
  const items = await listItemsByType(["publication"]);
  return (
    <RecordPage
      title="Publications"
      groups={[{ id: "publications", title: "Publications", items }]}
    />
  );
}
