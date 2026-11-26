-- Discipline portfolios (owner direction 2026-11-27, ADR-019): every discipline is a
-- standalone, shareable portfolio with its own capabilities, skills and section order,
-- still rendered by one data-driven template. Plus structured skills for the homepage
-- overview and per-discipline skill lists. See docs/07-database-design.md.

-- ---------------------------------------------------------------------------
-- Disciplines: capabilities and section order
-- ---------------------------------------------------------------------------

create function public.has_no_duplicates(items text[])
returns boolean
language sql
immutable
set search_path = ''
as $$
  select cardinality(items) = (select count(distinct v) from unnest(items) as v);
$$;

alter table public.disciplines
  -- Short owner-written statements of what she does in this field ("capabilities").
  add column capabilities text[] not null default '{}',
  -- Which portfolio sections appear, in what order. The intro always comes first.
  add column sections text[] not null default array[
    'capabilities', 'case_studies', 'projects', 'skills', 'experience',
    'publications', 'writing', 'credentials'
  ],
  add constraint disciplines_sections_known check (
    sections <@ array[
      'capabilities', 'case_studies', 'projects', 'skills', 'experience',
      'publications', 'writing', 'credentials'
    ]::text[]
  ),
  add constraint disciplines_sections_unique check (public.has_no_duplicates(sections));

comment on column public.disciplines.sections is
  'Portfolio sections in display order. Allowed: capabilities, case_studies, projects, skills, experience, publications, writing, credentials. Omit a key to hide that section.';

-- An item can be a case study in one portfolio and a plain project in another.
alter table public.item_disciplines
  add column featured boolean not null default false;

comment on column public.item_disciplines.featured is
  'Shown as a case study (projects) or highlighted (other types) in this discipline''s portfolio.';

-- ---------------------------------------------------------------------------
-- Profile: homepage overview
-- ---------------------------------------------------------------------------

alter table public.profile
  add column overview text;

comment on column public.profile.overview is
  'Short multidisciplinary overview for the homepage. The full biography (bio) is on About.';

-- ---------------------------------------------------------------------------
-- Skills: categories, kinds and per-discipline lists
-- ---------------------------------------------------------------------------

create type public.skill_kind as enum ('technical', 'tool', 'competency');

create table public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  sort_order integer not null default 0,
  -- The portfolio this category leads to on the homepage, if any.
  discipline_id uuid references public.disciplines (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.skills
  drop column skill_group,
  add column category_id uuid references public.skill_categories (id) on delete set null,
  add column kind public.skill_kind not null default 'technical',
  -- A key strength, shown in the homepage overview.
  add column highlighted boolean not null default false;

create index skills_category_idx on public.skills (category_id);

-- Skills relevant to a discipline, in priority order (the first ones are shown first).
create table public.discipline_skills (
  discipline_id uuid not null references public.disciplines (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete restrict,
  sort_order integer not null default 0,
  primary key (discipline_id, skill_id)
);

create index discipline_skills_skill_idx on public.discipline_skills (skill_id);

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.skill_categories enable row level security;
alter table public.discipline_skills enable row level security;

revoke all on public.skill_categories, public.discipline_skills from anon, authenticated;
grant select on public.skill_categories, public.discipline_skills to anon, authenticated;

-- Like skills, categories are a plain taxonomy with no status of their own.
create policy "Public can read skill categories" on public.skill_categories
  for select to anon, authenticated using (true);

create policy "Public can read skills of published disciplines" on public.discipline_skills
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.disciplines d
      where d.id = discipline_id and d.status = 'published'
    )
  );
