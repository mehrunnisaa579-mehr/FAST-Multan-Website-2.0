import { supabase } from '../lib/supabase';
import { csFaculty, mgmtFaculty } from '../data/departments';
import { createSlug } from '../data/news';

const settingPromiseCache: Record<string, Promise<any> | undefined> = {};
const settingValueCache: Record<string, { value: any; expiresAt: number } | undefined> = {};
const SETTING_TTL_MS = 60 * 1000;

export interface SiteSetting {
  id?: string;

  key?: string;
  value?: any;
  setting_key?: string;
  setting_value?: any;
  description?: string;
  updated_at?: string;
}

export interface WorkshopRecord {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  overview?: string;
  hero_image?: string;
  venue?: string;
  date_label?: string;
  registration_link?: string;
  is_visible: boolean;
  is_archived?: boolean;
  is_builtin?: boolean;
  display_order: number;
  archived_at?: string;
}

export const cmsService = {
  // 1. GET ALL SITE SETTINGS
  async getAllSettings(): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;
      const settings: Record<string, any> = {};
      (data || []).forEach((row: any) => {
        const k = row.key || row.setting_key;
        const v = row.value !== undefined ? row.value : row.setting_value;
        if (k) settings[k] = v;
      });
      return settings;
    } catch {
      return {};
    }
  },

  // 2. GET SINGLE SETTING BY KEY (Supports both 'key' and 'setting_key' columns)
  getSetting<T = any>(key: string, defaultValue: T): Promise<T> {
    const cached = settingValueCache[key];
    if (cached && Date.now() < cached.expiresAt) {
      return Promise.resolve(cached.value as T);
    }

    if (settingPromiseCache[key]) {
      return settingPromiseCache[key];
    }

    const promise = (async () => {
      try {
        // 1. Try querying by canonical 'key' column
        const { data: primaryData, error: primaryErr } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', key)
          .maybeSingle();

        if (!primaryErr && primaryData) {
          const val = (primaryData.value !== undefined ? primaryData.value : primaryData.setting_value) as T;
          settingValueCache[key] = { value: val, expiresAt: Date.now() + SETTING_TTL_MS };
          return val;
        }

        // 2. Fallback to 'setting_key' column if primary query returns error or empty
        const { data: fallbackData, error: fallbackErr } = await supabase
          .from('site_settings')
          .select('*')
          .eq('setting_key', key)
          .maybeSingle();

        if (!fallbackErr && fallbackData) {
          const val = (fallbackData.setting_value !== undefined ? fallbackData.setting_value : fallbackData.value) as T;
          settingValueCache[key] = { value: val, expiresAt: Date.now() + SETTING_TTL_MS };
          return val;
        }

        return defaultValue;
      } catch {
        return defaultValue;
      } finally {
        delete settingPromiseCache[key];
      }
    })();

    settingPromiseCache[key] = promise;
    return promise;
  },

  // 3. SAVE OR UPDATE SETTING (Supports both 'key' and 'setting_key' schema targets)
  async saveSetting(
    key: string,
    value: any,
    description?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Primary upsert attempt using canonical 'key' / 'value' columns
      const primaryPayload = {
        key: key,
        value: value,
        description: description || `Settings for ${key}`,
        updated_at: new Date().toISOString(),
      };

      const { error: primaryErr } = await supabase
        .from('site_settings')
        .upsert(primaryPayload, { onConflict: 'key' });

      if (!primaryErr) {
        delete settingValueCache[key];
        return { success: true };
      }

      // 2. Fallback upsert attempt using 'setting_key' / 'setting_value' columns
      const fallbackPayload = {
        setting_key: key,
        setting_value: value,
        description: description || `Settings for ${key}`,
        updated_at: new Date().toISOString(),
      };

      const { error: fallbackErr } = await supabase
        .from('site_settings')
        .upsert(fallbackPayload, { onConflict: 'setting_key' });

      if (!fallbackErr) {
        delete settingValueCache[key];
        return { success: true };
      }

      throw primaryErr || fallbackErr;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to save setting' };
    }
  },

  // 4. DEPARTMENTS CRUD
  async getDepartments() {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .or('is_archived.eq.false,is_archived.is.null')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data || []).filter((item: any) => item.is_archived !== true);
    } catch {
      return [];
    }
  },

  async getSchools() {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .or('is_archived.eq.false,is_archived.is.null')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data || []).filter((item: any) => item.is_archived !== true);
    } catch {
      return [];
    }
  },

  // 5. PROGRAMS CRUD
  async getPrograms() {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .or('is_archived.eq.false,is_archived.is.null')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data || []).filter((item: any) => item.is_archived !== true);
    } catch {
      return [];
    }
  },

  // 6. FACULTY CRUD
  async getFaculty() {
    try {
      const { data, error } = await supabase
        .from('faculty')
        .select('*')
        .or('is_archived.eq.false,is_archived.is.null')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data || []).filter((item: any) => item.is_archived !== true);
    } catch {
      return [];
    }
  },

  // 7. RESEARCH GROUPS CRUD
  async getResearchGroups() {
    try {
      const { data, error } = await supabase
        .from('research_groups')
        .select('*')
        .or('is_archived.eq.false,is_archived.is.null')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data || []).filter((item: any) => item.is_archived !== true);
    } catch {
      return [];
    }
  },

  // 8. CAMPUS NEWS & ANNOUNCEMENTS CRUD
  async getNews() {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('updated_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false, nullsFirst: false })
        .order('display_order', { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data || []).filter((item: any) => item.is_archived !== true);
    } catch (err) {
      console.error('getNews error:', err);
      return [];
    }
  },

  async getNewsSummary() {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('id, title, excerpt, published_at, created_at, updated_at, author, category, image_url, published, is_archived')
        .order('updated_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false, nullsFirst: false })
        .order('display_order', { ascending: true, nullsFirst: false });
      if (error) throw error;
      return (data || []).filter((item: any) => item.is_archived !== true);
    } catch (err) {
      console.error('getNewsSummary error:', err);
      return [];
    }
  },

  async getNewsBySlug(slug: string) {
    try {
      const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(cleanSlug)) {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', cleanSlug)
          .maybeSingle();
        if (!error && data) return data;
      }

      const { data: list, error: listErr } = await supabase
        .from('news')
        .select('*');

      if (listErr || !list) return null;

      const found = list.find((item: any) => {
        if (item.is_archived === true) return false;
        const itemSlug = (item.slug || createSlug(item.title, item.id)).toLowerCase().trim();
        const itemTitleSlug = createSlug(item.title, item.id).toLowerCase().trim();
        return itemSlug === cleanSlug || itemTitleSlug === cleanSlug || item.id === cleanSlug;
      });

      return found || null;
    } catch (err) {
      console.error('getNewsBySlug error:', err);
      return null;
    }
  },

  async getNewsArticles() {
    return this.getNews();
  },

  async getRecentNews(limit: number = 4) {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('updated_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false, nullsFirst: false })
        .order('display_order', { ascending: true, nullsFirst: false });
      if (error) throw error;
      const filtered = (data || []).filter(
        (item: any) => item.is_archived !== true && item.published !== false
      );
      return filtered.slice(0, limit);
    } catch (err) {
      console.error('getRecentNews error:', err);
      return [];
    }
  },

  // 9. EVENTS CRUD
  async getEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .or('is_archived.eq.false,is_archived.is.null')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data || []).filter((item: any) => item.is_archived !== true);
    } catch {
      return [];
    }
  },

  async getRecentEvents(limit: number) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, event_date, start_time, end_time, location, description, image_url, published, display_order, is_archived')
        .or('is_archived.eq.false,is_archived.is.null')
        .or('published.eq.true,published.is.null')
        .order('display_order', { ascending: true })
        .limit(limit);
      if (error) throw error;
      return (data || []).filter((item: any) => item.is_archived !== true);
    } catch {
      return [];
    }
  },

  // 10. CAMPUS GALLERY CRUD
  async getGalleryItems() {
    try {
      const { data, error } = await supabase
        .from('campus_gallery')
        .select('*')
        .or('is_archived.eq.false,is_archived.is.null')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data || []).filter((item: any) => item.is_archived !== true);
    } catch {
      return [];
    }
  },

  // 11. SOCIETIES CRUD
  async getSocieties() {
    try {
      const { data, error } = await supabase
        .from('student_societies')
        .select('*')
        .or('is_archived.eq.false,is_archived.is.null')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data || []).filter((item: any) => item.is_archived !== true);
    } catch {
      return [];
    }
  },

  // 12. ADMINISTRATION STAFF CRUD
  async getAdminStaff() {
    try {
      const { data, error } = await supabase
        .from('administration_staff')
        .select('*')
        .or('is_archived.eq.false,is_archived.is.null')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data || []).filter((item: any) => item.is_archived !== true);
    } catch {
      return [];
    }
  },

  async getAdminStaffBySlug(slug: string) {
    try {
      const cleanSlug = slug.toLowerCase().trim();
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(cleanSlug)) {
        const { data, error } = await supabase
          .from('administration_staff')
          .select('*')
          .eq('id', cleanSlug)
          .maybeSingle();
        if (!error && data) return data;
      }

      const { data: list, error: listErr } = await supabase
        .from('administration_staff')
        .select('id, slug, name')
        .or('is_archived.eq.false,is_archived.is.null');

      if (listErr || !list) return null;

      const toSlugLocal = (text: string): string => {
        if (!text) return '';
        return text
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      };

      const found = list.find((item: any) => {
        const itemSlug = (item.slug || '').toLowerCase().trim();
        const itemSlugFromName = toSlugLocal(item.name).toLowerCase().trim();
        return itemSlug === cleanSlug || itemSlugFromName === cleanSlug || item.id === cleanSlug;
      });

      if (!found) return null;

      const { data, error } = await supabase
        .from('administration_staff')
        .select('*')
        .eq('id', found.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch {
      return null;
    }
  },

  // 13. CAREER SERVICES & EDC CONTENT
  async getEDCContent(type: string) {
    try {
      const { data, error } = await supabase
        .from('edc_content')
        .select('*')
        .eq('content_type', type)
        .single();
      if (error || !data) return null;
      return data;
    } catch {
      return null;
    }
  },

  // 14. MEDIA LIBRARY GET ALL
  async getMediaLibrary() {
    try {
      const { data, error } = await supabase.storage.from('site-media').list('uploads', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });
      if (error) throw error;
      return (data || []).map((file) => ({
        id: file.id,
        name: file.name,
        created_at: file.created_at,
        size: file.metadata?.size || 0,
        publicUrl: supabase.storage.from('site-media').getPublicUrl(`uploads/${file.name}`).data.publicUrl,
      }));
    } catch {
      return [];
    }
  },

  // 15. OPTIMIZED IMAGE URL HELPER
  getOptimizedMediaUrl(originalUrl: string, width?: number): string {
    if (!width || !originalUrl || typeof originalUrl !== 'string') return originalUrl;

    try {
      // Check if URL belongs to our site-media bucket
      const match = originalUrl.match(/\/storage\/v1\/object\/public\/site-media\/(.+)$/);
      if (match && match[1]) {
        const path = match[1];
        // Use Supabase JS SDK transform capability
        const { data } = supabase.storage.from('site-media').getPublicUrl(path, {
          transform: { width, resize: 'contain' }
        });
        return data.publicUrl;
      }
    } catch {
      // ignore
    }
    return originalUrl;
  },

  // 16. FILE UPLOAD TO site-media BUCKET (Support Images, MP4/WebM Videos, and PDF Documents)
  async uploadMedia(
    file: File,
    options?: { allowedTypes?: string[]; maxSizeBytes?: number }
  ): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
    try {
      const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm');
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      if (!isImage && !isVideo && !isPdf) {
        return {
          success: false,
          error: `File type "${file.type || 'unknown'}" is not supported. Please upload an image, MP4/WebM video, or PDF file.`,
        };
      }

      // Max size limit: 50MB for videos, 10MB for images/PDFs
      const maxLimit = options?.maxSizeBytes || (isVideo ? 52428800 : 10485760);
      if (file.size > maxLimit) {
        const mb = Math.round(maxLimit / (1024 * 1024));
        return {
          success: false,
          error: `File size exceeds the maximum allowed limit of ${mb}MB.`,
        };
      }

      const fileExt = file.name.split('.').pop() || (isVideo ? 'mp4' : 'jpg');
      const folder = isVideo ? 'videos' : isPdf ? 'documents' : 'images';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `uploads/${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('site-media').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || (isVideo ? 'video/mp4' : undefined),
      });

      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      const { data } = supabase.storage.from('site-media').getPublicUrl(filePath);

      return { success: true, publicUrl: data.publicUrl };
    } catch (err: any) {
      return { success: false, error: err?.message || 'File upload failed' };
    }
  },
  // 16. WORKSHOPS LIST CRUD
  async getWorkshops(): Promise<WorkshopRecord[]> {
    try {
      const data = await this.getSetting<{ items?: WorkshopRecord[] }>('workshops_list', { items: [] });
      const items: WorkshopRecord[] = data?.items || [];
      return items
        .filter((w) => w.is_archived !== true)
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    } catch {
      return [];
    }
  },

  async saveWorkshops(items: WorkshopRecord[]): Promise<{ success: boolean; error?: string }> {
    return this.saveSetting('workshops_list', { items }, 'Workshops List');
  },

  // 17. CANONICAL DEPARTMENT FACULTY GET / SAVE
  async getDepartmentFaculty(dept: 'cs' | 'management'): Promise<any[]> {
    try {
      const settingKey = dept === 'cs' ? 'department_cs_content' : 'school_of_management_content';
      const content = await this.getSetting<any>(settingKey, null);

      // 1. Build canonical HOD record from HOD/head CMS fields
      let hodRecord: any = null;
      if (dept === 'cs') {
        const hodName = content?.hodName || 'Dr. Head of Department';
        hodRecord = {
          id: 'cs-hod',
          slug: 'cs-hod',
          name: hodName,
          designation: content?.hodDesignation || 'Head, Department of Computer Science',
          qualification: content?.hodEducation || 'Ph.D. in Computer Science',
          biography: content?.hodMessage || '',
          photo_url: content?.hodPhotoUrl || '',
          photoUrl: content?.hodPhotoUrl || '',
          badge_photo_url: content?.hodBadgePhotoUrl || content?.hodBadgePhoto || '',
          badgePhotoUrl: content?.hodBadgePhotoUrl || content?.hodBadgePhoto || '',
          email: content?.hodEmail || 'hod.cs@multan.nu.edu.pk',
          phone: content?.hodPhone || '',
          school: 'computing',
          department: 'cs',
          display_order: 0,
          visible: true,
          isHOD: true,
        };
      } else {
        const headName = content?.headName || content?.hodName || 'Dr. Head of Department';
        hodRecord = {
          id: 'management-hod',
          slug: 'management-hod',
          name: headName,
          designation: content?.headDesignation || content?.hodDesignation || 'Head, Department of Management Sciences',
          qualification: content?.headEducation || content?.hodEducation || 'Ph.D. in Management Sciences',
          biography: content?.headMessage || content?.hodMessage || '',
          photo_url: content?.headPhotoUrl || content?.hodPhotoUrl || '',
          photoUrl: content?.headPhotoUrl || content?.hodPhotoUrl || '',
          badge_photo_url: content?.headBadgePhotoUrl || content?.hodBadgePhotoUrl || '',
          badgePhotoUrl: content?.headBadgePhotoUrl || content?.hodBadgePhotoUrl || '',
          email: content?.headEmail || content?.hodEmail || 'hod.mgmt@multan.nu.edu.pk',
          phone: content?.headPhone || content?.hodPhone || '',
          school: 'management',
          department: 'management',
          display_order: 0,
          visible: true,
          isHOD: true,
        };
      }

      // 2. Fetch raw faculty list from setting array or fallback data
      let rawList: any[] = [];
      if (content && Array.isArray(content.facultyList) && content.facultyList.length > 0) {
        rawList = content.facultyList.map((item: any, idx: number) => ({
          ...item,
          id: item.id || `${dept}-fac-${idx + 1}`,
          name: item.name || '',
          designation: item.designation || 'Faculty Member',
          qualification: item.qualification || '',
          biography: item.biography || item.introduction || item.bio || '',
          photo_url: item.photo_url || item.photoUrl || item.image || '',
          photoUrl: item.photoUrl || item.photo_url || item.image || '',
          badge_photo_url: item.badge_photo_url || item.badgePhotoUrl || '',
          badgePhotoUrl: item.badgePhotoUrl || item.badge_photo_url || '',
          school: dept === 'management' ? 'management' : 'computing',
          department: dept,
          display_order: item.display_order ?? item.displayOrder ?? idx + 1,
          visible: item.visible ?? item.is_visible ?? true,
          isHOD: false,
        }));
      } else {
        const fallbackSource = dept === 'cs' ? csFaculty : (mgmtFaculty || []);
        rawList = fallbackSource.map((f, idx) => ({
          id: f.id,
          name: f.name,
          designation: f.designation,
          qualification: dept === 'cs' ? 'Ph.D. / M.S. Computer Science' : 'Ph.D. / M.S. Management Sciences',
          biography: `Faculty member in the ${dept === 'cs' ? 'Department of Computer Science' : 'Department of Management Sciences'} at FAST-NUCES Multan Campus.`,
          photo_url: '',
          photoUrl: '',
          school: dept === 'management' ? 'management' : 'computing',
          department: dept,
          display_order: idx + 1,
          visible: true,
          isHOD: false,
        }));
      }

      const normalizeName = (str: string) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      // 3. Deduplicate: Filter raw list to remove any item that matches HOD by id, email, or normalized name
      const filteredList = rawList.filter((item: any) => {
        if (item.isHOD) return false;
        if (item.id && (item.id === hodRecord.id || item.id === 'cs-hod' || item.id === 'management-hod')) return false;
        if (item.email && hodRecord.email && item.email.toLowerCase().trim() === hodRecord.email.toLowerCase().trim()) return false;
        if (normalizeName(item.name) === normalizeName(hodRecord.name)) return false;
        return true;
      });

      // 4. Return HOD record prepended first
      return [hodRecord, ...filteredList];
    } catch {
      return [];
    }
  },

  async saveDepartmentFaculty(dept: 'cs' | 'management', facultyList: any[]): Promise<{ success: boolean; error?: string }> {
    try {
      const settingKey = dept === 'cs' ? 'department_cs_content' : 'school_of_management_content';
      const settingDesc = dept === 'cs' ? 'Department of Computer Science Content' : 'School of Management page content';
      const existing = (await this.getSetting<any>(settingKey, null)) || {};

      // Separate HOD item from regular faculty
      const hodRecord = facultyList.find((f: any) => f.isHOD || f.id === 'cs-hod' || f.id === 'management-hod');
      const regularFaculty = facultyList.filter((f: any) => !f.isHOD && f.id !== 'cs-hod' && f.id !== 'management-hod');

      // Normalize regular faculty items for facultyList array storage
      const normalizedList = regularFaculty.map((item: any, idx: number) => ({
        id: item.id || `${dept}-fac-${Date.now()}-${idx}`,
        name: item.name || '',
        designation: item.designation || 'Faculty Member',
        qualification: item.qualification || '',
        biography: item.biography || item.introduction || '',
        introduction: item.introduction || item.biography || '',
        photo_url: item.photo_url || item.photoUrl || '',
        photoUrl: item.photoUrl || item.photo_url || '',
        badge_photo_url: item.badge_photo_url || item.badgePhotoUrl || '',
        badgePhotoUrl: item.badgePhotoUrl || item.badge_photo_url || '',
        email: item.email || '',
        phone: item.phone || '',
        extension: item.extension || '',
        education: item.education || '',
        publications: item.publications || '',
        collaborations: item.collaborations || '',
        fundedProjects: item.fundedProjects || item.funded_projects || '',
        funded_projects: item.funded_projects || item.fundedProjects || '',
        slug: item.slug || '',
        school: dept === 'management' ? 'management' : 'computing',
        department: dept,
        display_order: idx + 1,
        is_visible: item.visible ?? item.is_visible ?? true,
        visible: item.visible ?? item.is_visible ?? true,
      }));

      const updatedPayload = {
        ...existing,
        facultyList: normalizedList,
        updated_at: new Date().toISOString(),
      };

      // If HOD was edited, update canonical HOD fields in CMS setting
      if (hodRecord) {
        if (dept === 'cs') {
          updatedPayload.hodName = hodRecord.name || existing.hodName;
          updatedPayload.hodDesignation = hodRecord.designation || existing.hodDesignation;
          updatedPayload.hodPhotoUrl = hodRecord.photo_url || hodRecord.photoUrl || existing.hodPhotoUrl;
          updatedPayload.hodEducation = hodRecord.qualification || existing.hodEducation;
          updatedPayload.hodMessage = hodRecord.biography || existing.hodMessage;
          updatedPayload.hodEmail = hodRecord.email || existing.hodEmail;
          updatedPayload.hodPhone = hodRecord.phone || existing.hodPhone;
        } else {
          updatedPayload.headName = hodRecord.name || existing.headName || existing.hodName;
          updatedPayload.hodName = hodRecord.name || existing.hodName || existing.headName;
          updatedPayload.headDesignation = hodRecord.designation || existing.headDesignation || existing.hodDesignation;
          updatedPayload.hodDesignation = hodRecord.designation || existing.hodDesignation || existing.headDesignation;
          updatedPayload.headPhotoUrl = hodRecord.photo_url || hodRecord.photoUrl || existing.headPhotoUrl || existing.hodPhotoUrl;
          updatedPayload.hodPhotoUrl = hodRecord.photo_url || hodRecord.photoUrl || existing.hodPhotoUrl || existing.headPhotoUrl;
          updatedPayload.headEducation = hodRecord.qualification || existing.headEducation || existing.hodEducation;
          updatedPayload.hodEducation = hodRecord.qualification || existing.headEducation || existing.hodEducation;
          updatedPayload.headMessage = hodRecord.biography || existing.headMessage || existing.hodMessage;
          updatedPayload.hodMessage = hodRecord.biography || existing.hodMessage || existing.headMessage;
          updatedPayload.headEmail = hodRecord.email || existing.headEmail || existing.hodEmail;
          updatedPayload.hodEmail = hodRecord.email || existing.hodEmail || existing.headEmail;
          updatedPayload.headPhone = hodRecord.phone || existing.headPhone || existing.hodPhone;
          updatedPayload.hodPhone = hodRecord.phone || existing.headPhone || existing.hodPhone;
        }
      }

      return await this.saveSetting(settingKey, updatedPayload, settingDesc);
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to save department faculty' };
    }
  },

  // 10. DYNAMIC CUSTOM DEPARTMENTS CRUD
  async getCustomDepartments() {
    return await this.getSetting<any[]>('custom_departments_list', []);
  },

  async saveCustomDepartments(list: any[]) {
    return await this.saveSetting('custom_departments_list', list, 'List of custom created departments');
  },

  async deleteCustomDepartment(id: string, slug: string) {
    const current = await this.getCustomDepartments();
    const filtered = current.filter((d: any) => d.id !== id && d.slug !== slug);
    return await this.saveCustomDepartments(filtered);
  },

  async getCustomDepartmentContent(slug: string) {
    return await this.getSetting<any>(`custom_department_content_${slug}`, null);
  },

  async saveCustomDepartmentContent(slug: string, content: any) {
    return await this.saveSetting(
      `custom_department_content_${slug}`,
      content,
      `Full content schema for custom department ${slug}`
    );
  },
};
