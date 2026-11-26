import Link from "next/link";

import { recordPages } from "@/lib/navigation";
import { site } from "@/lib/site";

/**
 * Quiet footer under every page: the "full record" pages, which list everything across
 * disciplines. Kept out of the navbar so portfolios stay focused (ADR-019).
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border px-5 py-10 text-sm sm:px-8 md:px-10 lg:px-16 xl:px-24">
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
