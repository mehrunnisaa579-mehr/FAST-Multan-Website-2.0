-- Migration: 20260810000004_add_department_page_fields.sql
-- Description: Add page hero and HOD message columns to public.departments table

ALTER TABLE public.departments 
ADD COLUMN IF NOT EXISTS short_name TEXT,
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
ADD COLUMN IF NOT EXISTS hod_designation TEXT,
ADD COLUMN IF NOT EXISTS hod_message TEXT;
