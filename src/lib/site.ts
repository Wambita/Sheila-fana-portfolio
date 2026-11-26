/**
 * Site-wide identity. Copy here is owner-approved (docs/brand-style-guide.md §1).
 * Profile content moves to the database in Phase 2.
 */
export const site = {
  name: "Wambita Sheila Fana",
  positioning:
    "A multidisciplinary technologist working across design, software, cybersecurity, research and emerging technologies.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/**
 * Launch disciplines approved by the owner on 2026-11-26 (doc 02 §3).
 * Temporary: replaced by the `disciplines` table in Phase 2.
 */
export const launchDisciplines = [
  "Product & UI/UX Design",
  "Frontend Development",
  "Cybersecurity",
  "Full-stack Development",
] as const;
