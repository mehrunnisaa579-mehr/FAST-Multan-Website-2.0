import { supabase } from '../lib/supabase';

export interface SiteSetting {
  id?: string;
  key?: string;
  value?: any;
  setting_key?: string;
  setting_value?: any;
  description?: string;
  updated_at?: string;
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
  async getSetting<T = any>(key: string, defaultValue: T): Promise<T> {
    try {
      // 1. Try querying by canonical 'key' column
      const { data: primaryData, error: primaryErr } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .maybeSingle();

      if (!primaryErr && primaryData) {
        return (primaryData.value !== undefined ? primaryData.value : primaryData.setting_value) as T;
      }

      // 2. Fallback to 'setting_key' column if primary query returns error or empty
      const { data: fallbackData, error: fallbackErr } = await supabase
        .from('site_settings')
        .select('*')
        .eq('setting_key', key)
        .maybeSingle();

      if (!fallbackErr && fallbackData) {
        return (fallbackData.setting_value !== undefined ? fallbackData.setting_value : fallbackData.value) as T;
      }

      return defaultValue;
    } catch {
      return defaultValue;
    }
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

      if (!primaryErr) return { success: true };

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

      if (!fallbackErr) return { success: true };

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
        .or('is_archived.eq.false,is_archived.is.null')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).filter((item: any) => item.is_archived !== true);
    } catch {
      return [];
    }
  },

  async getNewsArticles() {
    return this.getNews();
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

  // 15. FILE UPLOAD TO site-media BUCKET (Support Images, MP4/WebM Videos, and PDF Documents)
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
};
