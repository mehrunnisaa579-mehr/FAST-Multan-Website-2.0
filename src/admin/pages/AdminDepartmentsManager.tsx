import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { adminOfficesList, initialStaffMembers } from '../../data/staffData';
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowUp,
  ArrowDown,
  Edit2,
  ChevronDown,
  ChevronRight,
  User,
  GraduationCap,
  Users,
} from 'lucide-react';

interface DepartmentItem {
  id: string;
  name: string;
  short_name?: string;
  school_id?: string;
  school_name?: string;
  code?: string;
  description?: string;
  icon_url?: string;
  hero_title?: string;
  hero_image_url?: string;
  hod_name?: string;
  hod_designation?: string;
  hod_message?: string;
  hod_photo_url?: string;
  display_order: number;
  is_visible: boolean;
}

interface AdminStaffItem {
  id: string;
  slug: string;
  name: string;
  designation: string;
  office: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  extension?: string;
  introduction?: string;
  education?: string;
  display_order: number;
  is_visible: boolean;
}

export default function AdminDepartmentsManager() {
  const [activeTab, setActiveTab] = useState<'departments' | 'admin-staff'>('departments');
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<DepartmentItem> | null>(null);

  // Admin Staff State
  const [staffList, setStaffList] = useState<AdminStaffItem[]>([]);
  const [offices, setOffices] = useState<{ id: string; title: string }[]>(
    adminOfficesList.map((o) => ({ id: o.id, title: o.title }))
  );
  const [selectedOffice, setSelectedOffice] = useState<string>('admin-office');
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Partial<AdminStaffItem> | null>(null);
  const [isSavingStaff, setIsSavingStaff] = useState(false);

  // Accordion expansion in editor modal
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    basic: true,
    hero: false,
    hod: false,
    programs: false,
    faculty: false,
    research: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DepartmentItem | null>(null);
  const [deleteStaffTarget, setDeleteStaffTarget] = useState<AdminStaffItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDepartmentsData = async () => {
    setLoading(true);
    const deptsData = await cmsService.getDepartments();
    const schoolsData = await cmsService.getSchools();
    const staffDataFromDb = await cmsService.getAdminStaff();
    const savedOffices = await cmsService.getSetting<any[]>('admin_offices_list', []);
    setSchools(schoolsData);

    if (savedOffices && savedOffices.length > 0) {
      setOffices(savedOffices.map((o: any) => ({ id: o.id, title: o.title || o.label || o.id })));
    }

    if (deptsData.length > 0) {
      setDepartments(deptsData);
    } else {
      setDepartments([
        {
          id: 'dept-1',
          name: 'Department of Computer Science',
          short_name: 'CS',
          code: 'CS',
          school_name: 'FAST School of Computing',
          description: 'Delivering world-class computing education, software design, and AI research.',
          hero_title: 'Department Of Computer Science',
          hod_name: 'Dr. Head of Department',
          hod_designation: 'Head of Department (CS)',
          hod_message: 'Welcome to the Department of Computer Science at FAST-NUCES Multan Campus.',
          display_order: 1,
          is_visible: true,
        },
        {
          id: 'dept-2',
          name: 'Department of Software Engineering',
          short_name: 'SE',
          code: 'SE',
          school_name: 'FAST School of Computing',
          description: 'Focusing on software development methodologies, quality assurance, and architecture.',
          hero_title: 'Department Of Software Engineering',
          hod_name: 'Dr. Head of Department',
          hod_designation: 'Head of Department (SE)',
          hod_message: 'Welcome to the Department of Software Engineering.',
          display_order: 2,
          is_visible: true,
        },
        {
          id: 'dept-3',
          name: 'Department of Artificial Intelligence & Data Science',
          short_name: 'AI & DS',
          code: 'AIDS',
          school_name: 'FAST School of Computing',
          description: 'Specialized degree in machine learning, deep neural networks, and big data analytics.',
          hero_title: 'Department Of Artificial Intelligence & Data Science',
          hod_name: 'Dr. Head of Department',
          hod_designation: 'Head of Department (AI & DS)',
          hod_message: 'Welcome to the Department of AI & Data Science.',
          display_order: 3,
          is_visible: true,
        },
        {
          id: 'dept-4',
          name: 'Department of Management Sciences',
          short_name: 'Management',
          code: 'MGMT',
          school_name: 'FAST School of Management',
          description: 'Business administration, strategic leadership, and corporate finance.',
          hero_title: 'Department Of Management Sciences',
          hod_name: 'Dr. Head of Department',
          hod_designation: 'Head of Department (Management)',
          hod_message: 'Welcome to the Department of Management Sciences.',
          display_order: 4,
          is_visible: true,
        },
      ]);
    }

    if (staffDataFromDb && staffDataFromDb.length > 0) {
      setStaffList(staffDataFromDb);
    } else {
      // Use initial 6 placeholders per office
      setStaffList(
        initialStaffMembers.map((s) => ({
          id: s.id,
          slug: s.slug,
          name: s.name,
          designation: s.designation,
          office: s.office,
          photo_url: s.photoUrl || '',
          email: s.email || '',
          phone: s.phone || '',
          extension: s.extension || '',
          introduction: s.introduction || '',
          education: s.education || '',
          display_order: s.display_order || 1,
          is_visible: true,
        }))
      );
    }
    setLoading(false);
  };

  const [searchParams] = useSearchParams();
  const deptParam = searchParams.get('dept')?.toLowerCase();

  useEffect(() => {
    fetchDepartmentsData();
  }, []);

  useEffect(() => {
    if (departments.length > 0 && deptParam) {
      const match = departments.find((d) => {
        const code = (d.code || d.short_name || '').toLowerCase();
        const name = (d.name || '').toLowerCase();
        if (deptParam === 'cs') return code === 'cs' || name.includes('computer science');
        if (deptParam === 'se') return code === 'se' || name.includes('software engineering');
        if (deptParam === 'ai' || deptParam === 'aids') return code === 'aids' || code === 'ai' || name.includes('artificial intelligence');
        return false;
      });
      if (match) {
        setEditingItem({ ...match });
        setIsModalOpen(true);
      }
    }
  }, [departments, deptParam]);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOpenAdd = () => {
    setEditingItem({
      name: '',
      short_name: '',
      code: 'NEW',
      description: '',
      hero_title: 'Department Of ...',
      hero_image_url: '',
      hod_name: 'Dr. Head of Department',
      hod_designation: 'Head of Department',
      hod_message: '',
      hod_photo_url: '',
      display_order: departments.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: DepartmentItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      callback(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newList = [...departments];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setDepartments(newList);
  };

  const handleSave = async () => {
    if (!editingItem?.name?.trim()) {
      alert('Please enter a department name.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: editingItem.name.trim(),
        short_name: editingItem.short_name || '',
        code: editingItem.code || 'DEPT',
        school_id: editingItem.school_id || null,
        description: editingItem.description || '',
        icon_url: editingItem.icon_url || '',
        hero_title: editingItem.hero_title || `Department Of ${editingItem.name}`,
        hero_image_url: editingItem.hero_image_url || '',
        hod_name: editingItem.hod_name || '',
        hod_designation: editingItem.hod_designation || 'Head of Department',
        hod_message: editingItem.hod_message || '',
        hod_photo_url: editingItem.hod_photo_url || '',
        display_order: editingItem.display_order || 1,
        is_visible: editingItem.is_visible ?? true,
        updated_at: new Date().toISOString(),
      };

      if (editingItem.id && !editingItem.id.startsWith('dept-')) {
        const { error } = await supabase.from('departments').update(payload).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('departments').insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setMessage({ type: 'success', text: 'Department details saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
      fetchDepartmentsData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save department details.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Staff CRUD Handlers
  const handleOpenAddStaff = () => {
    const num = staffList.filter((s) => s.office === selectedOffice).length + 1;
    const slug = `${selectedOffice}-staff-${Date.now()}`;
    setEditingStaff({
      slug,
      name: `New Staff Member ${num}`,
      designation: 'Office Executive',
      office: selectedOffice,
      photo_url: '',
      email: `${slug}@multan.nu.edu.pk`,
      phone: '+92 (61) 111-128-128',
      extension: '100',
      introduction: 'Staff member introduction text...',
      education: 'Bachelor / Master Degree',
      display_order: num,
      is_visible: true,
    });
    setIsStaffModalOpen(true);
  };

  const handleOpenEditStaff = (staffMember: AdminStaffItem) => {
    setEditingStaff({ ...staffMember });
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = async () => {
    if (!editingStaff?.name?.trim()) {
      alert('Please enter a staff member name.');
      return;
    }

    setIsSavingStaff(true);
    try {
      const slug = editingStaff.slug || editingStaff.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = {
        slug,
        name: editingStaff.name.trim(),
        designation: editingStaff.designation || 'Staff Member',
        office: editingStaff.office || selectedOffice,
        photo_url: editingStaff.photo_url || '',
        email: editingStaff.email || '',
        phone: editingStaff.phone || '',
        extension: editingStaff.extension || '',
        introduction: editingStaff.introduction || '',
        education: editingStaff.education || '',
        display_order: editingStaff.display_order || 1,
        is_visible: editingStaff.is_visible ?? true,
        updated_at: new Date().toISOString(),
      };

      if (editingStaff.id && !editingStaff.id.startsWith(`${selectedOffice}-staff-`)) {
        const { error } = await supabase.from('administration_staff').update(payload).eq('id', editingStaff.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('administration_staff').upsert([payload], { onConflict: 'slug' });
        if (error) throw error;
      }

      setIsStaffModalOpen(false);
      setMessage({ type: 'success', text: 'Staff member saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
      fetchDepartmentsData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save staff member.' });
    } finally {
      setIsSavingStaff(false);
    }
  };

  const handleDeleteStaff = async () => {
    if (!deleteStaffTarget) return;
    setIsDeleting(true);
    try {
      if (!deleteStaffTarget.id.includes('-staff-')) {
        const { error } = await supabase.from('administration_staff').delete().eq('id', deleteStaffTarget.id);
        if (error) throw error;
      }
      setStaffList((prev) => prev.filter((s) => s.id !== deleteStaffTarget.id));
      setDeleteStaffTarget(null);
      setMessage({ type: 'success', text: 'Staff member deleted.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to delete staff member.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1300px]">
      <AdminPageHeader
        title="Manage Departments & Administration Staff"
        subtitle="Manage academic departments, HOD messages, degree programs, and administration staff offices."
        action={
          activeTab === 'departments' ? (
            <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
              Add Department
            </AdminButton>
          ) : (
            <AdminButton variant="primary" onClick={handleOpenAddStaff} icon={<Plus className="w-4 h-4" />}>
              Add Staff Member
            </AdminButton>
          )
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] space-x-4">
        <button
          type="button"
          onClick={() => setActiveTab('departments')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'departments'
              ? 'border-[#0093DD] text-[#0093DD]'
              : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academic Departments</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admin-staff')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'admin-staff'
              ? 'border-[#0093DD] text-[#0093DD]'
              : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Administration Staff</span>
        </button>
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

      {/* TAB 1: ACADEMIC DEPARTMENTS */}
      {activeTab === 'departments' && (
        <>
          {loading ? (
            <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center text-sm text-[#6B7280]">
              Loading departments...
            </div>
          ) : (
            <div className="space-y-4">
              {departments.map((item, idx) => (
                <AdminCard key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center flex-shrink-0 font-bold border border-[#E5E7EB]">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                          Order #{idx + 1}
                        </span>
                        <span className="text-xs text-[#6B7280]">{item.school_name || 'FAST School of Computing'}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#1F2937]">{item.name}</h3>
                      <p className="text-xs text-[#6B7280] line-clamp-1 mt-0.5">{item.description}</p>
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
                      disabled={idx === departments.length - 1}
                      className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <AdminButton variant="secondary" onClick={() => handleOpenEdit(item)} icon={<Edit2 className="w-4 h-4" />}>
                      Edit
                    </AdminButton>

                    <AdminButton variant="danger" onClick={() => setDeleteTarget(item)} icon={<Trash2 className="w-4 h-4" />}>
                      Delete
                    </AdminButton>
                  </div>
                </AdminCard>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: ADMINISTRATION STAFF BY OFFICE */}
      {activeTab === 'admin-staff' && (
        <div className="space-y-6">
          {/* Office Selector Filter Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] pb-3">
            {offices.map((off) => (
              <button
                key={off.id}
                type="button"
                onClick={() => setSelectedOffice(off.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  selectedOffice === off.id
                    ? 'bg-[#0093DD] text-white shadow-xs'
                    : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
                }`}
              >
                {off.title}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {staffList
              .filter((s) => s.office === selectedOffice)
              .map((staffMember, idx) => (
                <AdminCard key={staffMember.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-16 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex items-center justify-center flex-shrink-0">
                      {staffMember.photo_url ? (
                        <img src={staffMember.photo_url} alt={staffMember.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-[#9CA3AF]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                          Position #{idx + 1}
                        </span>
                        <span className="text-xs text-[#6B7280]">{staffMember.email}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#1F2937]">{staffMember.name}</h3>
                      <p className="text-xs text-[#6B7280] mt-0.5">{staffMember.designation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <AdminButton variant="secondary" onClick={() => handleOpenEditStaff(staffMember)} icon={<Edit2 className="w-4 h-4" />}>
                      Edit Staff Member
                    </AdminButton>
                    <AdminButton variant="danger" onClick={() => setDeleteStaffTarget(staffMember)} icon={<Trash2 className="w-4 h-4" />}>
                      Delete
                    </AdminButton>
                  </div>
                </AdminCard>
              ))}
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? `Edit ${editingItem.name}` : 'Add New Department'}
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSave} loading={isSaving}>
              Save Department
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <AdminFormGroup label="Department Full Name" required>
            <AdminInput
              value={editingItem?.name || ''}
              onChange={(e) => setEditingItem((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Department of Computer Science"
            />
          </AdminFormGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Short Code / Name">
              <AdminInput
                value={editingItem?.short_name || editingItem?.code || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, short_name: e.target.value, code: e.target.value }))}
                placeholder="e.g. CS"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Assigned School">
              <select
                value={editingItem?.school_id || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, school_id: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]"
              >
                <option value="">FAST School of Computing</option>
                <option value="school-mgmt">FAST School of Management</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Department Overview / Description">
            <AdminTextarea
              rows={3}
              value={editingItem?.description || ''}
              onChange={(e) => setEditingItem((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide overview description for this department..."
            />
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Website"
            checked={editingItem?.is_visible ?? true}
            onChange={(checked) => setEditingItem((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      {/* Edit Staff Modal */}
      <AdminModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        title={editingStaff?.id ? 'Edit Administration Staff Member' : 'Add Administration Staff Member'}
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsStaffModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveStaff} loading={isSavingStaff}>
              Save Staff Member
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <AdminFormGroup label="Full Name" required>
            <AdminInput
              value={editingStaff?.name || ''}
              onChange={(e) => setEditingStaff((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Full Name"
            />
          </AdminFormGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Designation / Role">
              <AdminInput
                value={editingStaff?.designation || ''}
                onChange={(e) => setEditingStaff((prev) => ({ ...prev, designation: e.target.value }))}
                placeholder="e.g. Officer / Manager"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Assigned Office">
              <select
                value={editingStaff?.office || selectedOffice}
                onChange={(e) => setEditingStaff((prev) => ({ ...prev, office: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]"
              >
                {offices.map((off) => (
                  <option key={off.id} value={off.id}>
                    {off.title}
                  </option>
                ))}
              </select>
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Staff Photograph Upload">
            <div className="flex items-center gap-3">
              <div className="w-16 h-20 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {editingStaff?.photo_url ? (
                  <img src={editingStaff.photo_url} alt="Staff Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{editingStaff?.photo_url ? 'Replace Photo' : 'Upload Photo'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setEditingStaff((prev) => ({ ...prev, photo_url: url })))} />
                </label>

                {editingStaff?.photo_url && (
                  <button
                    type="button"
                    onClick={() => setEditingStaff((prev) => ({ ...prev, photo_url: '' }))}
                    className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdminFormGroup label="Email Address">
              <AdminInput
                value={editingStaff?.email || ''}
                onChange={(e) => setEditingStaff((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="name@multan.nu.edu.pk"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Phone Number">
              <AdminInput
                value={editingStaff?.phone || ''}
                onChange={(e) => setEditingStaff((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+92 (61) 111-128-128"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Extension">
              <AdminInput
                value={editingStaff?.extension || ''}
                onChange={(e) => setEditingStaff((prev) => ({ ...prev, extension: e.target.value }))}
                placeholder="101"
              />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Introduction / Biography">
            <AdminTextarea
              rows={3}
              value={editingStaff?.introduction || ''}
              onChange={(e) => setEditingStaff((prev) => ({ ...prev, introduction: e.target.value }))}
              placeholder="Staff member biography and role overview..."
            />
          </AdminFormGroup>

          <AdminFormGroup label="Education / Qualifications">
            <AdminInput
              value={editingStaff?.education || ''}
              onChange={(e) => setEditingStaff((prev) => ({ ...prev, education: e.target.value }))}
              placeholder="e.g. Master Degree / Bachelor Degree in relevant field"
            />
          </AdminFormGroup>
        </div>
      </AdminModal>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {}}
        itemTitle={deleteTarget?.name}
      />

      <DeleteConfirmModal
        isOpen={!!deleteStaffTarget}
        onClose={() => setDeleteStaffTarget(null)}
        onConfirm={handleDeleteStaff}
        itemTitle={deleteStaffTarget?.name}
      />
    </div>
  );
}
