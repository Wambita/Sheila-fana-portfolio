# supabase/CLAUDE.md

Conventions for the database. The logical model and RLS rules live in `docs/07-database-design.md`. Update it in the same branch as any schema change.

## Commands

```bash
npx supabase start          # start the local stack (Docker Desktop must be running)
npx supabase stop           # stop it; data is kept
npx supabase status         # URLs and local keys
npx supabase db reset       # rebuild the local DB from migrations (+ seed.sql, if present)
npx supabase test db        # pgTAP tests in supabase/tests/database/*.test.sql
npx supabase db lint --level warning
npx supabase migration new <name>
```

Studio runs at http://127.0.0.1:54323. `.env.local` holds the local URL and keys (git-ignored).

## Migration rules

- **Never edit a migration that has been merged into `main`.** Add a new one instead. Unmerged migrations on a feature branch may be edited, followed by `db reset`.
- **RLS on every table**, in the same migration that creates it. `rls.test.sql` fails if any `public` table lacks it.
- **Grants are explicit.** For each new table, `revoke all ... from anon, authenticated`, then `grant select` only on public content. Server-only tables (contact, rate limits, sync) get no grants and no policies; only the service role uses them.
- **Public read policies** check `status = 'published'` on the row and on every parent it depends on (use `public.is_published_item(id)` for content items). Join rows are visible only when both sides are.
- **A new content type** needs: a value in `content_type`, a detail table with `item_id` PK, a `type` column pinned by `CHECK`, a composite FK `(item_id, type) → content_items (id, type) ON DELETE CASCADE`, RLS, a policy and a test.
- Functions set `search_path = ''` and use schema-qualified names.
- Slugs are lowercase kebab-case (checked by constraint). Date ranges check `ended_on >= started_on`.
- No colour fields on disciplines or anything else (brand guide).

## Tests and data

- Every policy and integrity rule gets a pgTAP test. Tests run in a transaction and roll back.
- Test fixtures and any `seed.sql` content must be **obviously fake** ("Test project", "Fake bullet"). Never put real or plausible portfolio content in the database from code; Sheila loads real content herself.
- After a schema change, run `db reset`, `test db` and `db lint`, then `npm run db:types` and `npm run test:integration`. Update the Zod schemas in `src/lib/content/schemas.ts` if selected columns changed.
