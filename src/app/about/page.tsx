import type { Metadata } from "next";
import { InDevelopment } from "@/components/layout/InDevelopment";

export const metadata: Metadata = { title: "About" };

export default function Page() {
  return <InDevelopment title="About" />;
}
