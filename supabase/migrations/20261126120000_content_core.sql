-- Content core: taxonomies, media, the content_items supertable and its 1:1 detail tables.
-- See docs/07-database-design.md. RLS is enabled on every table; anon may read only published rows.

-- ---------------------------------------------------------------------------
-- Shared types and helpers
-- ---------------------------------------------------------------------------

create type public.publish_status as enum ('draft', 'published');

create type public.content_type as enum (
  'project',
  'experience',
  'publication',
  'education',
  'certification',
  'article',
  'engagement',
  'interest'
);

create type public.experience_kind as enum ('employment', 'volunteering', 'community');

create type public.engagement_kind as enum (
  'workshop',
  'training',
  'event',
  'talk',
  'judging',
  'mentoring',
  'delegation',
  'other'
);

create type public.article_source as enum ('medium', 'devto');

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Media (referenced by profile and content, so created first)
-- ---------------------------------------------------------------------------

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  alt_text text not null check (length(trim(alt_text)) > 0),
  width integer check (width > 0),
  height integer check (height > 0),
  credit text,
  created_at timestamptz not null default now()
);

comment on column public.media_assets.alt_text is
  'Required at the data level (WCAG 2.2 AA, doc 09); never blank.';

-- ---------------------------------------------------------------------------
-- Profile (singleton) and taxonomies
-- ---------------------------------------------------------------------------

create table public.profile (
  id boolean primary key default true check (id),
  full_name text not null,
  headline text,
  bio text,
  location text,
  avatar_media_id uuid references public.media_assets (id) on delete set null,
  links jsonb not null default '{}'::jsonb check (jsonb_typeof(links) = 'object'),
  updated_at timestamptz not null default now()
);

comment on table public.profile is 'Singleton row (id is always true).';

create table public.disciplines (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  tagline text,
  intro text,
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.disciplines is
  'Disciplines are data rendered by one template. No colour field: the brand guide requires one shared identity.';

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  skill_group text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- content_items supertable
-- ---------------------------------------------------------------------------

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  type public.content_type not null,
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(trim(title)) > 0),
  summary text,
  body text,
  status public.publish_status not null default 'draft',
  featured boolean not null default false,
  sort_date date,
  cover_media_id uuid references public.media_assets (id) on delete set null,
  seo jsonb not null default '{}'::jsonb check (jsonb_typeof(seo) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (type, slug),
  -- Target for the (item_id, type) foreign keys that tie each detail table to one type.
  unique (id, type)
);

create index content_items_listing_idx on public.content_items (status, type, sort_date desc);

-- ---------------------------------------------------------------------------
-- Detail tables (1:1 with content_items)
--
-- Each detail table carries a `type` column pinned by CHECK to its own type and a
-- composite FK to content_items (id, type). This makes it impossible to attach a
-- detail row to an item of another type, or to change an item's type while it has
-- a detail row, without needing a trigger.
-- ---------------------------------------------------------------------------

create table public.projects (
  item_id uuid primary key,
  type public.content_type not null default 'project' check (type = 'project'),
  role text,
  project_status text,
  started_on date,
  ended_on date,
  repo_url text,
  demo_url text,
  -- Evidence sections: all optional; the UI hides any that are empty.
  context text,
  problem text,
  process text,
  decisions text,
  implementation text,
  outcomes text,
  foreign key (item_id, type) references public.content_items (id, type) on delete cascade,
  check (ended_on is null or started_on is null or ended_on >= started_on)
);

create table public.experiences (
  item_id uuid primary key,
  type public.content_type not null default 'experience' check (type = 'experience'),
  kind public.experience_kind not null,
  organisation text not null,
  role text not null,
  location text,
  started_on date,
  ended_on date,
  foreign key (item_id, type) references public.content_items (id, type) on delete cascade,
  check (ended_on is null or started_on is null or ended_on >= started_on)
);

create table public.publications (
  item_id uuid primary key,
  type public.content_type not null default 'publication' check (type = 'publication'),
  authors jsonb not null default '[]'::jsonb check (jsonb_typeof(authors) = 'array'),
  venue text,
  year integer check (year between 1900 and 2100),
  doi text,
  url text,
  citation_type text,
  abstract text,
  foreign key (item_id, type) references public.content_items (id, type) on delete cascade
);

create table public.education (
  item_id uuid primary key,
  type public.content_type not null default 'education' check (type = 'education'),
  institution text not null,
  qualification text,
  field text,
  started_on date,
  ended_on date,
  foreign key (item_id, type) references public.content_items (id, type) on delete cascade,
  check (ended_on is null or started_on is null or ended_on >= started_on)
);

