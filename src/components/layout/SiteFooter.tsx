import Link from "next/link";

import { recordPages } from "@/lib/navigation";
import { site } from "@/lib/site";

/**
 * Quiet footer under every page: the "full record" pages, which list everything across
 * disciplines. Kept out of the navbar so portfolios stay focused (ADR-019).
 */
export function SiteFooter() {
  return (
    <footer className="mx-5 mt-28 mb-5 rounded-2xl bg-tile px-6 py-8 text-sm sm:mx-8 md:mx-10 md:px-8 lg:mx-16 xl:mx-24">
      <nav aria-label="Full record">
        <p className="font-mono text-xs text-fg-subtle">Full record</p>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {recordPages.map((page) => (
            <li key={page.href}>
              <Link href={page.href} className="text-fg-muted hover:text-fg">
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="mt-8 text-fg-subtle">{site.name}</p>
    </footer>
  );
}
