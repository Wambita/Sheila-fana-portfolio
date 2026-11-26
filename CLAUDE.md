# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This is Sheila Fana's personal portfolio. Sheila is the owner and approves all content. The project is in **Phase 0: discovery and planning**. No application code exists yet: `src/` and `public/` are empty, and there is no `package.json`. The plan lives in `docs/` (start with `docs/00-project-overview.md`; the roadmap is in `docs/08-development-plan.md`). Decisions marked **Proposed** are not settled yet, and implementation starts only after Sheila approves the plan.

`setup-portfolio.ps1` is the original scaffolder. It is idempotent and creates the empty directory and doc structure. It is not a build tool.

## Non-negotiable rules

- **Never invent portfolio content.** That covers achievements, roles, employers, dates, project outcomes, metrics, publications, certifications, testimonials and biography. Use clearly marked placeholders (`[[PLACEHOLDER: …]]`) or seed data labelled as fake fixtures. If a project's evidence section (context, problem, outcomes…) has no owner-supplied content, hide it; never fill it in.
- **The brand guide is the visual source of truth.** Read `docs/brand-style-guide.md` before touching any styling, tokens, layout or components. It bans purple, violet and indigo, gradients, glows, glassmorphism, sparkle or "AI" motifs, tag overload, heavy motion and discipline-specific colours. Never edit the guide without Sheila's explicit approval. If accessibility or technical needs conflict with it, propose an alternative first (as in `docs/05-design-system.md` §Accessibility findings).
- **Git:** the default branch is `main`. Work on feature branches named `<type>/<short-description>` and use Conventional Commits. Never merge into `main`, force-push it, change repository settings or permissions, or deploy to production without explicit approval. Never commit `.env*` files except `.env.example`.
- **Docs move with the code.** Every significant change must update the relevant doc in `docs/` in the same branch: schema changes go in doc 07, architecture in doc 06 (and its ADR decision log), requirements in doc 02.

## Planned architecture (see docs/06 and docs/07)

- **Next.js App Router + TypeScript (strict) + Tailwind CSS v4**, hosted on Vercel Hobby (free `*.vercel.app`, no custom domain yet). Public pages are statically generated and refreshed through on-demand revalidation.
- **Supabase Free (Postgres)**. RLS is enabled on every table, and anon users can only `SELECT` published rows. The service-role key may only be used in `server-only` modules (article sync, contact form inserts). Until the Phase 8 admin dashboard exists, content is edited in Supabase Studio.
- **Content model:** a `content_items` supertable with 1:1 detail tables (projects, experiences, publications, education, certifications, articles, interests) and uniform join tables (item↔discipline, item↔skill, item↔item). **Disciplines are data.** One `/disciplines/[slug]` template serves them all, so never create per-discipline components or styles. Focus views (`/for/[slug]`) and CV variants are reusable, ordered selections of content items. There are no per-recruiter tokens.
- **Layering:** UI never calls Supabase directly. All reads go through `src/lib/content/` repositories, which return Zod-validated types from `src/types/`.
- **Articles:** a daily Vercel Cron job hits `/api/sync/articles` (guarded by `CRON_SECRET`). It pulls from the dev.to API and Medium RSS (which returns only about the latest 10 posts) and upserts into Postgres keyed on the source URL. HTML is sanitised. Article pages set `rel="canonical"` to the original post.
- **Contact:** a server action validates input with Zod, verifies Turnstile, rate-limits, inserts into `contact_messages` and notifies Sheila through Resend. A `mailto:` link is offered too.
- **CV:** ATS-safe, single-column, text-based PDF generated with `@react-pdf/renderer` from the same repository data as `/cv/[slug]`. Rules are in doc 06 §CV.

## Commands

None exist yet. Phase 1 will add the real ones here: dev, build, lint, typecheck, unit test (and running a single test), e2e, plus Supabase local, migration and type-generation commands. Environment: Node 20.16 and npm 10. The Supabase CLI and `gh` aren't installed, so use `npx supabase`. Local Supabase requires Docker.
