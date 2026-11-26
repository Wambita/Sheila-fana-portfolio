# Sheila Fana — Brand & Visual Style Guide

**Status:** Approved visual source of truth (supplied by the owner, 2026-11-26)
**Brand idea:** The Researcher
**Brand principle:** One platform. Multiple disciplines. One coherent professional identity.

This document is the authoritative visual reference for the Sheila Fana portfolio. All design, frontend and content implementation must follow it. Do not introduce a competing visual direction, trendy AI aesthetic or unapproved colour system.

> **Change log:** 2026-11-26. The owner approved accessibility adjustments A1–A4 (contrast fixes for text on Warm Paper and for form-control borders). See [05-design-system.md](./05-design-system.md#accessibility-findings-on-the-approved-palette) for the measurements.

## 1. Brand direction

| Attribute | Direction |
|---|---|
| Brand name | Sheila Fana |
| Brand idea | The Researcher |
| Positioning | A multidisciplinary technologist working across design, software, cybersecurity, research and emerging technologies. |
| Personality | Curious, thoughtful, credible, inventive, precise and quietly confident. |
| Visual character | Editorial and research-oriented: considered typography, generous whitespace, structured layouts and subtle technical details. |
| Primary audience | Recruiters, hiring managers, collaborators, research teams and potential clients. |

The portfolio should feel like a carefully edited body of work—not a generic technology landing page, AI-generated template or collection of unrelated personal websites. It should communicate range while making each discipline easy to understand.

## 2. Non-negotiable visual rules

These rules take priority over generic design trends, generated design suggestions and default UI patterns.

- **No AI aesthetic.** The website must not look like an AI product, AI startup landing page or AI-generated template.
- **No purple or violet.** Do not introduce purple, lavender, indigo, magenta or blue-purple gradients as accents, backgrounds, glows or decorative details.
- **No exaggerated gradients.** Do not use oversized, multicolour, radial, mesh, aurora or glowing gradients. Prefer solid colours and restrained tonal variation.
- **No generic AI decorations.** Do not add sparkles, stars, magic-wand motifs, glowing orbs, floating blobs, neural-network patterns, circuit-board wallpaper, abstract AI swirls or decorative "intelligence" icons.
- **No AI-style tag overload.** Avoid rows of unnecessary pills, badges, chips, floating labels and keyword clouds. Use tags only when they communicate useful information, such as project technologies or content categories.
- **No glassmorphism as a default.** Avoid translucent floating panels, blurred backdrops and glowing glass cards.
- **No excessive animation.** Do not use constant floating, pulsing, shimmer, parallax or scroll-triggered spectacle. Motion must be subtle, purposeful and optional.
- **No generic tech stock imagery.** Avoid anonymous people in offices, random code screens, robot-head illustrations and unrelated futuristic imagery.
- **No fake product metrics or decorative dashboards.** Charts and numbers must represent real information and have a clear purpose.
- **No visual noise.** Avoid excessive shadows, borders, ornaments, gradients, oversized typography and competing accent colours.

If a design choice makes the site look like a stereotypical AI website, do not implement it—even if a UI library, template or AI design tool suggests it.

## 3. Colour system

Use a restrained palette built around deep ink, warm paper and botanical teal. Teal is the primary brand accent. Muted copper is a rare supporting accent.

### Core palette

| Token | Hex | Role | Usage |
|---|---|---|---|
| Ink | `#172426` | Primary dark | Dark theme background, strong headings and dark surfaces. |
| Deep Slate | `#243638` | Secondary dark | Cards, panels, navigation and layered surfaces. |
| Warm Paper | `#F5F3ED` | Primary light | Light theme background and calm page surfaces. |
| Pure White | `#FFFFFF` | Light surface | Cards, forms and elevated content. |
| Research Teal | `#47796F` | Primary accent | Links, active navigation, buttons, selected states and key highlights. |
| Soft Sage | `#A9BDB2` | Supporting accent | Subtle highlights and secondary emphasis. |
| Muted Copper | `#B98259` | Rare secondary accent | Occasional small markers or editorial details only. |
| Body Muted | `#687875` | Secondary text | Captions, metadata and supporting text in light theme. |
| Dark Muted | `#A8B7B2` | Secondary text | Captions, metadata and supporting text in dark theme. |
| Border Light | `#E2E4DD` | Borders | Dividers and subtle boundaries in light theme. |
| Border Dark | `#354648` | Borders | Dividers and subtle boundaries in dark theme. |
| Muted on Paper | `#62716E` | Secondary text (AA) | Secondary text placed directly on Warm Paper (4.61:1). *Added 2026-11-26 for accessibility.* |
| Teal on Paper | `#45756C` | Accent text (AA) | Links and teal text placed directly on Warm Paper (4.71:1). *Added 2026-11-26 for accessibility.* |

### Theme mapping

| Semantic role | Light theme | Dark theme |
|---|---|---|
| Page background | `#F5F3ED` | `#172426` |
| Surface / card | `#FFFFFF` | `#243638` |
| Primary text | `#202D2B` | `#F2F1EA` |
| Secondary text | `#62716E` on paper · `#687875` on white | `#A8B7B2` |
| Primary accent (fills, buttons with white text) | `#47796F` | `#A9BDB2` |
| Accent text / links | `#45756C` on paper · `#47796F` on white | `#A9BDB2` |
| Accent hover | `#35645B` | `#C0D0C7` |
| Border (dividers) | `#E2E4DD` | `#354648` |
| Form-control border (≥3:1) | `#62716E` | `#A8B7B2` |
| Focus ring | 2px solid `#45756C`, 2px offset | 2px solid `#A9BDB2`, 2px offset |

### Colour rules

- Keep the interface predominantly neutral. Colour should guide attention, not decorate every section.
- Use Research Teal for meaningful interactions and active states.
- Use Muted Copper sparingly. It is not a second primary accent.
- Do not assign a different colour to every discipline. The entire portfolio must retain one recognisable identity.
- Prefer solid fills and subtle tonal differences over gradients.
- Never rely on colour alone to communicate status or selection.
- Do not add new accent colours without approval.
- Verify text, controls and focus states against WCAG 2.2 AA contrast requirements. Do not assume a colour combination is accessible because it looks readable.

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
- Prefer simple rectangular or softly rounded surfaces.
- Avoid excessive nested cards, floating panels and decorative containers.
- Prioritise clarity, scanning and fast access to relevant work.

## 6. Components and interaction style

### Buttons and links

- Primary buttons use Research Teal with a clear text label.
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

All disciplines belong to the same Sheila Fana brand. They must share the same typography, navigation, spacing, component language and core palette.

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
- Never introduce purple, violet, AI-style gradients, glowing effects, sparkles, excessive tags or generic AI visual motifs.
- Avoid silently changing the brand palette, fonts or visual direction.
- If a change is needed for accessibility, usability or technical reasons, explain the issue and propose a specific alternative before changing the source-of-truth direction.
- Update this document only when the owner explicitly approves a brand or visual-system change.
- Keep design tokens and reusable components aligned with this document. Do not create conflicting local colour systems.
- When in doubt, choose the simpler, quieter and more editorial option.

## 12. Short design brief

A thoughtful, editorial portfolio for a multidisciplinary technologist. The identity combines warm paper, deep ink and research teal, supported by Lora and DM Sans typography. It should feel credible, curious, precise and quietly distinctive—more research journal than generic tech template. It must not look like an AI website. Use solid colours, restrained details, clear layouts and genuine work. The experience must remain accessible, responsive, fast and easy for recruiters to navigate.
