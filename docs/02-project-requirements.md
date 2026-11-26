# 02 — Product Requirements Document

**Status:** Owner decisions recorded 2026-11-26. `MUST`, `SHOULD` and `COULD` follow MoSCoW priority.

## 1. Functional requirements

### Content presentation

- FR-01 MUST: The home page is the **overall portfolio summary** (owner direction 2026-11-27, ADR-019): name and introduction, a short multidisciplinary overview (`profile.overview`), the discipline portfolios with links, selected projects across disciplines, a concise skills overview by category (highlighted skills only, each category linked to its portfolio), key experience, links to the shared pages, and a CV download once the CV exists (Phase 5). It summarises without duplicating the portfolios.
- FR-02 MUST: About page with biography and approach, plus personal interests.
- FR-03 MUST: **Discipline portfolios** (ADR-019). Each discipline is a **standalone, shareable portfolio**: a recruiter given one link sees everything relevant to that field (intro, capabilities, case studies, projects, skills, experience, publications, writing, education and credentials), filtered from the shared data, without needing other pages. Still one data-driven template (`/disciplines/[slug]`), but each discipline chooses which sections appear and in what order (`disciplines.sections`), so the page follows the nature of the field. Adding, renaming, reordering or unpublishing a portfolio is a data change only, and the navbar lists the published portfolios. A portfolio is published only when it has enough genuine work behind it.
- FR-03a MUST: **Skills are organised** (ADR-019): categories for the homepage overview, a kind per skill (technical skill, tool, professional competency), and an ordered list of relevant skills per discipline. Only skills actually documented by the owner are entered; categories are never padded.
- FR-04 MUST: Projects index with filters (discipline, technology, year) and project detail pages structured as evidence: context, problem, role, process, decisions, implementation and verified outcomes.
- FR-05 MUST: Experience timeline covering employment, volunteering and community impact, filterable by kind.
- FR-06 MUST: Publications with citation details and DOI or URL.
- FR-07 MUST: Education and certifications, with an optional verification link.
- FR-08 MUST: Any content item can relate to any number of disciplines, skills and other items.
- FR-08a MUST: **Community & Volunteering** discipline (owner decision, 2026-11-26). Ongoing roles are experiences (`kind = community | volunteering`). Initiatives Sheila founded or led are projects. One-off activities (workshops, trainings, events organised, judging, talks, summit delegations, mentoring programmes) are **engagements**. Any of them can also belong to a technical discipline, for example a cybersecurity awareness session.
- FR-08b MUST: Reach figures (for example "400+ learners") are stored as separate, owner-confirmed fields, never inferred, and shown only when confirmed.
- FR-08c MUST: Third-party personal data from CVs, such as referees' names, emails and phone numbers, is never stored in the database or the repository. CVs say "References available on request".
- FR-09 COULD: Site search.

### Writing (Medium and dev.to)

- FR-40 MUST: A `/writing` page lists Sheila's articles from Medium and dev.to, newest first, with title, date, source, excerpt and tags.
- FR-41 MUST: Articles sync automatically. There is no manual copying.
- FR-42 SHOULD: Article pages on the site with the full text where the source allows it. Each sets a `rel="canonical"` link to the original post so search engines don't treat it as duplicate content.
- FR-43 SHOULD: Articles can be linked to disciplines and projects like any other content item.
- FR-44 MUST: Synced HTML is sanitised before it is stored or rendered.

### Sharing for recruiters (no per-recruiter link generation)

- FR-10 MUST: Every page has a stable, shareable URL. Discipline pages double as recruiter-ready views (for example `/disciplines/cybersecurity`).
- FR-11 SHOULD: A small set of standing **focus views** (for example `/for/security-roles`) that Sheila defines once and reuses for every recruiter. Each is an ordered selection of items with an intro and a matching CV.
- FR-12 MUST NOT (v1): per-recruiter tokens, expiry or view tracking.

### CV

