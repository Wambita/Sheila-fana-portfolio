# 05 — Design System

**Status:** Derived from the approved [brand-style-guide.md](./brand-style-guide.md). If the two disagree, the brand guide wins. This doc covers how the guide becomes tokens and components. It does not redefine the brand.
**Last updated:** 2026-11-26

## Tokens

Tokens are semantic CSS variables in `src/styles/tokens.css`, exposed through Tailwind v4 `@theme`. Components use the semantic names only. Raw hex values and Tailwind's default palette (including any purple, violet or indigo) are not allowed in components. The default palette will be disabled.

| Token | Light | Dark | Brand guide role |
|---|---|---|---|
| `--color-bg` | `#F5F3ED` | `#172426` | Page background |
| `--color-surface` | `#FFFFFF` | `#243638` | Surface / card |
| `--color-fg` | `#202D2B` | `#F2F1EA` | Primary text |
| `--color-fg-muted` | `#687875` ⚠ | `#A8B7B2` | Secondary text |
| `--color-accent` | `#47796F` ⚠ | `#A9BDB2` | Primary accent |
| `--color-accent-hover` | `#35645B` | `#C0D0C7` | Accent hover |
| `--color-border` | `#E2E4DD` | `#354648` | Border (decorative dividers) |
| `--color-highlight` | `#A9BDB2` (Soft Sage) | — | Subtle highlight |
| `--color-marker` | `#B98259` (Muted Copper) | `#B98259` | Rare editorial markers only |

⚠ = see the accessibility findings below.

## Accessibility findings on the approved palette

I measured these WCAG 2.x contrast ratios in Phase 0. AA requires 4.5:1 for normal text, 3:1 for large text, and 3:1 for UI component boundaries such as input borders and focus rings (SC 1.4.11).

| Pair | Ratio | Result |
|---|---|---|
| Primary text on paper / white (light) | 12.86 / 14.27 | ✅ |
| Primary text on ink / slate (dark) | 14.08 / 11.17 | ✅ |
| **Body Muted `#687875` on Warm Paper** | **4.18** | ❌ fails for normal text (passes on white: 4.63) |
| **Research Teal `#47796F` text on Warm Paper** | **4.47** | ❌ just fails for normal text (passes on white: 4.96) |
| White text on Research Teal button | 4.96 | ✅ |
| Paper text on Research Teal button | 4.47 | ❌ so use white button text |
| Accent hover `#35645B` on paper | 6.06 | ✅ |
| Dark muted / dark accent on ink or slate | 6.07–8.06 | ✅ |
| Ink text on Soft Sage button (dark) | 8.06 | ✅ |
| Copper on paper | 2.96 | Decorative markers only, never text |
| Border Light on paper / Border Dark on ink | 1.16 / 1.61 | OK for decorative dividers. **Not enough for input borders** |

**Proposed adjustments.** These change nothing until the owner approves them, per brand guide §11.
- **A1:** For secondary text on Warm Paper, use `#62716E` (4.61:1). It is visually almost identical to Body Muted. Alternatively, keep `#687875` only on white surfaces.
- **A2:** For teal links and text on Warm Paper, use `#45756C` (4.71:1), or reuse the approved Accent Hover `#35645B` (6.06:1) as the resting link colour on paper. Teal buttons are unaffected: they use white text.
- **A3:** For form-control borders, use the secondary-text colour (light 4.6:1 at A1, dark `#A8B7B2`) instead of the Border tokens. This meets the 3:1 requirement for UI components. Border tokens stay for dividers only.
- **A4:** Focus ring: a 2px solid accent outline with a 2px offset. This needs re-checking against both backgrounds once A2 is decided.

## Typography

| Role | Font | Loading |
|---|---|---|
| Headings | Lora | `next/font/google`, self-hosted, `display: swap` |
| Body / UI | DM Sans | same |
| Code / technical metadata | JetBrains Mono | same, subset |

Headings use sentence case. Lora is limited to headings and short emphasis. Body text is about 17px with a line-height of 1.6 and a maximum line length of about 68ch. The type scale is fluid with `clamp()`, at a ratio of about 1.2 (restrained, with no oversized hero).

## Layout

- **Desktop (≥1024px):** a persistent left sidebar holds the name, primary navigation, theme toggle and contact link. The main content column sits to the right, with a reading measure of about 68ch and an optional metadata margin.
- **Tablet and mobile:** a top bar with a disclosure menu. The menu is a native button and a `<nav>`, with focus management.
- **Surfaces:** solid fills, 1px borders, a radius of 4–6px (softly rounded), and no shadows by default.
- **Spacing:** a 4px base scale.

## Theming

`next-themes` uses the `class` strategy with an inline script to prevent a flash of the wrong theme. The default is `system`, with a manual toggle that persists the choice.

## Core components (initial inventory)

AppShell (sidebar plus mobile top bar), ThemeToggle, Prose, PageIntro, ProjectCard, ItemMeta (plain-text metadata), Tag (informational only), Timeline, CitationBlock, Figure/Caption, FilterBar, ArticleCard, ContactForm, Button (primary / secondary / text), EmptyState.

Project detail pages follow the brand's evidence structure: context, problem, role, process, decisions, implementation and verified outcomes. Any section without owner-supplied content is hidden, never filled in.

## Guardrails

- Enforced with lint where possible: a Tailwind config with no default colour palette, and a stylelint/grep check in CI that rejects hex values outside `tokens.css`.
- Disciplines share one identity: no discipline-specific colours.
- Portrait: until one is supplied, use a typography-led introduction with no placeholder image.
