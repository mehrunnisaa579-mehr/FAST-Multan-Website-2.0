-- ====================================================================
-- FAST-NUCES Multan Campus CMS Foundation Migration
-- Migration: 20260810000000_admin_cms_foundation.sql
-- ====================================================================

-- 1. TABLE: admin_users
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint check_admin_role check (role in ('admin', 'super_admin'))
);

comment on table public.admin_users is 'Stores authorized administrative users and their access roles for FAST-NUCES Multan CMS';

-- 2. TABLE: site_settings
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  description text,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

comment on table public.site_settings is 'Stores key-value global website settings and CMS options';

-- 3. HELPER FUNCTION: is_active_admin()
create or replace function public.is_active_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and is_active = true
  );
$$;

comment on function public.is_active_admin() is 'Security definer helper checking if the current authenticated user is an active administrator';

-- 4. ROW LEVEL SECURITY (RLS) FOR TABLES

-- Enable RLS
alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;

-- admin_users Policies
create policy "Authenticated users can read their own admin record"
  on public.admin_users
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Active admins can read all admin records"
  on public.admin_users
  for select
  to authenticated
  using (public.is_active_admin());

create policy "Active admins can insert or update admin records"
  on public.admin_users
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());

-- site_settings Policies
create policy "Public users can read site settings"
  on public.site_settings
  for select
  to public
  using (true);

create policy "Active admins can insert, update, or delete site settings"
  on public.site_settings
  for all
  to authenticated
  using (public.is_active_admin())
  with check (public.is_active_admin());

-- 5. STORAGE BUCKET SETUP: site-media

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  52428800, -- 50 MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf']
)
on conflict (id) do nothing;

-- RLS Policies for storage.objects on 'site-media' bucket
create policy "Public Read Access for site-media bucket"
  on storage.objects
  for select
  to public
  using (bucket_id = 'site-media');

create policy "Admin Upload Access for site-media bucket"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'site-media' and public.is_active_admin());

create policy "Admin Update Access for site-media bucket"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'site-media' and public.is_active_admin());

create policy "Admin Delete Access for site-media bucket"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'site-media' and public.is_active_admin());
