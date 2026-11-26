import type { Metadata } from "next";

import { RecordPage } from "@/components/portfolio/RecordPage";
import { listItemsByType } from "@/lib/content";

export const metadata: Metadata = { title: "Experience" };

/** Full record: every role and engagement, across all portfolios. */
export default async function Page() {
  const items = await listItemsByType(["experience", "engagement"]);
  return (
    <RecordPage
      title="Experience"
      groups={[
        {
          id: "roles",
          title: "Roles",
          items: items.filter((i) => i.type === "experience"),
        },
        {
          id: "engagements",
          title: "Workshops, talks and engagements",
          items: items.filter((i) => i.type === "engagement"),
        },
      ]}
    />
  );
}
