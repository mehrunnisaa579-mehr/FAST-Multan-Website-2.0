import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import AdminToggle from '../components/ui/AdminToggle';
import AdminModal, { DeleteConfirmModal } from '../components/ui/AdminModal';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, Users } from 'lucide-react';

interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  biography: string;
  photo_url: string;
  school: string;
  department: string;
  research_interests: string;
  display_order: number;
  visible: boolean;
}

export default function AdminFacultyManager() {
  const [selectedDept, setSelectedDept] = useState<'cs' | 'se' | 'ai' | 'management'>('cs');
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<FacultyMember>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<FacultyMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchFaculty = async () => {
    setLoading(true);
    const data = await cmsService.getFaculty(selectedDept);
    setFacultyList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFaculty();
  }, [selectedDept]);

  const handleOpenAdd = () => {
    setEditingItem({
      name: '',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. in Computer Science',
      biography: '',
      photo_url: '',
      school: selectedDept === 'management' ? 'management' : 'computing',
      department: selectedDept,
      display_order: facultyList.length + 1,
      visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FacultyMember) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingItem?.name?.trim()) {
      alert('Please enter faculty member name.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: editingItem.name.trim(),
        designation: editingItem.designation || 'Lecturer',
        qualification: editingItem.qualification || '',
        biography: editingItem.biography || '',
        photo_url: editingItem.photo_url || '',
        school: selectedDept === 'management' ? 'management' : 'computing',
        department: selectedDept,
        display_order: editingItem.display_order || 1,
        visible: editingItem.visible ?? true,
        updated_at: new Date().toISOString(),
      };

      if (editingItem.id) {
        const { error } = await supabase.from('faculty').update(payload).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('faculty').insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setMessage({ type: 'success', text: 'Faculty member saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
      fetchFaculty();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save faculty record.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('faculty').delete().eq('id', deleteTarget.id);
      if (error) throw error;

      setDeleteTarget(null);
      setMessage({ type: 'success', text: 'Faculty record deleted.' });
      setTimeout(() => setMessage(null), 4000);
      fetchFaculty();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to delete record.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setEditingItem((prev) => ({ ...prev, photo_url: res.publicUrl }));
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1300px]">
      <AdminPageHeader
        title="Manage Department Faculty"
        subtitle="Select a department to manage faculty member profiles, designations, and qualifications."
        action={
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add Faculty Member
          </AdminButton>
        }
      />

      {/* Department Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] pb-3">
        {[
          { id: 'cs', label: 'Computer Science (CS)' },
          { id: 'se', label: 'Software Engineering (SE)' },
          { id: 'ai', label: 'Artificial Intelligence (AI)' },
          { id: 'management', label: 'School of Management' },
        ].map((dept) => (
          <button
            key={dept.id}
            type="button"
            onClick={() => setSelectedDept(dept.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              selectedDept === dept.id
                ? 'bg-[#0093DD] text-white shadow-xs'
                : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
            }`}
          >
            {dept.label}
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

      {/* Faculty Cards Grid */}
      {loading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center text-sm text-[#6B7280]">
          Loading department faculty...
        </div>
      ) : facultyList.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center">
          <p className="text-sm font-medium text-[#1F2937] mb-2">No faculty records in database for this department yet.</p>
          <p className="text-xs text-[#6B7280] mb-6">
            The public website is currently displaying standard department faculty profiles as fallback. Add a profile to customize live CMS faculty!
          </p>
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add First Faculty Member
          </AdminButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {facultyList.map((fac) => (
            <AdminCard key={fac.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {fac.photo_url ? (
                      <img src={fac.photo_url} alt={fac.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-[#9CA3AF]" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                      {fac.designation}
                    </span>
                    <h3 className="text-base font-bold text-[#1F2937] mt-1">{fac.name}</h3>
                    <p className="text-xs text-[#6B7280]">{fac.qualification}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-end gap-2">
                <AdminButton variant="secondary" onClick={() => handleOpenEdit(fac)} icon={<Edit2 className="w-3.5 h-3.5" />}>
                  Edit
                </AdminButton>
                <AdminButton variant="danger" onClick={() => setDeleteTarget(fac)} icon={<Trash2 className="w-3.5 h-3.5" />}>
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? 'Edit Faculty Profile' : 'Add Faculty Member'}
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSave} loading={isSaving}>
              Save Profile
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminFormGroup label="Full Name" required>
            <AdminInput
              value={editingItem?.name || ''}
              onChange={(e) => setEditingItem((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Dr. [Faculty Name]"
            />
          </AdminFormGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Designation">
              <AdminInput
                value={editingItem?.designation || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, designation: e.target.value }))}
                placeholder="Assistant Professor / Lecturer"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Qualification">
              <AdminInput
                value={editingItem?.qualification || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, qualification: e.target.value }))}
                placeholder="Ph.D. / M.S. Computer Science"
              />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Photo URL or Upload">
            <div className="flex gap-2 items-center">
              <AdminInput
                value={editingItem?.photo_url || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, photo_url: e.target.value }))}
                placeholder="https://..."
              />
              <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB]">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Website"
            checked={editingItem?.visible ?? true}
            onChange={(checked) => setEditingItem((prev) => ({ ...prev, visible: checked }))}
          />
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
