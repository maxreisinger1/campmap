```
-- 1) Cities
create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  state text,
  threshold integer not null default 100,
  created_at timestamptz not null default now()
);

-- 2) Events (one per city)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id) on delete cascade,
  event_name text not null,
  event_date timestamptz,
  evey_event_url text,          -- presence => show "Buy"
  qr_code_url text,
  created_at timestamptz not null default now(),
  unique (city_id)
);

-- 3) City metrics (denormalized counters for speed)
create table if not exists public.city_metrics (
  city_id uuid primary key references public.cities(id) on delete cascade,
  signup_count bigint not null default 0,
  last_signup_at timestamptz
);

-- 4) Submissions (with anti-spam fields)
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email citext not null,                  -- case-insensitive
  email_normalized text generated always as (lower(trim(email))) stored,
  zip text,
  state text,
  lat double precision,
  lon double precision,
  city text not null,
  city_id uuid references public.cities(id) on delete set null,

  -- spam & ops
  ip_hash text,                           -- hash of IP (do not store raw IP)

  constraint uq_email_global unique (email_normalized),
);

create index if not exists idx_submissions_city_id on public.submissions(city_id);
create index if not exists idx_submissions_created_at on public.submissions(created_at);
create index if not exists idx_submissions_ip_hash on public.submissions(ip_hash);
create index if not exists idx_submissions_email_norm on public.submissions(email_normalized);

-- 5) Trigger: keep city_metrics in sync (atomic & contention-friendly)
create or replace function public.bump_city_metrics()
returns trigger
language plpgsql
as $$
begin
  if new.city_id is not null then
    insert into public.city_metrics (city_id, signup_count, last_signup_at)
    values (new.city_id, 1, now())
    on conflict (city_id)
    do update set
      signup_count = public.city_metrics.signup_count + 1,
      last_signup_at = excluded.last_signup_at;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_bump_city_metrics on public.submissions;
create trigger trg_bump_city_metrics
after insert on public.submissions
for each row
execute function public.bump_city_metrics();

-- 6) Helper: rolling-window rate limit (email + ip)
create or replace function public.rate_limit_guard(
  v_email text,
  v_ip_hash text,
  email_window_minutes integer default 60,
  ip_window_minutes integer default 10,
  email_max integer default 1,      -- 1 per hour per email (adjust as needed)
  ip_max integer default 5          -- 5 per 10 mins per IP
) returns void
language plpgsql
as $$
declare
  email_ct int;
  ip_ct int;
begin
  select count(*) into email_ct
  from public.submissions
  where email_normalized = lower(trim(v_email))
    and created_at > now() - make_interval(mins => email_window_minutes);

  if email_ct >= email_max then
    raise exception 'Too many submissions for this email. Please try again later.' using errcode = 'P0001';
  end if;

  if v_ip_hash is not null then
    select count(*) into ip_ct
    from public.submissions
    where ip_hash = v_ip_hash
      and created_at > now() - make_interval(mins => ip_window_minutes);

    if ip_ct >= ip_max then
      raise exception 'Too many submissions from your network. Please try again later.' using errcode = 'P0001';
    end if;
  end if;
end;
$$;

-- 7) RPC: the only write path (idempotent insert + rate limit + city lookup)
create or replace function public.submit_signup(
  v_name text,
  v_email text,
  v_zip text,
  v_state text,
  v_lat double precision,
  v_lon double precision,
  v_city text,
  v_city_id uuid,               -- optional; pass if you already matched
  v_ip_hash text,               -- sha256 of requester IP (computed at edge)
) returns public.submissions
language plpgsql
security definer
as $$
declare
  city_row public.cities%rowtype;
  sub_row public.submissions%rowtype;
begin
  -- Basic guards
  if v_name is null or v_email is null or v_city is null then
    raise exception 'Missing required fields';
  end if;

  -- OPTIONAL: If no city_id, try to find by name
  if v_city_id is null then
    select * into city_row from public.cities where lower(name) = lower(v_city) limit 1;
    if not found then
      -- Create on-the-fly or raise; here we raise to avoid noisy cities
      raise exception 'Unknown city: %', v_city;
    end if;
  else
    select * into city_row from public.cities where id = v_city_id;
    if not found then
      raise exception 'Invalid city_id';
    end if;
  end if;

  -- Rate limit
  perform public.rate_limit_guard(v_email, v_ip_hash);

  -- Attempt insert (will error if email already exists due to unique constraint)
  insert into public.submissions(
    name, email, zip, state, lat, lon, city, city_id,
    ip_hash
  )
  values (
    v_name, v_email, v_zip, v_state, v_lat, v_lon, v_city, coalesce(v_city_id, city_row.id),
    v_ip_hash
  )
  returning * into sub_row;

  return sub_row;
exception
  when unique_violation then
    -- If email already exists, treat as conflict but not fatal to UX
    raise exception 'This email has already signed up.' using errcode = '23505';
end;
$$;

-- 8) Views for the UI
create or replace view public.city_leaderboard as
select
  c.id as city_id,
  c.name as city_name,
  c.threshold,
  coalesce(m.signup_count, 0) as signup_count,
  (coalesce(m.signup_count,0)::numeric / nullif(c.threshold,0)) as progress_ratio,
  e.evey_event_url is not null as tickets_available
from public.cities c
left join public.city_metrics m on m.city_id = c.id
left join public.events e on e.city_id = c.id;

-- 9) RLS: lock tables, expose views & RPC
alter table public.submissions enable row level security;
alter table public.cities enable row level security;
alter table public.events enable row level security;
alter table public.city_metrics enable row level security;

-- Public can read leaderboard & events (read-only)
create policy "read leaderboard" on public.cities
  for select using (true);
create policy "read events" on public.events
  for select using (true);
create policy "read metrics" on public.city_metrics
  for select using (true);

-- No direct inserts to submissions from anon; only via RPC (security definer)
create policy "select own submissions" on public.submissions
  for select using (true);  -- or restrict by email if you expose it

-- Block anon insert/update/delete on submissions
revoke insert, update, delete on public.submissions from anon;

-- Allow service_role full access (for backend/edge)
grant all on public.submissions, public.cities, public.events, public.city_metrics to service_role;

-- 10) Seed cities (optional adjust thresholds)
insert into public.cities (name, state, threshold) values
  ('Seattle','WA',100),
  ('San Francisco','CA',100),
  ('Los Angeles','CA',100),
  ('New York City','NY',100)
on conflict (name) do nothing;
```
