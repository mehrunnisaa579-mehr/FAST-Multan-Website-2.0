import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import AdminModal, { DeleteConfirmModal } from '../components/ui/AdminModal';
import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, CheckCircle2, AlertCircle, Upload } from 'lucide-react';

interface ResearchGroupItem {
  id: string;
  name: string;
  description: string;
  lead_name: string;
  lead_photo_url: string;
  image_url: string;
  research_areas: string;
  display_order: number;
}

export default function AdminResearchGroupsManager() {
  const [groups, setGroups] = useState<ResearchGroupItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResearchGroupItem | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadPhotoUrl, setLeadPhotoUrl] = useState('');
  const [researchAreas, setResearchAreas] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ResearchGroupItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchGroups = async () => {
    setLoading(true);
    const data = await cmsService.getResearchGroups();
    if (data.length > 0) {
      setGroups(data);
    } else {
      setGroups([
        { id: 'rg-1', name: 'Artificial Intelligence & Computer Vision Lab', description: 'Deep learning, neural networks, object detection, and autonomous vision systems.', lead_name: 'Dr. [Lead Name]', lead_photo_url: '', image_url: '', research_areas: 'Machine Learning, Computer Vision, Robotics', display_order: 1 },
        { id: 'rg-2', name: 'Cyber Security & Software Systems', description: 'Network defense, cryptography, secure coding practices, and cloud vulnerability assessment.', lead_name: 'Dr. [Lead Name]', lead_photo_url: '', image_url: '', research_areas: 'Cybersecurity, Cryptography, Cloud Security', display_order: 2 },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setLeadName('');
    setLeadPhotoUrl('');
    setResearchAreas('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ResearchGroupItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description || '');
    setLeadName(item.lead_name || '');
    setLeadPhotoUrl(item.lead_photo_url || '');
    setResearchAreas(item.research_areas || '');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a research group name.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name,
        description,
        lead_name: leadName,
        lead_photo_url: leadPhotoUrl,
        research_areas: researchAreas,
        display_order: editingItem ? editingItem.display_order : groups.length + 1,
        is_visible: true,
        updated_at: new Date().toISOString(),
      };

      if (editingItem && editingItem.id && !editingItem.id.startsWith('rg-')) {
        const { error } = await supabase.from('research_groups').update(payload).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('research_groups').insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setMessage({ type: 'success', text: 'Research group saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
      fetchGroups();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save research group.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (!deleteTarget.id.startsWith('rg-')) {
        const { error } = await supabase.from('research_groups').delete().eq('id', deleteTarget.id);
        if (error) throw error;
      }
      setGroups((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      setDeleteTarget(null);
      setMessage({ type: 'success', text: 'Research group removed.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to delete research group.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const { cropperProps, openCropper } = useImageCropper();

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback?: (url: string) => void,
    opts?: { aspectRatio?: number; cropShape?: 'rect' | 'round'; title?: string }
  ) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          if (callback) callback(res.publicUrl);
          else setLeadPhotoUrl(res.publicUrl);
        } else {
          alert(`Upload failed: ${res.error}`);
        }
      },
      opts || { aspectRatio: 3 / 4, title: 'Crop Research Lead Photo (3:4 Rectangle)' }
    );
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage Research Groups"
        subtitle="Add, edit, reorder, and upload photos for campus research labs and faculty leads."
        action={
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add Research Group
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
          Loading research groups...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {groups.map((item) => (
            <AdminCard key={item.id} className="p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1F2937] mb-1">{item.name}</h3>
                <p className="text-xs font-semibold text-[#0093DD] mb-2">Lead: {item.lead_name || 'Unassigned'}</p>
                <p className="text-xs text-[#6B7280] mb-4">{item.description || 'No overview provided.'}</p>
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
        title={editingItem ? 'Edit Research Group' : 'Add Research Group'}
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSave} loading={isSaving}>
              Save Group
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminFormGroup label="Research Group Title" required>
            <AdminInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AI & Computer Vision Lab" />
          </AdminFormGroup>

          <AdminFormGroup label="Group Lead Faculty Name">
            <AdminInput value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Dr. [Lead Name]" />
          </AdminFormGroup>

          <AdminFormGroup label="Research Lead Photo">
            <div className="flex gap-2">
              <AdminInput value={leadPhotoUrl} onChange={(e) => setLeadPhotoUrl(e.target.value)} placeholder="Upload image or paste URL https://..." />
              <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB]">
                <Upload className="w-4 h-4" />
                <span>{leadPhotoUrl ? 'Replace Photo' : 'Upload Photo'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setLeadPhotoUrl(url), { aspectRatio: 3 / 4, title: 'Crop Research Lead Photo (3:4 Rectangle)' })} />
              </label>
            </div>
          </AdminFormGroup>

          <AdminFormGroup label="Focus Areas (Comma separated)">
            <AdminInput value={researchAreas} onChange={(e) => setResearchAreas(e.target.value)} placeholder="Machine Learning, Computer Vision, Robotics" />
          </AdminFormGroup>

          <AdminFormGroup label="Lab Description & Active Projects">
            <AdminTextarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Summary of lab research activities..." />
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

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
