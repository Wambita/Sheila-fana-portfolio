"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { isActive, primaryNav } from "@/lib/navigation";
import { site } from "@/lib/site";

/**
 * Persistent left sidebar on desktop; top bar with a disclosure menu on
 * smaller screens (brand guide §5). One <nav> landmark serves both layouts.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const collapsed = open ? "" : "hidden lg:block";

  return (
    <header className="border-b border-border bg-bg lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:block lg:px-8 lg:pt-12 lg:pb-8">
        <Link
          href="/"
          className="font-serif text-xl text-fg no-underline hover:text-fg"
          onNavigate={() => setOpen(false)}
        >
          {site.name}
        </Link>
        <button
          ref={buttonRef}
          type="button"
          className="min-h-11 rounded border border-control px-3 text-sm text-fg lg:hidden"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>

      <nav
        id="site-nav"
        aria-label="Primary"
        className={`${collapsed} px-4 pb-4 sm:px-8 lg:px-8`}
      >
        <ul className="flex flex-col gap-1">
          {primaryNav.map((item) => {
            const active = isActive(item.href, pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onNavigate={() => setOpen(false)}
                  className={`flex min-h-11 items-center border-l-2 pl-3 no-underline ${
                    active
                      ? "border-link font-medium text-link"
                      : "border-transparent text-fg hover:text-link"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={`${collapsed} px-4 pb-6 sm:px-8 lg:mt-auto lg:px-8 lg:pb-10`}
      >
        <ThemeToggle />
      </div>
    </header>
  );
}
