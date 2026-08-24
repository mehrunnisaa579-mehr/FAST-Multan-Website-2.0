-- ====================================================================
-- FAST-NUCES Multan Campus CMS - Instagram Feed Integration
-- Migration: 20260823000001_add_instagram_integration.sql
-- Description: Adds tables and cron jobs for the live Instagram Feed.
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "extensions";

-- 2. Vault Helper Functions for Edge Functions
CREATE OR REPLACE FUNCTION public.store_vault_secret(secret_name text, secret_value text, secret_description text DEFAULT '')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = vault, public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM vault.secrets WHERE name = secret_name) THEN
    UPDATE vault.secrets SET secret = secret_value, description = secret_description WHERE name = secret_name;
  ELSE
    PERFORM vault.create_secret(secret_value, secret_name, secret_description);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_vault_secret(secret_name text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = vault, public
AS $$
  SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = secret_name LIMIT 1;
$$;

-- 3. Create Instagram Posts Table
CREATE TABLE IF NOT EXISTS public.instagram_posts (
  id text PRIMARY KEY,
  media_type text NOT NULL,
  media_url text NOT NULL,
  thumbnail_url text,
  permalink text NOT NULL,
  caption text,
  posted_at timestamptz NOT NULL,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  is_visible boolean NOT NULL DEFAULT true
);

COMMENT ON TABLE public.instagram_posts IS 'Stores the latest 20 synchronized posts from the official FAST Multan Instagram Business account.';

-- 3. Create Integration Settings Table (Metadata Only)
CREATE TABLE IF NOT EXISTS public.integration_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value_expires_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.integration_settings IS 'Stores non-sensitive metadata for third-party integrations (e.g., token expiry dates).';

-- 4. Create Integration Alerts Table
CREATE TABLE IF NOT EXISTS public.integration_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  message text NOT NULL,
  severity text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.integration_alerts IS 'Logs automated integration failures like token refresh errors.';

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_alerts ENABLE ROW LEVEL SECURITY;

-- instagram_posts: Public read, No public write
CREATE POLICY "Public read access for instagram_posts"
  ON public.instagram_posts
  FOR SELECT
  TO public
  USING (is_visible = true);

-- integration_settings: Admin-only read/write
CREATE POLICY "Admin full access for integration_settings"
  ON public.integration_settings
  FOR ALL
  TO authenticated
  USING (public.is_active_admin() AND public.get_admin_role() IN ('admin', 'super_admin'))
  WITH CHECK (public.is_active_admin() AND public.get_admin_role() IN ('admin', 'super_admin'));

-- integration_alerts: Admin-only read, no write (except via service_role)
CREATE POLICY "Admin read access for integration_alerts"
  ON public.integration_alerts
  FOR SELECT
  TO authenticated
  USING (public.is_active_admin() AND public.get_admin_role() IN ('admin', 'super_admin'));

-- 6. Cron Jobs for Synchronization and Token Refresh
-- Note: Replace placeholders with real values before executing

-- Safely remove existing cron jobs if they exist
SELECT cron.unschedule('fetch-instagram-posts-hourly');
SELECT cron.unschedule('refresh-instagram-token-daily');

-- Schedule: Fetch Posts (Hourly)
SELECT cron.schedule(
  'fetch-instagram-posts-hourly',
  '0 * * * *',
  $$
    SELECT net.http_post(
      url:='https://idqkkujdqjhnnwixbpst.supabase.co/functions/v1/fetch-instagram-posts',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer REPLACE_WITH_REAL_SUPABASE_SERVICE_ROLE_KEY_BEFORE_RUNNING"}'::jsonb
    )
  $$
);

-- Schedule: Refresh Token (Daily at Midnight)
SELECT cron.schedule(
  'refresh-instagram-token-daily',
  '0 0 * * *',
  $$
    SELECT net.http_post(
      url:='https://idqkkujdqjhnnwixbpst.supabase.co/functions/v1/refresh-instagram-token',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer REPLACE_WITH_REAL_SUPABASE_SERVICE_ROLE_KEY_BEFORE_RUNNING"}'::jsonb
    )
  $$
);
