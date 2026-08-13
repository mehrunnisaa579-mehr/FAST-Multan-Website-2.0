import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import AdminToggle from '../components/ui/AdminToggle';
import AdminModal, { DeleteConfirmModal } from '../components/ui/AdminModal';
import { cmsService } from '../../services/cmsService';
import { archiveService } from '../../services/archiveService';
import { supabase } from '../../lib/supabase';
import { societiesData } from '../../data/societies';
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowUp,
  ArrowDown,
  Edit2,
  User,
  Eye,
  EyeOff,
  Users,
  Image as ImageIcon,
} from 'lucide-react';

export interface SocietyCMSItem {
  id: string;
  slug: string;
  name: string;
  short_name?: string;
  description: string;
  hero_image_url?: string;
  hero_image?: string;
  mentor_name: string;
  mentor_photo_url: string;
  mentor_photo?: string;
  president_name: string;
  president_photo_url: string;
  president_photo?: string;
  vp1_name: string;
  vice_president_1_photo_url?: string;
  vp1_photo_url?: string;
  vp1_photo?: string;
  vp2_name: string;
  vice_president_2_photo_url?: string;
  vp2_photo_url?: string;
  vp2_photo?: string;
  instagram_url: string;
  display_order: number;
  is_visible: boolean;
}

const defaultInitialSocieties: SocietyCMSItem[] = [
  {
    id: 'soc-techsoc',
    slug: 'techsoc',
    name: 'TechSoc',
    short_name: 'Technical Society',
    description: societiesData.techsoc?.intro || 'The official computing and technology society of FAST-NUCES Multan Campus.',
    hero_image_url: '',
    mentor_name: 'Dr. Faculty Mentor',
    mentor_photo_url: '',
    president_name: 'TechSoc President',
    president_photo_url: '',
    vp1_name: 'Vice President 1',
    vice_president_1_photo_url: '',
    vp2_name: 'Vice President 2',
    vice_president_2_photo_url: '',
    instagram_url: 'https://www.instagram.com/techsoc.nu',
    display_order: 1,
    is_visible: true,
  },
  {
    id: 'soc-fmm',
    slug: 'fmm',
    name: 'FMM',
    short_name: 'FAST Media Mavericks',
    description: societiesData.fmm?.intro || 'The official media and photography society of FAST-NUCES Multan Campus.',
    hero_image_url: '',
    mentor_name: 'Dr. Faculty Mentor',
    mentor_photo_url: '',
    president_name: 'FMM President',
    president_photo_url: '',
    vp1_name: 'Vice President 1',
    vice_president_1_photo_url: '',
    vp2_name: 'Vice President 2',
    vice_president_2_photo_url: '',
    instagram_url: 'https://www.instagram.com/fastmediamavericks',
    display_order: 2,
    is_visible: true,
  },
  {
    id: 'soc-figs',
    slug: 'figs',
    name: 'FIGS',
    short_name: 'Innovation & Gaming Society',
    description: societiesData.figs?.intro || 'The official gaming, e-sports and innovation society.',
    hero_image_url: '',
    mentor_name: 'Dr. Faculty Mentor',
    mentor_photo_url: '',
    president_name: 'FIGS President',
    president_photo_url: '',
    vp1_name: 'Vice President 1',
    vice_president_1_photo_url: '',
    vp2_name: 'Vice President 2',
    vice_president_2_photo_url: '',
    instagram_url: 'https://www.instagram.com/figs_mtn',
    display_order: 3,
    is_visible: true,
  },
  {
    id: 'soc-dhanak',
    slug: 'dhanak',
    name: 'Dhanak',
    short_name: 'Arts & Dramatic Society',
    description: societiesData.dhanak?.intro || 'The official arts, drama and cultural society.',
    hero_image_url: '',
    mentor_name: 'Dr. Faculty Mentor',
    mentor_photo_url: '',
    president_name: 'Dhanak President',
    president_photo_url: '',
    vp1_name: 'Vice President 1',
    vice_president_1_photo_url: '',
    vp2_name: 'Vice President 2',
    vice_president_2_photo_url: '',
    instagram_url: 'https://www.instagram.com/dhanakfastmtn',
    display_order: 4,
    is_visible: true,
  },
  {
    id: 'soc-bayaan',
    slug: 'bayaan',
    name: 'Bayaan',
    short_name: 'Debating & Literary Society',
    description: societiesData.bayaan?.intro || 'The official literary, debating and public speaking society.',
    hero_image_url: '',
    mentor_name: 'Dr. Faculty Mentor',
    mentor_photo_url: '',
    president_name: 'Bayaan President',
    president_photo_url: '',
    vp1_name: 'Vice President 1',
    vice_president_1_photo_url: '',
    vp2_name: 'Vice President 2',
    vice_president_2_photo_url: '',
    instagram_url: 'https://www.instagram.com/bayaan_fast',
    display_order: 5,
    is_visible: true,
  },
];

