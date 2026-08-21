import { supabase } from '../lib/supabase';
import { cmsService } from './cmsService';

export interface ArchivedRecord {
  id: string;
  source_type: 'table' | 'setting_array' | 'fallback';
  source_key: string;
  array_key?: string;
  module_name: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  archived_at: string;
  original_data: any;
}

export const archiveService = {
  // 1. GET ALL ARCHIVED ITEMS ACROSS DB TABLES, JSON SETTINGS, AND FALLBACK STORAGE
  async getArchivedItems(): Promise<ArchivedRecord[]> {
    const items: ArchivedRecord[] = [];

    // Helper for DB table queries
    const fetchTableArchives = async (
      table: string,
      moduleName: string,
      titleField: string,
      subtitleField?: string,
      imageField?: string
    ) => {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('is_archived', true);
        if (!error && data) {
          data.forEach((row: any) => {
            items.push({
              id: row.id,
              source_type: 'table',
              source_key: table,
              module_name: moduleName,
              title: row[titleField] || row.title || row.name || 'Untitled Item',
              subtitle: subtitleField ? row[subtitleField] : row.subtitle || row.designation || row.category || '',
              image_url: imageField ? row[imageField] : row.image_url || row.photo_url || row.image || '',
              archived_at: row.archived_at || row.updated_at || new Date().toISOString(),
              original_data: row,
            });
          });
        }
      } catch {
        // Table query error ignored
      }
    };

    // Query supported DB tables
    await Promise.all([
      fetchTableArchives('news', 'Campus News & Announcements', 'title', 'category', 'image_url'),
      fetchTableArchives('events', 'Events Calendar', 'title', 'event_date', 'image_url'),
      fetchTableArchives('faculty', 'Faculty Members', 'name', 'designation', 'photo_url'),
      fetchTableArchives('administration_staff', 'Administration Staff', 'name', 'designation', 'photo_url'),
      fetchTableArchives('gallery_items', 'Photo Gallery', 'caption', 'row_number', 'image_url'),
      fetchTableArchives('societies', 'Student Societies', 'name', 'slug', 'hero_image'),
      fetchTableArchives('programs', 'Degree Programs', 'name', 'level', 'image_url'),
      fetchTableArchives('research_groups', 'Research Groups', 'name', 'lead_name', 'image_url'),
      fetchTableArchives('edc_conferences', 'EDC Conferences', 'title', 'date', 'image_url'),
      fetchTableArchives('edc_speakers', 'EDC Speakers', 'name', 'title', 'photo_url'),
      fetchTableArchives('edc_workshops', 'EDC Workshops', 'title', 'date', 'image_url'),
      fetchTableArchives('services', 'Campus Services', 'title', 'description', 'icon_url'),
      fetchTableArchives('useful_links', 'Useful Links', 'title', 'category', 'icon_url'),
    ]);

    // Query JSON setting arrays from site_settings
    const settingArrayConfigs = [
      { key: 'department_cs_content', arrayKey: 'programsList', moduleName: 'CS Programs' },
      { key: 'department_cs_content', arrayKey: 'facultyList', moduleName: 'CS Faculty' },
      { key: 'department_cs_content', arrayKey: 'alliedFacultyList', moduleName: 'CS Allied Faculty' },
      { key: 'department_cs_content', arrayKey: 'researchList', moduleName: 'CS Research Areas' },
      { key: 'department_se_content', arrayKey: 'programsList', moduleName: 'SE Programs' },
      { key: 'department_se_content', arrayKey: 'facultyList', moduleName: 'SE Faculty' },
      { key: 'department_ai_content', arrayKey: 'programsList', moduleName: 'AI Programs' },
      { key: 'department_ai_content', arrayKey: 'facultyList', moduleName: 'AI Faculty' },
      { key: 'school_of_management_content', arrayKey: 'programsList', moduleName: 'Management Programs' },
      { key: 'school_of_management_content', arrayKey: 'facultyList', moduleName: 'Management Faculty' },
      { key: 'school_of_management_content', arrayKey: 'alliedFacultyList', moduleName: 'Management Allied Faculty' },
      { key: 'homepage_full_content', arrayKey: 'newsList', moduleName: 'Homepage News' },
      { key: 'homepage_full_content', arrayKey: 'eventsList', moduleName: 'Homepage Events' },
      { key: 'homepage_full_content', arrayKey: 'galleryImages', moduleName: 'Homepage Gallery' },
      { key: 'campus_intro_content', arrayKey: 'galleryList', moduleName: 'Campus Introduction Gallery' },
      { key: 'edc_summer_bootcamp', arrayKey: 'modulesList', moduleName: 'Summer Bootcamp Modules' },
      { key: 'edc_highlights', arrayKey: 'mediaList', moduleName: 'EDC Highlights Media' },
      { key: 'workshops_list', arrayKey: 'items', moduleName: 'Workshops' },
    ];

    for (const cfg of settingArrayConfigs) {
      try {
        const data = await cmsService.getSetting<any>(cfg.key, null);
        if (data && Array.isArray(data[cfg.arrayKey])) {
          data[cfg.arrayKey].forEach((item: any) => {
            if (item && item.is_archived === true) {
              items.push({
                id: item.id || `${cfg.key}_${cfg.arrayKey}_${Math.random()}`,
                source_type: 'setting_array',
                source_key: cfg.key,
                array_key: cfg.arrayKey,
                module_name: cfg.moduleName,
                title: item.title || item.name || item.caption || item.moduleTitle || 'Archived Item',
                subtitle: item.subtitle || item.designation || item.role || item.category || '',
                image_url: item.image || item.imageUrl || item.image_url || item.photoUrl || item.photo_url || '',
                archived_at: item.archived_at || new Date().toISOString(),
                original_data: item,
              });
            }
          });
        }
      } catch {
        // setting query error ignored
      }
    }

    // Query Fallback Archived Items
    try {
      const fallbacks = await cmsService.getSetting<ArchivedRecord[]>('cms_archived_items_fallback', []);
      if (Array.isArray(fallbacks)) {
        fallbacks.forEach((fb) => {
          if (!items.some((i) => i.id === fb.id)) {
            items.push(fb);
          }
        });
      }
    } catch {
      // Fallback query error ignored
    }

    // Sort by archived_at descending
    return items.sort((a, b) => new Date(b.archived_at).getTime() - new Date(a.archived_at).getTime());
  },

  // 2. SOFT ARCHIVE AN ITEM
  async archiveItem(params: {
    table?: string;
    settingKey?: string;
    arrayKey?: string;
    itemId: string;
    moduleName: string;
    title: string;
    subtitle?: string;
    image_url?: string;
    itemData?: any;
  }): Promise<{ success: boolean; error?: string }> {
    const { table, settingKey, arrayKey, itemId, moduleName, title, subtitle, image_url, itemData } = params;
    const nowIso = new Date().toISOString();

    // Strategy A: DB Table Soft Delete
    if (table) {
      try {
        const { error } = await supabase
          .from(table)
          .update({ is_archived: true, archived_at: nowIso })
          .eq('id', itemId);

        if (!error) return { success: true };
      } catch {
        // Table update failed, fallback below
      }
    }

    // Strategy B: Setting Array Soft Delete
    if (settingKey && arrayKey) {
      try {
        const currentData = await cmsService.getSetting<any>(settingKey, {});
        if (currentData && Array.isArray(currentData[arrayKey])) {
          const updatedArray = currentData[arrayKey].map((item: any) => {
            if (item.id === itemId || item.slug === itemId) {
              return { ...item, is_archived: true, archived_at: nowIso };
            }
            return item;
          });
          await cmsService.saveSetting(settingKey, { ...currentData, [arrayKey]: updatedArray });
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err?.message };
      }
    }

    // Strategy C: Store in Fallback Setting Array if DB schema columns are not yet present
    try {
      const currentFallbacks = await cmsService.getSetting<ArchivedRecord[]>('cms_archived_items_fallback', []);
      const newArchivedRecord: ArchivedRecord = {
        id: itemId,
        source_type: table ? 'table' : 'setting_array',
        source_key: table || settingKey || 'general',
        array_key: arrayKey,
        module_name: moduleName,
        title: title,
        subtitle: subtitle,
        image_url: image_url,
        archived_at: nowIso,
        original_data: itemData || { id: itemId, title, subtitle, image_url },
      };
      const updated = [newArchivedRecord, ...currentFallbacks.filter((f) => f.id !== itemId)];
      await cmsService.saveSetting('cms_archived_items_fallback', updated);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to archive item' };
    }
  },

  // 3. RESTORE AN ARCHIVED ITEM
  async restoreItem(item: ArchivedRecord): Promise<{ success: boolean; error?: string }> {
    try {
      // Restore Strategy A: DB Table
      if (item.source_type === 'table' || item.source_key) {
        try {
          const { error } = await supabase
            .from(item.source_key)
            .update({ is_archived: false, archived_at: null })
            .eq('id', item.id);
          if (!error) {
            // Also clean up fallback record if present
            await this.removeFallbackItem(item.id);
            return { success: true };
          }
        } catch {
          // Ignore table error if column missing
        }
      }

      // Restore Strategy B: Setting Array
      if (item.source_type === 'setting_array' && item.source_key && item.array_key) {
        const currentData = await cmsService.getSetting<any>(item.source_key, {});
        if (currentData && Array.isArray(currentData[item.array_key])) {
          const updatedArray = currentData[item.array_key].map((elem: any) => {
            if (elem.id === item.id || elem.slug === item.id) {
              const copy = { ...elem, is_archived: false };
              delete copy.archived_at;
              return copy;
            }
            return elem;
          });
          await cmsService.saveSetting(item.source_key, { ...currentData, [item.array_key]: updatedArray });
          await this.removeFallbackItem(item.id);
          return { success: true };
        }
      }

      // Restore Strategy C: Fallback Item Clean Up
      await this.removeFallbackItem(item.id);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to restore item' };
    }
  },

  // 4. PERMANENTLY DELETE AN ARCHIVED ITEM
  async deletePermanently(item: ArchivedRecord): Promise<{ success: boolean; error?: string }> {
    try {
      // Permanent Delete Strategy A: DB Table
      if (item.source_type === 'table') {
        const { error } = await supabase.from(item.source_key).delete().eq('id', item.id);
        if (error) {
          // If table delete fails, fallback to removing from fallback
          await this.removeFallbackItem(item.id);
        }
      }

      // Permanent Delete Strategy B: Setting Array
      if (item.source_type === 'setting_array' && item.source_key && item.array_key) {
        const currentData = await cmsService.getSetting<any>(item.source_key, {});
        if (currentData && Array.isArray(currentData[item.array_key])) {
          const filteredArray = currentData[item.array_key].filter((elem: any) => elem.id !== item.id && elem.slug !== item.id);
          await cmsService.saveSetting(item.source_key, { ...currentData, [item.array_key]: filteredArray });
        }
      }

      // Clean up fallback record
      await this.removeFallbackItem(item.id);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to permanently delete item' };
    }
  },

  // Helper: Remove item from fallback storage array
  async removeFallbackItem(itemId: string) {
    try {
      const currentFallbacks = await cmsService.getSetting<ArchivedRecord[]>('cms_archived_items_fallback', []);
      const updated = currentFallbacks.filter((f) => f.id !== itemId);
      await cmsService.saveSetting('cms_archived_items_fallback', updated);
    } catch {
      // ignore fallback error
    }
  },
};
