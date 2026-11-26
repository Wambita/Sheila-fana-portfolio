import type { Metadata } from "next";

import { RecordPage } from "@/components/portfolio/RecordPage";
import { listItemsByType } from "@/lib/content";

export const metadata: Metadata = { title: "Education" };

/** Full record: education and certifications (doc 03: /credentials). */
export default async function Page() {
  const items = await listItemsByType(["education", "certification"]);
  return (
    <RecordPage
      title="Education"
      groups={[
        {
          id: "education",
          title: "Education",
          items: items.filter((i) => i.type === "education"),
        },
        {
          id: "certifications",
          title: "Certifications",
          items: items.filter((i) => i.type === "certification"),
        },
      ]}
    />
  );
}
