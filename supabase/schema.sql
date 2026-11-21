-- Three Hellos database schema (docs/plan.md 5.4).
-- Run once in the Supabase SQL editor. Safe to re-run: objects are created only if missing.
-- Access is server-side only, with the service role key. Row level security is on
-- and there are no policies, so the public anon key can read or write nothing.

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  admin_token text unique not null,
  name text not null,
  starts_at timestamptz,
  time_zone text, -- organiser's IANA zone, e.g. Asia/Singapore
  place text,
  description text,
  organiser_name text not null,
  organiser_email text not null,
  plan text not null default 'free' check (plan in ('free', 'paid', 'pilot', 'demo', 'test')),
  guest_limit int not null default 15,
  stripe_session_id text,
  amount_paid_cents int,
  paid_at timestamptz,
  status text not null default 'collecting' check (status in ('collecting', 'matched')),
  matched_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  token text unique not null,
  number int not null,
  name text not null,
  email text,
  role text not null,
  interests text[] not null default '{}',
  looking_for text,
  ask_me_about text,
  created_at timestamptz not null default now(),
  unique (event_id, number)
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  guest_id uuid not null references guests(id) on delete cascade,
  match_guest_id uuid not null references guests(id) on delete cascade,
  rank int not null check (rank between 1 and 3),
  reason text not null,
  opener text not null,
  source text not null default 'ai' check (source in ('ai', 'fallback')),
  created_at timestamptz not null default now(),
  unique (guest_id, rank)
);

-- Added after the first version of this file; harmless if the column exists.
alter table events add column if not exists time_zone text;

create index if not exists guests_event_id_idx on guests (event_id);
create index if not exists matches_event_id_idx on matches (event_id);
create index if not exists matches_match_guest_id_idx on matches (match_guest_id);

alter table events enable row level security;
alter table guests enable row level security;
alter table matches enable row level security;

-- Adds a guest with the next badge number. Locks the event row so two guests
-- joining at the same moment never get the same number.
create or replace function join_event(
  p_slug text,
  p_token text,
  p_name text,
  p_email text,
  p_role text,
  p_interests text[],
  p_looking_for text,
  p_ask_me_about text
) returns table (guest_token text, guest_number int)
language plpgsql
as $$
declare
  v_event_id uuid;
  v_number int;
begin
  select id into v_event_id from events where slug = p_slug for update;
  if v_event_id is null then
    raise exception 'event_not_found';
  end if;

  select coalesce(max(g.number), 0) + 1 into v_number from guests g where g.event_id = v_event_id;

  insert into guests (event_id, token, number, name, email, role, interests, looking_for, ask_me_about)
  values (
    v_event_id, p_token, v_number, p_name, nullif(p_email, ''), p_role,
    coalesce(p_interests, '{}'), nullif(p_looking_for, ''), nullif(p_ask_me_about, '')
  );

  return query select p_token, v_number;
end;
$$;

revoke execute on function join_event(text, text, text, text, text, text[], text, text) from public, anon, authenticated;
