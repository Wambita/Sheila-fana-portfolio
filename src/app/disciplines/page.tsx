import type { Metadata } from "next";

import { InDevelopment } from "@/components/layout/InDevelopment";
import { PageIntro } from "@/components/layout/PageIntro";
import { PortfolioList } from "@/components/portfolio/PortfolioList";
import { listDisciplines } from "@/lib/content";

export const metadata: Metadata = { title: "Disciplines" };

export default async function Page() {
  const disciplines = await listDisciplines();
  if (disciplines.length === 0) return <InDevelopment title="Disciplines" />;

  return (
    <>
      <PageIntro title="Disciplines">
        <p>One body of work, organised by discipline.</p>
      </PageIntro>
      <PortfolioList disciplines={disciplines} headingLevel="h2" />
    </>
  );
}
