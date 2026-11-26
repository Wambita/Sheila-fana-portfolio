export type NavItem = { href: string; label: string };

/** Primary navigation (doc 03). Order to be validated with the owner in Phase 3. */
export const primaryNav: readonly NavItem[] = [
  { href: "/projects", label: "Work" },
  { href: "/disciplines", label: "Disciplines" },
  { href: "/experience", label: "Experience" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** True when `pathname` is the item's page or one of its children. */
export function isActive(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
