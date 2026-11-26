export type NavItem = { href: string; label: string };

/**
 * Site navigation (ADR-019). The first group is the discipline portfolios, which come
 * from the database (published disciplines, in their sort order), so adding or
 * reordering a portfolio is a data change. The second group is the shared pages that
 * support every portfolio.
 */
export const sharedNav: readonly NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/credentials", label: "Education" },
  { href: "/publications", label: "Publications" },
  { href: "/writing", label: "Writing" },
  { href: "/projects", label: "All projects" },
  { href: "/contact", label: "Contact" },
];

export function portfolioNav(
  disciplines: ReadonlyArray<{ slug: string; name: string }>,
): NavItem[] {
  return disciplines.map(({ slug, name }) => ({
    href: `/disciplines/${slug}`,
    label: name,
  }));
}

/** True when `pathname` is the item's page or one of its children. */
export function isActive(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
