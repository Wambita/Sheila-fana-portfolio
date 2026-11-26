# 09 — Testing, Quality Assurance and Standards

**Status:** Proposed. Tooling is set up in Phase 1.

## Test layers

| Layer         | Tool                                                                                         | Scope                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Static        | `next typegen && tsc --noEmit` (strict), ESLint (next + full jsx-a11y recommended), Prettier | Every commit / CI                                                                                         |
| Unit          | Vitest + Testing Library                                                                     | Repository layer, mappers, Zod schemas, components                                                        |
| Database      | pgTAP via `supabase test db`                                                                 | RLS policies (anon cannot read drafts, cannot read contact messages, cannot write), constraints, triggers |
| End-to-end    | Playwright on desktop and mobile (Pixel 7) viewports, against a production build             | Journeys J1–J7 (doc 04), theme toggle, filters, contact form, CV download                                 |
| Accessibility | `@axe-core/playwright` on every route, light and dark                                        | No serious or critical violations                                                                         |
| Performance   | Lighthouse CI on key routes                                                                  | Score of 95 or more in each category (budgets)                                                            |
| Security      | `npm audit`, header checks in e2e, dependency updates                                        | CI                                                                                                        |
| CV            | PDF text extraction (`pdf-parse` or similar)                                                 | Headings and sections extract in reading order; no text is missing                                        |
| Sync          | Unit tests with recorded Medium RSS and dev.to API fixtures                                  | Idempotent upserts; HTML sanitised; malformed feeds handled                                               |
| Brand         | CI check for hex colours outside `tokens.css` and for Tailwind default-palette classes       | Fails on violation                                                                                        |

Colour tokens are also unit-tested: `src/lib/color/tokens.test.ts` asserts every text and control pair in `tokens.css` meets AA in both themes, so a token edit that breaks contrast fails CI.

### Running tests locally

- `npm test` runs the unit tests (needs Node 22.12 or newer). Run a single file with `npx vitest run src/lib/theme.test.ts`, or filter by name with `-t "resolveTheme"`.
- `npm run build && npm run test:e2e` runs the end-to-end tests. Run one spec with `npx playwright test e2e/shell.spec.ts --project=desktop`. If Playwright's browser download is blocked, set `PLAYWRIGHT_CHANNEL=msedge` to use the installed Edge.

CI runs on GitHub Actions for every PR. A PR is merge-ready only when all checks are green.

## Accessibility standard: WCAG 2.2 AA

- Semantic landmarks, a logical heading order and a skip link.
- Full keyboard operation and visible focus (`:focus-visible`, at least 3:1 contrast).
- Colour contrast checked for both themes. Colour is never the only signal.
- `prefers-reduced-motion` respected.
- Alt text required at the data level (`media_assets.alt_text NOT NULL`).
- Target size of at least 24×24px.
- Manual screen-reader smoke test (NVDA on Windows) before each milestone.

## Definition of done

- Acceptance criteria met, with tests added or updated.
- Lint, typecheck, unit, e2e and a11y checks pass in CI.
- Relevant `docs/` updated in the same branch, and the decision log updated where applicable.
- No placeholder content presented as real.
- UI changes comply with [brand-style-guide.md](./brand-style-guide.md).
- Reviewed and approved by the owner before merge.

## Documentation standards

- `docs/` is the source of truth for product and architecture. `CLAUDE.md` is the source of truth for how to work in the repository.
- Each doc carries a status and is updated whenever behaviour, schema or decisions change.
- Architecture decisions are recorded as ADR rows in doc 06.
