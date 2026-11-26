-- Operational tables: contact messages, rate limiting and article sync runs.
-- These are server-only: RLS is on with no policies, and anon/authenticated have no grants,
-- so only the service role (server-only modules) can touch them. Admin access arrives in Phase 8.

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 200),
  email text not null check (length(email) between 3 and 320 and email like '%_@_%'),
  subject text check (length(subject) <= 200),
  message text not null check (length(message) between 1 and 5000),
  -- Salted hash only; raw IP addresses are never stored.
  ip_hash text,
  created_at timestamptz not null default now(),
  handled_at timestamptz
);

comment on table public.contact_messages is 'Kept for 3 months (docs/02). Purge job arrives with the contact form in Phase 3.';

create index contact_messages_created_idx on public.contact_messages (created_at);

create table public.rate_limits (
  key text not null,
  window_start timestamptz not null,
  count integer not null default 0 check (count >= 0),
  primary key (key, window_start)
);

create table public.sync_runs (
  id uuid primary key default gen_random_uuid(),
  source public.article_source not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  items_upserted integer not null default 0 check (items_upserted >= 0),
  error text,
  check (finished_at is null or finished_at >= started_at)
);

create index sync_runs_source_started_idx on public.sync_runs (source, started_at desc);

alter table public.contact_messages enable row level security;
alter table public.rate_limits enable row level security;
alter table public.sync_runs enable row level security;

revoke all on public.contact_messages, public.rate_limits, public.sync_runs from anon, authenticated;
