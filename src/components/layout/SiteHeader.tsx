"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { ArrowLeft, CloseIcon, MenuIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { isActive, recordPages, siteNav, type NavItem } from "@/lib/navigation";
import type { PageSection } from "@/lib/sections";
import { site } from "@/lib/site";

import { useSectionNav } from "./useSectionNav";

/**
 * Tablet and desktop: a persistent glass sidebar that stays put while the page scrolls.
 * Mobile: a sticky glass top bar showing where you are, with a disclosure menu.
 *
 * Two levels (ADR-022), stacked in one <nav> landmark:
 * - Main navigation: the disciplines (each holds a portfolio), then About and Contact.
 * - Portfolio navigation: on a portfolio page the sidebar zooms into that portfolio,
 *   with an "All disciplines" back button, its name and its own sections. Back zooms out to the main
 *   navigation without leaving the page.
 * The hidden level is `inert`, so keyboard and screen-reader users only meet the
 * visible one. The section being read is marked with aria-current="location".
 */
export function SiteHeader({ portfolios }: { portfolios: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // The page on which the visitor chose "All disciplines". Moving to another
  // page clears it, so each portfolio opens in its own navigation (no effect needed).
  const [mainOn, setMainOn] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const focusAfterSwitch = useRef<"main" | "portfolio" | null>(null);
  const { sections, activeId, select } = useSectionNav(pathname);
  const goToSection = (id: string) => {
    select(id);
    setOpen(false);
  };

  const portfolio = portfolios.find((p) => isActive(p.href, pathname));
  const showPortfolio = Boolean(portfolio) && mainOn !== pathname;

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

  // After switching levels from the keyboard, keep focus in the visible level.
  useEffect(() => {
    const target = focusAfterSwitch.current;
    focusAfterSwitch.current = null;
    const panel = target === "main" ? mainRef.current : portfolioRef.current;
    if (!target || !panel) return;
    const preferred =
      target === "main"
        ? panel.querySelector<HTMLElement>('[aria-current="page"]')
        : null;
    (preferred ?? panel.querySelector<HTMLElement>("a, button"))?.focus();
  }, [showPortfolio]);

  const navItems = [...portfolios, ...siteNav];
  const inNav = navItems.some((item) => isActive(item.href, pathname));
  // For the mobile "where you are" label, full-record pages count too.
  const current = [...navItems, ...recordPages].find((item) =>
    isActive(item.href, pathname),
  );
  const activeSection = sections.find((s) => s.id === activeId);
  const collapsed = open ? "" : "hidden md:block";

  // Zoom between levels: the outgoing level shrinks away, the incoming one settles in.
  // The incoming level becomes visible at once (so it can take focus); only the
  // outgoing level delays its hide until the zoom has finished.
  const level = "[grid-area:1/1] origin-top duration-300 ease-out";
  const shown = "visible scale-100 opacity-100 transition-[opacity,transform]";
  const hidden =
    "invisible opacity-0 transition-[opacity,transform,visibility]";
  const mainState = showPortfolio ? `${hidden} scale-95` : shown;
  const portfolioState = showPortfolio ? shown : `${hidden} scale-105`;

  return (
    <header className="sticky top-0 z-30 md:flex md:h-dvh md:flex-col md:glass">
      {/* On mobile the bar and the menu panel carry their own glass: a backdrop filter
          nested inside another cannot blur the page behind it. */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 max-md:glass sm:px-6 md:block md:px-6 md:pt-10 md:pb-8 lg:px-8 lg:pt-12">
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
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center gap-2 rounded-full bg-tile px-4 text-sm text-fg transition-colors hover:bg-tile-hover md:hidden"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
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
        className={`${collapsed} overflow-x-hidden overflow-y-auto max-md:absolute max-md:inset-x-0 max-md:top-full max-md:max-h-[80dvh] max-md:glass md:flex md:min-h-0 md:flex-1 md:flex-col`}
      >
        <nav
          id="site-nav"
          aria-label="Primary"
          className="grid px-4 py-4 sm:px-6 md:px-6 md:py-0 lg:px-8"
        >
          {/* Level 1: main navigation */}
          <div
            ref={mainRef}
            inert={showPortfolio}
            className={`${level} ${mainState} flex flex-col gap-6`}
          >
            {portfolios.length > 0 ? (
              <div>
                <p
                  id="nav-disciplines"
                  className="mb-1 pl-3 font-mono text-xs text-fg-subtle"
                >
                  Disciplines
                </p>
                <ul
                  aria-labelledby="nav-disciplines"
                  className="flex flex-col gap-0.5"
                >
                  {portfolios.map((item) => (
                    <li key={item.href}>
                      <NavLink
                        item={item}
                        pathname={pathname}
                        onNavigate={() => setOpen(false)}
                        // Choosing the current portfolio again re-opens its navigation.
                        onClick={() => {
                          if (isActive(item.href, pathname)) {
                            focusAfterSwitch.current = "portfolio";
                            setMainOn(null);
                          }
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <ul aria-label="Pages" className="flex flex-col gap-0.5">
              {siteNav.map((item) => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    pathname={pathname}
                    onNavigate={() => setOpen(false)}
                  />
                  {isActive(item.href, pathname) && sections.length > 0 ? (
                    <SectionLinks
                      sections={sections}
                      activeId={activeId}
                      onNavigate={goToSection}
                    />
                  ) : null}
                </li>
              ))}
            </ul>
            {!inNav && sections.length > 0 ? (
              // Pages without a nav item (home, full record): list their sections here.
              <div>
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
          </div>

          {/* Level 2: the current portfolio's own navigation */}
          {portfolio ? (
            <div
              ref={portfolioRef}
              inert={!showPortfolio}
              className={`${level} ${portfolioState} flex flex-col`}
            >
              <button
                type="button"
                onClick={() => {
                  focusAfterSwitch.current = "main";
                  setMainOn(pathname);
                }}
                className="group -ml-1 inline-flex min-h-11 items-center gap-2 self-start rounded-lg px-2 text-sm text-fg-muted transition-colors hover:bg-tile hover:text-fg md:min-h-9"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                All disciplines
              </button>
              <p className="mt-6 px-1 font-serif text-2xl leading-tight text-fg">
                {portfolio.label}
              </p>
              {sections.length > 0 ? (
                <SectionLinks
                  label={`${portfolio.label}: sections`}
                  sections={sections}
                  activeId={activeId}
                  onNavigate={goToSection}
                  prominent
                />
              ) : null}
              {/* Shared pages, as a vertical list like the main navigation. */}
              <ul aria-label="Pages" className="mt-6 flex flex-col gap-0.5">
                {siteNav.map((item) => (
                  <li key={item.href}>
                    <NavLink
                      item={item}
                      pathname={pathname}
                      onNavigate={() => setOpen(false)}
                    />
                  </li>
                ))}
              </ul>
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

function NavLink({
  item,
  pathname,
  onNavigate,
  onClick,
}: {
  item: NavItem;
  pathname: string | null;
  onNavigate: () => void;
  onClick?: () => void;
}) {
  const active = isActive(item.href, pathname);
  const exact = pathname === item.href;
  return (
    <Link
      href={item.href}
      aria-current={exact ? "page" : active ? "true" : undefined}
      onNavigate={onNavigate}
      onClick={onClick}
      className={`flex min-h-11 items-center rounded-lg px-3 no-underline transition-[color,background-color,font-size] duration-200 md:min-h-10 ${
        active
          ? "bg-tile text-lg font-medium text-fg"
          : "text-fg-subtle hover:bg-tile hover:text-fg"
      }`}
    >
      {item.label}
    </Link>
  );
}

function SectionLinks({
  sections,
  activeId,
  onNavigate,
  label = "On this page",
  prominent = false,
}: {
  sections: PageSection[];
  activeId: string | null;
  onNavigate: (id: string) => void;
  label?: string;
  /** Portfolio navigation: sections are the main items, so they are larger. */
  prominent?: boolean;
}) {
  return (
    <ul
      aria-label={label}
      className={`flex flex-col ${prominent ? "mt-5 gap-0.5" : "mt-1 mb-2 ml-3"}`}
    >
      {sections.map(({ id, label: text }) => {
        const active = id === activeId;
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active ? "location" : undefined}
              onClick={() => onNavigate(id)}
              className={`flex min-h-11 items-center gap-2.5 rounded-lg px-3 no-underline transition-[color,background-color,font-size] duration-200 ${
                prominent ? "md:min-h-10" : "text-sm md:min-h-9"
              } ${
                active
                  ? `font-medium text-fg ${prominent ? "bg-tile text-lg" : ""}`
                  : `text-fg-subtle hover:text-fg ${prominent ? "hover:bg-tile" : ""}`
              }`}
            >
              {/* Position marker: a filled dot for the section being read (not colour alone). */}
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full transition-colors ${
                  active ? "bg-fg" : "bg-fg-subtle/40"
                }`}
              />
              {text}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
