# 05 — Design System

**Status:** Derived from the approved [brand-style-guide.md](./brand-style-guide.md). If the two disagree, the brand guide wins. This doc covers how the guide becomes tokens and components. It does not redefine the brand.
**Last updated:** 2026-11-26

## Tokens

Tokens are semantic CSS variables in `src/styles/tokens.css`, exposed as Tailwind v4 utilities through `@theme` in `globals.css` (`bg-bg`, `bg-surface`, `bg-surface-2`, `text-fg`, `text-fg-muted`, `text-fg-subtle`, `border-border`, `border-control`, `bg-accent`, `text-on-accent`, `border-glass-border`, `bg-overlay`, …). Components use the semantic names only. Tailwind's default palette is disabled.

**Monochrome system (owner-approved 2026-11-26, ADR-018).** Values and roles are listed in [brand-style-guide.md §3](./brand-style-guide.md#3-colour-system). Dark and light are semantic inversions; every token is a neutral grey.

`src/lib/color/tokens.test.ts` checks, in both themes and for the system-preference dark block:

- AA 4.5:1 for `fg`, `fg-muted` and `fg-subtle` on every surface, links and link hover, and text on the primary button;
- 3:1 for control borders and the focus ring;
- AA for text on the glass tint composited over the background (so navigation stays readable even where blur is unsupported);
- that every colour is neutral (r = g = b).

### Tiles and lines (ADR-020)

Content sits on tonal tiles instead of between hairlines: `--tile` (light `#F4F4F4`, dark `#111111`) and `--tile-hover` (light `#EDEDED`, dark `#1A1A1A`), with a 12–16px radius and no borders. Every text tier meets AA on both tile shades (tested). The title link of a linked tile is stretched over it (`after:absolute after:inset-0`), so the whole tile is the target while assistive tech hears one link; the "View project →" cues are `aria-hidden`. Sections are separated by space. Lines remain only where WCAG needs them: form-control borders (`--control-border`, ≥3:1). Active navigation is a filled pill plus heavier weight; the section being read has a filled dot, so neither relies on colour alone.

Icons live in `src/components/icons.tsx` (inline SVG, 1.5px stroke, `aria-hidden`, always next to text): ArrowUpRight (leaves the site), ArrowRight (continues), Sun/Moon (theme), Menu/Close.

### Glass

One utility, `glass` in `globals.css` (tint + `backdrop-filter: blur(16px) saturate(140%)`), used only by the sidebar, the mobile top bar and menu panel, and floating controls. Nested backdrop filters can't blur the page, so on mobile the bar and the menu panel each carry their own glass. Where `backdrop-filter` is unsupported, `tokens.css` swaps the tint for the opaque surface. `check:brand` rejects blur anywhere else.

## Previous palette (superseded)

The Warm Paper / Ink / Research Teal palette and adjustments A1–A4 below were in use until ADR-018 and are kept for history.

### Accessibility findings on the previous palette

I measured these WCAG 2.x contrast ratios in Phase 0. AA requires 4.5:1 for normal text, 3:1 for large text, and 3:1 for UI component boundaries such as input borders and focus rings (SC 1.4.11).

| Pair                                           | Ratio         | Result                                                       |
| ---------------------------------------------- | ------------- | ------------------------------------------------------------ |
| Primary text on paper / white (light)          | 12.86 / 14.27 | ✅                                                           |
| Primary text on ink / slate (dark)             | 14.08 / 11.17 | ✅                                                           |
| **Body Muted `#687875` on Warm Paper**         | **4.18**      | ❌ fails for normal text (passes on white: 4.63)             |
| **Research Teal `#47796F` text on Warm Paper** | **4.47**      | ❌ just fails for normal text (passes on white: 4.96)        |
| White text on Research Teal button             | 4.96          | ✅                                                           |
| Paper text on Research Teal button             | 4.47          | ❌ so use white button text                                  |
| Accent hover `#35645B` on paper                | 6.06          | ✅                                                           |
| Dark muted / dark accent on ink or slate       | 6.07–8.06     | ✅                                                           |
| Ink text on Soft Sage button (dark)            | 8.06          | ✅                                                           |
| Copper on paper                                | 2.96          | Decorative markers only, never text                          |
| Border Light on paper / Border Dark on ink     | 1.16 / 1.61   | OK for decorative dividers. **Not enough for input borders** |

**Adjustments: approved by the owner on 2026-11-26 and applied to the brand guide.**

- **A1:** For secondary text on Warm Paper, use `#62716E` (4.61:1). It is visually almost identical to Body Muted. Alternatively, keep `#687875` only on white surfaces.
- **A2:** For teal links and text on Warm Paper, use `#45756C` (4.71:1), or reuse the approved Accent Hover `#35645B` (6.06:1) as the resting link colour on paper. Teal buttons are unaffected: they use white text.
- **A3:** For form-control borders, use the secondary-text colour (light 4.6:1 at A1, dark `#A8B7B2`) instead of the Border tokens. This meets the 3:1 requirement for UI components. Border tokens stay for dividers only.
- **A4:** Focus ring: a 2px solid link-colour outline with a 2px offset (`#45756C` light, `#A9BDB2` dark). It meets 3:1 against both backgrounds.

## Typography

| Role                      | Font           | Loading                                          |
| ------------------------- | -------------- | ------------------------------------------------ |
| Headings                  | Lora           | `next/font/google`, self-hosted, `display: swap` |
| Body / UI                 | DM Sans        | same                                             |
| Code / technical metadata | JetBrains Mono | same, subset                                     |

Headings use sentence case. Lora is limited to headings and short emphasis. Body text is about 17px with a line-height of 1.6 and a maximum line length of about 68ch. The type scale is fluid with `clamp()`, at a ratio of about 1.2 (restrained, with no oversized hero).

## Layout

- **Desktop (≥1024px) and tablet (≥768px):** a persistent glass sidebar (16–18rem on desktop, 13.5rem on tablet) holds the name, primary navigation, the current page's section links and the theme toggle. It is sticky while the document scrolls, so there is no nested scroll container; the page background is static. The main column keeps a ~68ch reading measure, with wider editorial rows for lists.
- **Mobile (<768px):** a sticky glass top bar with the name, the current page and section ("Work / Context") and a Menu button. The menu is an overlay panel with a dimmed backdrop; it closes on Escape (focus returns to the button), on backdrop click and on navigation.
- **Section navigation:** pages wrap sections in `<Section>` (`src/components/layout/Section.tsx`), which sets an id and `data-section`. `useSectionNav` finds the visible page's sections (ignoring routes React `<Activity>` keeps hidden), marks the one being read with `aria-current="location"` and a left rule (not colour alone), and tracks scrolling with a passive, rAF-throttled listener: the active section is the last one past 30% of the viewport, or the last section at the bottom of the page. A section chosen from the nav or the URL hash stays active until the visitor scrolls (short pages can't bring it to the top). Smooth scrolling is disabled under `prefers-reduced-motion`.
- **Gallery composition:** numbered tonal tiles (index in JetBrains Mono, serif title, metadata column on wide screens), larger for case studies, separated by space (ADR-020).
- **Surfaces:** solid tonal fills, no hairlines, 12–16px radius on tiles and fully rounded pill buttons, no shadows.
- **Spacing:** a 4px base scale. Touch targets are at least 44px, except desktop section links (36px, above the WCAG 2.2 AA 24px minimum).

## Theming

A `light` or `dark` class on `<html>`, set before first paint by an inline script (`src/lib/theme.ts`); with no stored choice the system preference applies (also without JavaScript). `ThemeToggle` stores an explicit choice in localStorage. Colours cross-fade over 200ms when the theme changes (instant with reduced motion).

## Core components (initial inventory)

AppShell (sidebar plus mobile top bar), ThemeToggle, Prose, PageIntro, ProjectCard, ItemMeta (plain-text metadata), Tag (informational only), Timeline, CitationBlock, Figure/Caption, FilterBar, ArticleCard, ContactForm, Button (primary / secondary / text), EmptyState.

Project detail pages follow the brand's evidence structure: context, problem, role, process, decisions, implementation and verified outcomes. Any section without owner-supplied content is hidden, never filled in.

## Guardrails

- Enforced in CI: Tailwind's default palette is disabled; `check:brand` rejects raw colours outside `tokens.css`, palette classes, gradients, and blur outside the `glass` utility; `tokens.test.ts` rejects non-neutral colours and contrast failures.
- Disciplines share one identity: no discipline-specific colours (and no colours at all beyond the greys).
- Portrait: until one is supplied, use a typography-led introduction with no placeholder image.
