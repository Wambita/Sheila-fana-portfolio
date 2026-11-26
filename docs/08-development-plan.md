# 08 — Development Plan and Roadmap

**Status:** Proposed, updated 2026-11-26. Each phase ends with a review. Nothing merges into `main` without owner approval.

## Phases and milestones

| Phase | Goal | Key deliverables | Exit criteria |
|---|---|---|---|
| **0 — Discovery & planning** (current) | Shared understanding | CLAUDE.md, docs, brand guide, decisions | Owner approves the plan and decides O1 |
| **1 — Foundations** | Working skeleton | Next.js + TS strict + Tailwind v4; ESLint, Prettier, Vitest, Playwright, axe; GitHub Actions CI; brand tokens and fonts; theme toggle; sidebar shell; security headers; `.env.example`; Vercel preview deploys | CI green; the shell passes axe in both themes |
| **2 — Data layer** | Content model live locally | Local Supabase; migrations; RLS + pgTAP; clearly fake seed data; generated types; repository layer | RLS and repository tests pass |
| **3 — Public pages, writing, contact** | Browsable portfolio | Home, About, Disciplines template, Projects, Experience, Publications, Credentials; article sync and `/writing`; contact form + Resend + Turnstile; privacy page; 404/error | e2e journeys pass; a11y clean; sync is idempotent |
| **4 — Focus views** | Reusable sharing | `/for/[slug]` | Journey J1 passes |
| **5 — CV** | ATS-safe CV | `/cv`, `/cv/[slug]`, PDF route; PDF text-extraction test | The PDF parses in the correct order |
| **6 — Hardening & content** | Launch-ready | SEO, CSP tuning, performance; Sheila loads real content through Supabase Studio | Sheila signs off the content |
| **7 — Launch** | Production | Hosted Supabase project; Vercel production on `*.vercel.app`; cron enabled | **Explicit owner approval** |
| **8 — Admin dashboard** | Self-service editing | Auth + MFA, content CRUD, view and CV builders, media, contact inbox, audit log | Security review; admin e2e tests |

Phases 4 and 5 can run in parallel.

## Git workflow

- The default branch is `main`, renamed from `master` on 2026-11-26.
- Feature branches: `<type>/<short-description>`. Conventional Commits.
- Every change goes through a PR into `main`, with CI required, the relevant docs updated, and owner approval before merge.
- No force-push to `main`, no repository-setting changes and no production deploys without approval.

## Claude Code tooling (to be added when the relevant code exists)

| Tool | Purpose | When |
|---|---|---|
| Nested `CLAUDE.md` in `src/` | Token, component and data-layer conventions; read the brand guide first | Phase 1 |
| Nested `CLAUDE.md` in `supabase/` | Migration conventions; RLS on every table; regenerate types; update doc 07 | Phase 2 |
| Skill `new-migration` | Migration + RLS policy + pgTAP test + type regeneration + doc update | Phase 2 |
| Subagent `brand-reviewer` | Checks UI diffs against brand guide §2 (no purple, gradients, glows, tag overload) and the tokens | Phase 1 onward |
| Subagent `security-reviewer` | RLS, secrets, headers, contact form and sync endpoint | Phases 2, 3, 8 |
| Subagent `a11y-auditor` | axe, semantics and contrast in both themes | Phase 3 onward |

## Content dependencies (Sheila)

Needed before Phase 6: biography, a portrait (optional), discipline intros, projects in the evidence structure, roles, publications, education, certifications, interests, images with alt text, Medium and dev.to usernames, a contact inbox address, and the Medium data export for older posts.
