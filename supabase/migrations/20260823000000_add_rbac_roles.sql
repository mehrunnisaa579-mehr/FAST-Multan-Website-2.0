-- ====================================================================
-- FAST-NUCES Multan Campus CMS - Role-Based Access Control Migration
-- Migration: 20260823000000_add_rbac_roles.sql
-- Description: Expands admin roles and implements server-side RLS
-- ====================================================================

-- 1. Update the check_admin_role constraint to allow the 3 new roles
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS check_admin_role;
ALTER TABLE public.admin_users ADD CONSTRAINT check_admin_role 
  CHECK (role IN ('admin', 'super_admin', 'hr', 'director_secretary', 'student_affairs'));

-- 2. Helper function to fetch the user's specific role for RLS checks
CREATE OR REPLACE FUNCTION public.get_admin_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role
  FROM public.admin_users
  WHERE user_id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;

-- 3. Update RLS for site_settings (Modules like Dept Editors, News, Events)
DROP POLICY IF EXISTS "Active admins can insert, update, or delete site settings" ON public.site_settings;

CREATE POLICY "Role-based access for site settings"
  ON public.site_settings
  FOR ALL
  TO authenticated
  USING (
    public.is_active_admin() AND (
      public.get_admin_role() IN ('admin', 'super_admin')
      OR
      (public.get_admin_role() IN ('hr', 'director_secretary') AND key IN (
         'admin_staff_content',
         'department_cs_content',
         'department_se_content',
         'department_ai_content',
         'department_ee_content',
         'department_cv_content',
         'school_of_management_content',
         'generic_department_content',
         'news_content',
         'campus_news'
      ))
      OR
      (public.get_admin_role() = 'student_affairs' AND key IN (
         'events_content',
         'events_settings',
         'societies_content',
         'societies_settings'
      ))
    )
  )
  WITH CHECK (
    public.is_active_admin() AND (
      public.get_admin_role() IN ('admin', 'super_admin')
      OR
      (public.get_admin_role() IN ('hr', 'director_secretary') AND key IN (
         'admin_staff_content',
         'department_cs_content',
         'department_se_content',
         'department_ai_content',
         'department_ee_content',
         'department_cv_content',
         'school_of_management_content',
         'generic_department_content',
         'news_content',
         'campus_news'
      ))
      OR
      (public.get_admin_role() = 'student_affairs' AND key IN (
         'events_content',
         'events_settings',
         'societies_content',
         'societies_settings'
      ))
    )
  );

-- 4. Update RLS for events and societies tables (student_affairs)
DROP POLICY IF EXISTS "Admin all access for events" ON public.events;
CREATE POLICY "Role-based access for events"
  ON public.events
  FOR ALL
  TO authenticated
  USING (public.is_active_admin() AND public.get_admin_role() IN ('admin', 'super_admin', 'student_affairs'))
  WITH CHECK (public.is_active_admin() AND public.get_admin_role() IN ('admin', 'super_admin', 'student_affairs'));

DROP POLICY IF EXISTS "Admin all access for societies" ON public.societies;
CREATE POLICY "Role-based access for societies"
  ON public.societies
  FOR ALL
  TO authenticated
  USING (public.is_active_admin() AND public.get_admin_role() IN ('admin', 'super_admin', 'student_affairs'))
  WITH CHECK (public.is_active_admin() AND public.get_admin_role() IN ('admin', 'super_admin', 'student_affairs'));

-- 5. Update RLS for news and faculty tables (hr, director_secretary)
DROP POLICY IF EXISTS "Admin all access for news" ON public.news;
CREATE POLICY "Role-based access for news"
  ON public.news
  FOR ALL
  TO authenticated
  USING (public.is_active_admin() AND public.get_admin_role() IN ('admin', 'super_admin', 'hr', 'director_secretary'))
  WITH CHECK (public.is_active_admin() AND public.get_admin_role() IN ('admin', 'super_admin', 'hr', 'director_secretary'));

DROP POLICY IF EXISTS "Admin all access for faculty" ON public.faculty;
CREATE POLICY "Role-based access for faculty"
  ON public.faculty
  FOR ALL
  TO authenticated
  USING (public.is_active_admin() AND public.get_admin_role() IN ('admin', 'super_admin', 'hr', 'director_secretary'))
  WITH CHECK (public.is_active_admin() AND public.get_admin_role() IN ('admin', 'super_admin', 'hr', 'director_secretary'));

-- 6. Restrict other core CMS tables to admin and super_admin only
DO $$ 
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'schools', 'departments', 'programs', 'research_groups', 'services', 
        'useful_links', 'edc_conferences', 'edc_speakers', 'edc_workshops', 
        'page_heroes', 'gallery_items'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('
            DROP POLICY IF EXISTS "Admin Write %s" ON public.%s;
            DROP POLICY IF EXISTS "Admin all access for %s" ON public.%s;
            CREATE POLICY "Role-based access for %s"
              ON public.%s
              FOR ALL
              TO authenticated
              USING (public.is_active_admin() AND public.get_admin_role() IN (''admin'', ''super_admin''))
              WITH CHECK (public.is_active_admin() AND public.get_admin_role() IN (''admin'', ''super_admin''));
        ', tbl, tbl, tbl, tbl, tbl, tbl);
    END LOOP;
END $$;
