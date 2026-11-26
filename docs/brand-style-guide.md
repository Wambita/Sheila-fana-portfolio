# Wambita Sheila Fana — Brand & Visual Style Guide

**Status:** Approved visual source of truth (supplied by the owner, 2026-11-26)
**Brand idea:** The Researcher
**Brand principle:** One platform. Multiple disciplines. One coherent professional identity.

This document is the authoritative visual reference for the Wambita Sheila Fana portfolio. All design, frontend and content implementation must follow it. Do not introduce a competing visual direction, trendy AI aesthetic or unapproved colour system.

> **Change log:** 2026-11-27 (later): tonal gallery (ADR-020): white hairlines removed in favour of tile shades (`--tile`, `--tile-hover`), and a small set of functional line icons (external link, continue, theme, menu). Decorative icons remain out of scope.
>
> 2026-11-27: the owner approved the positioning "Full-stack developer working at the intersection of design, code and security, building user-centred, secure systems." (full-stack as the primary identity; see doc 02 O7).
>
> 2026-11-26 (later): the owner approved a **strict monochrome colour system** and **restrained glass** for navigation surfaces, replacing the Warm Paper / Ink / Research Teal palette and the blanket no-glassmorphism rule (ADR-018). §2, §3, §6, §11 and §12 are updated; the earlier palette and adjustments A1–A4 are kept in doc 05 for history.
>
> 2026-11-26: the owner set the brand name to her full name, **Wambita Sheila Fana**, used consistently on the site and CVs. Also on 2026-11-26, the owner approved accessibility adjustments A1–A4 (contrast fixes for text on Warm Paper and for form-control borders). See [05-design-system.md](./05-design-system.md#accessibility-findings-on-the-approved-palette) for the measurements.

## 1. Brand direction

| Attribute | Direction |
|---|---|
| Brand name | Wambita Sheila Fana |
| Brand idea | The Researcher |
| Positioning | Full-stack developer working at the intersection of design, code and security, building user-centred, secure systems. (owner-approved 2026-11-27; the live wording is `profile.headline`, editable in Studio) |
| Personality | Curious, thoughtful, credible, inventive, precise and quietly confident. |
| Visual character | A minimalist, editorial digital gallery: monochrome, considered typography, generous negative space, layered tonal shades instead of lines, structured layouts and subtle technical details. |
| Primary audience | Recruiters, hiring managers, collaborators, research teams and potential clients. |

The portfolio should feel like a carefully edited body of work—not a generic technology landing page, AI-generated template or collection of unrelated personal websites. It should communicate range while making each discipline easy to understand.

## 2. Non-negotiable visual rules

These rules take priority over generic design trends, generated design suggestions and default UI patterns.

- **No AI aesthetic.** The website must not look like an AI product, AI startup landing page or AI-generated template.
- **No purple or violet.** Do not introduce purple, lavender, indigo, magenta or blue-purple gradients as accents, backgrounds, glows or decorative details.
- **No exaggerated gradients.** Do not use oversized, multicolour, radial, mesh, aurora or glowing gradients. Prefer solid colours and restrained tonal variation.
- **Icons are functional only** (ADR-020): a small set of thin line icons that mark an action or destination (external link, continue, theme, menu), always beside a text label.
- **No generic AI decorations.** Do not add sparkles, stars, magic-wand motifs, glowing orbs, floating blobs, neural-network patterns, circuit-board wallpaper, abstract AI swirls or decorative "intelligence" icons.
- **No AI-style tag overload.** Avoid rows of unnecessary pills, badges, chips, floating labels and keyword clouds. Use tags only when they communicate useful information, such as project technologies or content categories.
- **Glass only where it earns its place.** Restrained glass (neutral tint, backdrop blur, hairline neutral border) is allowed for the sidebar, the mobile top bar and menu, and floating controls such as the theme switcher. Never on content cards or page sections, never coloured or glowing, and always readable without the blur (an opaque fallback is required).
- **No excessive animation.** Do not use constant floating, pulsing, shimmer, parallax or scroll-triggered spectacle. Motion must be subtle, purposeful and optional.
- **No generic tech stock imagery.** Avoid anonymous people in offices, random code screens, robot-head illustrations and unrelated futuristic imagery.
- **No fake product metrics or decorative dashboards.** Charts and numbers must represent real information and have a clear purpose.
- **No visual noise.** Avoid excessive shadows, borders, ornaments, gradients, oversized typography and competing accent colours.

If a design choice makes the site look like a stereotypical AI website, do not implement it—even if a UI library, template or AI design tool suggests it.

## 3. Colour system

A strict black-and-white system. Dark and light themes are semantic inversions of each other: the same tokens, the same hierarchy, opposite ends of the grey scale. There is no accent colour. Emphasis comes from contrast, weight, size, spacing and underlines.

### Tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#FFFFFF` | `#050505` | Page background |
| `--surface` | `#FAFAFA` | `#0D0D0D` | Sections, form fields |
| `--surface-2` | `#F1F1F1` | `#151515` | Secondary surface, hover fills |
| `--surface-3` | `#FFFFFF` | `#1C1C1C` | Elevated surface |
| `--fg` | `#111111` | `#FFFFFF` | Primary text, headings, links |
| `--fg-muted` | `#666666` | `#A3A3A3` | Secondary text |
| `--fg-subtle` | `#6B6B6B` | `#8A8A8A` | Muted metadata |
| `--border` | `#E5E5E5` | `#292929` | Hairline dividers only |
| `--control-border` | `#767676` | `#6B6B6B` | Form controls and outlined buttons (≥3:1) |
| `--accent` / `--on-accent` | `#111111` / `#FFFFFF` | `#FFFFFF` / `#050505` | Primary button: an inverted fill |
| `--focus` | `#111111` | `#FFFFFF` | Focus ring |
| `--glass` | white at 72% | `#0D0D0D` at 72% | Glass tint (navigation surfaces only) |
| `--overlay` | black at 32% | black at 60% | Backdrop behind the mobile menu |

The brief's suggested muted greys (`#888888` light, `#737373` dark) were darkened/lightened to `#6B6B6B` and `#8A8A8A` because they fail WCAG AA for normal text (3.5:1 and 4.3:1).

### Colour rules

- Monochrome only. Every token is a neutral grey (enforced by `tokens.test.ts`). Do not add accent, discipline or decorative colours.
- Feedback states (form errors, success) may use an accessible semantic colour sparingly, added as a token with owner approval, and never as the only signal.
- Links are underlined; colour never distinguishes them on its own.
- Hairline `--border` is for dividers. Controls use `--control-border`, which meets 3:1.
- Components use tokens only; raw colours exist only in `src/styles/tokens.css` (enforced by `check:brand`).
- Verify text, controls, focus and text on glass against WCAG 2.2 AA in both themes.

## 4. Typography

Use a clear editorial pairing with a modern, readable interface font.

| Role | Typeface | Guidance |
|---|---|---|
| Display and headings | Lora | Editorial character for page titles and selected section headings. Use with restraint. |
| Body and interface | DM Sans | Navigation, paragraphs, buttons, forms, labels and general UI. |
| Code and technical details | JetBrains Mono | Code snippets and small technical metadata only. |

Typography rules:

- Use sentence case for headings.
- Keep paragraphs short and readable.
- Establish hierarchy through size, weight and spacing—not excessive font styles.
- Use Lora for emphasis, not long blocks of body copy.
- Use a comfortable body line-height of approximately 1.5–1.7.
- Avoid all-caps paragraphs and overly tight letter spacing.
- Avoid oversized hero typography that pushes useful information below the fold.

## 5. Layout and composition

- Use a clean grid, consistent alignment and generous whitespace.
- On desktop, use persistent left-side navigation where it improves orientation; adapt it for tablet and mobile.
- Keep the main content column readable instead of stretching paragraphs across the full viewport.
- Make the first screen useful to a recruiter: who Sheila is, what she does, selected strengths and where to explore next.
- Use clear page introductions and concise summaries.
- Present projects as evidence: context, problem, role, process, decisions, implementation and verified outcomes.
- Keep navigation and important actions predictable across all discipline pages.
- Desktop and tablet: the sidebar stays in place while the page scrolls and lists the current page's sections, marking the one being read. The page background is static. Mobile: a sticky top bar shows the current page and section, with a menu; normal page scrolling, no nested scroll areas.
- Present work as a gallery of softly rounded tonal tiles, a shade off the page (near-black on black, soft grey on white), separated by space rather than lines (ADR-020). Vary their scale: case studies get larger tiles than list items.
- Prefer simple rectangular or softly rounded surfaces.
- Avoid excessive nested cards, floating panels and decorative containers.
- Prioritise clarity, scanning and fast access to relevant work.

## 6. Components and interaction style

### Buttons and links

- Primary buttons use the inverted fill (`--accent`: black on light, white on dark) with a clear text label.
- Secondary actions use an outline or quiet text-link treatment.
- Links must be recognisable without relying only on colour.
- Provide visible keyboard focus indicators.
- Implement consistent hover, active, disabled, loading and focus states.
- Avoid glowing buttons, gradient buttons and oversized pill-shaped calls to action.

### Cards and panels

- Use restrained borders and subtle surface differences.
- Give project cards room for a useful title, short description, role and relevant details.
- Keep card layouts consistent across disciplines.
- Avoid heavy shadows, glowing edges, glass effects and decorative gradients.
- Do not add badges or tags unless they help users understand or filter content.

### Tags and labels

Tags are informational, not decoration.

- Use them sparingly for technologies, disciplines or meaningful content categories.
- Do not display every skill as a pill.
- Avoid floating labels, animated chips, sparkle icons and excessive micro-labels.
- Prefer plain text metadata where a badge adds no value.

### Motion

- Keep motion subtle and purposeful: small transitions and clear navigation feedback.
- Respect `prefers-reduced-motion`.
- Do not make essential information dependent on animation, hover or scrolling effects.
- Avoid continuous motion, parallax spectacle, shimmer, pulsing glows and animated background effects.

## 7. Photography and visual assets

Prefer genuine, relevant material over generic technology stock imagery.

- Use one professional, approachable portrait as the primary personal image.
- Use real project screenshots, prototypes, diagrams and photographs from workshops or demonstrations where permission allows.
- Crop images consistently and provide meaningful alternative text.
- Use diagrams, interface details and technical visuals to explain work when they add evidence.
- Do not use unrelated stock photos of people in offices, random code backgrounds, generic AI illustrations or futuristic robot imagery.
- Do not publish confidential client work, private data, unreleased product screens or photographs of other people without appropriate permission.
- If a professional portrait is not ready, use a typography-led introduction rather than an unrelated placeholder image.

## 8. Discipline identity

All disciplines belong to the same Wambita Sheila Fana brand. They must share the same typography, navigation, spacing, component language and core palette.

Suggested discipline labels:

- Product and UI/UX Design
- Frontend Engineering
- Full-stack Development
- Cybersecurity
- Research and Innovation
- Robotics and IoT

Represent disciplines through clear labels, relevant imagery and tailored content—not entirely separate visual identities or a rainbow of discipline colours. Only publish a discipline page when there is enough genuine work and evidence to support it.

## 9. Brand voice and writing

The voice should be:

- Clear and specific, not inflated.
- Curious and analytical, without sounding overly academic.
- Confident but grounded in evidence.
- Human and approachable.
- Focused on problems solved, decisions made, contributions and learning.

Prefer concrete descriptions over vague claims such as "passionate tech enthusiast" or "innovative problem solver". Never invent achievements, metrics, job titles, project outcomes or responsibilities.

## 10. Accessibility and quality

- Target WCAG 2.2 AA.
- Ensure keyboard navigation and visible focus states.
- Provide meaningful alternative text for informative images.
- Use semantic HTML and accessible labels.
- Check colour contrast in both themes.
- Respect reduced-motion preferences.
- Test mobile, tablet and desktop layouts.
- Ensure content remains understandable without animation, colour or hover.
- Keep the site responsive, performant and easy to navigate.

## 11. Source-of-truth and change control

This file is the authoritative source of truth for the portfolio's brand and visual style.

Claude Code and any other AI or human contributor must:

- Read this file before creating or changing visual components, styling, themes, layouts or design tokens.
- Follow the palette, typography, layout and non-negotiable rules in this document.
- Treat generated designs, starter templates, UI libraries and default component themes as subordinate to this guide.
- Never introduce colour accents, purple, violet, AI-style gradients, glowing effects, sparkles, excessive tags or generic AI visual motifs. Glass stays limited to the surfaces listed in §2.
- Avoid silently changing the brand palette, fonts or visual direction.
- If a change is needed for accessibility, usability or technical reasons, explain the issue and propose a specific alternative before changing the source-of-truth direction.
- Update this document only when the owner explicitly approves a brand or visual-system change.
- Keep design tokens and reusable components aligned with this document. Do not create conflicting local colour systems.
- When in doubt, choose the simpler, quieter and more editorial option.

## 12. Short design brief

A thoughtful, editorial portfolio for a full-stack developer working across design, code and security, with focused portfolios per discipline. The identity is strictly monochrome—white and near-black with carefully differentiated greys—supported by Lora and DM Sans typography, thin dividers and restrained glass on navigation. It should feel credible, curious, precise and quietly distinctive—more gallery and research journal than generic tech template. It must not look like an AI website. Use solid colours, restrained details, clear layouts and genuine work. The experience must remain accessible, responsive, fast and easy for recruiters to navigate.