export default function AdminSocietiesManager() {
  const [societies, setSocieties] = useState<SocietyCMSItem[]>(defaultInitialSocieties);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSociety, setEditingSociety] = useState<Partial<SocietyCMSItem> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SocietyCMSItem | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSocietiesData = async () => {
    setLoading(true);
    let loaded: SocietyCMSItem[] = [];

    // 1. Try fetching from CMS setting student_societies_full_list
    const savedSetting = await cmsService.getSetting<SocietyCMSItem[]>('student_societies_full_list', []);
    if (savedSetting && Array.isArray(savedSetting) && savedSetting.length > 0) {
      loaded = savedSetting;
    } else {
      // 2. Try fetching from Supabase societies table
      const dbSocieties = await cmsService.getSocieties();
      if (dbSocieties && dbSocieties.length > 0) {
        loaded = dbSocieties.map((s: any, idx: number) => ({
          id: s.id || `soc-${s.slug}`,
          slug: s.slug,
          name: s.name || s.slug.toUpperCase(),
          short_name: s.short_name || s.name || '',
          description: s.description || '',
          hero_image_url: s.hero_image_url || s.hero_image || '',
          mentor_name: s.mentor_name || '',
          mentor_photo_url: s.mentor_photo_url || s.mentor_photo || '',
          president_name: s.president_name || '',
          president_photo_url: s.president_photo_url || s.president_photo || '',
          vp1_name: s.vp1_name || '',
          vice_president_1_photo_url: s.vice_president_1_photo_url || s.vp1_photo_url || s.vp1_photo || '',
          vp2_name: s.vp2_name || '',
          vice_president_2_photo_url: s.vice_president_2_photo_url || s.vp2_photo_url || s.vp2_photo || '',
          instagram_url: s.instagram_url || '',
          display_order: s.display_order || idx + 1,
          is_visible: s.is_visible ?? true,
        }));
      } else {
        loaded = defaultInitialSocieties;
      }
    }

    setSocieties(loaded);
    setLoading(false);
  };

  useEffect(() => {
    fetchSocietiesData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrlFn: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setUrlFn(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  // Generate public slug automatically from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenAdd = () => {
    setEditingSociety({
      id: `soc-${Date.now()}`,
      slug: '',
      name: '',
      short_name: '',
      description: '',
      hero_image_url: '',
      mentor_name: '',
      mentor_photo_url: '',
      president_name: '',
      president_photo_url: '',
      vp1_name: '',
      vice_president_1_photo_url: '',
      vp2_name: '',
      vice_president_2_photo_url: '',
      instagram_url: '',
      display_order: societies.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (soc: SocietyCMSItem) => {
    setEditingSociety({ ...soc });
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (!editingSociety?.name?.trim()) {
      alert('Please enter a Society Name.');
      return;
    }

    const autoSlug = editingSociety.slug?.trim()
      ? editingSociety.slug.trim().toLowerCase()
      : generateSlug(editingSociety.name);

    const finalItem: SocietyCMSItem = {
      id: editingSociety.id || `soc-${Date.now()}`,
      slug: autoSlug,
      name: editingSociety.name.trim(),
      short_name: editingSociety.short_name?.trim() || editingSociety.name.trim(),
      description: editingSociety.description || '',
      hero_image_url: editingSociety.hero_image_url || '',
      mentor_name: editingSociety.mentor_name || '',
      mentor_photo_url: editingSociety.mentor_photo_url || '',
      president_name: editingSociety.president_name || '',
      president_photo_url: editingSociety.president_photo_url || '',
      vp1_name: editingSociety.vp1_name || '',
      vice_president_1_photo_url: editingSociety.vice_president_1_photo_url || '',
      vp2_name: editingSociety.vp2_name || '',
      vice_president_2_photo_url: editingSociety.vice_president_2_photo_url || '',
      instagram_url: editingSociety.instagram_url || '',
      display_order: editingSociety.display_order || societies.length + 1,
      is_visible: editingSociety.is_visible ?? true,
    };

    const updated = [...societies];
    const idx = updated.findIndex((s) => s.id === finalItem.id || s.slug === finalItem.slug);
    if (idx >= 0) {
      updated[idx] = finalItem;
    } else {
      updated.push(finalItem);
    }

    setSocieties(updated);
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    const updated = societies.filter((s) => s.id !== deleteTarget.id && s.slug !== deleteTarget.slug);
    setSocieties(updated);

    await archiveService.archiveItem({
      table: 'societies',
      settingKey: 'student_societies_full_list',
      arrayKey: 'societies',
      itemId: deleteTarget.id,
      moduleName: 'Societies',
      title: deleteTarget.name,
      subtitle: deleteTarget.short_name || deleteTarget.slug,
      image_url: deleteTarget.hero_image_url,
      itemData: deleteTarget,
    });

    setDeleteTarget(null);
    setMessage({ type: 'success', text: 'Society moved to Archive.' });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newList = [...societies];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    newList.forEach((item, idx) => {
      item.display_order = idx + 1;
    });
    setSocieties(newList);
  };

  const handleToggleVisibility = (id: string) => {
    setSocieties((prev) =>
      prev.map((soc) => (soc.id === id ? { ...soc, is_visible: !soc.is_visible } : soc))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    // Normalize display order
    const payloadList = societies.map((soc, idx) => ({
      ...soc,
      display_order: idx + 1,
    }));

    // 1. Save to site_settings for 100% reliable local CMS persistence
    const settingRes = await cmsService.saveSetting(
      'student_societies_full_list',
      payloadList,
      'Student Societies List Content'
    );

    // 2. Also attempt sync to Supabase societies table
    try {
      const dbPayloads = payloadList.map((soc) => ({
        slug: soc.slug,
        name: soc.name,
        short_name: soc.short_name,
        description: soc.description,
        hero_image: soc.hero_image_url,
        mentor_name: soc.mentor_name,
        mentor_photo_url: soc.mentor_photo_url,
        president_name: soc.president_name,
        president_photo_url: soc.president_photo_url,
        vp1_name: soc.vp1_name,
        vice_president_1_photo_url: soc.vice_president_1_photo_url,
        vp2_name: soc.vp2_name,
        vice_president_2_photo_url: soc.vice_president_2_photo_url,
        instagram_url: soc.instagram_url,
        display_order: soc.display_order,
        is_visible: soc.is_visible,
        updated_at: new Date().toISOString(),
      }));

      await supabase.from('societies').upsert(dbPayloads, { onConflict: 'slug' });
    } catch {
      // settingRes handles state
    }

    if (settingRes.success) {
      setMessage({ type: 'success', text: 'All student societies saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: settingRes.error || 'Failed to save changes.' });
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage Student Societies"
        subtitle="Add, edit, reorder, show/hide, or delete campus student societies and their leadership members."
        action={
          <div className="flex items-center gap-3">
            <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
              Add Society
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveAll} loading={saving} icon={<Save className="w-4 h-4" />}>
              Save All Changes
            </AdminButton>
          </div>
        }
      />

      {message && (
        <div
          className={`p-4 rounded-lg border text-sm font-medium flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Societies List Grid */}
      <AdminSection
        title="Campus Student Societies"
        description="Dynamic list of student societies. Add new societies, update leadership, reorder or delete."
      >
        <div className="space-y-3">
          {societies.map((soc, idx) => (
            <AdminCard key={soc.id || soc.slug} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center flex-shrink-0 font-bold border border-[#E5E7EB] overflow-hidden">
                  {soc.hero_image_url ? (
                    <img src={soc.hero_image_url} alt={soc.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                      Order #{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#4B5563] bg-gray-100 px-2 py-0.5 rounded">
                      /campus/societies/{soc.slug}
                    </span>
                    {!soc.is_visible && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Hidden
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-[#1F2937]">{soc.name}</h4>
                  <p className="text-xs text-[#6B7280] line-clamp-1">{soc.short_name || soc.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(soc.id)}
                  className={`p-2 border rounded-md cursor-pointer transition-colors ${
                    soc.is_visible
                      ? 'text-[#0093DD] bg-[#F0F9FF] border-[#B9E6FE]'
                      : 'text-[#9CA3AF] bg-[#F9FAFB] border-[#E5E7EB]'
                  }`}
                  title={soc.is_visible ? 'Visible (Click to Hide)' : 'Hidden (Click to Show)'}
                >
                  {soc.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === societies.length - 1}
                  className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <AdminButton variant="secondary" onClick={() => handleOpenEdit(soc)} icon={<Edit2 className="w-4 h-4" />}>
                  Edit
                </AdminButton>

                <AdminButton variant="danger" onClick={() => setDeleteTarget(soc)} icon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      </AdminSection>

      {/* Add / Edit Society Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSociety?.slug && societies.some((s) => s.id === editingSociety.id) ? 'Edit Student Society' : 'Add New Student Society'}
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveModal}>
              Save Society
            </AdminButton>
          </>
        }
      >
        <div className="space-y-5 text-left max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Society Name" required>
              <AdminInput
                value={editingSociety?.name || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setEditingSociety((prev) => ({
                    ...prev,
                    name: val,
                    slug: prev?.slug ? prev.slug : generateSlug(val),
                  }));
                }}
                placeholder="e.g. Robotics & Automation Society"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Short Name / Subtitle">
              <AdminInput
                value={editingSociety?.short_name || ''}
                onChange={(e) => setEditingSociety((prev) => ({ ...prev, short_name: e.target.value }))}
                placeholder="e.g. RoboTech Society"
              />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Overview Description">
            <AdminTextarea
              rows={4}
              value={editingSociety?.description || ''}
              onChange={(e) => setEditingSociety((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed overview of society activities..."
            />
          </AdminFormGroup>

          <AdminFormGroup label="Instagram Profile URL">
            <AdminInput
              value={editingSociety?.instagram_url || ''}
              onChange={(e) => setEditingSociety((prev) => ({ ...prev, instagram_url: e.target.value }))}
              placeholder="https://www.instagram.com/your_society"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Society Hero / Page Banner Image Upload">
            <div className="flex items-center gap-3">
              <div className="w-24 h-14 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center">
                {editingSociety?.hero_image_url ? (
                  <img src={editingSociety.hero_image_url} alt="Banner Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>
              <div className="flex gap-2">
                <label className="px-3 py-1.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{editingSociety?.hero_image_url ? 'Replace Image' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setEditingSociety((prev) => ({ ...prev, hero_image_url: url })))}
                  />
                </label>
                {editingSociety?.hero_image_url && (
                  <button
                    type="button"
                    onClick={() => setEditingSociety((prev) => ({ ...prev, hero_image_url: '' }))}
                    className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          {/* Leadership Section */}
          <div className="border-t border-[#E5E7EB] pt-4 space-y-4">
            <h4 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider">Leadership Members</h4>

            {/* Mentor */}
            <div className="p-3 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] space-y-3">
              <span className="text-xs font-bold text-[#0093DD]">FACULTY MENTOR</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <AdminInput
                  value={editingSociety?.mentor_name || ''}
                  onChange={(e) => setEditingSociety((prev) => ({ ...prev, mentor_name: e.target.value }))}
                  placeholder="Mentor Name"
                />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-12 bg-white border border-[#E5E7EB] rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    {editingSociety?.mentor_photo_url ? (
                      <img src={editingSociety.mentor_photo_url} alt="Mentor" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-[#9CA3AF]" />
                    )}
                  </div>
                  <label className="px-3 py-1.5 bg-white border border-[#E5E7EB] text-xs font-semibold text-[#374151] rounded cursor-pointer hover:bg-gray-50 flex items-center gap-1">
                    <Upload className="w-3 h-3 text-[#0093DD]" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setEditingSociety((prev) => ({ ...prev, mentor_photo_url: url })))}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* President */}
            <div className="p-3 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] space-y-3">
              <span className="text-xs font-bold text-[#0093DD]">PRESIDENT</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <AdminInput
                  value={editingSociety?.president_name || ''}
                  onChange={(e) => setEditingSociety((prev) => ({ ...prev, president_name: e.target.value }))}
                  placeholder="President Name"
                />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-12 bg-white border border-[#E5E7EB] rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    {editingSociety?.president_photo_url ? (
                      <img src={editingSociety.president_photo_url} alt="President" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-[#9CA3AF]" />
                    )}
                  </div>
                  <label className="px-3 py-1.5 bg-white border border-[#E5E7EB] text-xs font-semibold text-[#374151] rounded cursor-pointer hover:bg-gray-50 flex items-center gap-1">
                    <Upload className="w-3 h-3 text-[#0093DD]" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setEditingSociety((prev) => ({ ...prev, president_photo_url: url })))}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Vice President 1 */}
            <div className="p-3 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] space-y-3">
              <span className="text-xs font-bold text-[#0093DD]">VICE PRESIDENT 1</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <AdminInput
                  value={editingSociety?.vp1_name || ''}
                  onChange={(e) => setEditingSociety((prev) => ({ ...prev, vp1_name: e.target.value }))}
                  placeholder="Vice President 1 Name"
                />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-12 bg-white border border-[#E5E7EB] rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    {editingSociety?.vice_president_1_photo_url ? (
                      <img src={editingSociety.vice_president_1_photo_url} alt="VP1" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-[#9CA3AF]" />
                    )}
                  </div>
                  <label className="px-3 py-1.5 bg-white border border-[#E5E7EB] text-xs font-semibold text-[#374151] rounded cursor-pointer hover:bg-gray-50 flex items-center gap-1">
                    <Upload className="w-3 h-3 text-[#0093DD]" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (url) => setEditingSociety((prev) => ({ ...prev, vice_president_1_photo_url: url })))
                      }
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Vice President 2 */}
            <div className="p-3 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] space-y-3">
              <span className="text-xs font-bold text-[#0093DD]">VICE PRESIDENT 2</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <AdminInput
                  value={editingSociety?.vp2_name || ''}
                  onChange={(e) => setEditingSociety((prev) => ({ ...prev, vp2_name: e.target.value }))}
                  placeholder="Vice President 2 Name"
                />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-12 bg-white border border-[#E5E7EB] rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    {editingSociety?.vice_president_2_photo_url ? (
                      <img src={editingSociety.vice_president_2_photo_url} alt="VP2" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-[#9CA3AF]" />
                    )}
                  </div>
                  <label className="px-3 py-1.5 bg-white border border-[#E5E7EB] text-xs font-semibold text-[#374151] rounded cursor-pointer hover:bg-gray-50 flex items-center gap-1">
                    <Upload className="w-3 h-3 text-[#0093DD]" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (url) => setEditingSociety((prev) => ({ ...prev, vice_president_2_photo_url: url })))
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <AdminToggle
            label="Visible on Website"
            checked={editingSociety?.is_visible ?? true}
            onChange={(checked) => setEditingSociety((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      {/* Delete Society Confirmation Modal */}
      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this society?"
        maxWidth="sm"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </AdminButton>
            <AdminButton variant="danger" onClick={handleDeleteConfirm}>
              Delete Society
            </AdminButton>
          </>
        }
      >
        <div className="py-2 text-left space-y-3">
          <p className="text-sm text-[#4B5563] leading-relaxed">
            This will remove the society from the public website and Societies dropdown. This action cannot be undone.
          </p>
          {deleteTarget && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs font-bold text-red-800">
              Target Society: {deleteTarget.name} ({deleteTarget.slug})
            </div>
          )}
        </div>
      </AdminModal>
    </div>
  );
}
