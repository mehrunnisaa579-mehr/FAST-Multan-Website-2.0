-- Migration: 20260811000006_create_administration_staff.sql
-- Description: Create public.administration_staff table for office staff profiles

CREATE TABLE IF NOT EXISTS public.administration_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  office TEXT NOT NULL,
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  extension TEXT,
  introduction TEXT,
  education TEXT,
  display_order INTEGER DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.administration_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for administration_staff" ON public.administration_staff
  FOR SELECT USING (true);

CREATE POLICY "Admin all access for administration_staff" ON public.administration_staff
  FOR ALL USING (public.is_active_admin());
