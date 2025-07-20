-- Schema setup for FleetForge
-- Adds user scoping and Row Level Security policies

-- Loads table
create table if not exists public.loads (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    pickup_location text,
    delivery_location text,
    rate numeric,
    status text,
    created_at timestamp with time zone default now()
);

-- Dispatches table
create table if not exists public.dispatches (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    created_at timestamp with time zone default now()
);

-- Drivers table
create table if not exists public.drivers (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    created_at timestamp with time zone default now()
);

-- Carriers table
create table if not exists public.carriers (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    created_at timestamp with time zone default now()
);

-- Equipment table
create table if not exists public.equipment (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    created_at timestamp with time zone default now()
);

-- Rate confirmations table
create table if not exists public.rate_confirmations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    created_at timestamp with time zone default now()
);

-- Expenses table
create table if not exists public.expenses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id),
    created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.loads enable row level security;
alter table public.dispatches enable row level security;
alter table public.drivers enable row level security;
alter table public.carriers enable row level security;
alter table public.equipment enable row level security;
alter table public.rate_confirmations enable row level security;
alter table public.expenses enable row level security;

-- Policy: users can operate only on their own rows
create policy if not exists "users_read_write_own_rows" on public.loads
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "users_read_write_own_rows" on public.dispatches
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "users_read_write_own_rows" on public.drivers
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "users_read_write_own_rows" on public.carriers
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "users_read_write_own_rows" on public.equipment
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "users_read_write_own_rows" on public.rate_confirmations
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "users_read_write_own_rows" on public.expenses
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

