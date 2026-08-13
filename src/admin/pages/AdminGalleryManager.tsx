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
import { galleryItems as defaultInitialGallery } from '../../data/gallery';
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
  Eye,
  EyeOff,
  Video,
  Image as ImageIcon,
  Play,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

export interface GalleryCMSItem {
  id: string;
  title: string;
  subtitle: string;
  thumbnail_url?: string;
  thumbnail?: string;
  video_type: 'uploaded' | 'youtube';
  video_url: string;
  display_order: number;
  is_visible: boolean;
}

const initialDefaultList: GalleryCMSItem[] = defaultInitialGallery.map((item, idx) => ({
  id: item.id || `gal-${idx + 1}`,
  title: item.title,
  subtitle: item.subtitle,
  thumbnail_url: '',
  thumbnail: item.thumbnail,
  video_type: 'youtube',
  video_url: item.videoUrl || '',
  display_order: idx + 1,
  is_visible: true,
}));

export default function AdminGalleryManager() {
  const [items, setItems] = useState<GalleryCMSItem[]>(initialDefaultList);
  const [loading, setLoading] = useState(true);

  // Hero settings state
  const [heroTitle, setHeroTitle] = useState('Gallery');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [uploadingHero, setUploadingHero] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<GalleryCMSItem> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryCMSItem | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchGalleryData = async () => {
    setLoading(true);

    // 0. Load hero settings
    const heroSettings = await cmsService.getSetting<any>('campus_gallery_settings', null);
    if (heroSettings) {
      if (heroSettings.heroTitle !== undefined) setHeroTitle(heroSettings.heroTitle);
      if (heroSettings.heroImageUrl || heroSettings.heroImage) {
        setHeroImageUrl(heroSettings.heroImageUrl || heroSettings.heroImage);
      }
    }

    // 1. Try loading from site_settings key campus_gallery_list
    const savedSetting = await cmsService.getSetting<GalleryCMSItem[]>('campus_gallery_list', []);
    if (savedSetting && Array.isArray(savedSetting) && savedSetting.length > 0) {
      setItems(savedSetting);
    } else {
      // 2. Try loading from Supabase gallery_items
      const dbItems = await cmsService.getGalleryItems();
      if (dbItems && dbItems.length > 0) {
        const loaded: GalleryCMSItem[] = dbItems.map((g: any, idx: number) => ({
          id: g.id || `gal-${idx + 1}`,
          title: g.caption || g.title || `Campus Video #${idx + 1}`,
          subtitle: g.subtitle || 'FAST-NUCES Multan Campus',
          thumbnail_url: g.image_url || g.thumbnail_url || '',
          video_type: g.video_type || (g.video_url?.includes('youtube') ? 'youtube' : 'uploaded'),
          video_url: g.video_url || '',
          display_order: g.display_order || idx + 1,
          is_visible: g.published ?? true,
        }));
        setItems(loaded);
      } else {
        setItems(initialDefaultList);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    const res = await cmsService.uploadMedia(file);
    setUploadingHero(false);

    if (res.success && res.publicUrl) {
      setHeroImageUrl(res.publicUrl);
    } else {
      alert(`Hero image upload failed: ${res.error || 'Unknown error'}`);
    }
  };

  const handleRemoveHeroImage = () => {
    setHeroImageUrl('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrlFn: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setUrlFn(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error}`);
    }
    setUploadingMedia(false);
  };

  const handleOpenAdd = () => {
    setEditingItem({
      id: `gal-${Date.now()}`,
      title: 'Campus Video Highlight',
      subtitle: 'FAST-NUCES Multan Campus',
      thumbnail_url: '',
      video_type: 'youtube',
      video_url: '',
      display_order: items.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryCMSItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (!editingItem?.title?.trim()) {
      alert('Please enter a Title for this gallery item.');
      return;
    }

    const finalItem: GalleryCMSItem = {
      id: editingItem.id || `gal-${Date.now()}`,
      title: editingItem.title.trim(),
      subtitle: editingItem.subtitle?.trim() || 'FAST-NUCES Multan Campus',
      thumbnail_url: editingItem.thumbnail_url || '',
      video_type: editingItem.video_type || 'youtube',
      video_url: editingItem.video_url || '',
      display_order: editingItem.display_order || items.length + 1,
      is_visible: editingItem.is_visible ?? true,
    };

    const updated = [...items];
    const idx = updated.findIndex((i) => i.id === finalItem.id);
    if (idx >= 0) {
      updated[idx] = finalItem;
    } else {
      updated.push(finalItem);
    }

    setItems(updated);
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    const updated = items.filter((i) => i.id !== deleteTarget.id);
    setItems(updated);

    await archiveService.archiveItem({
      table: 'gallery_items',
      settingKey: 'campus_gallery_list',
      arrayKey: 'items',
      itemId: deleteTarget.id,
      moduleName: 'Photo Gallery',
      title: deleteTarget.title || 'Gallery Image',
      subtitle: deleteTarget.video_url ? 'Video Item' : 'Photo Item',
      image_url: deleteTarget.thumbnail_url,
      itemData: deleteTarget,
    });

    setDeleteTarget(null);
    setMessage({ type: 'success', text: 'Gallery item moved to Archive.' });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newList = [...items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    newList.forEach((item, idx) => {
      item.display_order = idx + 1;
    });
    setItems(newList);
  };

  const handleToggleVisibility = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_visible: !item.is_visible } : item))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    const normalized = items.map((item, idx) => ({
      ...item,
      display_order: idx + 1,
    }));

    // 1. Save Hero Settings
    const heroRes = await cmsService.saveSetting(
      'campus_gallery_settings',
      {
        heroTitle: heroTitle.trim() || 'Gallery',
        heroImageUrl,
        heroImage: heroImageUrl,
        updated_at: new Date().toISOString(),
      },
      'Campus Gallery Hero Settings'
    );

    // 2. Save Gallery Items setting
    const settingRes = await cmsService.saveSetting(
      'campus_gallery_list',
      normalized,
      'Campus Photo Gallery Content'
    );

    // 3. Sync to Supabase gallery_items table
    try {
      const dbPayloads = normalized.map((i) => ({
        id: i.id.startsWith('gal-') ? undefined : i.id,
        caption: i.title,
        image_url: i.thumbnail_url || '',
        row_number: 1,
        display_order: i.display_order,
        published: i.is_visible,
        updated_at: new Date().toISOString(),
      }));

      await supabase.from('gallery_items').upsert(dbPayloads);
    } catch {
      // settingRes handles local persistence
    }

    if (settingRes.success && heroRes.success) {
      setMessage({ type: 'success', text: 'Campus Photo Gallery and Hero Settings saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: settingRes.error || heroRes.error || 'Failed to save changes.' });
    }

    setSaving(false);
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/campus"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to Manage Campus"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Manage Photo Gallery"
          subtitle="Manage campus gallery videos, hero banner media, thumbnails, titles, and display order for /campus/gallery."
          action={
            <div className="flex items-center gap-3">
              <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
                Add Gallery Item
              </AdminButton>
              <AdminButton variant="primary" onClick={handleSaveAll} loading={saving || uploadingHero} icon={<Save className="w-4 h-4" />}>
                Save All Changes
              </AdminButton>
            </div>
          }
        />
      </div>

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

      {/* Gallery Hero Settings Section */}
      <AdminSection
        title="Gallery Hero Settings"
        description="Manage the title and background hero image for the public Campus Gallery page (/campus/gallery)."
      >
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Hero Title">
            <AdminInput
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Gallery"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Hero Background Image">
            <div className="flex items-center gap-4">
              <div className="w-32 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {heroImageUrl ? (
                  <img src={heroImageUrl} alt="Gallery Hero Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingHero ? 'Uploading...' : heroImageUrl ? 'Replace Hero Image' : 'Upload Hero Image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleHeroFileUpload} disabled={uploadingHero} />
                </label>

                {heroImageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveHeroImage}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer transition-colors"
                  >
                    Remove Hero Image
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* Gallery Items Grid */}
      <AdminSection
        title="Public Gallery Video Cards (/campus/gallery)"
        description="Every item renders with a thumbnail preview, title, caption, red play button, and video modal on the public site."
      >
        <div className="space-y-3">
          {items.map((item, idx) => (
            <AdminCard key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-14 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex items-center justify-center flex-shrink-0 relative group">
                  {(() => {
                    if (item.thumbnail_url) return <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />;
                    const vUrl = item.video_url || '';
                    const isDirect = vUrl.endsWith('.mp4') || vUrl.endsWith('.webm');
                    if (isDirect && vUrl) return <video src={vUrl} muted playsInline preload="metadata" className="w-full h-full object-cover" />;
                    const ytm = vUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&#]+)/);
                    if (ytm) return <img src={`https://img.youtube.com/vi/${ytm[1]}/hqdefault.jpg`} alt={item.title} className="w-full h-full object-cover" />;
                    return (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-1 text-center">
                        <ImageIcon className="w-4 h-4 text-[#9CA3AF]" />
                        <span className="text-[9px] font-bold text-[#6B7280] uppercase">VIDEO</span>
                      </div>
                    );
                  })()}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                      <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                      Order #{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#4B5563] bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                      {item.video_type === 'youtube' ? <YoutubeIcon className="w-3 h-3 text-red-500" /> : <Video className="w-3 h-3 text-blue-500" />}
                      {item.video_type === 'youtube' ? 'YouTube' : 'Uploaded Video'}
                    </span>
                    {!item.is_visible && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Hidden
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-[#1F2937]">{item.title}</h4>
                  <p className="text-xs text-[#6B7280]">{item.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(item.id)}
                  className={`p-2 border rounded-md cursor-pointer transition-colors ${
                    item.is_visible
                      ? 'text-[#0093DD] bg-[#F0F9FF] border-[#B9E6FE]'
                      : 'text-[#9CA3AF] bg-[#F9FAFB] border-[#E5E7EB]'
                  }`}
                  title={item.is_visible ? 'Visible (Click to Hide)' : 'Hidden (Click to Show)'}
                >
                  {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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
                  disabled={idx === items.length - 1}
                  className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <AdminButton variant="secondary" onClick={() => handleOpenEdit(item)} icon={<Edit2 className="w-4 h-4" />}>
                  Edit
                </AdminButton>

                <AdminButton variant="danger" onClick={() => setDeleteTarget(item)} icon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      </AdminSection>

      {/* Add / Edit Gallery Item Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id && items.some((i) => i.id === editingItem.id) ? 'Edit Gallery Video Item' : 'Add New Gallery Video Item'}
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveModal} loading={uploadingMedia}>
              Save Gallery Item
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left max-h-[70vh] overflow-y-auto pr-1">
          <AdminFormGroup label="Video Card Title" required>
            <AdminInput
              value={editingItem?.title || ''}
              onChange={(e) => setEditingItem((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Campus Event Highlight 2026"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Subtitle / Location Caption">
            <AdminInput
              value={editingItem?.subtitle || ''}
              onChange={(e) => setEditingItem((prev) => ({ ...prev, subtitle: e.target.value }))}
              placeholder="e.g. FAST-NUCES Multan Campus"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Video Preview">
            <div className="flex items-center gap-4">
              <div className="w-28 h-20 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {(() => {
                  if (editingItem?.thumbnail_url) return <img src={editingItem.thumbnail_url} alt="Thumbnail Preview" className="w-full h-full object-cover" />;
                  const vUrl = editingItem?.video_url || '';
                  const isDirect = vUrl.endsWith('.mp4') || vUrl.endsWith('.webm');
                  if (isDirect && vUrl) return <video src={vUrl} muted playsInline preload="metadata" className="w-full h-full object-cover" />;
                  const ytm = vUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&#]+)/);
                  if (ytm) return <img src={`https://img.youtube.com/vi/${ytm[1]}/hqdefault.jpg`} alt="Preview" className="w-full h-full object-cover" />;
                  return (
                    <div className="text-center p-2">
                      <ImageIcon className="w-5 h-5 text-[#9CA3AF] mx-auto" />
                      <span className="text-[10px] font-bold text-[#6B7280]">AUTO-PREVIEW</span>
                    </div>
                  );
                })()}
              </div>
              <div className="text-xs text-[#6B7280] leading-relaxed">
                <p className="font-semibold text-[#374151] mb-0.5">Auto-generated from video</p>
                <p>The video's first frame or YouTube thumbnail is used as the preview. No separate image upload needed.</p>
                {editingItem?.thumbnail_url && (
                  <button
                    type="button"
                    onClick={() => setEditingItem((prev) => ({ ...prev, thumbnail_url: '' }))}
                    className="mt-1 px-2 py-1 bg-red-50 text-[#DC2626] text-[10px] font-semibold rounded border border-red-200 cursor-pointer"
                  >
                    Clear Custom Thumbnail
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          {/* Media Type Selector */}
          <AdminFormGroup label="Media Type">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEditingItem((prev) => ({ ...prev, video_type: 'uploaded' }))}
                className={`p-3 rounded-md border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  editingItem?.video_type === 'uploaded'
                    ? 'bg-[#0093DD] text-white border-[#0093DD]'
                    : 'bg-white text-[#374151] border-[#E5E7EB] hover:bg-gray-50'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Uploaded Video File (MP4/WEBM)</span>
              </button>

              <button
                type="button"
                onClick={() => setEditingItem((prev) => ({ ...prev, video_type: 'youtube' }))}
                className={`p-3 rounded-md border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                  editingItem?.video_type === 'youtube'
                    ? 'bg-[#0093DD] text-white border-[#0093DD]'
                    : 'bg-white text-[#374151] border-[#E5E7EB] hover:bg-gray-50'
                }`}
              >
                <YoutubeIcon className="w-4 h-4" />
                <span>YouTube Video Link</span>
              </button>
            </div>
          </AdminFormGroup>

          {/* Video Input depending on Media Type */}
          {editingItem?.video_type === 'uploaded' ? (
            <AdminFormGroup label="Upload Video File (MP4 / WEBM)">
              <div className="flex items-center gap-3">
                <AdminInput
                  value={editingItem?.video_url || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, video_url: e.target.value }))}
                  placeholder="Uploaded video public URL..."
                />
                <label className="px-3.5 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>Upload Video</span>
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setEditingItem((prev) => ({ ...prev, video_url: url })))}
                  />
                </label>
              </div>
            </AdminFormGroup>
          ) : (
            <AdminFormGroup label="YouTube Video URL">
              <AdminInput
                value={editingItem?.video_url || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, video_url: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </AdminFormGroup>
          )}

          <AdminToggle
            label="Visible on Website"
            checked={editingItem?.is_visible ?? true}
            onChange={(checked) => setEditingItem((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this gallery item?"
        maxWidth="sm"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </AdminButton>
            <AdminButton variant="danger" onClick={handleDeleteConfirm}>
              Delete Gallery Item
            </AdminButton>
          </>
        }
      >
        <div className="py-2 text-left space-y-3">
          <p className="text-sm text-[#4B5563] leading-relaxed">
            This will remove the gallery video card from the public website gallery. This action cannot be undone.
          </p>
          {deleteTarget && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs font-bold text-red-800">
              Target Item: {deleteTarget.title}
            </div>
          )}
        </div>
      </AdminModal>
    </div>
  );
}
