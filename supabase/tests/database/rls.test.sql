-- RLS: anon/authenticated can read only published content, and nothing operational.
-- Fixture text is deliberately fake. Runs in a transaction that is rolled back.
begin;
create extension if not exists pgtap with schema extensions;

select plan(22);

-- ---------------------------------------------------------------------------
-- Every public table has RLS on
-- ---------------------------------------------------------------------------
select is_empty(
  $$ select tablename from pg_tables where schemaname = 'public' and not rowsecurity $$,
  'RLS is enabled on every table in public'
);

-- ---------------------------------------------------------------------------
-- Fixtures (inserted as the owner, which bypasses RLS)
-- ---------------------------------------------------------------------------
insert into public.media_assets (id, storage_path, alt_text) values
  ('00000000-0000-0000-0000-0000000000a1', 'test/published-cover.png', 'Test image A'),
  ('00000000-0000-0000-0000-0000000000a2', 'test/draft-cover.png', 'Test image B'),
  ('00000000-0000-0000-0000-0000000000a3', 'test/unused.png', 'Test image C');

insert into public.disciplines (id, slug, name, status) values
  ('00000000-0000-0000-0000-0000000000d1', 'test-published-discipline', 'Test discipline (published)', 'published'),
  ('00000000-0000-0000-0000-0000000000d2', 'test-draft-discipline', 'Test discipline (draft)', 'draft');

insert into public.content_items (id, type, slug, title, status, cover_media_id) values
  ('00000000-0000-0000-0000-000000000001', 'project', 'test-published', 'Test project (published)', 'published',
   '00000000-0000-0000-0000-0000000000a1'),
  ('00000000-0000-0000-0000-000000000002', 'project', 'test-draft', 'Test project (draft)', 'draft',
   '00000000-0000-0000-0000-0000000000a2');

insert into public.projects (item_id, context) values
  ('00000000-0000-0000-0000-000000000001', 'Fake context'),
  ('00000000-0000-0000-0000-000000000002', 'Fake draft context');

insert into public.item_disciplines (item_id, discipline_id) values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000d1'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000d2');

insert into public.item_highlights (id, item_id, text, status) values
  ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-000000000001', 'Fake bullet (published)', 'published'),
  ('00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-000000000001', 'Fake bullet (draft)', 'draft'),
  ('00000000-0000-0000-0000-0000000000b3', '00000000-0000-0000-0000-000000000002', 'Fake bullet on draft item', 'published');

insert into public.item_relations (from_item_id, to_item_id, relation) values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'related');

insert into public.cv_variants (id, slug, title, status) values
  ('00000000-0000-0000-0000-0000000000c1', 'test-cv', 'Test CV', 'published'),
  ('00000000-0000-0000-0000-0000000000c2', 'test-draft-cv', 'Test draft CV', 'draft');

insert into public.cv_sections (id, cv_variant_id, heading) values
  ('00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-0000000000c1', 'Test section'),
  ('00000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-0000000000c2', 'Test draft section');

insert into public.cv_section_items (id, section_id, item_id) values
  ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-000000000002');

insert into public.cv_item_highlights (section_item_id, highlight_id, item_id) values
  ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-000000000001');

insert into public.focus_views (id, slug, title, status) values
  ('00000000-0000-0000-0000-000000000091', 'test-view', 'Test view', 'published');

insert into public.focus_view_items (view_id, item_id) values
  ('00000000-0000-0000-0000-000000000091', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000091', '00000000-0000-0000-0000-000000000002');

insert into public.contact_messages (name, email, message) values ('Test Sender', 'test@example.com', 'Fake message');
insert into public.sync_runs (source) values ('devto');

-- ---------------------------------------------------------------------------
-- As anon
-- ---------------------------------------------------------------------------
set local role anon;

select results_eq(
  $$ select slug from public.content_items $$,
  $$ values ('test-published') $$,
  'anon sees only published items'
);

select results_eq(
  $$ select context from public.projects $$,
  $$ values ('Fake context') $$,
  'anon sees details only for published items'
);

select results_eq(
  $$ select slug from public.disciplines $$,
  $$ values ('test-published-discipline') $$,
  'anon sees only published disciplines'
);

select results_eq(
  $$ select discipline_id from public.item_disciplines $$,
  $$ values ('00000000-0000-0000-0000-0000000000d1'::uuid) $$,
  'anon does not see links to draft disciplines'
);

select results_eq(
  $$ select text from public.item_highlights $$,
  $$ values ('Fake bullet (published)') $$,
  'anon sees only published highlights of published items'
);

select is_empty(
  $$ select 1 from public.item_relations $$,
  'anon does not see relations that point at a draft item'
);

select results_eq(
  $$ select storage_path from public.media_assets $$,
  $$ values ('test/published-cover.png') $$,
  'anon sees only media used by published content'
);

select results_eq(
  $$ select slug from public.cv_variants $$,
  $$ values ('test-cv') $$,
  'anon sees only published CVs'
);

select results_eq(
  $$ select heading from public.cv_sections $$,
  $$ values ('Test section') $$,
  'anon sees only sections of published CVs'
);

select results_eq(
  $$ select item_id from public.cv_section_items $$,
  $$ values ('00000000-0000-0000-0000-000000000001'::uuid) $$,
  'anon does not see draft items placed in a published CV'
);

select results_eq(
  $$ select highlight_id from public.cv_item_highlights $$,
  $$ values ('00000000-0000-0000-0000-0000000000b1'::uuid) $$,
  'anon does not see draft highlights chosen for a CV'
);

select results_eq(
  $$ select item_id from public.focus_view_items $$,
  $$ values ('00000000-0000-0000-0000-000000000001'::uuid) $$,
  'anon does not see draft items placed in a focus view'
);

select throws_ok(
  $$ select * from public.contact_messages $$,
  '42501', null,
  'anon cannot read contact messages'
);

select throws_ok(
  $$ insert into public.contact_messages (name, email, message) values ('x', 'x@example.com', 'x') $$,
  '42501', null,
  'anon cannot insert contact messages directly'
);

select throws_ok(
  $$ select * from public.sync_runs $$,
  '42501', null,
  'anon cannot read sync runs'
);

select throws_ok(
  $$ select * from public.rate_limits $$,
  '42501', null,
  'anon cannot read rate limits'
);

select throws_ok(
  $$ insert into public.content_items (type, slug, title) values ('project', 'anon-write', 'x') $$,
  '42501', null,
  'anon cannot insert content'
);

select throws_ok(
  $$ update public.content_items set title = 'changed' $$,
  '42501', null,
  'anon cannot update content'
);

select throws_ok(
  $$ delete from public.content_items $$,
  '42501', null,
  'anon cannot delete content'
);

-- ---------------------------------------------------------------------------
-- As authenticated (no admin role yet, so same as anon)
-- ---------------------------------------------------------------------------
reset role;
set local role authenticated;

select results_eq(
  $$ select slug from public.content_items $$,
  $$ values ('test-published') $$,
  'authenticated users also see only published items'
);

select throws_ok(
  $$ select * from public.contact_messages $$,
  '42501', null,
  'authenticated users cannot read contact messages'
);

reset role;
select * from finish();
rollback;
