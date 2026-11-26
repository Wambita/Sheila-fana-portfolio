import type { Metadata } from "next";

import { InDevelopment } from "@/components/layout/InDevelopment";

export const metadata: Metadata = { title: "Education" };

/** Education and certifications (doc 03: /credentials). */
export default function Page() {
  return <InDevelopment title="Education" />;
}
