import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  themeInitScript,
} from "./theme";

describe("resolveTheme", () => {
  it("prefers an explicit stored choice", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("falls back to the system preference", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
    expect(resolveTheme("garbage", true)).toBe("dark");
  });
});

describe("applyTheme", () => {
  it("sets exactly one theme class", () => {
    const root = document.createElement("html");
    applyTheme(root, "dark");
    expect([...root.classList]).toEqual(["dark"]);
    applyTheme(root, "light");
    expect([...root.classList]).toEqual(["light"]);
  });
});

describe("themeInitScript", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    localStorage.clear();
  });

  function run(systemDark: boolean) {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({ matches: systemDark } as MediaQueryList),
    );
    new Function(themeInitScript)();
    vi.unstubAllGlobals();
  }

  it("applies the stored theme", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    run(false);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("follows the system when nothing is stored", () => {
    run(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    run(false);
    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
