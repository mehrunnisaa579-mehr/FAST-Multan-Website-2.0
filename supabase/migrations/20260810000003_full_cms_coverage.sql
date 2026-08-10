-- Migration: 20260810000003_full_cms_coverage.sql
-- Description: Full CMS Coverage Schema Expansion for Schools, Departments, Programs, Research Groups, Services, Useful Links, EDC, and Page Heroes

-- 1. SCHOOLS
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  href TEXT,
  display_order INTEGER DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  icon_url TEXT,
  hod_name TEXT,
  hod_photo_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PROGRAMS
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level TEXT DEFAULT 'undergraduate',
  duration TEXT,
  description TEXT,
  image_url TEXT,
  icon_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RESEARCH GROUPS
CREATE TABLE IF NOT EXISTS public.research_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  lead_name TEXT,
  lead_photo_url TEXT,
  image_url TEXT,
  research_areas TEXT,
  display_order INTEGER DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. SERVICES
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  href TEXT,
  display_order INTEGER DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. USEFUL LINKS
CREATE TABLE IF NOT EXISTS public.useful_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  href TEXT NOT NULL,
  icon_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. EDC CONFERENCES
CREATE TABLE IF NOT EXISTS public.edc_conferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT,
  location TEXT,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. EDC SPEAKERS
CREATE TABLE IF NOT EXISTS public.edc_speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conference_id UUID REFERENCES public.edc_conferences(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  organization TEXT,
  photo_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. EDC WORKSHOPS
CREATE TABLE IF NOT EXISTS public.edc_workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT,
  location TEXT,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. PAGE HEROES
CREATE TABLE IF NOT EXISTS public.page_heroes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  video_url TEXT,
  is_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Security Policies
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.useful_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edc_conferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edc_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edc_workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_heroes ENABLE ROW LEVEL SECURITY;

-- Public READ Policies
CREATE POLICY "Public Read Schools" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Public Read Departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Public Read Programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Public Read Research Groups" ON public.research_groups FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public Read Useful Links" ON public.useful_links FOR SELECT USING (true);
CREATE POLICY "Public Read EDC Conferences" ON public.edc_conferences FOR SELECT USING (true);
CREATE POLICY "Public Read EDC Speakers" ON public.edc_speakers FOR SELECT USING (true);
CREATE POLICY "Public Read EDC Workshops" ON public.edc_workshops FOR SELECT USING (true);
CREATE POLICY "Public Read Page Heroes" ON public.page_heroes FOR SELECT USING (true);

-- Admin WRITE Policies
CREATE POLICY "Admin Write Schools" ON public.schools FOR ALL USING (public.is_active_admin());
CREATE POLICY "Admin Write Departments" ON public.departments FOR ALL USING (public.is_active_admin());
CREATE POLICY "Admin Write Programs" ON public.programs FOR ALL USING (public.is_active_admin());
CREATE POLICY "Admin Write Research Groups" ON public.research_groups FOR ALL USING (public.is_active_admin());
CREATE POLICY "Admin Write Services" ON public.services FOR ALL USING (public.is_active_admin());
CREATE POLICY "Admin Write Useful Links" ON public.useful_links FOR ALL USING (public.is_active_admin());
CREATE POLICY "Admin Write EDC Conferences" ON public.edc_conferences FOR ALL USING (public.is_active_admin());
CREATE POLICY "Admin Write EDC Speakers" ON public.edc_speakers FOR ALL USING (public.is_active_admin());
CREATE POLICY "Admin Write EDC Workshops" ON public.edc_workshops FOR ALL USING (public.is_active_admin());
CREATE POLICY "Admin Write Page Heroes" ON public.page_heroes FOR ALL USING (public.is_active_admin());
