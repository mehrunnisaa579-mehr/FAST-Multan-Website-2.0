-- Migration: 20260821000001_add_hero_image_and_long_description_to_news.sql
-- Description: Add explicit hero_image and long_description columns to public.news table

ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS hero_image TEXT,
ADD COLUMN IF NOT EXISTS long_description TEXT;

COMMENT ON COLUMN public.news.hero_image IS 'Hero/Featured image URL for the news article';
COMMENT ON COLUMN public.news.long_description IS 'Full long-form body content for individual news detail page';
