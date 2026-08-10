import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import AdminModal, { DeleteConfirmModal } from '../components/ui/AdminModal';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, CheckCircle2, AlertCircle, Upload } from 'lucide-react';

interface ProgramItem {
  id: string;
  name: string;
  level: string;
  duration: string;
  description: string;
  image_url: string;
  department: string;
  display_order: number;
}

export default function AdminProgramsManager() {
  const [selectedDept, setSelectedDept] = useState('cs');
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProgramItem | null>(null);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('undergraduate');
  const [duration, setDuration] = useState('4 Years (8 Semesters)');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ProgramItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPrograms = async () => {
    setLoading(true);
    const data = await cmsService.getPrograms();
    if (data.length > 0) {
      setPrograms(data.filter((p: any) => p.department === selectedDept || !p.department));
    } else {
      // Default program list
      const defaults: Record<string, ProgramItem[]> = {
        cs: [
          { id: 'pr-1', name: 'BS Computer Science', level: 'undergraduate', duration: '4 Years', description: 'Comprehensive curriculum covering algorithms, software design, AI, and systems.', image_url: '', department: 'cs', display_order: 1 },
          { id: 'pr-2', name: 'MS Computer Science', level: 'graduate', duration: '2 Years', description: 'Advanced research and specialized coursework in machine learning and computing.', image_url: '', department: 'cs', display_order: 2 },
        ],
        se: [
          { id: 'pr-3', name: 'BS Software Engineering', level: 'undergraduate', duration: '4 Years', description: 'Focus on enterprise software development, testing, and system architecture.', image_url: '', department: 'se', display_order: 1 },
        ],
        aids: [
          { id: 'pr-4', name: 'BS Artificial Intelligence', level: 'undergraduate', duration: '4 Years', description: 'Specialized degree in neural networks, machine learning, and data analytics.', image_url: '', department: 'aids', display_order: 1 },
        ],
        management: [
          { id: 'pr-5', name: 'Bachelor of Business Administration (BBA)', level: 'undergraduate', duration: '4 Years', description: 'Business strategy, finance, marketing, and organizational leadership.', image_url: '', department: 'management', display_order: 1 },
        ],
      };
      setPrograms(defaults[selectedDept] || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, [selectedDept]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setLevel('undergraduate');
    setDuration('4 Years (8 Semesters)');
    setDescription('');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ProgramItem) => {
    setEditingItem(item);
    setName(item.name);
    setLevel(item.level || 'undergraduate');
    setDuration(item.duration || '4 Years');
    setDescription(item.description || '');
    setImageUrl(item.image_url || '');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a program name.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name,
        level,
        duration,
        description,
        image_url: imageUrl,
        department: selectedDept,
        display_order: editingItem ? editingItem.display_order : programs.length + 1,
        is_visible: true,
        updated_at: new Date().toISOString(),
      };

      if (editingItem && editingItem.id && !editingItem.id.startsWith('pr-')) {
        const { error } = await supabase.from('programs').update(payload).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('programs').insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setMessage({ type: 'success', text: 'Program saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
      fetchPrograms();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save program.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (!deleteTarget.id.startsWith('pr-')) {
        const { error } = await supabase.from('programs').delete().eq('id', deleteTarget.id);
        if (error) throw error;
      }
      setPrograms((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      setMessage({ type: 'success', text: 'Program removed.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to delete program.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setImageUrl(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage Academic Programs"
        subtitle="Add and update degree programs offered by FAST-NUCES Multan departments."
        action={
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add Program to {selectedDept.toUpperCase()}
          </AdminButton>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E5E7EB] pb-3">
        {[
          { key: 'cs', label: 'Computer Science' },
          { key: 'se', label: 'Software Engineering' },
          { key: 'aids', label: 'AI & Data Science' },
          { key: 'management', label: 'Management Sciences' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSelectedDept(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              selectedDept === tab.key
                ? 'bg-[#0093DD] text-white shadow-xs'
                : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
            }`}
          >
            {tab.label}
          </button>
        ))}
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

      {loading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center text-sm text-[#6B7280]">
          Loading degree programs...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {programs.map((item) => (
            <AdminCard key={item.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-[#1F2937]">{item.name}</h3>
                  <span className="text-xs font-semibold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded capitalize">
                    {item.duration || '4 Years'}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] mb-4">{item.description || 'No description provided.'}</p>
              </div>

              <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
                <AdminButton variant="secondary" onClick={() => handleOpenEdit(item)}>
                  Edit Details
                </AdminButton>

                <AdminButton variant="danger" onClick={() => setDeleteTarget(item)} icon={<Trash2 className="w-3.5 h-3.5" />}>
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Degree Program' : 'Add New Degree Program'}
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSave} loading={isSaving}>
              Save Program
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminFormGroup label="Program Title" required>
            <AdminInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. BS Computer Science" />
          </AdminFormGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Degree Level">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]"
              >
                <option value="undergraduate">Undergraduate (BS)</option>
                <option value="graduate">Graduate (MS / MBA)</option>
                <option value="postgraduate">Postgraduate (PhD)</option>
              </select>
            </AdminFormGroup>

            <AdminFormGroup label="Program Duration">
              <AdminInput value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="4 Years (8 Semesters)" />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Program Description / Curriculum Overview">
            <AdminTextarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Details regarding entry requirements, core subjects, and focus areas..." />
          </AdminFormGroup>

          <AdminFormGroup label="Banner Image / Prospectus Cover">
            <div className="flex gap-2">
              <AdminInput value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Upload image or paste URL https://..." />
              <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB]">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </AdminFormGroup>
        </div>
      </AdminModal>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemTitle={deleteTarget?.name}
        loading={isDeleting}
      />
    </div>
  );
}
