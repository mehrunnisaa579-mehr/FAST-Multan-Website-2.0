-- Migration: 20260810000002_add_society_leadership_photos.sql
-- Description: Add photo URL columns for society leadership members

ALTER TABLE public.societies 
ADD COLUMN IF NOT EXISTS mentor_photo_url TEXT,
ADD COLUMN IF NOT EXISTS president_photo_url TEXT,
ADD COLUMN IF NOT EXISTS vice_president_1_photo_url TEXT,
ADD COLUMN IF NOT EXISTS vice_president_2_photo_url TEXT,
ADD COLUMN IF NOT EXISTS vp1_photo_url TEXT,
ADD COLUMN IF NOT EXISTS vp2_photo_url TEXT;
