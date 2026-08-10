import { supabase } from '../lib/supabase';
import { footerContent } from '../data/footer';
import { homepageContent } from '../data/homepage';
import { csFaculty, seFaculty, aidsFaculty } from '../data/departments';

export const cmsService = {
  // 1. SITE SETTINGS (Generic JSON Key-Value)
  async getSetting<T>(key: string, fallback: T): Promise<T> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .maybeSingle();

      if (error || !data || !data.value) {
        return fallback;
      }
      return data.value as T;
    } catch {
      return fallback;
    }
  },

  async saveSetting<T>(key: string, value: T, description?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            key,
            value,
            description: description || `CMS Setting for ${key}`,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to save settings' };
    }
  },

  // 2. NEWS
  async getNews(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return [];
      }
      return data;
    } catch {
      return [];
    }
  },

  // 3. EVENTS
  async getEvents(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return [];
      }
      return data;
    } catch {
      return [];
    }
  },

  // 4. FACULTY
  async getFaculty(department?: string): Promise<any[]> {
    try {
      let query = supabase.from('faculty').select('*').order('display_order', { ascending: true });
      if (department) {
        query = query.eq('department', department);
      }
      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        return [];
      }
      return data;
    } catch {
      return [];
    }
  },

  // 5. SOCIETIES
  async getSocieties(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('societies')
        .select('*');

      if (error || !data || data.length === 0) {
        return [];
      }
      return data;
    } catch {
      return [];
    }
  },

  // 6. GALLERY
  async getGalleryItems(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return [];
      }
      return data;
    } catch {
      return [];
    }
  },

  // 7. SCHOOLS
  async getSchools(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('display_order', { ascending: true });
      if (error || !data || data.length === 0) return [];
      return data;
    } catch {
      return [];
    }
  },

  // 8. DEPARTMENTS
  async getDepartments(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('display_order', { ascending: true });
      if (error || !data || data.length === 0) return [];
      return data;
    } catch {
      return [];
    }
  },

  // 9. PROGRAMS
  async getPrograms(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('display_order', { ascending: true });
      if (error || !data || data.length === 0) return [];
      return data;
    } catch {
      return [];
    }
  },

  // 10. RESEARCH GROUPS
  async getResearchGroups(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('research_groups')
        .select('*')
        .order('display_order', { ascending: true });
      if (error || !data || data.length === 0) return [];
      return data;
    } catch {
      return [];
    }
  },

  // 11. SERVICES
  async getServices(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });
      if (error || !data || data.length === 0) return [];
      return data;
    } catch {
      return [];
    }
  },

  // 12. USEFUL LINKS
  async getUsefulLinks(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('useful_links')
        .select('*')
        .order('display_order', { ascending: true });
      if (error || !data || data.length === 0) return [];
      return data;
    } catch {
      return [];
    }
  },

  // 13. EDC CONFERENCES & SPEAKERS & WORKSHOPS
  async getEdcConferences(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('edc_conferences')
        .select('*')
        .order('display_order', { ascending: true });
      if (error || !data || data.length === 0) return [];
      return data;
    } catch {
      return [];
    }
  },

  async getEdcSpeakers(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('edc_speakers')
        .select('*')
        .order('display_order', { ascending: true });
      if (error || !data || data.length === 0) return [];
      return data;
    } catch {
      return [];
    }
  },

  async getEdcWorkshops(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('edc_workshops')
        .select('*')
        .order('display_order', { ascending: true });
      if (error || !data || data.length === 0) return [];
      return data;
    } catch {
      return [];
    }
  },

  // 14. FILE UPLOAD TO site-media BUCKET
  async uploadMedia(file: File): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
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
