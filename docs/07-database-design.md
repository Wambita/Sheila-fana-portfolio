# 07 — Database Design

**Status:** Proposed. The physical schema is implemented in `supabase/migrations/` (Phase 2, 2026-11-26) and runs locally; it is not yet merged or deployed. The Phase 8 tables (`admins`, `audit_log`) are not created yet. Migration conventions: `supabase/CLAUDE.md`.

## Approach

**Class-table inheritance.** Every piece of portfolio content is a row in `content_items`, with a 1:1 detail table for its type. This keeps foreign keys real and lets every relationship, focus view and CV reference a single `content_item_id`.

## Entities

```
profile (singleton)         id, full_name, headline, bio, location, avatar_media_id, links jsonb
disciplines                 id, slug UNIQUE, name, tagline, intro, sort_order, status (draft|published)
skills                      id, slug, name, skill_group
media_assets                id, storage_path, alt_text NOT NULL, width, height, credit

content_items               id, type (enum), slug, title, summary, body, status (draft|published),
                            featured, sort_date, cover_media_id, seo jsonb, created_at, updated_at
  UNIQUE (type, slug)
  ├─ projects               item_id PK/FK, role, project_status, started_on, ended_on, repo_url, demo_url,
  │                         context, problem, process, decisions, implementation, outcomes  (all nullable)
  ├─ experiences            item_id, kind (employment|volunteering|community), organisation, role,
  │                         location, started_on, ended_on
  ├─ publications           item_id, authors jsonb, venue, year, doi, url, citation_type, abstract
  ├─ education              item_id, institution, qualification, field, started_on, ended_on
  ├─ certifications         item_id, issuer, issued_on, expires_on, credential_id, verify_url
  ├─ articles               item_id, source (medium|devto), source_id, source_url UNIQUE (canonical),
  │                         published_at, excerpt, html_sanitised, source_tags text[], full_text bool,
  │                         last_synced_at
  ├─ engagements            item_id, kind (workshop|training|event|talk|judging|mentoring|delegation|other),
  │                         host_org, partner_orgs text[], role, started_on, ended_on, location, audience,
  │                         reach_count int NULL, reach_label NULL, reach_confirmed bool DEFAULT false
  └─ interests              item_id

item_disciplines            item_id, discipline_id, is_primary, emphasis_note, sort_order  PK(item_id, discipline_id)
item_skills                 item_id, skill_id                                               PK(item_id, skill_id)
item_relations              from_item_id, to_item_id, relation (about|derived_from|part_of|related), CHECK(from <> to)
item_media                  item_id, media_id, caption, sort_order
item_highlights             id, item_id, text, sort_order, status        -- bullet points, owner wording
highlight_disciplines       highlight_id, discipline_id                   -- which disciplines a bullet supports

focus_views                 id, slug UNIQUE, title, intro, discipline_id NULL, cv_variant_id NULL, status
focus_view_items            view_id, item_id, sort_order, annotation
cv_variants                 id, slug UNIQUE, title, summary_override, is_default, status
cv_sections                 id, cv_variant_id, heading, sort_order        -- any heading; not tied to a content type
cv_section_items            id, section_id, item_id, sort_order, title_override, organisation_label_override,
                            summary_override
cv_item_highlights          section_item_id, highlight_id, item_id, sort_order  -- which bullets this CV shows

contact_messages            id, name, email, subject, message, ip_hash, created_at, handled_at
rate_limits                 key, window_start, count
sync_runs                   id, source, started_at, finished_at, items_upserted, error

admins (Phase 8)            user_id FK auth.users
audit_log (Phase 8)         id, actor, action, table_name, row_id, diff jsonb, at
```

Disciplines have no colour field, because the brand guide requires one shared identity.

## Framing one item differently per CV

One real role is stored **once**. Example: Zone01 Kisumu, 04/2024 – 04/2026, which was both apprenticeship training and hands-on project work. Each CV variant decides:

- **which section it sits in** (for example "Professional experience" on the frontend CV, "Technical training" on the cybersecurity CV), because `cv_sections` aren't tied to a content type;
- **the title shown** (`title_override`, for example "Frontend Developer" or "Apprentice Software Developer"). Overrides must come from titles the owner has approved for that item;
- **which bullets appear**, chosen from the item's own `item_highlights`. A CV can never show text that isn't in the master record.

Dates and organisation always come from the master record, so every CV agrees on the facts.

## Integrity rules

- The `content_items.type` value must match the detail table it has. Enforced declaratively rather than by a trigger: each detail table has a `type` column pinned by `CHECK` to its own type and a composite FK `(item_id, type) → content_items (id, type)`. A detail row can't attach to an item of another type, and an item's type can't change while it has a detail row.
- A CV can only show an item's own highlights: `cv_item_highlights` repeats `item_id`, with composite FKs to `cv_section_items (id, item_id)` and `item_highlights (id, item_id)`.
- Date ranges require `ended_on >= started_on` or a null end date (`expires_on >= issued_on` for certifications).
- Slugs are lowercase kebab-case. `media_assets.alt_text` can't be blank. `profile` is a singleton (`id boolean = true`). An item has at most one primary discipline.
- Article upserts are keyed on `source_url`. Synced articles are created as `published`, and Sheila can unpublish any of them.
- `ON DELETE CASCADE` applies from items to join rows. `RESTRICT` applies on disciplines that are still referenced.
- Only one `cv_variants.is_default = true` (partial unique index).

## RLS summary

| Table group                                                  | anon                                                | server-only (service role) | admin (Phase 8)        |
| ------------------------------------------------------------ | --------------------------------------------------- | -------------------------- | ---------------------- |
| content, taxonomies, joins, media, profile, focus views, CVs | SELECT published (or where the parent is published) | —                          | ALL                    |
| contact_messages, rate_limits                                | none                                                | INSERT / UPDATE            | SELECT, UPDATE, DELETE |
| sync_runs                                                    | none                                                | INSERT / UPDATE            | SELECT                 |
| admins, audit_log                                            | none                                                | —                          | SELECT (audit)         |

Details of the "published" rule as implemented:

- A row is public only when it **and every parent it depends on** are published. Detail tables and join rows follow their item; join rows to disciplines also need the discipline published; `item_relations` needs both ends published; CV and focus-view rows need the CV or view, the item and (for bullets) the highlight published.
- `profile` and `skills` have no status and are always readable.
- `media_assets` has no status; a file's record is readable only when it is the profile avatar, the cover of a published item, or in a published item's gallery.
- `anon` and `authenticated` get `SELECT` only on content tables and no privileges at all on operational tables, so writes fail on grants as well as RLS. Until Phase 8, signed-in users see exactly what anon sees.

pgTAP tests cover each policy and integrity rule (`supabase/tests/database/`, doc 09).

## Seed data

`supabase/seed.sql` loads local-only rows for development, every one labelled `[Sample]` or using a `sample-` slug, including a draft project, a draft discipline and a draft highlight so the "published only" paths are exercised. It runs on `npx supabase db reset` and is never pushed to the hosted project. Real content is entered by Sheila in Studio.

## Indexes

`content_items(status, type, sort_date desc)`, `item_disciplines(discipline_id)`, `item_skills(skill_id)`, `articles(source, published_at desc)`, `contact_messages(created_at)`, plus reverse-lookup indexes on every join table's second key and `sync_runs(source, started_at desc)`.
