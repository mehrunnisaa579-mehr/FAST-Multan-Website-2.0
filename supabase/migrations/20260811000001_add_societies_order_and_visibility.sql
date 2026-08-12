-- Migration: 20260811000001_add_societies_order_and_visibility.sql
-- Description: Add short_name, display_order and is_visible columns to societies table

ALTER TABLE public.societies 
ADD COLUMN IF NOT EXISTS short_name TEXT,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
