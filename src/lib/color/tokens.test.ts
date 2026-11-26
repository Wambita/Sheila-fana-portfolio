/**
 * Guards the brand guide (§3, monochrome system) and WCAG 2.2 AA: every text and
 * control pairing in src/styles/tokens.css meets its contrast threshold in both
 * themes, text stays readable on glass, and every colour is a neutral grey.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { AA, contrastRatio } from "./contrast";

const css = readFileSync(join(process.cwd(), "src/styles/tokens.css"), "utf8");

type Rgba = { r: number; g: number; b: number; a: number };

function parseColour(value: string): Rgba {
  const hex = /^#([0-9a-f]{6})$/i.exec(value);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return { r: n >> 16, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const rgba = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/.exec(value);
  if (rgba) {
    const [r, g, b, a] = rgba.slice(1).map(Number);
    return { r, g, b, a };
  }
  throw new Error(`Unsupported colour ${value}`);
}

const toHex = ({ r, g, b }: Rgba) =>
  `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`;

/** `top` composited over an opaque `bottom`. */
function over(top: Rgba, bottom: Rgba): string {
  const mix = (t: number, b: number) => t * top.a + b * (1 - top.a);
  return toHex({
    r: mix(top.r, bottom.r),
    g: mix(top.g, bottom.g),
    b: mix(top.b, bottom.b),
    a: 1,
  });
}

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start < 0)
    throw new Error(`Selector ${selector} not found in tokens.css`);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6}|rgba\([^)]*\))/gi)].map(
      (m) => [m[1], m[2]],
    ),
  );
}

const themes = {
  light: block(":root"),
  dark: block(":root.dark"),
  "dark (system)": block(":root:not(.light)"),
};

const pairs: Array<[fg: string, bg: string, min: number]> = [
  ["fg", "bg", AA.text],
  ["fg", "surface", AA.text],
  ["fg", "surface-2", AA.text],
  ["fg", "surface-3", AA.text],
  ["fg-muted", "bg", AA.text],
  ["fg-muted", "surface", AA.text],
  ["fg-muted", "surface-2", AA.text],
  ["fg-muted", "surface-3", AA.text],
  ["fg-subtle", "bg", AA.text],
  ["fg-subtle", "surface", AA.text],
  ["fg-subtle", "surface-2", AA.text],
  ["fg", "tile", AA.text],
  ["fg", "tile-hover", AA.text],
  ["fg-muted", "tile", AA.text],
  ["fg-muted", "tile-hover", AA.text],
  ["fg-subtle", "tile", AA.text],
  ["fg-subtle", "tile-hover", AA.text],
  ["fg-subtle", "surface-3", AA.text],
  ["link", "tile", AA.text],
  ["link-hover", "tile", AA.text],
  ["link", "bg", AA.text],
  ["link", "surface", AA.text],
  ["link-hover", "bg", AA.text],
  ["link-hover", "surface", AA.text],
  ["on-accent", "accent", AA.text],
  ["on-accent", "accent-hover", AA.text],
  ["control-border", "bg", AA.nonText],
  ["control-border", "surface", AA.nonText],
  ["control-border", "surface-2", AA.nonText],
  ["focus", "bg", AA.nonText],
  ["focus", "surface", AA.nonText],
];

describe.each(Object.entries(themes))("%s theme tokens", (_name, tokens) => {
  it.each(pairs)("%s on %s meets %s:1", (fg, bg, min) => {
    expect(tokens[fg], `missing --${fg}`).toBeDefined();
    expect(tokens[bg], `missing --${bg}`).toBeDefined();
    expect(contrastRatio(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(min);
  });

  // Glass sits over the page background (and, on mobile, over scrolled content, which
  // is itself text on bg). Its tint must keep sidebar text readable on its own.
  it.each(["fg", "fg-muted", "fg-subtle"])(
    "%s on glass over the background meets AA",
    (fg) => {
      const glass = over(parseColour(tokens.glass), parseColour(tokens.bg));
      expect(contrastRatio(tokens[fg], glass)).toBeGreaterThanOrEqual(AA.text);
    },
  );

  it("uses only neutral greys (no accent colours)", () => {
    for (const [name, value] of Object.entries(tokens)) {
      const { r, g, b } = parseColour(value);
      expect([g, b], `--${name} ${value} is not neutral`).toEqual([r, r]);
    }
  });
});

it("system dark theme mirrors the explicit dark theme", () => {
  expect(themes["dark (system)"]).toEqual(themes.dark);
});
