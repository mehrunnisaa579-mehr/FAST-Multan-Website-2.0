import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import AdminToggle from '../components/ui/AdminToggle';
import AdminModal from '../components/ui/AdminModal';
import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';
import { cmsService } from '../../services/cmsService';
import { bootcampModules as defaultModules, bootcampSchedule as defaultSchedule } from '../../data/edc';
import { Save, CheckCircle2, AlertCircle, Upload, ImageIcon, ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, Edit2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BootcampModuleCMS {
  id: string;
  title: string;
  description: string;
  icon_url?: string;
  icon?: string;
  display_order: number;
  is_visible: boolean;
}

export default function AdminEDCSummerBootcampEditor() {
  const [heroTitle, setHeroTitle] = useState('Summer Bootcamp 2026');
  const [heroImage, setHeroImage] = useState('');
  const [title, setTitle] = useState('Summer Bootcamp 2026');
  const [subtitle, setSubtitle] = useState('Executive Development Centre — FAST-NUCES Multan Campus');
  const [overview, setOverview] = useState(
    'The Summer Bootcamp 2026 is an intensive executive training program organized by the Executive Development Centre (EDC) at FAST-NUCES Multan Campus to enhance leadership, analytical, and digital skills.\n\nDesigned for corporate professionals, entrepreneurs, and advanced students, the bootcamp combines interactive lectures, practical case studies, and hands-on group project mentorship.'
  );

  const [modules, setModules] = useState<BootcampModuleCMS[]>([]);
  const [schedule, setSchedule] = useState<{ day: string; session: string; time: string }[]>(defaultSchedule);

  const [openingDate, setOpeningDate] = useState('Registration opening date');
  const [eligibility, setEligibility] = useState('Eligibility criteria & prerequisites');
  const [fee, setFee] = useState('Registration fee structure');
  const [contact, setContact] = useState('EDC Multan contact email & phone');

  // Module modal
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Partial<BootcampModuleCMS> | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await cmsService.getSetting<any>('edc_bootcamp_content', null);
      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.title) setTitle(data.title);
        if (data.subtitle) setSubtitle(data.subtitle);
        if (data.overview) setOverview(data.overview);

        if (data.openingDate) setOpeningDate(data.openingDate);
        if (data.eligibility) setEligibility(data.eligibility);
        if (data.fee) setFee(data.fee);
        if (data.contact) setContact(data.contact);

        if (data.modules && Array.isArray(data.modules) && data.modules.length > 0) {
          setModules(data.modules);
        } else {
          setModules(
            defaultModules.map((m, idx) => ({
              id: m.id,
              title: m.title,
              description: m.description,
              icon_url: '',
              display_order: idx + 1,
              is_visible: true,
            }))
          );
        }

        if (data.schedule && Array.isArray(data.schedule)) {
          setSchedule(data.schedule);
        }
      } else {
        setModules(
          defaultModules.map((m, idx) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            icon_url: '',
            display_order: idx + 1,
            is_visible: true,
          }))
        );
      }
    };
    loadData();
  }, []);

  const { cropperProps, openCropper } = useImageCropper();

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          setHeroImage(res.publicUrl);
        } else {
          alert(`Upload failed: ${res.error}`);
        }
      },
      { aspectRatio: 16 / 9, title: 'Crop Bootcamp Hero Image (16:9 Wide)' }
    );
  };

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrlFn: (url: string) => void) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          setUrlFn(res.publicUrl);
        } else {
          alert(`Icon upload failed: ${res.error}`);
        }
      },
      { aspectRatio: 1 / 1, cropShape: 'round', title: 'Crop Module Icon (1:1 Round)' }
    );
  };

  // Module handlers
  const handleOpenAddModule = () => {
    setEditingModule({
      id: `mod-${Date.now()}`,
      title: '',
      description: '',
      icon_url: '',
      display_order: modules.length + 1,
      is_visible: true,
    });
    setIsModuleModalOpen(true);
  };

  const handleOpenEditModule = (mod: BootcampModuleCMS) => {
    setEditingModule({ ...mod });
    setIsModuleModalOpen(true);
  };

  const handleSaveModuleModal = () => {
    if (!editingModule?.title?.trim()) {
      alert('Please enter Module Title.');
      return;
    }

    const finalItem: BootcampModuleCMS = {
      id: editingModule.id || `mod-${Date.now()}`,
      title: editingModule.title.trim(),
      description: editingModule.description || '',
      icon_url: editingModule.icon_url || '',
      display_order: editingModule.display_order || modules.length + 1,
      is_visible: editingModule.is_visible ?? true,
    };

    const updated = [...modules];
    const idx = updated.findIndex((m) => m.id === finalItem.id);
    if (idx >= 0) {
      updated[idx] = finalItem;
    } else {
      updated.push(finalItem);
    }

    setModules(updated);
    setIsModuleModalOpen(false);
  };

  const handleDeleteModule = (id: string) => {
    setModules((prev) => prev.filter((m) => m.id !== id));
  };

  const handleMoveModule = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= modules.length) return;
    const next = [...modules];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    next.forEach((m, i) => (m.display_order = i + 1));
    setModules(next);
  };

  const handleToggleModuleVisibility = (id: string) => {
    setModules((prev) => prev.map((m) => (m.id === id ? { ...m, is_visible: !m.is_visible } : m)));
  };

  // Schedule handlers
  const handleAddScheduleRow = () => {
    setSchedule((prev) => [...prev, { day: `Day ${prev.length + 1}`, session: 'New Bootcamp Session', time: '09:00 AM - 04:00 PM' }]);
  };

  const handleScheduleChange = (idx: number, field: 'day' | 'session' | 'time', val: string) => {
    setSchedule((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
  };

  const handleDeleteScheduleRow = (idx: number) => {
    setSchedule((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMoveScheduleRow = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= schedule.length) return;
    const next = [...schedule];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setSchedule(next);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImage,
      title,
      subtitle,
      overview,
      modules: modules.map((m, i) => ({ ...m, display_order: i + 1 })),
      schedule,
      openingDate,
      eligibility,
      fee,
      contact,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('edc_bootcamp_content', payload, 'Summer Bootcamp 2026 Content');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Summer Bootcamp 2026 saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/edc/workshops-hub"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to Workshops Hub"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Edit Summer Bootcamp 2026 Page"
          subtitle="Manage bootcamp hero title, media, overview, modules, schedule rows, and registration information for /edc/workshops/summer-bootcamp-2026."
          action={
            <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
              Save Page Changes
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

      {/* Hero */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#0093DD]" />
          <span>1. Hero Banner & Overview Settings</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormGroup label="Hero Page Title">
            <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
          </AdminFormGroup>

          <AdminFormGroup label="Workshop Main Title">
            <AdminInput value={title} onChange={(e) => setTitle(e.target.value)} />
          </AdminFormGroup>
        </div>

        <AdminFormGroup label="Workshop Subtitle / Organizer Metadata">
          <AdminInput value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
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

        <AdminFormGroup label="Workshop Overview Text (Use double linebreaks between paragraphs)">
          <AdminTextarea rows={5} value={overview} onChange={(e) => setOverview(e.target.value)} />
        </AdminFormGroup>
      </AdminCard>

      {/* Bootcamp Modules */}
      <AdminCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-2">
          <h3 className="text-base font-bold text-[#1F2937]">2. Bootcamp Modules</h3>
          <AdminButton variant="secondary" onClick={handleOpenAddModule} icon={<Plus className="w-3.5 h-3.5" />}>
            Add Module
          </AdminButton>
        </div>

        <div className="space-y-3">
          {modules.map((mod, idx) => (
            <div key={mod.id} className="p-4 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-[#E5E7EB] rounded flex items-center justify-center flex-shrink-0 text-[#0093DD]">
                  {mod.icon_url ? (
                    <img src={mod.icon_url} alt="Icon" className="w-full h-full object-cover rounded" />
                  ) : (
                    <BookOpen className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#1F2937]">{mod.title}</h4>
                  <p className="text-xs text-[#6B7280] line-clamp-1">{mod.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button type="button" onClick={() => handleMoveModule(idx, 'up')} disabled={idx === 0} className="p-2 border rounded bg-white text-gray-600 disabled:opacity-30">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => handleMoveModule(idx, 'down')} disabled={idx === modules.length - 1} className="p-2 border rounded bg-white text-gray-600 disabled:opacity-30">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <AdminButton variant="secondary" onClick={() => handleOpenEditModule(mod)} icon={<Edit2 className="w-3.5 h-3.5" />}>
                  Edit
                </AdminButton>
                <AdminButton variant="danger" onClick={() => handleDeleteModule(mod.id)} icon={<Trash2 className="w-3.5 h-3.5" />}>
                  Delete
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Bootcamp Schedule */}
      <AdminCard className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-2">
          <h3 className="text-base font-bold text-[#1F2937]">3. Bootcamp Schedule Rows</h3>
          <AdminButton variant="secondary" onClick={handleAddScheduleRow} icon={<Plus className="w-3.5 h-3.5" />}>
            Add Schedule Row
          </AdminButton>
        </div>

        <div className="space-y-2">
          {schedule.map((row, idx) => (
            <div key={idx} className="p-3 border border-[#E5E7EB] rounded-md bg-[#F9FAFB] flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:w-1/4">
                <AdminInput value={row.day} onChange={(e) => handleScheduleChange(idx, 'day', e.target.value)} placeholder="Day (e.g. Day 1)" />
              </div>
              <div className="w-full sm:w-2/4">
                <AdminInput value={row.session} onChange={(e) => handleScheduleChange(idx, 'session', e.target.value)} placeholder="Session Title" />
              </div>
              <div className="w-full sm:w-1/4 flex items-center gap-2">
                <AdminInput value={row.time} onChange={(e) => handleScheduleChange(idx, 'time', e.target.value)} placeholder="Time" />
                <button type="button" onClick={() => handleMoveScheduleRow(idx, 'up')} disabled={idx === 0} className="p-2 border rounded bg-white text-gray-600 disabled:opacity-30">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => handleMoveScheduleRow(idx, 'down')} disabled={idx === schedule.length - 1} className="p-2 border rounded bg-white text-gray-600 disabled:opacity-30">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => handleDeleteScheduleRow(idx)} className="p-2 text-red-600 bg-red-50 border border-red-200 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Registration Details */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2">
          4. Registration Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormGroup label="Registration Opening Date">
            <AdminInput value={openingDate} onChange={(e) => setOpeningDate(e.target.value)} />
          </AdminFormGroup>

          <AdminFormGroup label="Eligibility & Prerequisites">
            <AdminInput value={eligibility} onChange={(e) => setEligibility(e.target.value)} />
          </AdminFormGroup>

          <AdminFormGroup label="Registration Fee Structure">
            <AdminInput value={fee} onChange={(e) => setFee(e.target.value)} />
          </AdminFormGroup>

          <AdminFormGroup label="Contact Details (Email / Phone)">
            <AdminInput value={contact} onChange={(e) => setContact(e.target.value)} />
          </AdminFormGroup>
        </div>
      </AdminCard>

      <div className="flex justify-end pt-2">
        <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
          Save Page Changes
        </AdminButton>
      </div>

      {/* Module Add/Edit Modal */}
      <AdminModal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        title={editingModule?.id && modules.some((m) => m.id === editingModule.id) ? 'Edit Bootcamp Module' : 'Add New Bootcamp Module'}
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModuleModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveModuleModal}>
              Save Module
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <AdminFormGroup label="Module Title" required>
            <AdminInput
              value={editingModule?.title || ''}
              onChange={(e) => setEditingModule((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Module 1 — Executive Leadership & Strategy"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Module Description">
            <AdminTextarea
              rows={3}
              value={editingModule?.description || ''}
              onChange={(e) => setEditingModule((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Module overview and learning outcomes..."
            />
          </AdminFormGroup>

          <AdminFormGroup label="Custom Icon Upload">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F3F4F6] border border-[#E5E7EB] rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                {editingModule?.icon_url ? (
                  <img src={editingModule.icon_url} alt="Icon" className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-5 h-5 text-[#9CA3AF]" />
                )}
              </div>
              <label className="px-3 py-1.5 bg-[#0093DD] text-white text-xs font-semibold rounded cursor-pointer">
                <span>Upload Icon</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleIconUpload(e, (url) => setEditingModule((prev) => ({ ...prev, icon_url: url })))}
                />
              </label>
              {editingModule?.icon_url && (
                <button type="button" onClick={() => setEditingModule((prev) => ({ ...prev, icon_url: '' }))} className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded border border-red-200">
                  Remove
                </button>
              )}
            </div>
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Website"
            checked={editingModule?.is_visible ?? true}
            onChange={(checked) => setEditingModule((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
