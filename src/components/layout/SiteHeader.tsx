"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { isActive, primaryNav } from "@/lib/navigation";
import { site } from "@/lib/site";

import { useSectionNav } from "./useSectionNav";

/**
 * Tablet and desktop: a persistent glass sidebar that stays put while the page scrolls.
 * Mobile: a sticky glass top bar showing where you are, with a disclosure menu.
 * One <nav> landmark serves both. The current page's sections are listed under its
 * nav item and the one being read is marked with aria-current="location".
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { sections, activeId, select } = useSectionNav(pathname);
  const goToSection = (id: string) => {
    select(id);
    setOpen(false);
  };

  // Cache Components keeps routes mounted (React Activity); make sure the menu
  // never reappears open when this component is hidden and shown again.
  useLayoutEffect(() => () => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const current = primaryNav.find((item) => isActive(item.href, pathname));
  const activeSection = sections.find((s) => s.id === activeId);
  const collapsed = open ? "" : "hidden md:block";

  return (
    <header className="sticky top-0 z-30 md:flex md:h-dvh md:flex-col md:border-r md:border-glass-border md:glass">
      {/* On mobile the bar and the menu panel carry their own glass: a backdrop filter
          nested inside another cannot blur the page behind it. */}
      <div className="flex items-center justify-between gap-3 border-b border-glass-border px-4 py-3 max-md:glass sm:px-6 md:block md:border-b-0 md:px-6 md:pt-10 md:pb-8 lg:px-8 lg:pt-12">
        <div className="min-w-0">
          <Link
            href="/"
            className="font-serif text-lg leading-tight text-fg no-underline hover:text-fg md:text-xl"
            onNavigate={() => setOpen(false)}
          >
            {site.name}
          </Link>
          {/* Mobile: where you are, since the sidebar is collapsed. */}
          {current ? (
            <p className="truncate text-xs text-fg-muted md:hidden">
              {current.label}
              {activeSection ? ` / ${activeSection.label}` : null}
            </p>
          ) : null}
        </div>
        <button
          ref={buttonRef}
          type="button"
          className="min-h-11 min-w-11 shrink-0 rounded-md border border-control px-3 text-sm text-fg transition-colors hover:bg-surface-2 md:hidden"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>

      {/* Mobile menu backdrop: decorative, click closes. */}
      {open ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 bg-overlay md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={`${collapsed} overflow-y-auto border-glass-border max-md:absolute max-md:inset-x-0 max-md:top-full max-md:max-h-[80dvh] max-md:border-y max-md:glass md:flex md:min-h-0 md:flex-1 md:flex-col`}
      >
        <nav
          id="site-nav"
          aria-label="Primary"
          className="px-4 py-4 sm:px-6 md:px-6 md:py-0 lg:px-8"
        >
          <ul className="flex flex-col gap-0.5">
            {primaryNav.map((item) => {
              const active = isActive(item.href, pathname);
              const exact = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={exact ? "page" : active ? "true" : undefined}
                    onNavigate={() => setOpen(false)}
                    className={`flex min-h-11 items-center border-l-2 pl-3 no-underline transition-colors ${
                      active
                        ? "border-fg font-medium text-fg"
                        : "border-transparent text-fg-muted hover:border-border hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {active && sections.length > 0 ? (
                    <SectionLinks
                      sections={sections}
                      activeId={activeId}
                      onNavigate={goToSection}
                    />
                  ) : null}
                </li>
              );
            })}
          </ul>
          {!current && sections.length > 0 ? (
            // Home has no nav item of its own: list its sections separately.
            <div className="mt-6">
              <p
                aria-hidden="true"
                className="mb-1 pl-3 font-mono text-xs text-fg-subtle"
              >
                On this page
              </p>
              <SectionLinks
                sections={sections}
                activeId={activeId}
                onNavigate={goToSection}
              />
            </div>
          ) : null}
        </nav>

        <div className="px-4 pt-2 pb-5 sm:px-6 md:mt-auto md:px-6 md:pt-6 md:pb-8 lg:px-8 lg:pb-10">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function SectionLinks({
  sections,
  activeId,
  onNavigate,
}: {
  sections: { id: string; label: string }[];
  activeId: string | null;
  onNavigate: (id: string) => void;
}) {
  return (
    <ul
      aria-label="On this page"
      className="mt-1 mb-2 ml-3 flex flex-col border-l border-border"
    >
      {sections.map(({ id, label }) => {
        const active = id === activeId;
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active ? "location" : undefined}
              onClick={() => onNavigate(id)}
              className={`-ml-px flex min-h-11 items-center border-l-2 pl-4 text-sm no-underline transition-colors md:min-h-9 ${
                active
                  ? "border-fg text-fg"
                  : "border-transparent text-fg-muted hover:text-fg"
              }`}
            >
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
