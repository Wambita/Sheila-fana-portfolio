import Link from "next/link";
import { launchDisciplines, site } from "@/lib/site";

/**
 * Phase 1 home: typography-led introduction (no portrait yet, brand guide §7).
 * Featured work and strengths are added in Phase 3 from owner-supplied content.
 */
export default function Home() {
  return (
    <div className="max-w-[68ch]">
      <h1 className="text-4xl sm:text-5xl">{site.name}</h1>
      <p className="mt-6 text-xl text-fg-muted">{site.positioning}</p>

      <section
        aria-labelledby="disciplines-heading"
        className="mt-14 border-t border-border pt-8"
      >
        <h2 id="disciplines-heading" className="text-2xl">
          Disciplines
        </h2>
        <ul className="mt-4 flex flex-col gap-2">
          {launchDisciplines.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href="/disciplines">Explore disciplines</Link>
        </p>
      </section>

      <section
        aria-labelledby="contact-heading"
        className="mt-14 border-t border-border pt-8"
      >
        <h2 id="contact-heading" className="text-2xl">
          Get in touch
        </h2>
        <p className="mt-4">
          <Link href="/contact">Contact Sheila</Link>
        </p>
      </section>
    </div>
  );
}
