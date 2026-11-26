-- Relations between content: disciplines, skills, item-to-item links, media and highlights.
-- See docs/07-database-design.md. Join rows cascade when an item is deleted; disciplines and
-- skills that are still referenced cannot be deleted (RESTRICT).

create type public.item_relation as enum (
  'about',        -- e.g. an article about a project
  'derived_from', -- e.g. a publication derived from a project
  'part_of',      -- e.g. a project that was part of an experience
  'related'       -- general cross-link
);

create table public.item_disciplines (
  item_id uuid not null references public.content_items (id) on delete cascade,
  discipline_id uuid not null references public.disciplines (id) on delete restrict,
  is_primary boolean not null default false,
  emphasis_note text,
  sort_order integer not null default 0,
  primary key (item_id, discipline_id)
);

create index item_disciplines_discipline_idx on public.item_disciplines (discipline_id);
-- At most one primary discipline per item.
create unique index item_disciplines_one_primary_idx on public.item_disciplines (item_id) where is_primary;

create table public.item_skills (
  item_id uuid not null references public.content_items (id) on delete cascade,
  skill_id uuid not null references public.skills (id) on delete restrict,
  primary key (item_id, skill_id)
);

create index item_skills_skill_idx on public.item_skills (skill_id);

create table public.item_relations (
  from_item_id uuid not null references public.content_items (id) on delete cascade,
  to_item_id uuid not null references public.content_items (id) on delete cascade,
  relation public.item_relation not null,
  primary key (from_item_id, to_item_id, relation),
  check (from_item_id <> to_item_id)
);

create index item_relations_to_idx on public.item_relations (to_item_id);

create table public.item_media (
  item_id uuid not null references public.content_items (id) on delete cascade,
  media_id uuid not null references public.media_assets (id) on delete cascade,
  caption text,
  sort_order integer not null default 0,
  primary key (item_id, media_id)
);

create index item_media_media_idx on public.item_media (media_id);

-- Bullet points in the owner's own wording. CVs choose from these and never add text of their own.
create table public.item_highlights (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.content_items (id) on delete cascade,
  text text not null check (length(trim(text)) > 0),
  sort_order integer not null default 0,
  status public.publish_status not null default 'draft',
  -- Target for cv_item_highlights, which must pick highlights of the same item.
  unique (id, item_id)
);

create index item_highlights_item_idx on public.item_highlights (item_id, sort_order);

create table public.highlight_disciplines (
  highlight_id uuid not null references public.item_highlights (id) on delete cascade,
  discipline_id uuid not null references public.disciplines (id) on delete restrict,
  primary key (highlight_id, discipline_id)
);

create index highlight_disciplines_discipline_idx on public.highlight_disciplines (discipline_id);

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.item_disciplines enable row level security;
alter table public.item_skills enable row level security;
alter table public.item_relations enable row level security;
alter table public.item_media enable row level security;
alter table public.item_highlights enable row level security;
alter table public.highlight_disciplines enable row level security;

revoke all on
  public.item_disciplines, public.item_skills, public.item_relations, public.item_media,
  public.item_highlights, public.highlight_disciplines
from anon, authenticated;

grant select on
  public.item_disciplines, public.item_skills, public.item_relations, public.item_media,
  public.item_highlights, public.highlight_disciplines
to anon, authenticated;

create policy "Public can read links of published items to published disciplines" on public.item_disciplines
  for select to anon, authenticated
  using (
    public.is_published_item(item_id)
    and exists (select 1 from public.disciplines d where d.id = discipline_id and d.status = 'published')
  );

create policy "Public can read skills of published items" on public.item_skills
  for select to anon, authenticated using (public.is_published_item(item_id));

create policy "Public can read relations between published items" on public.item_relations
  for select to anon, authenticated
  using (public.is_published_item(from_item_id) and public.is_published_item(to_item_id));

create policy "Public can read media of published items" on public.item_media
  for select to anon, authenticated using (public.is_published_item(item_id));

create policy "Public can read published highlights of published items" on public.item_highlights
  for select to anon, authenticated
  using (status = 'published' and public.is_published_item(item_id));

create policy "Public can read discipline tags of visible highlights" on public.highlight_disciplines
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.item_highlights h
      where h.id = highlight_id and h.status = 'published' and public.is_published_item(h.item_id)
    )
    and exists (select 1 from public.disciplines d where d.id = discipline_id and d.status = 'published')
  );

-- Media is readable only when something public uses it: the profile avatar, a published
-- item's cover, or a published item's gallery. Unused or draft-only media stays hidden.
create policy "Public can read media used by public content" on public.media_assets
  for select to anon, authenticated
  using (
    exists (select 1 from public.profile p where p.avatar_media_id = media_assets.id)
    or exists (
      select 1 from public.content_items c
      where c.cover_media_id = media_assets.id and c.status = 'published'
    )
    or exists (
      select 1 from public.item_media im
      where im.media_id = media_assets.id and public.is_published_item(im.item_id)
    )
  );
