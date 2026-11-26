# 06 — Technical Architecture

**Status:** Proposed, updated with owner decisions on 2026-11-26. Free-tier limits change over time, so they are re-checked before launch (Phase 7).

## Stack

| Choice                | Verdict | Notes                                                                                                                                                                                                                                                             |
| --------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js (App Router)  | ✅      | Static generation plus on-demand revalidation. Route handlers for the PDF CV, OG images and sync. Version 16.4, with Cache Components and Partial Prefetching enabled. Requires Node 22.12 or newer for the toolchain; the project targets Node 26 LTS (ADR-014). |
| TypeScript (strict)   | ✅      | Shared domain types, with Zod at the data boundary.                                                                                                                                                                                                               |
| Tailwind CSS v4       | ✅      | `@theme` tokens from doc 05. The default palette is disabled.                                                                                                                                                                                                     |
| Supabase + PostgreSQL | ✅      | The relational model suits reusable relationships. RLS, Auth for Phase 8, and Storage for media.                                                                                                                                                                  |

## Hosting (recommended: all free)

| Service                  | Purpose                            | Free tier (verify at launch)                                                                                                                           |
| ------------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Vercel Hobby**         | Hosting Next.js                    | Free for personal, non-commercial sites. Includes a free `*.vercel.app` subdomain, HTTPS, preview deploys per PR, and cron jobs (once a day on Hobby). |
| **Supabase Free**        | Postgres, Auth, Storage            | About 500 MB database and 1 GB storage. **Projects pause after about 7 days without activity.**                                                        |
| **Resend Free**          | Contact form email notifications   | About 3,000 emails a month and 100 a day. Fine for one person's portfolio.                                                                             |
| **Cloudflare Turnstile** | Spam challenge on the contact form | Free, and privacy-friendly.                                                                                                                            |

**Why Vercel:** Vercel makes Next.js, so it supports every Next.js feature with no adapter. Free alternatives are Cloudflare Pages or Workers with the OpenNext adapter, which has more generous limits but needs more setup and has a few feature gaps, and Netlify. Vercel's Hobby plan is meant for non-commercial use. A personal portfolio fits that. If Sheila later sells services through the site, re-evaluate.

**Supabase pausing:** public pages are pre-built, so visitors never depend on the database being awake. The daily article sync (below) writes to the database, which also keeps the project active.

**Domain:** use `sheila-fana.vercel.app` (or similar) for now. A custom domain can be added later without code changes. It costs roughly $10–15 a year and is not free.

## System overview

```
Visitor ──► Vercel (static/ISR pages, route handlers)
               │ server-only data layer (src/lib/content)
               ▼
          Supabase: Postgres (RLS) · Storage · Auth (Phase 8)
               ▲
Vercel Cron (daily) ── /api/sync/articles ──► Medium RSS + dev.to API
Contact form ── server action ──► Supabase (contact_messages) + Resend email
```

- **Rendering:** Next.js 16 **Cache Components** model (ADR-013). Data fetching is dynamic by default, so repository functions opt into caching with `"use cache"` plus `cacheTag(...)`. That lets public pages prerender as static shells. The sync job calls `revalidateTag`, and admin saves (Phase 8) call `updateTag`. Routes stay mounted in React `<Activity>` across navigations, so transient UI state (menus, dialogs, form success messages) must reset itself; see `SiteHeader`.
- **Data layer:** `src/lib/content/*` repositories are the only code that talks to Supabase (import from `@/lib/content`). They are `server-only`, validate every row with Zod and return camelCase domain types (`schemas.ts`); query errors and schema mismatches throw rather than render empty pages. Empty text is normalised to `null`, and a project's `evidence` contains only sections with text, so the UI hides the rest. Database types are generated into `src/lib/supabase/database.types.ts` with `npm run db:types`.
- **Cache lifetime:** every repository read uses `cacheLife("hours")` and tags from `src/lib/content/tags.ts` (`content` for everything, plus per-type, per-item, `content:profile` and `content:disciplines` tags). Until the admin dashboard exists, content is edited in Supabase Studio, which can't call `revalidateTag`, so edits appear on the site within about an hour. The sync job and later admin saves invalidate by tag immediately.
- **No fetch Data Cache for Supabase (ADR-016):** both Supabase clients pass a `fetch` with `cache: "no-store"`. Otherwise Next.js stores every Supabase response made inside `"use cache"` in its fetch Data Cache, which persists across builds and deployments (Vercel restores `.next/cache`), so a redeploy could keep serving old content. Caching is left entirely to `"use cache"`, which is per deployment and tag-invalidated.
- **Dynamic routes (ADR-017):** `/projects/[slug]` and `/disciplines/[slug]` prerender every published slug. Cache Components requires `generateStaticParams` to return at least one entry, so with nothing published they return a placeholder slug (`src/lib/static-params.ts`) that renders the 404 page. Slugs published later render on first visit and are then cached. Because those pages stream, an unknown slug shows the not-found page with `noindex` but an HTTP 200 status; a true 404 status would require `dynamicParams = false`, which would hide newly published items until the next deploy.
- **Builds read Supabase:** `next build` prerenders pages from the database, so it needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` and a reachable project (locally, `npx supabase start`). A failed query fails the build instead of publishing empty pages.
- **Supabase clients:** `src/lib/supabase/public-client.ts` (anon, reads under RLS) and `service-client.ts`, a service-role client restricted to `server-only` modules (sync job and contact inserts). Settings are validated by `env.ts`, which fails with a readable message when they are missing. An admin session client arrives in Phase 8.

## Articles from Medium and dev.to

Both platforms offer free, public, read-only access to your own posts. No scraping is needed.

| Source | Feed                                                                                                                                  | Notes                                                                                                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dev.to | Public API: `GET https://dev.to/api/articles?username=<name>` (paginated) and `GET /api/articles/{id}` for the full HTML and Markdown | Returns all published articles with tags and dates. No API key is needed for public reads.                                                                                        |
| Medium | RSS: `https://medium.com/feed/@<username>`                                                                                            | Returns only the **~10 most recent** posts, and gives only a preview for member-only (paywalled) posts. Older posts need a **one-time import** from Medium's account data export. |