- FR-14 MUST: An ATS-safe CV, generated from the same content, available as a web page (`/cv`), a downloadable text-based PDF, and a .docx file.
- FR-15 MUST: CV variants (owner decision, 2026-11-26): **UI/UX Design**, **Frontend Development**, **Full-stack Development**, **Cybersecurity** (new; built from existing security training, certifications and projects) and **Community & Mentorship**. All share one layout and differ in selection, ordering, section placement, title framing and chosen bullets (doc 07 §Framing).
- FR-15a MUST: A role can be framed differently per CV (title, section, bullets), but dates, organisation and facts are always taken from the master record.
- FR-15b MUST: Only owner-confirmed figures appear on CVs or the site. Unconfirmed metrics from earlier CVs are dropped, and the claim is described without the number.
- FR-16 MUST: The CV follows the ATS rules in doc 06 §CV, and CI checks that the PDF's text extracts in the right reading order.

### Contact

- FR-17 MUST: A contact page with a `mailto:` link and a contact form (name, email, subject, message).
- FR-18 MUST: Form submissions are stored and emailed to Sheila. They are protected by a spam challenge, a honeypot field and rate limiting.
- FR-19 MUST: A privacy notice explaining what the form collects and how long it is kept.

### Administration (Phase 8)

- FR-20 MUST: Single-owner authenticated admin with MFA.
- FR-21 MUST: Create, edit and delete for all content types, disciplines, focus views and CV variants, with a draft/published workflow.
- FR-22 SHOULD: Media upload with alt text required, an inbox for contact messages and an audit log.
- _Interim (Phases 2–7):_ content is edited in the Supabase Studio table editor, which is free, already authenticated and needs no code.

### Theming

- FR-30 MUST: Light and dark themes. The default follows the system, the user can override it, the choice persists, and there is no flash of the wrong theme.

## 2. Non-functional requirements

- NFR-01 Accessibility: WCAG 2.2 AA (doc 09). The palette contrast findings are in doc 05.
- NFR-02 Performance: static or ISR pages, with Core Web Vitals in the "good" range.
- NFR-03 Security: doc 06 §Security.
- NFR-04 SEO: metadata, Open Graph images, sitemap, robots and JSON-LD.
- NFR-05 Privacy: no third-party trackers. Contact data is kept for a limited time.
- NFR-06 Cost: everything runs on free tiers (doc 06 §Hosting).
- NFR-07 Brand compliance: every UI change follows [brand-style-guide.md](./brand-style-guide.md).

## 3. Decisions made by the owner (2026-11-26)

| #      | Topic             | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1     | Owner             | Wambita Sheila Fana is the owner and content approver                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Q2     | Hosting           | Free tier. Recommendation in doc 06 §Hosting                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Q3     | Domain            | None for now. Use the free `*.vercel.app` subdomain                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Q4/5/6 | Recruiter links   | No per-recruiter link generation. Stable page URLs plus reusable focus views                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Q4     | Contact           | Email link and contact form                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Q7     | CV                | Plain, ATS-friendly, following the industry standard                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Q8     | Blog              | Show Medium and dev.to articles on the site                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Q10    | Disciplines       | Addable by data. Initial labels from brand guide §8                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| D1–D3  | Brand             | Brand guide supplied and approved                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Q12    | Branch            | Rename `master` to `main`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| O1     | Palette           | Adjustments A1–A4 approved                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| O2     | Writing sources   | Medium `@wambitafana`, dev.to `wambita_sheila_fana`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| O3     | Contact           | Sheila's Gmail address receives form messages and is shown in the `mailto:` link. It is configured with the `CONTACT_TO_EMAIL` environment variable and the `profile.links` data, not hard-coded                                                                                                                                                                                                                                                                                                                                                                                                                          |
| O4     | Retention         | Contact messages kept for **3 months** (tentative; easy to change)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| O5     | Articles          | Full text on the site for dev.to; excerpts linking to Medium                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| O6     | DOCX CV           | Yes. Offer a .docx export alongside the PDF                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| O7     | Launch portfolios | Updated 2026-11-27. **Main portfolios:** Full-stack Development (primary identity: the intersection of design, code and security, building user-centred, secure systems), Frontend Engineering, UI/UX & Product Design, Cybersecurity, and **Community & Volunteering** (for community roles). Game Development and Research & Innovation (incl. robotics, IoT, AI) stay as drafts. Positioning lives in `profile.headline`/`overview` and portfolios are data, so a future Backend Development portfolio or a shift in positioning is a Studio change, not code. The five main portfolios match the CV variants in FR-15 |

| — | Name | **Wambita Sheila Fana** everywhere (site, CVs, metadata), 2026-11-26 |
| — | Location | Nairobi |

## 4. Open questions

None blocking. New questions will be added here as they arise.
