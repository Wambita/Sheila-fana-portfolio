# 10 — Project Retrospective

Updated at the end of each phase.

## Phase 0 — Discovery & planning (2026-11-26)

**Found:** a scaffolded repository with empty `docs/`, `src/` and `public/` directories, a README and the `setup-portfolio.ps1` scaffolder. There was no application code or existing specification.

**Done:**

- CLAUDE.md and the first drafts of docs 00–09.
- Owner decisions recorded (doc 02 §3).
- Brand style guide added as the visual source of truth.
- `master` renamed to `main`.

**Learned:** the approved palette has two pairs that fall slightly below AA contrast on Warm Paper (Body Muted at 4.18:1 and Research Teal text at 4.47:1). Sheila approved the proposed fixes, A1–A4 in doc 05.

**Resolved:** all Phase 0 questions were answered (doc 02 §3), and contrast fixes A1–A4 were approved and applied to the brand guide.

**Pending:** the GitHub default-branch switch to `main` (done by the owner in GitHub settings).

## Phase 1 — Foundations (merged, 2026-11-26)

**Done:**

- Next.js 16.4 + TypeScript strict + Tailwind v4 scaffold.
- Brand tokens, with Tailwind's default palette disabled.
- Lora, DM Sans and JetBrains Mono via `next/font`.
- Light and dark themes with no flash of the wrong theme.
- Sidebar and mobile menu shell, a skip link, and honest "in development" placeholder pages.
- Security headers.
- Brand guard script, a token contrast test, unit tests, Playwright and axe e2e tests (both themes, desktop and mobile), and a GitHub Actions CI workflow.

**Learned:**

- Next.js 16 nonce-based CSP forces dynamic rendering, so the project uses a header-based CSP for static pages (ADR-012).
- Cache Components changes the caching model (ADR-013).
- The toolchain needs Node 22.12 or newer, and Node 20 is end of life (ADR-014).
- Playwright's browser download was blocked locally; Edge works through `PLAYWRIGHT_CHANNEL`.

**Pending:**

- Owner upgrades local Node to 24 LTS, which is required to run the unit tests locally.
- Owner connects the repository to Vercel for preview deploys.
- First CI run on GitHub.
