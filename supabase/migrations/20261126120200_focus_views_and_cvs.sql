-- Focus views (/for/[slug]) and CV variants. See docs/07-database-design.md,
-- "Framing one item differently per CV".

create table public.cv_variants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  summary_override text,
  is_default boolean not null default false,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Only one default CV.
create unique index cv_variants_one_default_idx on public.cv_variants (is_default) where is_default;

-- Section headings are free text and are not tied to a content type, so the same item can sit
-- under "Professional experience" on one CV and "Technical training" on another.
create table public.cv_sections (
  id uuid primary key default gen_random_uuid(),
  cv_variant_id uuid not null references public.cv_variants (id) on delete cascade,
  heading text not null,
  sort_order integer not null default 0
);

create index cv_sections_variant_idx on public.cv_sections (cv_variant_id, sort_order);

-- Dates and organisation always come from the master record; only these labels may be overridden,
-- and overrides must be wording the owner has approved for that item.
create table public.cv_section_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.cv_sections (id) on delete cascade,
  item_id uuid not null references public.content_items (id) on delete cascade,
  sort_order integer not null default 0,
  title_override text,
  organisation_label_override text,
  summary_override text,
  unique (section_id, item_id),
  -- Target for cv_item_highlights, which must stay on the same item.
  unique (id, item_id)
);

create index cv_section_items_item_idx on public.cv_section_items (item_id);

-- Which of an item's own highlights this CV shows. The shared item_id column plus the two
-- composite FKs guarantee a CV can only show bullets that belong to that item.
create table public.cv_item_highlights (
  section_item_id uuid not null,
  highlight_id uuid not null,
  item_id uuid not null,
  sort_order integer not null default 0,
  primary key (section_item_id, highlight_id),
  foreign key (section_item_id, item_id) references public.cv_section_items (id, item_id) on delete cascade,
  foreign key (highlight_id, item_id) references public.item_highlights (id, item_id) on delete cascade
);

create index cv_item_highlights_highlight_idx on public.cv_item_highlights (highlight_id, item_id);

create table public.focus_views (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  intro text,
  discipline_id uuid references public.disciplines (id) on delete restrict,
  cv_variant_id uuid references public.cv_variants (id) on delete set null,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.focus_view_items (
  view_id uuid not null references public.focus_views (id) on delete cascade,
  item_id uuid not null references public.content_items (id) on delete cascade,
  sort_order integer not null default 0,
  annotation text,
  primary key (view_id, item_id)
);

create index focus_view_items_item_idx on public.focus_view_items (item_id);

create trigger cv_variants_set_updated_at before update on public.cv_variants
  for each row execute function public.set_updated_at();
create trigger focus_views_set_updated_at before update on public.focus_views
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.cv_variants enable row level security;
alter table public.cv_sections enable row level security;
alter table public.cv_section_items enable row level security;
alter table public.cv_item_highlights enable row level security;
alter table public.focus_views enable row level security;
alter table public.focus_view_items enable row level security;

revoke all on
  public.cv_variants, public.cv_sections, public.cv_section_items, public.cv_item_highlights,
  public.focus_views, public.focus_view_items
from anon, authenticated;

grant select on
  public.cv_variants, public.cv_sections, public.cv_section_items, public.cv_item_highlights,
  public.focus_views, public.focus_view_items
to anon, authenticated;

create policy "Public can read published CVs" on public.cv_variants
  for select to anon, authenticated using (status = 'published');

create policy "Public can read sections of published CVs" on public.cv_sections
  for select to anon, authenticated
  using (exists (select 1 from public.cv_variants v where v.id = cv_variant_id and v.status = 'published'));

create policy "Public can read published items in published CVs" on public.cv_section_items
  for select to anon, authenticated
  using (
    public.is_published_item(item_id)
    and exists (
      select 1 from public.cv_sections s
      join public.cv_variants v on v.id = s.cv_variant_id
      where s.id = section_id and v.status = 'published'
    )
  );

create policy "Public can read published highlights in published CVs" on public.cv_item_highlights
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.cv_section_items si
      join public.cv_sections s on s.id = si.section_id
      join public.cv_variants v on v.id = s.cv_variant_id
      where si.id = section_item_id and v.status = 'published'
    )
    and exists (
      select 1 from public.item_highlights h
      where h.id = highlight_id and h.status = 'published'
    )
    and public.is_published_item(item_id)
  );

create policy "Public can read published focus views" on public.focus_views
  for select to anon, authenticated using (status = 'published');

create policy "Public can read published items in published focus views" on public.focus_view_items
  for select to anon, authenticated
  using (
    public.is_published_item(item_id)
    and exists (select 1 from public.focus_views f where f.id = view_id and f.status = 'published')
  );
