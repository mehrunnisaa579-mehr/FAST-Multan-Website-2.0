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
  photoUrl?: string;
  badge_photo_url?: string;
  badgePhotoUrl?: string;
  school: string;
  department: string;
  research_interests?: string;
  display_order: number;
  visible: boolean;
  is_visible?: boolean;
  isHOD?: boolean;
}

export default function AdminFacultyManager() {
  const [selectedDept, setSelectedDept] = useState<'cs' | 'management'>('cs');
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
    const data = await cmsService.getDepartmentFaculty(selectedDept);
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
      qualification: selectedDept === 'cs' ? 'Ph.D. in Computer Science' : 'Ph.D. in Management Sciences',
      biography: '',
      photo_url: '',
      school: selectedDept === 'management' ? 'management' : 'computing',
      department: selectedDept,
      display_order: facultyList.length + 1,
      visible: true,
      isHOD: false,
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
      const newItem: FacultyMember = {
        id: editingItem.id || `${selectedDept}-fac-${Date.now()}`,
        name: editingItem.name.trim(),
        designation: editingItem.designation || (editingItem.isHOD ? 'Head of Department' : 'Lecturer'),
        qualification: editingItem.qualification || '',
        biography: editingItem.biography || (editingItem as any).introduction || '',
        photo_url: editingItem.photo_url || (editingItem as any).photoUrl || '',
        photoUrl: editingItem.photo_url || (editingItem as any).photoUrl || '',
        badge_photo_url: (editingItem as any).badge_photo_url || (editingItem as any).badgePhotoUrl || '',
        badgePhotoUrl: (editingItem as any).badgePhotoUrl || (editingItem as any).badge_photo_url || '',
        school: selectedDept === 'management' ? 'management' : 'computing',
        department: selectedDept,
        display_order: editingItem.display_order ?? (editingItem.isHOD ? 0 : facultyList.length + 1),
        visible: editingItem.visible ?? editingItem.is_visible ?? true,
        isHOD: !!editingItem.isHOD,
      };

      const updatedList = [...facultyList];
      const existingIdx = updatedList.findIndex((f) => f.id === newItem.id);

      if (existingIdx >= 0) {
        updatedList[existingIdx] = { ...updatedList[existingIdx], ...editingItem, ...newItem };
      } else {
        updatedList.push(newItem);
      }

      const res = await cmsService.saveDepartmentFaculty(selectedDept, updatedList);
      if (!res.success) throw new Error(res.error);

      // Attempt background database update if Supabase table is active
      try {
        if (!newItem.isHOD) {
          const payload = {
            name: newItem.name,
            designation: newItem.designation,
            qualification: newItem.qualification,
            biography: newItem.biography,
            photo_url: newItem.photo_url,
            school: newItem.school,
            department: newItem.department,
            display_order: newItem.display_order,
            visible: newItem.visible,
            updated_at: new Date().toISOString(),
          };
          if (editingItem.id && !editingItem.id.startsWith('cs-fac-') && !editingItem.id.startsWith('mgmt-fac-')) {
            await supabase.from('faculty').update(payload).eq('id', editingItem.id);
          } else {
            await supabase.from('faculty').insert([payload]);
          }
        }
      } catch {
        // Safe fallback ignoring database table errors
      }

      setIsModalOpen(false);
      setMessage({ type: 'success', text: 'Faculty profile saved successfully.' });
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

    if (deleteTarget.isHOD) {
      alert('Department Head / HOD profile is managed via the Department Page Editor and cannot be deleted from the faculty list.');
      setDeleteTarget(null);
      return;
    }

    setIsDeleting(true);
    try {
      const updatedList = facultyList.filter((f) => f.id !== deleteTarget.id);
      const res = await cmsService.saveDepartmentFaculty(selectedDept, updatedList);
      if (!res.success) throw new Error(res.error);

      try {
        await supabase.from('faculty').delete().eq('id', deleteTarget.id);
      } catch {
        // Safe fallback
      }

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
      setEditingItem((prev) => ({ ...prev, photo_url: res.publicUrl, photoUrl: res.publicUrl }));
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1300px]">
      <AdminPageHeader
        title="Manage Department Faculty"
        subtitle="Select a department to manage HOD and faculty member profiles, designations, and qualifications."
        action={
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add Faculty Member
          </AdminButton>
        }
      />

      {/* Department Tabs - ONLY CS and Management */}
      <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] pb-3">
        {[
          { id: 'cs', label: 'Computer Science (CS)' },
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
            Add a faculty profile to customize live department faculty!
          </p>
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add First Faculty Member
          </AdminButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {facultyList.map((fac) => {
            const photo = fac.photo_url || fac.photoUrl;
            return (
              <AdminCard key={fac.id} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {photo ? (
                        <img src={photo} alt={fac.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-6 h-6 text-[#9CA3AF]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {fac.isHOD && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                            HEAD / HOD
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                          {fac.designation}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#1F2937] mt-1">{fac.name}</h3>
                      <p className="text-xs text-[#6B7280]">{fac.qualification}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-end gap-2">
                  <AdminButton variant="secondary" onClick={() => handleOpenEdit(fac)} icon={<Edit2 className="w-3.5 h-3.5" />}>
                    Edit
                  </AdminButton>
                  {fac.isHOD ? (
                    <span
                      className="text-[11px] font-semibold text-gray-400 bg-gray-50 border border-gray-200 rounded px-2.5 py-1 select-none"
                      title="Department HOD profile is managed via Department Page Editor"
                    >
                      HOD Card
                    </span>
                  ) : (
                    <AdminButton variant="danger" onClick={() => setDeleteTarget(fac)} icon={<Trash2 className="w-3.5 h-3.5" />}>
                      Delete
                    </AdminButton>
                  )}
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? (editingItem.isHOD ? 'Edit Department Head / HOD Profile' : 'Edit Faculty Profile') : 'Add Faculty Member'}
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
        <div className="space-y-6">
          {/* BASIC INFORMATION */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Full Name" required>
                <AdminInput
                  value={editingItem?.name || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Dr. [Faculty Name]"
                />
              </AdminFormGroup>
              <AdminFormGroup label="Designation">
                <AdminInput
                  value={editingItem?.designation || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, designation: e.target.value }))}
                  placeholder="Assistant Professor / Lecturer"
                />
              </AdminFormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Qualification / Degree">
                <AdminInput
                  value={editingItem?.qualification || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, qualification: e.target.value }))}
                  placeholder="Ph.D. / M.S. Computer Science"
                />
              </AdminFormGroup>

              <AdminFormGroup label="Profile Slug (Optional)">
                <AdminInput
                  value={(editingItem as any)?.slug || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, slug: e.target.value } as any))}
                  placeholder="dr-faculty-name"
                />
              </AdminFormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Main Profile Image (Rectangular Frame)">
                <div className="flex gap-2 items-center">
                  <AdminInput
                    value={editingItem?.photo_url || (editingItem as any)?.photoUrl || ''}
                    onChange={(e) => setEditingItem((prev) => ({ ...prev, photo_url: e.target.value, photoUrl: e.target.value }))}
                    placeholder="Main photo URL..."
                  />
                  <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB]">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </AdminFormGroup>

              <AdminFormGroup label="Circular Badge Image (Overlapping Frame)">
                <div className="flex gap-2 items-center">
                  <AdminInput
                    value={(editingItem as any)?.badge_photo_url || (editingItem as any)?.badgePhotoUrl || ''}
                    onChange={(e) => setEditingItem((prev) => ({ ...prev, badge_photo_url: e.target.value, badgePhotoUrl: e.target.value } as any))}
                    placeholder="Badge photo URL (Optional)..."
                  />
                  <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB]">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const res = await cmsService.uploadMedia(file);
                        if (res.success && res.publicUrl) {
                          setEditingItem((prev) => ({ ...prev, badge_photo_url: res.publicUrl, badgePhotoUrl: res.publicUrl } as any));
                        }
                      }}
                    />
                  </label>
                </div>
              </AdminFormGroup>
            </div>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AdminFormGroup label="Email">
                <AdminInput
                  value={(editingItem as any)?.email || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, email: e.target.value } as any))}
                  placeholder="faculty@multan.nu.edu.pk"
                />
              </AdminFormGroup>

              <AdminFormGroup label="Phone">
                <AdminInput
                  value={(editingItem as any)?.phone || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, phone: e.target.value } as any))}
                  placeholder="+92 (61) 111-128-128"
                />
              </AdminFormGroup>

              <AdminFormGroup label="Extension">
                <AdminInput
                  value={(editingItem as any)?.extension || ''}
                  onChange={(e) => setEditingItem((prev) => ({ ...prev, extension: e.target.value } as any))}
                  placeholder="205"
                />
              </AdminFormGroup>
            </div>
          </div>

          {/* PROFILE CONTENT */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Profile Content</h4>
            <AdminFormGroup label="Introduction / Biography">
              <AdminTextarea
                rows={4}
                value={editingItem?.biography || (editingItem as any)?.introduction || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, biography: e.target.value, introduction: e.target.value }))}
                placeholder="Faculty member biography and academic background..."
              />
            </AdminFormGroup>

            <AdminFormGroup label="Education">
              <AdminTextarea
                rows={3}
                value={(editingItem as any)?.education || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, education: e.target.value } as any))}
                placeholder="Ph.D. in Computer Science (University, Year)..."
              />
            </AdminFormGroup>
          </div>

          {/* ACADEMIC DETAILS */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Academic Details</h4>
            <AdminFormGroup label="Publications">
              <AdminTextarea
                rows={4}
                value={(editingItem as any)?.publications || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, publications: e.target.value } as any))}
                placeholder="List of journal articles, conference papers, and patents..."
              />
            </AdminFormGroup>

            <AdminFormGroup label="Collaborations at National and International Level">
              <AdminTextarea
                rows={4}
                value={(editingItem as any)?.collaborations || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, collaborations: e.target.value } as any))}
                placeholder="Joint research initiatives, university collaborations..."
              />
            </AdminFormGroup>

            <AdminFormGroup label="Detail of Funded Projects">
              <AdminTextarea
                rows={4}
                value={(editingItem as any)?.funded_projects || (editingItem as any)?.fundedProjects || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, funded_projects: e.target.value, fundedProjects: e.target.value } as any))}
                placeholder="HEC grants, industry sponsored projects, research funding..."
              />
            </AdminFormGroup>
          </div>

          {/* SETTINGS */}
          <div className="pt-2">
            <AdminToggle
              label="Visible on Website"
              checked={editingItem?.visible ?? editingItem?.is_visible ?? true}
              onChange={(checked) => setEditingItem((prev) => ({ ...prev, visible: checked, is_visible: checked }))}
            />
          </div>
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
