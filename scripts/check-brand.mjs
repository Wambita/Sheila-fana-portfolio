#!/usr/bin/env node
/**
 * Brand guard (docs/brand-style-guide.md §2–3, doc 09 "Brand" check).
 * Fails when source files outside src/styles/tokens.css contain raw colours,
 * Tailwind default-palette classes, gradients, or glass/blur effects.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["src"];
const EXTENSIONS = /\.(tsx?|jsx?|css|mdx?)$/;
const ALLOWED = new Set([join("src", "styles", "tokens.css")]);

const PALETTE =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";

const RULES = [
  {
    name: "raw hex colour (use a token from tokens.css)",
    re: /(?<![\w&/-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g,
  },
  {
    name: "raw colour function (use a token)",
    re: /\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/g,
  },
  {
    name: "Tailwind default palette class",
    re: new RegExp(`\\b[a-z-]+-(?:${PALETTE})-(?:50|[1-9]00|950)\\b`, "g"),
  },
  {
    name: "gradient (brand guide §2: no gradients)",
    re: /\b(?:bg-(?:linear|radial|conic|gradient)-|(?:linear|radial|conic)-gradient\()/g,
  },
  {
    name: "glass/blur effect (brand guide §2)",
    re: /\b(?:backdrop-blur|backdrop-filter|blur-(?:sm|md|lg|xl|2xl|3xl))\b/g,
  },
];

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory()
      ? walk(path)
      : EXTENSIONS.test(path)
        ? [path]
        : [];
  });
}

const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)))
  .map((f) => relative(ROOT, f))
  .filter((f) => !ALLOWED.has(f) && !/\.test\.tsx?$/.test(f));

const violations = [];
for (const file of files) {
  readFileSync(file, "utf8")
    .split(/\r?\n/)
    .forEach((line, i) => {
      for (const rule of RULES) {
        for (const match of line.matchAll(rule.re)) {
          violations.push(
            `${file.split(sep).join("/")}:${i + 1}  ${rule.name}: ${match[0]}`,
          );
        }
      }
    });
}

if (violations.length) {
  console.error(
    `Brand check failed (${violations.length}):\n  ${violations.join("\n  ")}`,
  );
  process.exit(1);
}
console.log(`Brand check passed (${files.length} files).`);
