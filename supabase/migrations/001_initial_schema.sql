-- EnergieMIND Platform Schema
-- Run in Supabase SQL Editor or via: supabase db push

-- Extensions
create extension if not exists "uuid-ossp";

-- Enums
create type user_role as enum ('user', 'operator', 'developer', 'admin');
create type access_request_status as enum ('pending', 'approved', 'rejected');
create type alert_severity as enum ('info', 'warning', 'critical');
create type miner_status as enum ('online', 'offline', 'degraded', 'maintenance');

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  company text,
  role user_role not null default 'user',
  phone text,
  locale text default 'en',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Access requests (public form submissions)
create table public.access_requests (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  company text not null,
  phone text,
  use_case text not null,
  message text not null,
  status access_request_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz not null default now()
);

-- Infrastructure sites
create table public.sites (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  location text,
  country text,
  capacity_mw numeric(10,2) default 0,
  is_active boolean not null default true,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ASIC miners
create table public.miners (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid not null references public.sites(id) on delete cascade,
  name text not null,
  model text not null default 'Antminer S19',
  serial_number text unique,
  status miner_status not null default 'offline',
  hash_rate_th numeric(12,2) default 0,
  power_watts numeric(10,2) default 0,
  temperature_c numeric(5,2) default 0,
  efficiency_jth numeric(8,2) default 0,
  firmware_version text default 'EnergieMIND-1.0',
  pool_name text,
  uptime_percent numeric(5,2) default 0,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Energy metrics (time-series snapshots)
create table public.energy_metrics (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid not null references public.sites(id) on delete cascade,
  recorded_at timestamptz not null default now(),
  power_kw numeric(12,2) not null default 0,
  generation_kw numeric(12,2) default 0,
  consumption_kwh numeric(14,2) default 0,
  efficiency_percent numeric(5,2) default 0,
  cost_per_kwh numeric(8,4) default 0,
  carbon_intensity_g numeric(8,2) default 0
);

-- Heat recovery metrics
create table public.heat_metrics (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid not null references public.sites(id) on delete cascade,
  recorded_at timestamptz not null default now(),
  thermal_efficiency_percent numeric(5,2) default 0,
  heat_recovered_kw numeric(10,2) default 0,
  waste_heat_utilization_percent numeric(5,2) default 0,
  cop_ratio numeric(4,2) default 0,
  fuel_savings_percent numeric(5,2) default 0
);

-- Alerts
create table public.alerts (
  id uuid primary key default uuid_generate_v4(),
  site_id uuid references public.sites(id) on delete set null,
  miner_id uuid references public.miners(id) on delete set null,
  title text not null,
  message text not null,
  severity alert_severity not null default 'info',
  is_resolved boolean not null default false,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

-- API keys
create table public.api_keys (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  key_prefix text not null,
  key_hash text not null,
  scopes text[] default '{read}',
  is_active boolean not null default true,
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_miners_site_id on public.miners(site_id);
create index idx_miners_status on public.miners(status);
create index idx_energy_metrics_site_recorded on public.energy_metrics(site_id, recorded_at desc);
create index idx_heat_metrics_site_recorded on public.heat_metrics(site_id, recorded_at desc);
create index idx_alerts_unresolved on public.alerts(is_resolved, created_at desc);
create index idx_access_requests_status on public.access_requests(status, created_at desc);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
create trigger sites_updated_at before update on public.sites
  for each row execute function public.handle_updated_at();
create trigger miners_updated_at before update on public.miners
  for each row execute function public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.access_requests enable row level security;
alter table public.sites enable row level security;
alter table public.miners enable row level security;
alter table public.energy_metrics enable row level security;
alter table public.heat_metrics enable row level security;
alter table public.alerts enable row level security;
alter table public.api_keys enable row level security;

-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active = true
  );
$$ language sql security definer stable;

-- Profiles policies
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can manage all profiles"
  on public.profiles for all
  using (public.is_admin());

-- Access requests: anyone can insert (public form), admins can read/update
create policy "Anyone can submit access request"
  on public.access_requests for insert
  with check (true);

create policy "Admins can view access requests"
  on public.access_requests for select
  using (public.is_admin());

create policy "Admins can update access requests"
  on public.access_requests for update
  using (public.is_admin());

-- Platform data: authenticated users can read, admins can write
create policy "Authenticated users can read sites"
  on public.sites for select to authenticated using (true);

create policy "Admins manage sites"
  on public.sites for all using (public.is_admin());

create policy "Authenticated users can read miners"
  on public.miners for select to authenticated using (true);

create policy "Admins manage miners"
  on public.miners for all using (public.is_admin());

create policy "Authenticated users can read energy metrics"
  on public.energy_metrics for select to authenticated using (true);

create policy "Admins manage energy metrics"
  on public.energy_metrics for all using (public.is_admin());

create policy "Authenticated users can read heat metrics"
  on public.heat_metrics for select to authenticated using (true);

create policy "Admins manage heat metrics"
  on public.heat_metrics for all using (public.is_admin());

create policy "Authenticated users can read alerts"
  on public.alerts for select to authenticated using (true);

create policy "Admins manage alerts"
  on public.alerts for all using (public.is_admin());

create policy "Users can read own API keys"
  on public.api_keys for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can create own API keys"
  on public.api_keys for insert
  with check (auth.uid() = user_id);

create policy "Admins manage all API keys"
  on public.api_keys for all using (public.is_admin());

-- Seed demo data (sites, miners, metrics)
insert into public.sites (name, slug, location, country, capacity_mw) values
  ('TVK Frankfurt Facility', 'tvk-frankfurt', 'Frankfurt, Germany', 'DE', 12.5),
  ('Ankara Solar-Mining Hub', 'ankara-hub', 'Ankara, Türkiye', 'TR', 8.2),
  ('Dubai Industrial Park', 'dubai-park', 'Dubai, UAE', 'AE', 15.0);

insert into public.miners (site_id, name, model, serial_number, status, hash_rate_th, power_watts, temperature_c, efficiency_jth, pool_name, uptime_percent, last_seen_at)
select s.id, 'Miner-' || n, 'Antminer S19 Pro', 'ENM-S19-' || n,
  case when n <= 8 then 'online'::miner_status when n <= 10 then 'degraded'::miner_status else 'offline'::miner_status end,
  95 + (n * 2.5), 2800 + (n * 50), 62 + n, 26.5 + (n * 0.1), 'Foundry USA', 99.2 - n, now() - (n || ' minutes')::interval
from public.sites s
cross join generate_series(1, 12) n
where s.slug = 'tvk-frankfurt';

insert into public.miners (site_id, name, model, serial_number, status, hash_rate_th, power_watts, temperature_c, efficiency_jth, pool_name, uptime_percent, last_seen_at)
select s.id, 'Miner-A' || n, 'Antminer S19 XP', 'ENM-AXP-' || n, 'online'::miner_status,
  110 + n, 3000, 58 + n, 21.5, 'AntPool', 99.8, now()
from public.sites s
cross join generate_series(1, 6) n
where s.slug = 'ankara-hub';

-- Energy metrics (last 24 hours, hourly)
insert into public.energy_metrics (site_id, recorded_at, power_kw, generation_kw, consumption_kwh, efficiency_percent, cost_per_kwh, carbon_intensity_g)
select
  s.id,
  now() - (h || ' hours')::interval,
  8500 + (random() * 1500)::numeric(12,2),
  1200 + (random() * 400)::numeric(12,2),
  8500 + (random() * 1000)::numeric(14,2),
  88 + (random() * 8)::numeric(5,2),
  0.065 + (random() * 0.02)::numeric(8,4),
  320 + (random() * 80)::numeric(8,2)
from public.sites s
cross join generate_series(0, 23) h;

insert into public.heat_metrics (site_id, recorded_at, thermal_efficiency_percent, heat_recovered_kw, waste_heat_utilization_percent, cop_ratio, fuel_savings_percent)
select
  s.id,
  now() - (h || ' hours')::interval,
  72 + (random() * 15)::numeric(5,2),
  450 + (random() * 200)::numeric(10,2),
  65 + (random() * 20)::numeric(5,2),
  3.2 + (random() * 0.8)::numeric(4,2),
  18 + (random() * 10)::numeric(5,2)
from public.sites s
cross join generate_series(0, 23) h;

insert into public.alerts (site_id, title, message, severity, is_resolved) values
  ((select id from public.sites where slug = 'tvk-frankfurt'), 'High Temperature Warning', 'Miner-3 chip temperature exceeded 85°C threshold', 'warning', false),
  ((select id from public.sites where slug = 'tvk-frankfurt'), 'Hash Rate Drop', 'Miner-10 hash rate dropped 15% below baseline', 'critical', false),
  ((select id from public.sites where slug = 'ankara-hub'), 'Power Spike Detected', 'Consumption exceeded 9 MW for 10 minutes', 'warning', false),
  ((select id from public.sites where slug = 'dubai-park'), 'Scheduled Maintenance', 'Cooling system maintenance completed successfully', 'info', true);
