import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import { DeleteConfirmModal } from '../components/ui/AdminModal';
import FacultyEditModal, { type FacultyMemberData } from '../components/ui/FacultyEditModal';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Users } from 'lucide-react';

interface FacultyMember extends FacultyMemberData {
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
  const [editingItem, setEditingItem] = useState<Partial<FacultyMember> | null>(null);
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

  const handleSaveModal = async (savedData: FacultyMemberData) => {
    setIsSaving(true);
    try {
      const newItem: FacultyMember = {
        id: savedData.id || editingItem?.id || `${selectedDept}-fac-${Date.now()}`,
        name: savedData.name?.trim() || '',
        designation: savedData.designation || (savedData.isHOD ? 'Head of Department' : 'Lecturer'),
        qualification: savedData.qualification || '',
        biography: savedData.biography || savedData.introduction || '',
        photo_url: savedData.photo_url || savedData.photoUrl || '',
        photoUrl: savedData.photo_url || savedData.photoUrl || '',
        badge_photo_url: savedData.badge_photo_url || savedData.badgePhotoUrl || '',
        badgePhotoUrl: savedData.badgePhotoUrl || savedData.badge_photo_url || '',
        email: savedData.email || '',
        phone: savedData.phone || '',
        extension: savedData.extension || '',
        education: savedData.education || '',
        publications: savedData.publications || '',
        collaborations: savedData.collaborations || '',
        funded_projects: savedData.funded_projects || savedData.fundedProjects || '',
        fundedProjects: savedData.fundedProjects || savedData.funded_projects || '',
        slug: savedData.slug || '',
        school: selectedDept === 'management' ? 'management' : 'computing',
        department: selectedDept,
        display_order: savedData.display_order ?? (savedData.isHOD ? 0 : facultyList.length + 1),
        visible: savedData.visible ?? savedData.is_visible ?? true,
        is_visible: savedData.visible ?? savedData.is_visible ?? true,
        isHOD: !!savedData.isHOD,
      };

      const updatedList = [...facultyList];
      const existingIdx = updatedList.findIndex((f) => f.id === newItem.id);

      if (existingIdx >= 0) {
        updatedList[existingIdx] = { ...updatedList[existingIdx], ...newItem };
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
          if (newItem.id && !newItem.id.startsWith('cs-fac-') && !newItem.id.startsWith('mgmt-fac-')) {
            await supabase.from('faculty').update(payload).eq('id', newItem.id);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {facultyList.map((fac) => {
            const photo = fac.photo_url || fac.photoUrl;
            return (
              <AdminCard key={fac.id} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {photo ? (
                        <img src={photo} alt={fac.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#9CA3AF]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {fac.isHOD && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                            HEAD / HOD
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800 truncate">
                          {fac.designation}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-[#1F2937] mt-1 truncate">{fac.name}</h3>
                      <p className="text-xs text-[#6B7280] line-clamp-1">{fac.qualification}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F3F4F6] flex flex-wrap items-center justify-end gap-2">
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

      {/* Edit Modal Reused Component */}
      <FacultyEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingItem}
        loading={isSaving}
      />

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

