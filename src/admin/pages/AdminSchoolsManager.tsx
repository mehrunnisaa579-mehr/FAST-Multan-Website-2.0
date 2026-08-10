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
import { Plus, Trash2, CheckCircle2, AlertCircle, Upload, ArrowUp, ArrowDown } from 'lucide-react';

interface SchoolItem {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  href: string;
  display_order: number;
  is_visible: boolean;
}

export default function AdminSchoolsManager() {
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SchoolItem | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [href, setHref] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<SchoolItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSchools = async () => {
    setLoading(true);
    const data = await cmsService.getSchools();
    if (data.length > 0) {
      setSchools(data);
    } else {
      // Fallback initial schools
      setSchools([
        { id: 'sc-1', name: 'FAST School of Computing', description: 'Computer Science, Software Engineering, AI & Data Science', icon_url: '', href: '/departments/computing', display_order: 1, is_visible: true },
        { id: 'sc-2', name: 'FAST School of Management', description: 'Business Administration & Management Sciences', icon_url: '', href: '/departments/management', display_order: 2, is_visible: true },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setIconUrl('');
    setHref('/departments');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SchoolItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description || '');
    setIconUrl(item.icon_url || '');
    setHref(item.href || '/departments');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a school name.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name,
        description,
        icon_url: iconUrl,
        href,
        display_order: editingItem ? editingItem.display_order : schools.length + 1,
        is_visible: true,
        updated_at: new Date().toISOString(),
      };

      if (editingItem && editingItem.id && !editingItem.id.startsWith('sc-')) {
        const { error } = await supabase.from('schools').update(payload).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('schools').insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setMessage({ type: 'success', text: 'School saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
      fetchSchools();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save school.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (!deleteTarget.id.startsWith('sc-')) {
        const { error } = await supabase.from('schools').delete().eq('id', deleteTarget.id);
        if (error) throw error;
      }
      setSchools((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
      setMessage({ type: 'success', text: 'School removed.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to delete school.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setIconUrl(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage Schools & Departments"
        subtitle="Add, edit, reorder, and upload icons for university schools and department cards."
        action={
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add New School
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

      {loading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center text-sm text-[#6B7280]">
          Loading schools...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {schools.map((item, idx) => (
            <AdminCard key={item.id} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-[#1F2937]">{item.name}</h3>
                  <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                    Order #{idx + 1}
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
        title={editingItem ? 'Edit School Card' : 'Add New School Card'}
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSave} loading={isSaving}>
              Save School
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminFormGroup label="School Name" required>
            <AdminInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. FAST School of Computing" />
          </AdminFormGroup>

          <AdminFormGroup label="Short Overview / Description">
            <AdminTextarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief summary of programs offered..." />
          </AdminFormGroup>

          <AdminFormGroup label="Destination Link URL">
            <AdminInput value={href} onChange={(e) => setHref(e.target.value)} placeholder="/departments/computing" />
          </AdminFormGroup>

          <AdminFormGroup label="School Icon / Logo Upload">
            <div className="flex gap-2">
              <AdminInput value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="Upload file or paste image URL https://..." />
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
