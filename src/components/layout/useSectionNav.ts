"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  activeSectionId,
  sameSections,
  type PageSection,
} from "@/lib/sections";

const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

/** Visible, i.e. not inside a route that React <Activity> keeps mounted but hidden. */
function isVisible(element: HTMLElement): boolean {
  return typeof element.checkVisibility === "function"
    ? element.checkVisibility()
    : element.offsetParent !== null;
}

/**
 * Sections of the page currently shown in <main>, plus the one being read.
 * Re-reads when the route or the main content changes (streamed content, Activity).
 */
export function useSectionNav(pathname: string | null): {
  sections: PageSection[];
  activeId: string | null;
  /** For section links: the chosen section stays active until the visitor scrolls. */
  select: (id: string) => void;
} {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  // A section chosen from the nav or the URL hash. A short page cannot scroll it to the
  // top, so position alone would mark a later section; it wins until the visitor scrolls.
  const pinned = useRef<string | null>(null);

  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;

    const read = () => {
      const next = [...main.querySelectorAll<HTMLElement>("[data-section][id]")]
        .filter(isVisible)
        .map((el) => ({ id: el.id, label: el.dataset.section ?? el.id }));
      setSections((current) => (sameSections(current, next) ? current : next));
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(main, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "hidden", "data-section"],
    });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (sections.length === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (pinned.current) {
        setActiveId(pinned.current);
        return;
      }
      const tops = sections.flatMap(({ id }) => {
        const el = document.getElementById(id);
        return el ? [{ id, top: el.getBoundingClientRect().top }] : [];
      });
      const doc = document.documentElement;
      const atBottom =
        window.innerHeight + window.scrollY >= doc.scrollHeight - 2 &&
        doc.scrollHeight > window.innerHeight;
      setActiveId(activeSectionId(tops, window.innerHeight * 0.3, atBottom));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Visitor-initiated scrolling releases a pinned section. Smooth scrolling after a
    // link click also fires scroll events, so scroll itself cannot be the signal.
    const release = (event: Event) => {
      if (event instanceof KeyboardEvent && !SCROLL_KEYS.has(event.key)) return;
      pinned.current = null;
      schedule();
    };

    const pinHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (hash && sections.some((s) => s.id === hash)) pinned.current = hash;
      schedule();
    };
    pinHash();
    update();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchmove", release, { passive: true });
    window.addEventListener("keydown", release);
    window.addEventListener("hashchange", pinHash);
    return () => {
      window.removeEventListener("hashchange", pinHash);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchmove", release);
      window.removeEventListener("keydown", release);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  const select = useCallback((id: string) => {
    pinned.current = id;
    setActiveId(id);
  }, []);

  // A stale id from the previous page is never reported.
  return {
    sections,
    activeId: sections.some((s) => s.id === activeId) ? activeId : null,
    select,
  };
}
