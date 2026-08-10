-- ====================================================================
-- FAST-NUCES Multan Campus CMS Modules Migration
-- Migration: 20260810000001_admin_cms_modules.sql
-- ====================================================================

-- 1. TABLE: news
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  content text,
  image_url text,
  category text default 'Campus News',
  published boolean not null default false,
  published_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

-- 2. TABLE: events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date text,
  start_time text,
  end_time text,
  location text,
  description text,
  image_url text,
  published boolean not null default true,
  display_order integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. TABLE: faculty
create table if not exists public.faculty (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text not null,
  qualification text,
  biography text,
  photo_url text,
  school text not null, -- 'computing' or 'management'
  department text not null, -- 'cs', 'se', 'ai', 'management'
  research_interests text,
  display_order integer default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. TABLE: societies
create table if not exists public.societies (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, -- 'techsoc', 'fmm', 'figs', 'dhanak', 'bayaan'
  name text not null,
  description text,
  hero_image text,
  mentor_name text,
  mentor_photo text,
  president_name text,
  president_photo text,
  vp1_name text,
  vp1_photo text,
  vp2_name text,
  vp2_photo text,
  instagram_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. TABLE: gallery_items
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  row_number integer not null default 1 check (row_number in (1, 2, 3)),
  display_order integer default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ENABLE ROW LEVEL SECURITY
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.faculty enable row level security;
alter table public.societies enable row level security;
alter table public.gallery_items enable row level security;

-- RLS POLICIES: PUBLIC READ ACCESS
create policy "Public read access for news" on public.news for select to public using (published = true or public.is_active_admin());
create policy "Public read access for events" on public.events for select to public using (published = true or public.is_active_admin());
create policy "Public read access for faculty" on public.faculty for select to public using (visible = true or public.is_active_admin());
create policy "Public read access for societies" on public.societies for select to public using (true);
create policy "Public read access for gallery_items" on public.gallery_items for select to public using (published = true or public.is_active_admin());

-- RLS POLICIES: ACTIVE ADMIN ALL ACCESS (INSERT, UPDATE, DELETE)
create policy "Admin all access for news" on public.news for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Admin all access for events" on public.events for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Admin all access for faculty" on public.faculty for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Admin all access for societies" on public.societies for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
create policy "Admin all access for gallery_items" on public.gallery_items for all to authenticated using (public.is_active_admin()) with check (public.is_active_admin());
