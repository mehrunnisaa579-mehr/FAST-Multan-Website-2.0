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
import { supabase } from '../../lib/supabase';
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
  GraduationCap,
} from 'lucide-react';

import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';

interface DeptCardItem {
  id: string;
  title: string;
  href: string;
  imageLabel?: string;
  image?: string;
  display_order: number;
  is_visible: boolean;
}

export default function AdminAllDepartmentsManager() {
  const [heroTitle, setHeroTitle] = useState('All Departments');
  const [heroImageUrl, setHeroImageUrl] = useState('');

  // Director's Message
  const [directorName, setDirectorName] = useState('Dr. Director Name');
  const [directorDesignation, setDirectorDesignation] = useState('Director, FAST-NUCES Multan');
  const [directorMessage, setDirectorMessage] = useState('');
  const [directorPhotoUrl, setDirectorPhotoUrl] = useState('');

  // Our Departments Cards
  const [deptSectionTitle, setDeptSectionTitle] = useState('Our Departments');
  const [deptCards, setDeptCards] = useState<DeptCardItem[]>([
    {
      id: 'card-1',
      title: 'Department Of Computer Science',
      href: '/departments/computing/computer-science',
      imageLabel: 'COMPUTER SCIENCE',
      display_order: 1,
      is_visible: true,
    },
    {
      id: 'card-2',
      title: 'Department Of Software Engineering',
      href: '/departments/computing/software-engineering',
      imageLabel: 'SOFTWARE ENGINEERING',
      display_order: 2,
      is_visible: true,
    },
    {
      id: 'card-3',
      title: 'Department Of AI & Data Science',
      href: '/departments/computing/ai-data-science',
      imageLabel: 'AI & DATA SCIENCE',
      display_order: 3,
      is_visible: true,
    },
    {
      id: 'card-4',
      title: 'Department Of Management Sciences',
      href: '/departments/management',
      imageLabel: 'MANAGEMENT',
      display_order: 4,
      is_visible: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Partial<DeptCardItem> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeptCardItem | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { cropperProps, openCropper } = useImageCropper();

  const handleFileUpload = (
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
          alert(`Upload failed: ${res.error}`);
        }
      },
      opts
    );
  };

  const handleOpenAdd = () => {
    setEditingCard({
      id: `card-${Date.now()}`,
      title: 'New Department',
      href: '/departments/computing',
      imageLabel: 'DEPARTMENT',
      image: '',
      display_order: deptCards.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (card: DeptCardItem) => {
    setEditingCard({ ...card });
    setIsModalOpen(true);
  };

  const handleSaveCard = () => {
    if (!editingCard?.title?.trim()) {
      alert('Please enter a department card title.');
      return;
    }

    const updated = [...deptCards];
    const idx = updated.findIndex((c) => c.id === editingCard.id);
    if (idx >= 0) {
      updated[idx] = editingCard as DeptCardItem;
    } else {
      updated.push(editingCard as DeptCardItem);
    }

    setDeptCards(updated);
    setIsModalOpen(false);
  };

  const handleDeleteCard = () => {
    if (!deleteTarget) return;
    setDeptCards((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newList = [...deptCards];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setDeptCards(newList);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImageUrl,
      directorName,
      directorDesignation,
      directorMessage,
      directorPhotoUrl,
      deptSectionTitle,
      deptCards,
      updated_at: new Date().toISOString(),
    };

    // Also sync director details to homepage_full_content setting if needed
    const homeSettings = (await cmsService.getSetting<any>('homepage_full_content', {})) || {};
    await cmsService.saveSetting('homepage_full_content', {
      ...homeSettings,
      directorName,
      directorMessage,
      directorPhotoUrl,
    });

    const res = await cmsService.saveSetting('all_departments_content', payload, 'All Departments page content');

    if (res.success) {
      setMessage({ type: 'success', text: 'All Departments page content saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="All Departments Page"
        subtitle="Manage the public All Departments overview page, Director's Message, hero banner, and department cards."
        action={
          <AdminButton variant="primary" onClick={handleSaveAll} loading={saving} icon={<Save className="w-4 h-4" />}>
            Save Changes
          </AdminButton>
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

      {/* Hero Section */}
      <AdminSection title="Page Hero Banner" description="Manage page banner title and background image.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Hero Title">
            <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="All Departments" />
          </AdminFormGroup>

          <AdminFormGroup label="Hero Background Image Upload">
            <div className="flex items-center gap-3">
              <div className="w-32 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center">
                {heroImageUrl ? (
                  <img src={heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-[#9CA3AF]">DEFAULT HERO</span>
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{heroImageUrl ? 'Replace Hero' : 'Upload Hero'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setHeroImageUrl, { aspectRatio: 16 / 9, title: 'Crop Page Hero Image (16:9 Wide)' })} />
                </label>

                {heroImageUrl && (
                  <button
                    type="button"
                    onClick={() => setHeroImageUrl('')}
                    className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* Director's Message Section */}
      <AdminSection title="Director's Message Section" description="Manage Campus Director message, photo, and details.">
        <AdminCard className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Director Name">
              <AdminInput value={directorName} onChange={(e) => setDirectorName(e.target.value)} placeholder="Dr. Director Name" />
            </AdminFormGroup>

            <AdminFormGroup label="Designation">
              <AdminInput value={directorDesignation} onChange={(e) => setDirectorDesignation(e.target.value)} placeholder="Director, FAST-NUCES Multan" />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Director Photograph Upload">
            <div className="flex items-center gap-3">
              <div className="w-16 h-20 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {directorPhotoUrl ? (
                  <img src={directorPhotoUrl} alt={directorName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{directorPhotoUrl ? 'Replace Photo' : 'Upload Photo'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setDirectorPhotoUrl, { aspectRatio: 1, title: 'Crop Director Photo (1:1 Square)' })} />
                </label>

                {directorPhotoUrl && (
                  <button
                    type="button"
                    onClick={() => setDirectorPhotoUrl('')}
                    className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <AdminFormGroup label="Full Director Message">
            <AdminTextarea rows={5} value={directorMessage} onChange={(e) => setDirectorMessage(e.target.value)} placeholder="Welcome to FAST-NUCES Multan Campus..." />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* Our Departments Cards Grid */}
      <AdminSection
        title="Department Tiles Grid"
        description="Add, edit, reorder, or remove department cards displayed on the All Departments page."
      >
        <div className="flex justify-between items-center mb-4">
          <AdminInput
            value={deptSectionTitle}
            onChange={(e) => setDeptSectionTitle(e.target.value)}
            placeholder="Our Departments"
            className="max-w-[300px]"
          />
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add Department Card
          </AdminButton>
        </div>

        <div className="space-y-3">
          {deptCards.map((card, idx) => (
            <AdminCard key={card.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center flex-shrink-0 font-bold border border-[#E5E7EB] overflow-hidden">
                  {card.image ? (
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                      Order #{idx + 1}
                    </span>
                    <span className="text-xs text-[#6B7280]">{card.href}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#1F2937]">{card.title}</h4>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
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
                  disabled={idx === deptCards.length - 1}
                  className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <AdminButton variant="secondary" onClick={() => handleOpenEdit(card)} icon={<Edit2 className="w-4 h-4" />}>
                  Edit
                </AdminButton>

                <AdminButton variant="danger" onClick={() => setDeleteTarget(card)} icon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      </AdminSection>

      {/* Edit Card Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCard?.id ? 'Edit Department Card' : 'Add Department Card'}
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveCard}>
              Save Tile
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <AdminFormGroup label="Department Title" required>
            <AdminInput
              value={editingCard?.title || ''}
              onChange={(e) => setEditingCard((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Department Of Computer Science"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Destination Page Link (URL)">
            <AdminInput
              value={editingCard?.href || ''}
              onChange={(e) => setEditingCard((prev) => ({ ...prev, href: e.target.value }))}
              placeholder="/departments/computing/computer-science"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Tile Image / Icon Upload">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center">
                {editingCard?.image ? (
                  <img src={editingCard.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{editingCard?.image ? 'Replace Image' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setEditingCard((prev) => ({ ...prev, image: url })), { aspectRatio: 16 / 9, title: 'Crop Department Tile Image (16:9 Wide)' })}
                  />
                </label>

                {editingCard?.image && (
                  <button
                    type="button"
                    onClick={() => setEditingCard((prev) => ({ ...prev, image: '' }))}
                    className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Website"
            checked={editingCard?.is_visible ?? true}
            onChange={(checked) => setEditingCard((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteCard}
        itemTitle={deleteTarget?.title}
      />

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
