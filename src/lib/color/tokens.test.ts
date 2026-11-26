/**
 * Guards brand-guide §3 / WCAG 2.2 AA: every text and control pairing in
 * src/styles/tokens.css must meet its contrast threshold in both themes.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { AA, contrastRatio } from "./contrast";

const css = readFileSync(join(process.cwd(), "src/styles/tokens.css"), "utf8");

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start < 0)
    throw new Error(`Selector ${selector} not found in tokens.css`);
  const body = css.slice(start, css.indexOf("}", start));
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [
      m[1],
      m[2],
    ]),
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
  ["fg-muted", "bg", AA.text],
  ["fg-muted", "surface", AA.text],
  ["link", "bg", AA.text],
  ["link", "surface", AA.text],
  ["link-hover", "bg", AA.text],
  ["on-accent", "accent", AA.text],
  ["on-accent", "accent-hover", AA.text],
  ["control-border", "bg", AA.nonText],
  ["control-border", "surface", AA.nonText],
];

describe.each(Object.entries(themes))("%s theme tokens", (_name, tokens) => {
  it.each(pairs)("%s on %s meets %s:1", (fg, bg, min) => {
    expect(tokens[fg], `missing --${fg}`).toBeDefined();
    expect(tokens[bg], `missing --${bg}`).toBeDefined();
    expect(contrastRatio(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(min);
  });
});

it("system dark theme mirrors the explicit dark theme", () => {
  expect(themes["dark (system)"]).toEqual(themes.dark);
});
