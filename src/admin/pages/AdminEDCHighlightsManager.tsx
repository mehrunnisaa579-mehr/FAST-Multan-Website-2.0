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
import { edcHighlightsData as defaultHighlights } from '../../data/edc';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Upload, ArrowUp, ArrowDown, Edit2, Sparkles, ImageIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface HighlightCMSItem {
  id: string;
  title: string;
  subtext: string;
  date?: string;
  description: string | string[];
  images: string[];
  imageCount?: number;
  display_order: number;
  is_visible: boolean;
}

export default function AdminEDCHighlightsManager() {
  const [heroTitle, setHeroTitle] = useState('Highlights');
  const [heroImage, setHeroImage] = useState('');
  const [highlights, setHighlights] = useState<HighlightCMSItem[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<Partial<HighlightCMSItem> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HighlightCMSItem | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      const data = await cmsService.getSetting<any>('edc_highlights_list', null);
      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.highlights && Array.isArray(data.highlights) && data.highlights.length > 0) {
          setHighlights(data.highlights);
        } else {
          setHighlights(
            defaultHighlights.map((h, idx) => ({
              id: h.id,
              title: h.title,
              subtext: h.subtext,
              description: Array.isArray(h.description) ? h.description.join('\n\n') : h.description,
              images: Array.from({ length: h.imageCount || 4 }).map(() => ''),
              display_order: idx + 1,
              is_visible: true,
            }))
          );
        }
      } else {
        setHighlights(
          defaultHighlights.map((h, idx) => ({
            id: h.id,
            title: h.title,
            subtext: h.subtext,
            description: Array.isArray(h.description) ? h.description.join('\n\n') : h.description,
            images: Array.from({ length: h.imageCount || 4 }).map(() => ''),
            display_order: idx + 1,
            is_visible: true,
          }))
        );
      }
    };
    fetchHighlights();
  }, []);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setHeroImage(res.publicUrl);
    } else {
      alert(`Hero upload failed: ${res.error}`);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>, imgIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setEditingHighlight((prev) => {
        if (!prev) return prev;
        const nextImages = [...(prev.images || [])];
        nextImages[imgIdx] = res.publicUrl;
        return { ...prev, images: nextImages };
      });
    } else {
      alert(`Gallery upload failed: ${res.error}`);
    }
  };

  const handleAddGalleryImage = () => {
    setEditingHighlight((prev) => {
      if (!prev) return prev;
      return { ...prev, images: [...(prev.images || []), ''] };
    });
  };

  const handleRemoveGalleryImage = (imgIdx: number) => {
    setEditingHighlight((prev) => {
      if (!prev) return prev;
      const nextImages = (prev.images || []).filter((_, i) => i !== imgIdx);
      return { ...prev, images: nextImages };
    });
  };

  const handleOpenAdd = () => {
    setEditingHighlight({
      id: `hl-${Date.now()}`,
      title: '',
      subtext: 'PLACEHOLDER DATE | FAST-NUCES Multan Campus',
      description: '',
      images: ['', '', ''],
      display_order: highlights.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hl: HighlightCMSItem) => {
    setEditingHighlight({
      ...hl,
      description: Array.isArray(hl.description) ? hl.description.join('\n\n') : hl.description,
      images: Array.isArray(hl.images) ? hl.images : [],
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (!editingHighlight?.title?.trim()) {
      alert('Please enter Highlight Event Title.');
      return;
    }

    const finalItem: HighlightCMSItem = {
      id: editingHighlight.id || `hl-${Date.now()}`,
      title: editingHighlight.title.trim(),
      subtext: editingHighlight.subtext?.trim() || '',
      description: editingHighlight.description || '',
      images: editingHighlight.images || [],
      display_order: editingHighlight.display_order || highlights.length + 1,
      is_visible: editingHighlight.is_visible ?? true,
    };

    const updated = [...highlights];
    const idx = updated.findIndex((h) => h.id === finalItem.id);
    if (idx >= 0) {
      updated[idx] = finalItem;
    } else {
      updated.push(finalItem);
    }

    setHighlights(updated);
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setHighlights((prev) => prev.filter((h) => h.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleMove = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= highlights.length) return;
    const next = [...highlights];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    next.forEach((h, i) => (h.display_order = i + 1));
    setHighlights(next);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImage,
      highlights: highlights.map((h, i) => ({ ...h, display_order: i + 1 })),
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('edc_highlights_list', payload, 'EDC Highlights Event List');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'EDC highlights saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save highlights.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/edc"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to EDC Admin Hub"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Manage EDC Highlights"
          subtitle="Add, edit, reorder, show/hide EDC event highlights and manage dynamic photo galleries."
          action={
            <div className="flex items-center gap-3">
              <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
                Add Highlight Event
              </AdminButton>
              <AdminButton variant="primary" onClick={handleSaveAll} loading={saving} icon={<Save className="w-4 h-4" />}>
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

      {/* Hero Banner Card */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#0093DD]" />
          <span>1. Hero Banner Settings</span>
        </h3>

        <AdminFormGroup label="Hero Page Title">
          <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
        </AdminFormGroup>

        <AdminFormGroup label="Hero Background Image Upload">
          <div className="flex items-center gap-4">
            <div className="w-24 h-14 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
              {heroImage ? (
                <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
              )}
            </div>

            <div className="flex gap-2">
              <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                <Upload className="w-4 h-4" />
                <span>{heroImage ? 'Replace Image' : 'Upload Image'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
              </label>

              {heroImage && (
                <button
                  type="button"
                  onClick={() => setHeroImage('')}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </AdminFormGroup>
      </AdminCard>

      {/* Highlights List */}
      <AdminSection title="EDC Highlight Events" description="List of highlight events rendered on /edc/highlights.">
        <div className="space-y-4">
          {highlights.map((hl, idx) => (
            <AdminCard key={hl.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center font-bold border border-[#E5E7EB] flex-shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                      Order #{idx + 1}
                    </span>
                    <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded">
                      {(hl.images || []).length} photos
                    </span>
                    {!hl.is_visible && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Hidden
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-[#1F2937]">{hl.title}</h4>
                  <p className="text-xs text-[#6B7280]">{hl.subtext}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === highlights.length - 1}
                  className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <AdminButton variant="secondary" onClick={() => handleOpenEdit(hl)} icon={<Edit2 className="w-4 h-4" />}>
                  Edit Event & Photos
                </AdminButton>

                <AdminButton variant="danger" onClick={() => setDeleteTarget(hl)} icon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      </AdminSection>

      {/* Add / Edit Highlight Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingHighlight?.id && highlights.some((h) => h.id === editingHighlight.id) ? 'Edit Highlight Event' : 'Add New Highlight Event'}
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveModal}>
              Save Highlight Event
            </AdminButton>
          </>
        }
      >
        <div className="space-y-5 text-left max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Highlight Title" required>
              <AdminInput
                value={editingHighlight?.title || ''}
                onChange={(e) => setEditingHighlight((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. EDC Corporate Summit 2026"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Date & Location Subtext">
              <AdminInput
                value={editingHighlight?.subtext || ''}
                onChange={(e) => setEditingHighlight((prev) => ({ ...prev, subtext: e.target.value }))}
                placeholder="MARCH 2026 | FAST-NUCES Multan Campus"
              />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Event Detailed Description (Use double linebreaks between paragraphs)">
            <AdminTextarea
              rows={4}
              value={(editingHighlight?.description as string) || ''}
              onChange={(e) => setEditingHighlight((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed summary of proceedings and outcomes..."
            />
          </AdminFormGroup>

          {/* Dynamic Photo Gallery per Highlight */}
          <div className="border-t border-[#E5E7EB] pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#1F2937]">Event Photo Gallery</h4>
              <AdminButton variant="secondary" onClick={handleAddGalleryImage} icon={<Plus className="w-3.5 h-3.5" />}>
                Add Photo Slot
              </AdminButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(editingHighlight?.images || []).map((imgUrl, imgIdx) => (
                <div key={imgIdx} className="p-2 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] flex flex-col items-center gap-2">
                  <div className="w-full h-24 bg-white border border-[#E5E7EB] rounded flex items-center justify-center overflow-hidden">
                    {imgUrl ? (
                      <img src={imgUrl} alt={`Photo ${imgIdx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-gray-400 font-bold uppercase">PHOTO #{imgIdx + 1}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 w-full justify-between">
                    <label className="px-2 py-1 bg-[#0093DD] text-white text-[11px] font-semibold rounded cursor-pointer flex-1 text-center">
                      <span>{imgUrl ? 'Replace' : 'Upload'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleGalleryUpload(e, imgIdx)} />
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(imgIdx)}
                      className="p-1 bg-red-50 text-red-600 border border-red-200 rounded"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AdminToggle
            label="Visible on Website"
            checked={editingHighlight?.is_visible ?? true}
            onChange={(checked) => setEditingHighlight((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Highlight Event?"
        message={`Are you sure you want to delete highlight "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
