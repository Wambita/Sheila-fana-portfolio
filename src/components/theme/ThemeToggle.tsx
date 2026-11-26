"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  applyTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const getTheme = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";
// Unknown during SSR; the inline head script has already applied the real theme.
const getServerTheme = (): Theme | null => null;

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(
    subscribe,
    getTheme,
    getServerTheme,
  );

  // Track system changes while the visitor hasn't made an explicit choice.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(THEME_STORAGE_KEY);
      } catch {}
      applyTheme(document.documentElement, resolveTheme(stored, media.matches));
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  const isDark = theme === "dark";

  function toggle() {
    const next: Theme = isDark ? "light" : "dark";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
    applyTheme(document.documentElement, next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === null ? undefined : isDark}
      className="inline-flex min-h-11 items-center gap-2 rounded-md border border-control px-3 text-sm text-fg transition-colors hover:bg-surface-2"
    >
      <span aria-hidden="true">{isDark ? "●" : "○"}</span>
      Dark theme
    </button>
  );
}
