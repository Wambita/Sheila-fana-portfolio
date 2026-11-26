# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project status

This is Wambita Sheila Fana's personal portfolio. Sheila is the owner and approves all content. The project is in **Phase 3: public pages**. The data layer (Supabase schema, RLS, repositories) is in place, with obviously fake seed data locally and no real content yet. The plan lives in `docs/` (start with `docs/00-project-overview.md`; the roadmap is in `docs/08-development-plan.md`). Decisions marked **Proposed** are not settled yet.

## Commands

```bash
npm run dev            # dev server (Turbopack)
npm run build          # production build; shows which routes are static (○). Needs `npx supabase start` (pages read the DB)
npm run lint           # ESLint (next + full jsx-a11y recommended)
npm run typecheck      # next typegen && tsc --noEmit (typegen creates LayoutProps/PageProps globals)
npm run format         # Prettier (with Tailwind class sorting)
npm run check:brand    # fails on raw colours, Tailwind palette classes, gradients, blur outside tokens.css
npm test               # Vitest unit tests (src/**/*.test.ts[x])
npx vitest run src/lib/theme.test.ts      # one file;  add -t "name" to filter by test name
npm run test:e2e       # Playwright + axe against `next start` on :3100; run `npm run build` first
npx playwright test e2e/shell.spec.ts --project=desktop   # one spec / one viewport
npm run check          # lint + typecheck + format:check + brand + unit tests
npx supabase start     # local Supabase (Docker Desktop must be running); Studio on :54323
npx supabase db reset  # rebuild local DB from supabase/migrations
npx supabase test db   # pgTAP RLS + constraint tests (supabase/tests/database); also `npm run test:db`
npm run test:integration  # repositories against the local stack + fake seed data (not in `npm test`)
npm run db:types       # regenerate src/lib/supabase/database.types.ts after a schema change
```

Database conventions are in `supabase/CLAUDE.md`.

Node 26 LTS (`.nvmrc`); `engines` requires 22.12 or newer. On Node 20, Vitest's native binding isn't installed and unit tests can't run. If Playwright's browser download fails, set `PLAYWRIGHT_CHANNEL=msedge` to use the installed Edge. The Supabase CLI isn't installed, so use `npx supabase`. Local Supabase requires Docker.

## Non-negotiable rules

- **Never invent portfolio content.** That covers achievements, roles, employers, dates, project outcomes, metrics, publications, certifications, testimonials and biography. Unfinished sections use `InDevelopment` or clearly marked placeholders. If a project's evidence section has no owner-supplied content, hide it.
- **The brand guide is the visual source of truth.** Read `docs/brand-style-guide.md` before touching any styling. Colours exist only as tokens in `src/styles/tokens.css`, exposed as Tailwind utilities (`bg-bg`, `bg-surface`, `text-fg`, `text-fg-muted`, `text-link`, `bg-accent`, `text-on-accent`, `border-border`, `border-control`, …). Tailwind's default palette is disabled. `tokens.test.ts` enforces AA contrast, and `check:brand` enforces no raw colours, purple, gradients or blur. Never edit tokens or the guide without Sheila's approval.
- **No AI attribution:** never add `Co-Authored-By: Claude` trailers, "Generated with Claude Code" lines or any other AI attribution to commits or PRs (owner instruction).
- **Private material:** the GitHub repository is public. Source CVs and other personal documents live in the git-ignored `private/` folder. Never commit them, and never copy contact details (phone number, address) into tracked files.
- **Git:** the default branch is `main`. Use feature branches named `<type>/<short-description>` and Conventional Commits. Never merge into `main`, force-push it, change repository settings or permissions, or deploy to production without explicit approval. Never commit `.env*` files except `.env.example`.
- **Docs move with the code.** Update the relevant `docs/` file in the same branch: schema changes go in doc 07, architecture in doc 06 (and its ADR log), requirements in doc 02, testing in doc 09.

## Architecture (see docs/06 and docs/07)

- **Next.js 16 App Router with Cache Components** (`cacheComponents` + `partialPrefetching` in `next.config.ts`). Data fetching is dynamic by default: repositories must use `"use cache"` + `cacheTag()` so public pages prerender statically, and invalidation uses `revalidateTag`/`updateTag`. Routes stay mounted in React `<Activity>` across navigations, so transient UI state must reset itself (see `src/components/layout/SiteHeader.tsx`). E2E tests should prefer `getByRole`, which ignores hidden Activity content. Read `node_modules/next/dist/docs/` before using unfamiliar Next.js APIs.
- **CSP** is header-based in `next.config.ts` (ADR-012), not nonce-based, because nonces would force dynamic rendering. Add new origins there and in doc 06.
- **Theme:** `src/lib/theme.ts` holds an inline `<head>` script that sets a `light`/`dark` class on `<html>` before first paint, and `tokens.css` switches on that class (with a `prefers-color-scheme` fallback when no class is set). `ThemeToggle` stores an explicit choice in localStorage.
- **Layout:** the root layout renders the skip link, `SiteHeader` (persistent left sidebar on desktop, disclosure menu on mobile, one `<nav aria-label="Primary">`) and `<main id="main">`. Navigation items are defined in `src/lib/navigation.ts`.
- **Data (Phase 2 onward):** Supabase Postgres. RLS is on every table, and anon users can read only published rows. The service-role key is used only in `server-only` modules. The content model is a `content_items` supertable with detail tables and uniform join tables. **Disciplines are data**: one `/disciplines/[slug]` template, never per-discipline components or colours. UI never calls Supabase directly; it goes through `src/lib/content/` repositories, which return Zod-validated types.
- **Planned features:** a daily article sync from the dev.to API and Medium RSS, with a canonical link to the original. A contact form using Turnstile, rate limiting, Supabase and Resend, with messages kept for 3 months. An ATS-safe PDF and .docx CV generated from content data. Reusable `/for/[slug]` focus views, with no per-recruiter tokens.
