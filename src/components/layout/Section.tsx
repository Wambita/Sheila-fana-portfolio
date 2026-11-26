import type { ReactNode } from "react";

/**
 * A titled page section. It registers itself with the sidebar's "on this page" links
 * (data-section) and gets an anchor id. Sections are separated by space, not rules (ADR-020).
 */
export function Section({
  id,
  title,
  navLabel = title,
  children,
  className = "",
}: {
  id: string;
  title: string;
  navLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      data-section={navLabel}
      aria-labelledby={headingId}
      className={`mt-20 md:mt-28 ${className}`}
    >
      <h2 id={headingId} className="text-2xl md:text-3xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}