create table public.certifications (
  item_id uuid primary key,
  type public.content_type not null default 'certification' check (type = 'certification'),
  issuer text not null,
  issued_on date,
  expires_on date,
  credential_id text,
  verify_url text,
  foreign key (item_id, type) references public.content_items (id, type) on delete cascade,
  check (expires_on is null or issued_on is null or expires_on >= issued_on)
);

create table public.articles (
  item_id uuid primary key,
  type public.content_type not null default 'article' check (type = 'article'),
  source public.article_source not null,
  source_id text,
  -- Canonical URL of the original post; the sync upserts on this key.
  source_url text not null unique,
  published_at timestamptz not null,
  excerpt text,
  html_sanitised text,
  source_tags text[] not null default '{}',
  full_text boolean not null default false,
  last_synced_at timestamptz,
  foreign key (item_id, type) references public.content_items (id, type) on delete cascade
);

create index articles_source_published_idx on public.articles (source, published_at desc);

create table public.engagements (
  item_id uuid primary key,
  type public.content_type not null default 'engagement' check (type = 'engagement'),
  kind public.engagement_kind not null,
  host_org text,
  partner_orgs text[] not null default '{}',
  role text,
  started_on date,
  ended_on date,
  location text,
  audience text,
  -- Reach is shown only when the owner has confirmed it.
  reach_count integer check (reach_count >= 0),
  reach_label text,
  reach_confirmed boolean not null default false,
  foreign key (item_id, type) references public.content_items (id, type) on delete cascade,
  check (ended_on is null or started_on is null or ended_on >= started_on)
);

create table public.interests (
  item_id uuid primary key,
  type public.content_type not null default 'interest' check (type = 'interest'),
  foreign key (item_id, type) references public.content_items (id, type) on delete cascade
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

create trigger profile_set_updated_at before update on public.profile
  for each row execute function public.set_updated_at();
create trigger disciplines_set_updated_at before update on public.disciplines
  for each row execute function public.set_updated_at();
create trigger content_items_set_updated_at before update on public.content_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Publication helper used by RLS policies
-- ---------------------------------------------------------------------------

create function public.is_published_item(p_item_id uuid)
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.content_items c
    where c.id = p_item_id and c.status = 'published'
  );
$$;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.media_assets enable row level security;
alter table public.profile enable row level security;
alter table public.disciplines enable row level security;
alter table public.skills enable row level security;
alter table public.content_items enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.publications enable row level security;
alter table public.education enable row level security;
alter table public.certifications enable row level security;
alter table public.articles enable row level security;
alter table public.engagements enable row level security;
alter table public.interests enable row level security;

-- Public roles get read-only access; writes happen with the service role (and the admin role in Phase 8).
revoke all on
  public.media_assets, public.profile, public.disciplines, public.skills, public.content_items,
  public.projects, public.experiences, public.publications, public.education,
  public.certifications, public.articles, public.engagements, public.interests
from anon, authenticated;

grant select on
  public.media_assets, public.profile, public.disciplines, public.skills, public.content_items,
  public.projects, public.experiences, public.publications, public.education,
  public.certifications, public.articles, public.engagements, public.interests
to anon, authenticated;

create policy "Public can read the profile" on public.profile
  for select to anon, authenticated using (true);

create policy "Public can read published disciplines" on public.disciplines
  for select to anon, authenticated using (status = 'published');

-- Skills are a plain taxonomy with no status of their own.
create policy "Public can read skills" on public.skills
  for select to anon, authenticated using (true);

create policy "Public can read published items" on public.content_items
  for select to anon, authenticated using (status = 'published');

create policy "Public can read published project details" on public.projects
  for select to anon, authenticated using (public.is_published_item(item_id));
create policy "Public can read published experience details" on public.experiences
  for select to anon, authenticated using (public.is_published_item(item_id));
create policy "Public can read published publication details" on public.publications
  for select to anon, authenticated using (public.is_published_item(item_id));
create policy "Public can read published education details" on public.education
  for select to anon, authenticated using (public.is_published_item(item_id));
create policy "Public can read published certification details" on public.certifications
  for select to anon, authenticated using (public.is_published_item(item_id));
create policy "Public can read published article details" on public.articles
  for select to anon, authenticated using (public.is_published_item(item_id));
create policy "Public can read published engagement details" on public.engagements
  for select to anon, authenticated using (public.is_published_item(item_id));
create policy "Public can read published interest details" on public.interests
  for select to anon, authenticated using (public.is_published_item(item_id));

-- Media policy is created in the relations migration, once item_media exists.
