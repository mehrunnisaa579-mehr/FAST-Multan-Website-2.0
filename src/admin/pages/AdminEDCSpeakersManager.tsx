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
import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';
import { cmsService } from '../../services/cmsService';
import { conferenceSpeakers as defaultSpeakers } from '../../data/edc';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Upload, ArrowUp, ArrowDown, Edit2, User, Eye, EyeOff, ArrowLeft, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface SpeakerCMSItem {
  id: string;
  name: string;
  title: string;
  organization?: string;
  bio: string | string[];
  photo_url?: string;
  photo?: string;
  display_order: number;
  is_visible: boolean;
}

export default function AdminEDCSpeakersManager() {
  const [speakers, setSpeakers] = useState<SpeakerCMSItem[]>([]);
  const [heroTitle, setHeroTitle] = useState('Conference Speakers');
  const [heroImage, setHeroImage] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Partial<SpeakerCMSItem> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SpeakerCMSItem | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchSpeakers = async () => {
      const data = await cmsService.getSetting<any>('edc_speakers_list', null);
      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.speakers && Array.isArray(data.speakers) && data.speakers.length > 0) {
          setSpeakers(data.speakers);
        } else {
          setSpeakers(
            defaultSpeakers.map((s, idx) => ({
              id: s.id,
              name: s.name,
              title: s.title,
              bio: Array.isArray(s.bio) ? s.bio.join('\n\n') : s.bio,
              photo_url: '',
              display_order: idx + 1,
              is_visible: true,
            }))
          );
        }
      } else {
        setSpeakers(
          defaultSpeakers.map((s, idx) => ({
            id: s.id,
            name: s.name,
            title: s.title,
            bio: Array.isArray(s.bio) ? s.bio.join('\n\n') : s.bio,
            photo_url: '',
            display_order: idx + 1,
            is_visible: true,
          }))
        );
      }
    };
    fetchSpeakers();
  }, []);

  const { cropperProps, openCropper } = useImageCropper();

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrlFn: (url: string) => void,
    opts?: { aspectRatio?: number; cropShape?: 'rect' | 'round'; title?: string }
  ) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          setUrlFn(res.publicUrl);
        } else {
          alert(`Photo upload failed: ${res.error}`);
        }
      },
      opts
    );
  };

  const handleOpenAdd = () => {
    setEditingSpeaker({
      id: `spk-${Date.now()}`,
      name: '',
      title: '',
      organization: '',
      bio: '',
      photo_url: '',
      display_order: speakers.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (spk: SpeakerCMSItem) => {
    setEditingSpeaker({
      ...spk,
      bio: Array.isArray(spk.bio) ? spk.bio.join('\n\n') : spk.bio,
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (!editingSpeaker?.name?.trim()) {
      alert('Please enter Speaker Name.');
      return;
    }

    const finalItem: SpeakerCMSItem = {
      id: editingSpeaker.id || `spk-${Date.now()}`,
      name: editingSpeaker.name.trim(),
      title: editingSpeaker.title?.trim() || '',
      organization: editingSpeaker.organization?.trim() || '',
      bio: editingSpeaker.bio || '',
      photo_url: editingSpeaker.photo_url || '',
      display_order: editingSpeaker.display_order || speakers.length + 1,
      is_visible: editingSpeaker.is_visible ?? true,
    };

    const updated = [...speakers];
    const idx = updated.findIndex((s) => s.id === finalItem.id);
    if (idx >= 0) {
      updated[idx] = finalItem;
    } else {
      updated.push(finalItem);
    }

    setSpeakers(updated);
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setSpeakers((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleMove = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= speakers.length) return;
    const next = [...speakers];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    next.forEach((s, i) => (s.display_order = i + 1));
    setSpeakers(next);
  };

  const handleToggleVisibility = (id: string) => {
    setSpeakers((prev) => prev.map((s) => (s.id === id ? { ...s, is_visible: !s.is_visible } : s)));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImage,
      speakers: speakers.map((s, i) => ({ ...s, display_order: i + 1 })),
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('edc_speakers_list', payload, 'Conference Speakers List');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Conference speakers saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save speakers.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/edc/conferences-hub"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to Conferences Hub"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Manage Conference Speakers"
          subtitle="Add, edit, reorder, show/hide, or delete conference keynote speakers and upload profile photos."
          action={
            <div className="flex items-center gap-3">
              <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
                Add Speaker
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

      {/* Conference Speakers Hero Settings */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[#0093DD]" />
          <span>Conference Speakers Hero Settings</span>
        </h3>

        <AdminFormGroup label="Hero Page Title">
          <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
        </AdminFormGroup>

        <AdminFormGroup label="Hero Background Image Upload (Preview / Replace / Remove)">
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
                <span>{heroImage ? 'Replace Hero Image' : 'Upload Hero Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e, (url) => setHeroImage(url), { aspectRatio: 16 / 9, title: 'Crop Speakers Page Hero Image (16:9 Wide)' })}
                />
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

      <AdminSection title="Conference Keynote Speakers" description="Dynamic list of conference speakers displayed on /edc/conferences/speakers.">
        <div className="space-y-3">
          {speakers.map((spk, idx) => (
            <AdminCard key={spk.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-14 bg-[#F0F9FF] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                  {spk.photo_url || spk.photo ? (
                    <img src={spk.photo_url || spk.photo} alt={spk.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-[#0093DD]" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                      Order #{idx + 1}
                    </span>
                    {!spk.is_visible && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Hidden
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-[#1F2937]">{spk.name}</h4>
                  <p className="text-xs text-[#6B7280]">{spk.title} {spk.organization ? `— ${spk.organization}` : ''}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleToggleVisibility(spk.id)}
                  className={`p-2 border rounded-md cursor-pointer transition-colors ${
                    spk.is_visible ? 'text-[#0093DD] bg-[#F0F9FF] border-[#B9E6FE]' : 'text-[#9CA3AF] bg-[#F9FAFB] border-[#E5E7EB]'
                  }`}
                  title={spk.is_visible ? 'Visible (Click to Hide)' : 'Hidden (Click to Show)'}
                >
                  {spk.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

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
                  disabled={idx === speakers.length - 1}
                  className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <AdminButton variant="secondary" onClick={() => handleOpenEdit(spk)} icon={<Edit2 className="w-4 h-4" />}>
                  Edit
                </AdminButton>

                <AdminButton variant="danger" onClick={() => setDeleteTarget(spk)} icon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      </AdminSection>

      {/* Add / Edit Speaker Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSpeaker?.id && speakers.some((s) => s.id === editingSpeaker.id) ? 'Edit Conference Speaker' : 'Add New Conference Speaker'}
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveModal}>
              Save Speaker
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Speaker Full Name" required>
              <AdminInput
                value={editingSpeaker?.name || ''}
                onChange={(e) => setEditingSpeaker((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Dr. Speaker Name"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Designation / Title">
              <AdminInput
                value={editingSpeaker?.title || ''}
                onChange={(e) => setEditingSpeaker((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Chief Innovation Officer / Professor"
              />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Organization / University">
            <AdminInput
              value={editingSpeaker?.organization || ''}
              onChange={(e) => setEditingSpeaker((prev) => ({ ...prev, organization: e.target.value }))}
              placeholder="e.g. FAST-NUCES Multan / Corporate Executive"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Biography / Description (Use double linebreaks for multiple paragraphs)">
            <AdminTextarea
              rows={5}
              value={(editingSpeaker?.bio as string) || ''}
              onChange={(e) => setEditingSpeaker((prev) => ({ ...prev, bio: e.target.value }))}
              placeholder="Introductory background and research expertise..."
            />
          </AdminFormGroup>

          <AdminFormGroup label="Speaker Photo Upload (Preview / Replace / Remove)">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 bg-[#F3F4F6] border border-[#E5E7EB] rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                {editingSpeaker?.photo_url ? (
                  <img src={editingSpeaker.photo_url} alt="Speaker" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3 py-1.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{editingSpeaker?.photo_url ? 'Replace Photo' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e, (url) => setEditingSpeaker((prev) => ({ ...prev, photo_url: url })), { aspectRatio: 1, title: 'Crop Speaker Photo (1:1 Square)' })}
                  />
                </label>

                {editingSpeaker?.photo_url && (
                  <button
                    type="button"
                    onClick={() => setEditingSpeaker((prev) => ({ ...prev, photo_url: '' }))}
                    className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded border border-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Website"
            checked={editingSpeaker?.is_visible ?? true}
            onChange={(checked) => setEditingSpeaker((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Speaker Profile?"
        message={`Are you sure you want to delete speaker "${deleteTarget?.name}"? This action cannot be undone.`}
      />

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
