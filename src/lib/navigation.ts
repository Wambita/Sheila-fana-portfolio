export type NavItem = { href: string; label: string };

/**
 * Site navigation (ADR-019, refined 2026-11-27).
 *
 * - The navbar is the discipline portfolios (published disciplines, from the database)
 *   plus About and Contact. Each portfolio already contains its own experience,
 *   publications, writing and credentials, so those are not repeated in the navbar.
 * - The "full record" pages list everything across disciplines, including work that
 *   fits no portfolio. They are reached from the footer and the homepage, not the navbar.
 */
export const siteNav: readonly NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const recordPages: readonly NavItem[] = [
  { href: "/experience", label: "Experience" },
  { href: "/credentials", label: "Education" },
  { href: "/publications", label: "Publications" },
  { href: "/writing", label: "Writing" },
  { href: "/projects", label: "All projects" },
];

/**
 * Public address of a discipline's page (ADR-024). A discipline's "Portfolio" is the
 * projects section on that page.
 */
export function disciplineHref(slug: string): string {
  return `/disciplines/${slug}`;
}

export function portfolioNav(
  disciplines: ReadonlyArray<{ slug: string; name: string }>,
): NavItem[] {
  return disciplines.map(({ slug, name }) => ({
    href: disciplineHref(slug),
    label: name,
  }));
}

/** True when `pathname` is the item's page or one of its children. */
export function isActive(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
