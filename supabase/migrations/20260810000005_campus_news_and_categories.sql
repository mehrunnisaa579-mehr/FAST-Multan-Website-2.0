-- Migration: 20260810000005_campus_news_and_categories.sql
-- Description: Add news_type column to public.news and create public.news_categories table

ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS news_type TEXT DEFAULT 'campus_news';

CREATE TABLE IF NOT EXISTS public.news_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 1,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read news_categories" ON public.news_categories
  FOR SELECT USING (true);

CREATE POLICY "Admin full access news_categories" ON public.news_categories
  FOR ALL USING (public.is_active_admin());
