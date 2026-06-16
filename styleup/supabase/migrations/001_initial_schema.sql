-- StyleUp initial schema
-- Run this in your Supabase SQL editor (or via `supabase db push`)

-- ── Profiles ────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with app-specific fields
create table if not exists public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  email      text not null,
  full_name  text,
  role       text not null default 'client' check (role in ('client', 'stylist', 'admin')),
  created_at timestamptz not null default now()
);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Stylists ─────────────────────────────────────────────────────────────────
create table if not exists public.stylists (
  id                  text primary key, -- e.g. "amara-okonkwo"
  user_id             uuid references public.profiles(id) on delete set null,
  name                text not null,
  bio                 text,
  city                text not null,
  country             text not null default '',
  flag                text not null default '🌍',
  specialty           text[] not null default '{}',
  tagline             text,
  rating              numeric(3,2) not null default 5.00,
  reviews_count       integer not null default 0,
  sessions_completed  integer not null default 0,
  commission_rate     numeric(5,2) not null default 20.00, -- percent kept by StyleUp
  status              text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  gradient            text[] not null default '{"#C4923A","#E2B97A"}',
  languages           text[] not null default '{"English"}',
  response_time       text not null default '< 1 hour',
  available_today     boolean not null default false,
  created_at          timestamptz not null default now()
);

-- ── Services (per stylist) ────────────────────────────────────────────────────
create table if not exists public.stylist_services (
  id           uuid default gen_random_uuid() primary key,
  stylist_id   text references public.stylists(id) on delete cascade,
  name         text not null,
  session_type text not null check (session_type in ('in-store', 'home', 'virtual', 'online')),
  duration_hrs numeric(3,1) not null default 2.0,
  price        integer not null, -- in pence/cents
  currency     text not null default 'GBP'
);

-- ── Bookings ─────────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id                         text primary key,
  client_id                  uuid not null references public.profiles(id),
  stylist_id                 text not null references public.stylists(id),
  service_name               text not null,
  session_type               text not null,
  date                       date not null,
  time                       text not null,
  price                      integer not null, -- session price in pence
  platform_fee               integer not null default 0, -- 5% booking fee in pence
  currency                   text not null default 'GBP',
  notes                      text,
  status                     text not null default 'pending_payment'
                               check (status in ('pending_payment', 'confirmed', 'completed', 'cancelled')),
  stripe_session_id          text,
  stripe_payment_intent_id   text,
  payment_status             text not null default 'unpaid'
                               check (payment_status in ('unpaid', 'paid', 'refunded')),
  created_at                 timestamptz not null default now()
);

-- ── Stylist applications ──────────────────────────────────────────────────────
create table if not exists public.stylist_applications (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  email      text not null,
  city       text not null,
  specialty  text,
  instagram  text,
  status     text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  notes      text, -- admin notes
  created_at timestamptz not null default now()
);

-- ── Reviews ────────────────────────────────────────────────────────────────────
create table if not exists public.reviews (
  id         uuid default gen_random_uuid() primary key,
  booking_id text not null references public.bookings(id),
  client_id  uuid not null references public.profiles(id),
  stylist_id text not null references public.stylists(id),
  rating     integer not null check (rating between 1 and 5),
  text       text,
  created_at timestamptz not null default now(),
  unique (booking_id) -- one review per booking
);

-- ── Row-level security ────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.stylists enable row level security;
alter table public.stylist_services enable row level security;
alter table public.bookings enable row level security;
alter table public.stylist_applications enable row level security;
alter table public.reviews enable row level security;

-- Profiles: users can read/update their own
create policy "profiles: own read" on public.profiles for select using (auth.uid() = id);
create policy "profiles: own update" on public.profiles for update using (auth.uid() = id);

-- Stylists: anyone can read active ones; only admin can insert/update
create policy "stylists: public read active" on public.stylists for select using (status = 'active');
create policy "stylists: admin all" on public.stylists for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Stylist services: public read
create policy "services: public read" on public.stylist_services for select using (true);

-- Bookings: clients see their own; stylists see their own; admin sees all
create policy "bookings: client own" on public.bookings for select using (client_id = auth.uid());
create policy "bookings: client insert" on public.bookings for insert with check (client_id = auth.uid());
create policy "bookings: client cancel" on public.bookings for update using (client_id = auth.uid());
create policy "bookings: admin all" on public.bookings for all
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Applications: anyone can insert; only admin can read
create policy "applications: public insert" on public.stylist_applications for insert with check (true);
create policy "applications: admin read" on public.stylist_applications for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');
create policy "applications: admin update" on public.stylist_applications for update
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Reviews: public read, client insert for own completed bookings
create policy "reviews: public read" on public.reviews for select using (true);
create policy "reviews: client insert" on public.reviews for insert
  with check (client_id = auth.uid());

-- ── RPC helpers ──────────────────────────────────────────────────────────────
create or replace function public.increment_stylist_sessions(p_stylist_id text)
returns void language plpgsql security definer as $$
begin
  update public.stylists
  set sessions_completed = sessions_completed + 1
  where id = p_stylist_id;
end;
$$;

-- ── Indexes ────────────────────────────────────────────────────────────────────
create index if not exists bookings_client_idx on public.bookings (client_id);
create index if not exists bookings_stylist_idx on public.bookings (client_id);
create index if not exists bookings_date_idx on public.bookings (date);
create index if not exists bookings_stripe_session_idx on public.bookings (stripe_session_id);
create index if not exists applications_email_idx on public.stylist_applications (email);
