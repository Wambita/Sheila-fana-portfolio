-- Integrity rules from docs/07: type/detail match, date ranges, single defaults,
-- CV highlights belong to their item, RESTRICT and CASCADE behaviour.
-- Fixture text is deliberately fake. Runs in a transaction that is rolled back.
begin;
create extension if not exists pgtap with schema extensions;

select plan(21);

-- Start from empty tables so seed.sql rows don't affect the results; rollback restores them.
truncate public.content_items, public.disciplines, public.skills, public.media_assets,
  public.profile, public.cv_variants, public.focus_views cascade;

insert into public.content_items (id, type, slug, title) values
  ('00000000-0000-0000-0000-000000000001', 'project', 'test-project', 'Test project'),
  ('00000000-0000-0000-0000-000000000002', 'experience', 'test-experience', 'Test experience'),
  ('00000000-0000-0000-0000-000000000003', 'project', 'test-project-two', 'Test project two');

insert into public.disciplines (id, slug, name) values
  ('00000000-0000-0000-0000-0000000000d1', 'test-discipline', 'Test discipline'),
  ('00000000-0000-0000-0000-0000000000d2', 'test-discipline-two', 'Test discipline two');

-- Type / detail match ---------------------------------------------------------
select lives_ok(
  $$ insert into public.projects (item_id) values ('00000000-0000-0000-0000-000000000001') $$,
  'a project detail row attaches to a project item'
);

select throws_ok(
  $$ insert into public.projects (item_id) values ('00000000-0000-0000-0000-000000000002') $$,
  '23503', null,
  'a project detail row cannot attach to an experience item'
);

select throws_ok(
  $$ insert into public.experiences (item_id, type, kind, organisation, role)
     values ('00000000-0000-0000-0000-000000000002', 'project', 'employment', 'Org', 'Role') $$,
  '23514', null,
  'a detail row cannot claim another type'
);

select throws_ok(
  $$ update public.content_items set type = 'article' where id = '00000000-0000-0000-0000-000000000001' $$,
  '23503', null,
  'an item''s type cannot change while it has a detail row'
);

-- Value checks ----------------------------------------------------------------
select throws_ok(
  $$ insert into public.experiences (item_id, kind, organisation, role, started_on, ended_on)
     values ('00000000-0000-0000-0000-000000000002', 'employment', 'Org', 'Role', '2025-01-01', '2024-01-01') $$,
  '23514', null,
  'end date cannot be before start date'
);

select lives_ok(
  $$ insert into public.experiences (item_id, kind, organisation, role, started_on)
     values ('00000000-0000-0000-0000-000000000002', 'employment', 'Org', 'Role', '2025-01-01') $$,
  'an open-ended date range is allowed'
);

select throws_ok(
  $$ insert into public.content_items (type, slug, title) values ('project', 'Not A Slug', 'x') $$,
  '23514', null,
  'slugs must be lowercase kebab-case'
);

select throws_ok(
  $$ insert into public.content_items (type, slug, title) values ('project', 'test-project', 'Duplicate') $$,
  '23505', null,
  'slugs are unique per type'
);

select throws_ok(
  $$ insert into public.media_assets (storage_path, alt_text) values ('test/blank.png', '  ') $$,
  '23514', null,
  'media alt text cannot be blank'
);

select throws_ok(
  $$ insert into public.profile (id, full_name) values (false, 'x') $$,
  '23514', null,
  'profile is a singleton'
);

-- Single-row rules ------------------------------------------------------------
insert into public.cv_variants (slug, title, is_default) values ('test-cv-a', 'Test CV A', true);
select throws_ok(
  $$ insert into public.cv_variants (slug, title, is_default) values ('test-cv-b', 'Test CV B', true) $$,
  '23505', null,
  'only one CV can be the default'
);

insert into public.item_disciplines (item_id, discipline_id, is_primary)
  values ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000d1', true);
select throws_ok(
  $$ insert into public.item_disciplines (item_id, discipline_id, is_primary)
     values ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000000000d2', true) $$,
  '23505', null,
  'an item has at most one primary discipline'
);

select throws_ok(
  $$ insert into public.item_relations (from_item_id, to_item_id, relation)
     values ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'related') $$,
  '23514', null,
  'an item cannot relate to itself'
);

-- CV highlights must come from the item's own highlights ------------------------
insert into public.item_highlights (id, item_id, text) values
  ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-000000000001', 'Fake bullet on project one'),
  ('00000000-0000-0000-0000-0000000000b3', '00000000-0000-0000-0000-000000000003', 'Fake bullet on project two');

insert into public.cv_sections (id, cv_variant_id, heading)
  select '00000000-0000-0000-0000-0000000000e1', id, 'Test section' from public.cv_variants where slug = 'test-cv-a';

insert into public.cv_section_items (id, section_id, item_id) values
  ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-000000000001');

select throws_ok(
  $$ insert into public.cv_item_highlights (section_item_id, highlight_id, item_id) values
     ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-0000000000b3', '00000000-0000-0000-0000-000000000001') $$,
  '23503', null,
  'a CV cannot show a highlight that belongs to another item'
);

-- RESTRICT and CASCADE --------------------------------------------------------
select throws_ok(
  $$ delete from public.disciplines where id = '00000000-0000-0000-0000-0000000000d1' $$,
  '23503', null,
  'a discipline still linked to content cannot be deleted'
);

delete from public.content_items where id = '00000000-0000-0000-0000-000000000001';

select is_empty(
  $$ select 1 from public.item_highlights where item_id = '00000000-0000-0000-0000-000000000001' $$,
  'deleting an item removes its highlights'
);

select is_empty(
  $$ select 1 from public.cv_section_items where item_id = '00000000-0000-0000-0000-000000000001' $$,
  'deleting an item removes it from CVs'
);

-- Discipline portfolio sections (ADR-019) ---------------------------------------
select throws_ok(
  $$ update public.disciplines set sections = array['skills', 'testimonials'] where slug = 'test-discipline-two' $$,
  '23514', null,
  'a portfolio can only use known section keys'
);

select throws_ok(
  $$ update public.disciplines set sections = array['skills', 'skills'] where slug = 'test-discipline-two' $$,
  '23514', null,
  'a portfolio section appears at most once'
);

select lives_ok(
  $$ update public.disciplines set sections = array['skills', 'credentials'] where slug = 'test-discipline-two' $$,
  'a portfolio can choose and reorder its sections'
);

insert into public.skills (id, slug, name) values ('00000000-0000-0000-0000-0000000000c9', 'test-skill', 'Test skill');
insert into public.discipline_skills (discipline_id, skill_id)
  values ('00000000-0000-0000-0000-0000000000d2', '00000000-0000-0000-0000-0000000000c9');
select throws_ok(
  $$ delete from public.skills where id = '00000000-0000-0000-0000-0000000000c9' $$,
  '23503', null,
  'a skill listed in a portfolio cannot be deleted'
);

select * from finish();
rollback;
