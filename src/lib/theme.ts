/**
 * Theme handling (doc 05 §Theming). Default follows the system; an explicit
 * choice is stored in localStorage. The resolved theme is applied as a
 * `light` or `dark` class on <html>, which tokens.css keys off.
 */
export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export function resolveTheme(
  stored: string | null,
  systemPrefersDark: boolean,
): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return systemPrefersDark ? "dark" : "light";
}

export function applyTheme(root: HTMLElement, theme: Theme): void {
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
}

/**
 * Inline <head> script that applies the theme before first paint, preventing
 * a flash of the wrong theme. Must stay self-contained (no imports at runtime).
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var c=document.documentElement.classList;c.toggle("dark",d);c.toggle("light",!d);}catch(e){}})();`;
