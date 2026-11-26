-- Local development seed. EVERYTHING HERE IS FAKE and exists only so pages and repositories
-- have rows to render. Real content is entered by the owner in Supabase Studio, never from code.
-- Runs on `npx supabase db reset` (local only; never pushed to the hosted project).

insert into public.profile (full_name, headline, overview, bio, links) values (
  '[Sample] Profile name',
  '[Sample] Headline placeholder',
  '[Sample] Overview placeholder: a short multidisciplinary summary for the homepage.',
  '[Sample] Biography placeholder. Replace in Studio.',
  '{"github": "https://example.com/sample"}'
);

-- Two published portfolios with different section orders, and one draft.
insert into public.disciplines
  (id, slug, name, tagline, intro, capabilities, sections, sort_order, status) values
  ('10000000-0000-0000-0000-000000000001', 'sample-discipline-a', '[Sample] Discipline A',
   '[Sample] Tagline', '[Sample] Intro placeholder.',
   array['[Sample] Capability one', '[Sample] Capability two'],
   array['capabilities', 'case_studies', 'projects', 'skills', 'experience',
         'publications', 'writing', 'credentials'],
   1, 'published'),
  ('10000000-0000-0000-0000-000000000002', 'sample-discipline-b', '[Sample] Discipline B',
   '[Sample] Tagline', '[Sample] Intro placeholder.',
   '{}',
   array['skills', 'credentials', 'experience', 'projects'],
   2, 'published'),
  ('10000000-0000-0000-0000-000000000003', 'sample-draft-discipline', '[Sample] Draft discipline',
   null, null, '{}', default, 3, 'draft');

insert into public.skill_categories (id, slug, name, sort_order, discipline_id) values
  ('40000000-0000-0000-0000-000000000001', 'sample-category-a', '[Sample] Category A', 1,
   '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000002', 'sample-category-b', '[Sample] Category B', 2,
   '10000000-0000-0000-0000-000000000002');

insert into public.skills (id, slug, name, category_id, kind, highlighted) values
  ('20000000-0000-0000-0000-000000000001', 'sample-skill-one', '[Sample] Skill one',
   '40000000-0000-0000-0000-000000000001', 'technical', true),
  ('20000000-0000-0000-0000-000000000002', 'sample-skill-two', '[Sample] Skill two',
   '40000000-0000-0000-0000-000000000001', 'tool', false),
  ('20000000-0000-0000-0000-000000000003', 'sample-skill-three', '[Sample] Skill three',
   '40000000-0000-0000-0000-000000000002', 'competency', true);

insert into public.discipline_skills (discipline_id, skill_id, sort_order) values
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 0),
  ('10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 1),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 0),
  ('10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 1);

insert into public.content_items (id, type, slug, title, summary, status, featured, sort_date) values
  ('30000000-0000-0000-0000-000000000001', 'project', 'sample-project-one', '[Sample] Project one',
   '[Sample] Summary placeholder.', 'published', true, '2000-01-01'),
  ('30000000-0000-0000-0000-000000000002', 'project', 'sample-project-two', '[Sample] Project two',
   '[Sample] Summary placeholder.', 'published', false, '2000-02-01'),
  ('30000000-0000-0000-0000-000000000003', 'project', 'sample-draft-project', '[Sample] Draft project',
   null, 'draft', false, '2000-03-01'),
  ('30000000-0000-0000-0000-000000000004', 'experience', 'sample-experience', '[Sample] Experience',
   '[Sample] Summary placeholder.', 'published', true, '2000-01-01'),
  ('30000000-0000-0000-0000-000000000005', 'engagement', 'sample-engagement', '[Sample] Engagement',
   '[Sample] Summary placeholder.', 'published', false, '2000-04-01'),
  ('30000000-0000-0000-0000-000000000006', 'publication', 'sample-publication', '[Sample] Publication',
   '[Sample] Summary placeholder.', 'published', false, '2000-05-01'),
  ('30000000-0000-0000-0000-000000000007', 'certification', 'sample-certification',
   '[Sample] Certification', null, 'published', false, '2000-06-01'),
  ('30000000-0000-0000-0000-000000000008', 'article', 'sample-article', '[Sample] Article',
   '[Sample] Summary placeholder.', 'published', false, '2000-07-01'),
  -- Linked to no portfolio: appears only in the full record (Publications page).
  ('30000000-0000-0000-0000-000000000009', 'publication', 'sample-unlinked-publication',
   '[Sample] Unlinked publication', null, 'published', false, '2000-08-01');

insert into public.projects (item_id, role, started_on, ended_on, context, problem) values
  ('30000000-0000-0000-0000-000000000001', '[Sample] Role', '2000-01-01', '2000-06-01',
   '[Sample] Context placeholder.', '[Sample] Problem placeholder.'),
  ('30000000-0000-0000-0000-000000000002', '[Sample] Role', '2000-02-01', null, null, null),
  ('30000000-0000-0000-0000-000000000003', null, null, null, null, null);

insert into public.experiences (item_id, kind, organisation, role, started_on) values
  ('30000000-0000-0000-0000-000000000004', 'employment', '[Sample] Organisation', '[Sample] Role', '2000-01-01');

insert into public.engagements (item_id, kind, host_org, role, started_on) values
  ('30000000-0000-0000-0000-000000000005', 'workshop', '[Sample] Host', '[Sample] Facilitator', '2000-04-01');

insert into public.publications (item_id, venue, year, url) values
  ('30000000-0000-0000-0000-000000000006', '[Sample] Venue', 2000, 'https://example.com/sample-publication'),
  ('30000000-0000-0000-0000-000000000009', '[Sample] Other venue', 2000, null);

insert into public.certifications (item_id, issuer, issued_on) values
  ('30000000-0000-0000-0000-000000000007', '[Sample] Issuer', '2000-06-01');

insert into public.articles (item_id, source, source_url, published_at, excerpt) values
  ('30000000-0000-0000-0000-000000000008', 'devto', 'https://example.com/sample-article',
   '2000-07-01T00:00:00Z', '[Sample] Excerpt placeholder.');

insert into public.item_disciplines (item_id, discipline_id, is_primary, featured, sort_order) values
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', true, true, 0),
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', false, false, 1),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', true, false, 0),
  ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', true, false, 0),
  ('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', true, false, 0),
  ('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', true, false, 0),
  ('30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', true, false, 0),
  ('30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', true, false, 0);

insert into public.item_skills (item_id, skill_id) values
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002');

insert into public.item_highlights (item_id, text, sort_order, status) values
  ('30000000-0000-0000-0000-000000000001', '[Sample] Highlight one.', 0, 'published'),
  ('30000000-0000-0000-0000-000000000001', '[Sample] Highlight two (draft).', 1, 'draft');
