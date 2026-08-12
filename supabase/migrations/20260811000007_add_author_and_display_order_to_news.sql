-- Migration: 20260811000007_add_author_and_display_order_to_news.sql
-- Description: Add missing author and display_order columns to public.news table

ALTER TABLE public.news
ADD COLUMN IF NOT EXISTS author TEXT DEFAULT 'Admin',
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 1;

COMMENT ON COLUMN public.news.author IS 'Author or publisher name for the news article';
COMMENT ON COLUMN public.news.display_order IS 'Sort order for news articles listing';
