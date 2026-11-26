/**
 * Site-wide identity. Copy here is owner-approved (docs/brand-style-guide.md §1).
 * It is the fallback when the profile record is missing, and is used for metadata.
 * Disciplines, projects and the biography come from the database.
 */
export const site = {
  name: "Wambita Sheila Fana",
  positioning:
    "A multidisciplinary technologist working across design, software, cybersecurity, research and emerging technologies.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
