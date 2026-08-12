import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { aboutGalleryImages } from '../../components/about/AboutGallerySlider';
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  ImageIcon,
  Loader2,
} from 'lucide-react';

interface CampusGalleryItem {
  id: string;
  title: string;
  image?: string;
  image_url?: string;
  photoUrl?: string;
  row_number: number;
  display_order: number;
  is_visible: boolean;
}

export default function AdminCampusIntroductionEditor() {
  const [heroTitle, setHeroTitle] = useState('Campus Introduction');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [introText, setIntroText] = useState(
    'FAST-NUCES Multan Campus is a leading institution of higher learning in South Punjab, delivering high quality academic programs in Computer Science, Software Engineering, AI & Data Science, and Management Sciences.\n\nEquipped with modern computing laboratories, digital library resources, spacious auditoriums, and active student societies, the campus provides a vibrant learning ecosystem for holistic student development.'
  );

  // Gallery Section
  const [galleryHeading, setGalleryHeading] = useState('CAMPUS GALLERY');
  const [galleryRow1Count, setGalleryRow1Count] = useState<number>(6);
  const [galleryRow2Count, setGalleryRow2Count] = useState<number>(6);
  const [galleryItems, setGalleryItems] = useState<CampusGalleryItem[]>(
    aboutGalleryImages.map((g, idx) => ({
      id: g.id,
      title: g.title,
      image: g.image || '',
      image_url: g.image || '',
      photoUrl: g.image || '',
      row_number: g.row_number || (idx < 6 ? 1 : idx < 12 ? 2 : 3),
      display_order: idx + 1,
      is_visible: true,
    }))
  );

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<Partial<CampusGalleryItem> | null>(null);
  const [uploadingGalleryImg, setUploadingGalleryImg] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CampusGalleryItem | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await cmsService.getSetting<any>('about_campus_intro_content', null);
      const legacyData = await cmsService.getSetting<any>('about_pages_content', null);

      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroImageUrl) setHeroImageUrl(data.heroImageUrl);
        if (data.introText) setIntroText(data.introText);
        if (data.galleryHeading) setGalleryHeading(data.galleryHeading);
        if (data.galleryRow1Count) setGalleryRow1Count(data.galleryRow1Count);
        if (data.galleryRow2Count) setGalleryRow2Count(data.galleryRow2Count);
        if (Array.isArray(data.galleryItems) && data.galleryItems.length > 0) {
          const normalized = data.galleryItems.map((g: any, idx: number) => {
            const img = g.image || g.image_url || g.photoUrl || '';
            return {
              id: g.id || `gal-${idx + 1}`,
              title: g.title || g.caption || 'Campus Photograph',
              image: img,
              image_url: img,
              photoUrl: img,
              row_number: g.row_number || 1,
              display_order: g.display_order || idx + 1,
              is_visible: g.is_visible ?? true,
            };
          });
          setGalleryItems(normalized);
        }
      } else if (legacyData) {
        if (legacyData.introTitle) setHeroTitle(legacyData.introTitle);
        if (legacyData.introText) setIntroText(legacyData.introText);
      }
    };

    fetchData();
  }, []);

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setHeroImageUrl(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error || 'Unknown error'}`);
    }
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGalleryImg(true);
    const res = await cmsService.uploadMedia(file);
    setUploadingGalleryImg(false);

    if (res.success && res.publicUrl) {
      const url = res.publicUrl;
      setEditingGalleryItem((prev) => (prev ? { ...prev, image: url, image_url: url, photoUrl: url } : null));
    } else {
      alert(`Upload failed: ${res.error || 'Unknown error'}`);
    }
    e.target.value = '';
  };

  // Gallery Item Handlers
  const handleOpenAddGalleryItem = () => {
    setEditingGalleryItem({
      id: `gal-${Date.now()}`,
      title: 'New Campus Photograph',
      image: '',
      image_url: '',
      photoUrl: '',
      row_number: 1,
      display_order: galleryItems.length + 1,
      is_visible: true,
    });
    setIsGalleryModalOpen(true);
  };

  const handleOpenEditGalleryItem = (item: CampusGalleryItem) => {
    const img = item.image || item.image_url || item.photoUrl || '';
    setEditingGalleryItem({
      ...item,
      image: img,
      image_url: img,
      photoUrl: img,
    });
    setIsGalleryModalOpen(true);
  };

  const handleSaveGalleryItem = () => {
    if (!editingGalleryItem?.title?.trim()) {
      alert('Please enter a caption for the gallery item.');
      return;
    }

    const imgUrl = editingGalleryItem.image || editingGalleryItem.image_url || editingGalleryItem.photoUrl || '';

    const newItem: CampusGalleryItem = {
      id: editingGalleryItem.id || `gal-${Date.now()}`,
      title: editingGalleryItem.title.trim(),
      image: imgUrl,
      image_url: imgUrl,
      photoUrl: imgUrl,
      row_number: editingGalleryItem.row_number || 1,
      display_order: editingGalleryItem.display_order || galleryItems.length + 1,
      is_visible: editingGalleryItem.is_visible ?? true,
    };

    const updated = [...galleryItems];
    const idx = updated.findIndex((g) => g.id === newItem.id);
    if (idx >= 0) {
      updated[idx] = newItem;
    } else {
      updated.push(newItem);
    }

    setGalleryItems(updated);
    setIsGalleryModalOpen(false);
  };

  const handleDeleteGalleryItem = () => {
    if (!deleteTarget) return;
    setGalleryItems((prev) => prev.filter((g) => g.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleMoveGallery = (index: number, direction: 'up' | 'down') => {
    const newList = [...galleryItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setGalleryItems(newList);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImageUrl,
      introText,
      galleryHeading,
      galleryRow1Count,
      galleryRow2Count,
      galleryItems,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('about_campus_intro_content', payload, 'Campus Introduction Content');

    // Sync legacy about_pages_content setting
    const legacy = (await cmsService.getSetting<any>('about_pages_content', {})) || {};
    await cmsService.saveSetting('about_pages_content', {
      ...legacy,
      introTitle: heroTitle,
      introText,
    });

    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Campus Introduction content saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/about"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to Manage About"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Campus Introduction Editor"
          subtitle="Manage the Campus Introduction page (/about/campus-introduction), hero image, introduction text, and campus photo gallery."
          action={
            <AdminButton variant="primary" onClick={handleSaveAll} loading={saving} icon={<Save className="w-4 h-4" />}>
              Save Changes
            </AdminButton>
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

      {/* 1. Hero Section */}
      <AdminSection title="Page Hero Banner" description="Manage hero title and background image.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Hero Title">
            <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="Campus Introduction" />
          </AdminFormGroup>

          <AdminFormGroup label="Hero Background Image Upload">
            <div className="flex items-center gap-4">
              <div className="w-32 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {heroImageUrl ? (
                  <img src={heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>{heroImageUrl ? 'Replace Hero Image' : 'Upload Hero Image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleHeroFileUpload} />
                </label>

                {heroImageUrl && (
                  <button
                    type="button"
                    onClick={() => setHeroImageUrl('')}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* 2. Introduction Content */}
      <AdminSection title="Introduction Content" description="Manage campus overview text paragraphs displayed on the Campus Introduction page.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Introduction Text Paragraphs">
            <AdminTextarea
              rows={8}
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              placeholder="Enter introduction text. Separate paragraphs with double line breaks..."
            />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* 3. Campus Photo Gallery */}
      <AdminSection title="Campus Photo Gallery" description="Add, edit, reorder, and upload campus gallery photographs.">
        <AdminCard className="space-y-4">
          {/* Gallery Layout Settings */}
          <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg space-y-3">
            <h4 className="text-xs font-bold text-[#1F2937] uppercase tracking-wide">Gallery Layout (Images Per Row)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminFormGroup label="Row 1 Images">
                <select
                  value={galleryRow1Count}
                  onChange={(e) => setGalleryRow1Count(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n} image{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </AdminFormGroup>

              <AdminFormGroup label="Row 2 Images">
                <select
                  value={galleryRow2Count}
                  onChange={(e) => setGalleryRow2Count(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>{n} image{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </AdminFormGroup>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#F3F4F6] pb-4">
            <AdminFormGroup label="Gallery Section Heading" className="w-full sm:w-[320px] mb-0">
              <AdminInput value={galleryHeading} onChange={(e) => setGalleryHeading(e.target.value)} placeholder="CAMPUS GALLERY" />
            </AdminFormGroup>

            <AdminButton variant="primary" onClick={handleOpenAddGalleryItem} icon={<Plus className="w-4 h-4" />}>
              Add Gallery Item
            </AdminButton>
          </div>

          <div className="space-y-3 pt-2">
            {galleryItems.map((item, idx) => {
              const displayImg = item.image || item.image_url || item.photoUrl || '';
              return (
                <div key={item.id} className="p-4 bg-white border border-[#E5E7EB] rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-12 bg-[#F3F4F6] border border-[#E5E7EB] rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                      {displayImg ? (
                        <img src={displayImg} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-[#9CA3AF]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                          Row #{item.row_number || 1}
                        </span>
                        <span className="text-xs text-[#6B7280]">Order #{idx + 1}</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#1F2937]">{item.title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleMoveGallery(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded bg-white cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveGallery(idx, 'down')}
                      disabled={idx === galleryItems.length - 1}
                      className="p-1.5 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded bg-white cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <AdminButton variant="secondary" onClick={() => handleOpenEditGalleryItem(item)} icon={<Edit2 className="w-3.5 h-3.5" />}>
                      Edit
                    </AdminButton>

                    <AdminButton variant="danger" onClick={() => setDeleteTarget(item)} icon={<Trash2 className="w-3.5 h-3.5" />}>
                      Delete
                    </AdminButton>
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>
      </AdminSection>

      {/* Gallery Modal */}
      <AdminModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        title={editingGalleryItem?.id ? 'Edit Gallery Photo' : 'Add Gallery Photo'}
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsGalleryModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveGalleryItem} disabled={uploadingGalleryImg}>
              Save Photo
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <AdminFormGroup label="Photo Title / Caption" required>
            <AdminInput
              value={editingGalleryItem?.title || ''}
              onChange={(e) => setEditingGalleryItem((prev) => (prev ? { ...prev, title: e.target.value } : null))}
              placeholder="e.g. Main Academic Block"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Carousel Row Assignment">
            <select
              value={editingGalleryItem?.row_number || 1}
              onChange={(e) => setEditingGalleryItem((prev) => (prev ? { ...prev, row_number: parseInt(e.target.value, 10) || 1 } : null))}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]"
            >
              <option value={1}>Row 1 (Top Carousel)</option>
              <option value={2}>Row 2 (Middle Carousel)</option>
              <option value={3}>Row 3 (Bottom Carousel)</option>
            </select>
          </AdminFormGroup>

          <AdminFormGroup label="Gallery Photograph Upload">
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {uploadingGalleryImg ? (
                  <Loader2 className="w-6 h-6 text-[#0093DD] animate-spin" />
                ) : editingGalleryItem?.image || editingGalleryItem?.image_url ? (
                  <img
                    src={editingGalleryItem.image || editingGalleryItem.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>
                    {uploadingGalleryImg
                      ? 'Uploading...'
                      : editingGalleryItem?.image || editingGalleryItem?.image_url
                      ? 'Replace Image'
                      : 'Upload Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingGalleryImg}
                    onChange={handleGalleryFileUpload}
                  />
                </label>

                {(editingGalleryItem?.image || editingGalleryItem?.image_url) && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditingGalleryItem((prev) =>
                        prev ? { ...prev, image: '', image_url: '', photoUrl: '' } : null
                      )
                    }
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Website"
            checked={editingGalleryItem?.is_visible ?? true}
            onChange={(checked) => setEditingGalleryItem((prev) => (prev ? { ...prev, is_visible: checked } : null))}
          />
        </div>
      </AdminModal>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteGalleryItem}
        itemTitle={deleteTarget?.title}
      />
    </div>
  );
}
