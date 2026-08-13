-- ====================================================================
-- FAST-NUCES Multan Campus CMS Archive System Migration
-- Migration: 20260812000001_add_archive_system_fields.sql
-- ====================================================================

-- 1. ADD ARCHIVE FIELDS TO ALL CONTENT TABLES
ALTER TABLE IF EXISTS public.news ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.news ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.events ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.events ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.faculty ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.faculty ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.societies ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.societies ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.gallery_items ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.gallery_items ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.schools ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.schools ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.departments ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.departments ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.programs ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.programs ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.research_groups ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.research_groups ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.services ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.useful_links ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.useful_links ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.edc_conferences ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.edc_conferences ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.edc_speakers ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.edc_speakers ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.edc_workshops ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.edc_workshops ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE IF EXISTS public.administration_staff ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS public.administration_staff ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- 2. CREATE PERFORMANCE INDEXES FOR ARCHIVE QUERIES
CREATE INDEX IF NOT EXISTS idx_news_is_archived ON public.news(is_archived);
CREATE INDEX IF NOT EXISTS idx_events_is_archived ON public.events(is_archived);
CREATE INDEX IF NOT EXISTS idx_faculty_is_archived ON public.faculty(is_archived);
CREATE INDEX IF NOT EXISTS idx_societies_is_archived ON public.societies(is_archived);
CREATE INDEX IF NOT EXISTS idx_gallery_items_is_archived ON public.gallery_items(is_archived);
CREATE INDEX IF NOT EXISTS idx_programs_is_archived ON public.programs(is_archived);
CREATE INDEX IF NOT EXISTS idx_research_groups_is_archived ON public.research_groups(is_archived);
CREATE INDEX IF NOT EXISTS idx_administration_staff_is_archived ON public.administration_staff(is_archived);
