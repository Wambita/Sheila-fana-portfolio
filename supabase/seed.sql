-- Local development seed. EVERYTHING HERE IS FAKE and exists only so pages and repositories
-- have rows to render. Real content is entered by the owner in Supabase Studio, never from code.
-- Runs on `npx supabase db reset` (local only; never pushed to the hosted project).

insert into public.profile (full_name, headline, bio, links) values (
  '[Sample] Profile name',
  '[Sample] Headline placeholder',
  '[Sample] Biography placeholder. Replace in Studio.',
  '{"github": "https://example.com/sample"}'
);

insert into public.disciplines (id, slug, name, tagline, intro, sort_order, status) values
  ('10000000-0000-0000-0000-000000000001', 'sample-discipline-a', '[Sample] Discipline A',
   '[Sample] Tagline', '[Sample] Intro placeholder.', 1, 'published'),
  ('10000000-0000-0000-0000-000000000002', 'sample-discipline-b', '[Sample] Discipline B',
   '[Sample] Tagline', '[Sample] Intro placeholder.', 2, 'published'),
  ('10000000-0000-0000-0000-000000000003', 'sample-draft-discipline', '[Sample] Draft discipline',
   null, null, 3, 'draft');

insert into public.skills (id, slug, name, skill_group) values
  ('20000000-0000-0000-0000-000000000001', 'sample-skill-one', '[Sample] Skill one', '[Sample] Group'),
  ('20000000-0000-0000-0000-000000000002', 'sample-skill-two', '[Sample] Skill two', '[Sample] Group');

insert into public.content_items (id, type, slug, title, summary, status, featured, sort_date) values
  ('30000000-0000-0000-0000-000000000001', 'project', 'sample-project-one', '[Sample] Project one',
   '[Sample] Summary placeholder.', 'published', true, '2000-01-01'),
  ('30000000-0000-0000-0000-000000000002', 'project', 'sample-project-two', '[Sample] Project two',
   '[Sample] Summary placeholder.', 'published', false, '2000-02-01'),
  ('30000000-0000-0000-0000-000000000003', 'project', 'sample-draft-project', '[Sample] Draft project',
   null, 'draft', false, '2000-03-01'),
  ('30000000-0000-0000-0000-000000000004', 'experience', 'sample-experience', '[Sample] Experience',
   '[Sample] Summary placeholder.', 'published', false, '2000-01-01');

insert into public.projects (item_id, role, started_on, ended_on, context, problem) values
  ('30000000-0000-0000-0000-000000000001', '[Sample] Role', '2000-01-01', '2000-06-01',
   '[Sample] Context placeholder.', '[Sample] Problem placeholder.'),
  ('30000000-0000-0000-0000-000000000002', '[Sample] Role', '2000-02-01', null, null, null),
  ('30000000-0000-0000-0000-000000000003', null, null, null, null, null);

insert into public.experiences (item_id, kind, organisation, role, started_on) values
  ('30000000-0000-0000-0000-000000000004', 'employment', '[Sample] Organisation', '[Sample] Role', '2000-01-01');

insert into public.item_disciplines (item_id, discipline_id, is_primary, sort_order) values
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', true, 0),
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', false, 1),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', true, 0),
  ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', true, 0);

insert into public.item_skills (item_id, skill_id) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002');

insert into public.item_highlights (item_id, text, sort_order, status) values
  ('30000000-0000-0000-0000-000000000001', '[Sample] Highlight one.', 0, 'published'),
  ('30000000-0000-0000-0000-000000000001', '[Sample] Highlight two (draft).', 1, 'draft');
