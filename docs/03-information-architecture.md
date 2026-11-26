# 03 — Information Architecture and Content Model

**Status:** Updated with owner decisions, 2026-11-26.

## Sitemap and routes

```
/                           Home (recruiter-useful first screen)
/about                      About + personal interests
/portfolio/[slug]           Portfolio (one per discipline; standalone and shareable; one template, own section order)
/disciplines, /portfolio    Redirect to / (old addresses; /disciplines/[slug] → /portfolio/[slug])
/projects                   Projects index (filterable)
/projects/[slug]            Project detail (evidence structure)
/experience                 Employment, volunteering, community impact
/publications               Publications
/writing                    Articles synced from Medium and dev.to
/writing/[slug]             Article page (canonical → original source)
/credentials                Education + certifications
/for/[slug]                 Standing focus view (reusable, e.g. /for/security-roles)
/cv                         Default CV (web, print-optimised)
/cv/[slug]                  CV variant;  /cv/[slug].pdf → downloadable PDF
/contact                    Email link + contact form
/privacy                    Privacy notice
/admin/**                   Phase 8, auth-gated, not linked publicly
```

**Navigation:** a persistent left sidebar on desktop and a top-bar menu on mobile (brand guide §5).
The navbar has two levels (ADR-022). **Main navigation:** the published portfolios by name, in their sort order (no caption), then **About** and **Contact**. **Portfolio navigation:** on a portfolio page the sidebar zooms into that portfolio: a "Main menu" back button, the portfolio's name, its own sections (in its chosen order) and small About and Contact links. "Main menu" zooms back out without leaving the page; opening another portfolio opens its navigation. Each portfolio already contains its own experience, publications, writing and credentials, so they are not repeated in the main navigation.

The **full record** pages (Experience, Education at `/credentials`, Publications, Writing, All projects at `/projects`) list everything across disciplines, including work linked to no portfolio. They are reached from the footer and the homepage, not the navbar. Data is entered once: an item linked to a discipline appears in that portfolio and in the full record; an unlinked item appears only in the full record. **About** is the shared story (who Sheila is, how she works, background, interests, links) that every portfolio points to, rather than a copy in each. There is no separate portfolio index: the homepage and the navbar list them.

**Naming (ADR-021):** visitors only ever see **portfolio**. _Discipline_ is the internal name for the same thing (the `disciplines` table in Studio and the code): one discipline row = one portfolio.

**Page roles:** the homepage summarises the whole portfolio; each discipline page is a focused, self-contained portfolio; shared pages hold supporting information across disciplines; project pages are the detailed case studies.

## Sharing model

There are no per-recruiter links. Sheila shares:

1. **A portfolio**, for example `/portfolio/cybersecurity`, which is already tailored by data.
2. **A focus view**, for example `/for/frontend-roles`, created once and reused. It holds an intro note, a hand-picked ordered selection of items and a link to its CV variant.
3. **A CV link**, for example `/cv/cybersecurity.pdf`.

## Content model

Every content item shares one core (`content_items`) and has a type-specific detail record.

| Content type  | Type-specific fields (indicative)                                                                                                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project       | role, status, dates, repo/demo URLs, and the evidence sections: context, problem, process, decisions, implementation, outcomes                                                                                                    |
| Experience    | kind (`employment` \| `volunteering` \| `community`), organisation, role, location, dates                                                                                                                                         |
| Publication   | authors, venue, year, DOI/URL, citation type, abstract                                                                                                                                                                            |
| Education     | institution, qualification, field, dates                                                                                                                                                                                          |
| Certification | issuer, issued/expiry dates, credential ID, verification URL                                                                                                                                                                      |
| Article       | source (`medium` \| `devto`), source URL (canonical), published date, excerpt, sanitised HTML, tags, sync metadata                                                                                                                |
| Engagement    | kind (`workshop` \| `training` \| `event` \| `talk` \| `judging` \| `mentoring` \| `delegation` \| `other`), host organisation, partner organisations, role, date or date range, location, audience, confirmed reach count, links |
| Interest      | short description, optional media                                                                                                                                                                                                 |

Shared fields: `slug`, `title`, `summary`, `body`, `status` (draft/published), `featured`, `sort_date`, cover media and SEO overrides.

**Taxonomies:** Discipline (addable, ordered, publishable) and Skill (grouped).

**Relationships** (all many-to-many):

- item ↔ discipline, with `is_primary` and an emphasis note per discipline
- item ↔ skill
- item ↔ item, typed (for example, an article _about_ a project, or a publication _derived from_ a project)
- focus view → ordered items, with annotations
- CV variant → ordered sections → ordered items

## How a discipline page is assembled

The discipline record supplies the name, tagline, intro and capabilities, and its `sections` list decides which portfolio sections appear and in what order (for example skills and credentials first for a security portfolio, case studies first for design). Each section shows only published items linked to the discipline: case studies (projects featured for this discipline), other projects, the discipline's skills grouped by kind, experience (roles and engagements, newest first), publications, writing, and education and credentials. Empty sections are hidden. Items without a page of their own link to their canonical source (publication, credential verification, original article). The page has no link away from the portfolio, so a shared link stands on its own.