**Sync job:** a daily Vercel Cron call to `/api/sync/articles`, protected by a `CRON_SECRET` header. It fetches both sources and upserts the posts into `content_items`/`articles`, keyed on the source URL, so the archive keeps growing beyond Medium's 10-post window. It then revalidates `/writing`.

**Display:** full text on the site where available, sanitised (`sanitize-html`, with Medium's tracking pixel removed), with `rel="canonical"` pointing to the original post so the site isn't penalised as duplicate content. Where only an excerpt is available, the page shows the excerpt and a "Read on Medium" link. Images stay hosted on the source CDNs, which are allow-listed in the CSP `img-src`.

**To verify in Phase 3 (spike):** the current RSS and API shapes and rate limits for both sources.

## Contact form

Fields are name, email, subject and message, plus a hidden honeypot field and a Turnstile token. The form submits to a server action that:

1. validates the input with Zod and verifies Turnstile on the server,
2. rate-limits by IP hash, tracked in Postgres with no extra service,
3. inserts into `contact_messages` (anon has no table access; the insert uses the server-only client), and
4. sends a notification to Sheila's private inbox through Resend, with `reply-to` set to the sender.

The page also shows a plain `mailto:` link as an alternative. Messages are deleted after **3 months** by a daily cleanup in the sync cron job. The recipient comes from `CONTACT_TO_EMAIL`.

## CV generation (ATS standard)

Industry practice for ATS-safe CVs, which the generator applies:

- **Single column**, reverse-chronological. No tables, text boxes, multiple columns, icons, graphics, photos or progress bars.
- **Standard headings:** Summary, Experience, Education, Skills, Certifications, Projects, Publications, Volunteering.
- **Contact details in the body text**, not in a page header or footer, because some ATS parsers skip those.
- **Consistent dates** (`Jan 2024 – Present`), with each job title, organisation and location on predictable lines.
- **Text-based PDF:** real selectable text with an embedded font (DM Sans), never an image. File name `Sheila-Fana-CV.pdf`. Aim for 1–2 pages.
- Skills listed as plain comma-separated text, taken only from real content.

The CV is built with `@react-pdf/renderer` in a route handler (`/cv/[slug].pdf`), from the same repository data as `/cv/[slug]`. A CI test extracts the PDF text and checks that the headings and their order are preserved. A `.docx` export (`/cv/[slug].docx`) is generated with the `docx` library from the same data, with the same single-column structure (owner decision O6).

## Security standards

1. **RLS on every table.** Anon users can read only published rows. Anon has no access to `contact_messages`, `sync_runs` or the admin tables.
2. **Admin (Phase 8):** Supabase Auth with MFA, an `admins` allowlist checked in RLS, and no public sign-up. Middleware gates `/admin`, and every mutation re-checks authorisation on the server.
3. **Secrets:** only the Supabase URL, the anon key and the Turnstile site key are public. The service-role key, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY` and `CRON_SECRET` are server-only, stored in Vercel environment variables, and never committed. `.env.example` lists every variable.
4. **HTTP headers** (set in `next.config.ts`): a header-based CSP, HSTS, `nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` and `frame-ancestors 'none'`. The CSP allows `'unsafe-inline'` scripts because Next.js bootstrapping and the theme script are inline. A nonce-based CSP would force every page to render dynamically, which conflicts with ADR-003 (ADR-012). Risk is limited: there are no third-party scripts, all synced HTML is sanitised, and React escapes output. `img-src` gains Supabase Storage and the Medium and dev.to CDNs in Phase 3. The Phase 8 admin routes, which are dynamic anyway, will add a nonce-based CSP through `proxy.ts`.
5. **Input and output:** Zod on every input. Synced HTML is sanitised before it is stored and escaped on render.
6. **Dependencies:** Dependabot, `npm audit` in CI and a committed lockfile.
7. **Privacy:** no trackers, a privacy notice, contact data kept only for a set period, and IPs stored only as salted hashes.

## Decision log

| ID      | Date       | Decision                                                                                                                                                                                                                                                                                                                                                                          | Status           |
| ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| ADR-001 | 2026-11-26 | Next.js + TS + Tailwind v4 + Supabase                                                                                                                                                                                                                                                                                                                                             | Proposed         |
| ADR-002 | 2026-11-26 | Content in Postgres with a `content_items` supertable                                                                                                                                                                                                                                                                                                                             | Proposed         |
| ADR-003 | 2026-11-26 | Static generation plus on-demand revalidation                                                                                                                                                                                                                                                                                                                                     | Proposed         |
| ADR-004 | 2026-11-26 | ~~Token-based recruiter links~~ replaced by stable URLs and reusable focus views (owner decision)                                                                                                                                                                                                                                                                                 | Accepted         |
| ADR-005 | 2026-11-26 | Repository-layer boundary; no Supabase calls from the UI                                                                                                                                                                                                                                                                                                                          | Proposed         |
| ADR-006 | 2026-11-26 | Hosting: Vercel Hobby + Supabase Free + Resend + Turnstile; no custom domain yet                                                                                                                                                                                                                                                                                                  | Proposed         |
| ADR-007 | 2026-11-26 | Articles synced daily from the dev.to API and Medium RSS into Postgres, shown with a canonical link to the source                                                                                                                                                                                                                                                                 | Proposed         |
| ADR-008 | 2026-11-26 | ATS-safe, text-based PDF CV generated from content data                                                                                                                                                                                                                                                                                                                           | Accepted (owner) |
| ADR-009 | 2026-11-26 | Brand style guide is the visual source of truth                                                                                                                                                                                                                                                                                                                                   | Accepted (owner) |
| ADR-010 | 2026-11-26 | Default branch renamed `master` → `main`                                                                                                                                                                                                                                                                                                                                          | Accepted (owner) |
| ADR-011 | 2026-11-26 | Palette contrast adjustments A1–A4                                                                                                                                                                                                                                                                                                                                                | Accepted (owner) |
| ADR-012 | 2026-11-26 | Header-based CSP for static pages instead of nonces (Next.js nonces require dynamic rendering); nonce CSP for the dynamic admin later                                                                                                                                                                                                                                             | Proposed         |
| ADR-013 | 2026-11-26 | Adopt the Next.js 16 Cache Components model: `use cache` + `cacheTag` in repositories, `revalidateTag`/`updateTag` for invalidation                                                                                                                                                                                                                                               | Proposed         |
| ADR-014 | 2026-11-26 | Node 26 LTS (current Active LTS; `.nvmrc` and CI). `engines >= 22.12` because of Vitest, jsdom and Rolldown requirements; Node 20 reached end of life in April 2026                                                                                                                                                                                                               | Proposed         |
| ADR-015 | 2026-11-26 | Community & Volunteering discipline plus a new `engagements` content type for one-off community activities; referee details never stored                                                                                                                                                                                                                                          | Accepted (owner) |
| ADR-016 | 2026-11-26 | Supabase clients bypass the fetch Data Cache (`no-store`); caching lives only in `"use cache"`                                                                                                                                                                                                                                                                                    | Proposed         |
| ADR-017 | 2026-11-26 | Dynamic content routes prerender published slugs, fall back to a 404 placeholder when none exist, and render new slugs on demand (soft 404 for unknown slugs)                                                                                                                                                                                                                     | Proposed         |
| ADR-018 | 2026-11-26 | Monochrome colour system (dark and light as semantic inversions, no accent) and restrained glass on navigation surfaces only, replacing the teal palette and the no-glass rule; sidebar section navigation with scroll tracking                                                                                                                                                   | Accepted (owner) |
| ADR-019 | 2026-11-27 | One central portfolio plus standalone discipline portfolios: homepage as overall summary, navbar = published disciplines + About and Contact, with full-record pages (all items across disciplines, incl. unlinked ones) in the footer, per-discipline section order via `disciplines.sections` (still one template), structured skills (categories, kinds, per-discipline lists) | Accepted (owner) |
