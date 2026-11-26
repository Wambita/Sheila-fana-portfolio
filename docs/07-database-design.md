# 07 — Database Design

**Status:** Proposed logical model, updated 2026-11-26. The physical schema will be finalised in the Phase 2 migrations.

## Approach

**Class-table inheritance.** Every piece of portfolio content is a row in `content_items`, with a 1:1 detail table for its type. This keeps foreign keys real and lets every relationship, focus view and CV reference a single `content_item_id`.

## Entities

```
profile (singleton)         id, full_name, headline, bio, location, avatar_media_id, links jsonb
disciplines                 id, slug UNIQUE, name, tagline, intro, sort_order, status (draft|published)
skills                      id, slug, name, group
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
item_relations              from_item_id, to_item_id, relation (enum), CHECK(from <> to)
item_media                  item_id, media_id, caption, sort_order

focus_views                 id, slug UNIQUE, title, intro, discipline_id NULL, cv_variant_id NULL, status
focus_view_items            view_id, item_id, sort_order, annotation
cv_variants                 id, slug UNIQUE, title, summary_override, is_default, status
cv_sections                 id, cv_variant_id, heading, content_type, sort_order
cv_section_items            section_id, item_id, sort_order, summary_override

contact_messages            id, name, email, subject, message, ip_hash, created_at, handled_at
rate_limits                 key, window_start, count
sync_runs                   id, source, started_at, finished_at, items_upserted, error

admins (Phase 8)            user_id FK auth.users
audit_log (Phase 8)         id, actor, action, table_name, row_id, diff jsonb, at
```

Disciplines have no colour field, because the brand guide requires one shared identity.

## Integrity rules

- The `content_items.type` value must match the detail table it has (enforced by a trigger).
- Date ranges require `ended_on >= started_on` or a null end date.
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

pgTAP tests cover each policy (doc 09).

## Indexes

`content_items(status, type, sort_date desc)`, `item_disciplines(discipline_id)`, `item_skills(skill_id)`, `articles(source, published_at desc)`, `contact_messages(created_at)`.
