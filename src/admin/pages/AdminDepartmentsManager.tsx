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

export default function AdminDepartmentsManager() {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<DepartmentItem> | null>(null);

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDepartmentsData = async () => {
    setLoading(true);
    const deptsData = await cmsService.getDepartments();
    const schoolsData = await cmsService.getSchools();
    setSchools(schoolsData);

    if (deptsData.length > 0) {
      setDepartments(deptsData);
    } else {
      // Default initial departments
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
    setLoading(false);
  };

  useEffect(() => {
    fetchDepartmentsData();
  }, []);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'hero_image_url' | 'hod_photo_url' | 'icon_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setEditingItem((prev) => ({ ...prev, [field]: res.publicUrl }));
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (!deleteTarget.id.startsWith('dept-')) {
        const { error } = await supabase.from('departments').delete().eq('id', deleteTarget.id);
        if (error) throw error;
      }
      setDepartments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      setDeleteTarget(null);
      setMessage({ type: 'success', text: 'Department deleted.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to delete department.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1300px]">
      <AdminPageHeader
        title="Manage Departments"
        subtitle="Add, edit, reorder, and manage department pages, HOD messages, degree programs, and media content."
        action={
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add Department
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

      {/* Editor Modal */}
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
          {/* Section 1: Basic Info */}
          <div className="border border-[#E5E7EB] rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => toggleAccordion('basic')}
              className="w-full px-5 py-3.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between font-bold text-sm text-[#1F2937] cursor-pointer"
            >
              <span>1. Basic Information</span>
              {openAccordions.basic ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {openAccordions.basic && (
              <div className="p-4 space-y-4 border-t border-[#E5E7EB]">
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
            )}
          </div>

          {/* Section 2: Page Hero */}
          <div className="border border-[#E5E7EB] rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => toggleAccordion('hero')}
              className="w-full px-5 py-3.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between font-bold text-sm text-[#1F2937] cursor-pointer"
            >
              <span>2. Page Hero Banner</span>
              {openAccordions.hero ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {openAccordions.hero && (
              <div className="p-4 space-y-4 border-t border-[#E5E7EB]">
                <AdminFormGroup label="Hero Banner Title">
                  <AdminInput
                    value={editingItem?.hero_title || ''}
                    onChange={(e) => setEditingItem((prev) => ({ ...prev, hero_title: e.target.value }))}
                    placeholder="e.g. Department Of Computer Science"
                  />
                </AdminFormGroup>

                <AdminFormGroup label="Hero Banner Image Upload">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-14 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                      {editingItem?.hero_image_url ? (
                        <img src={editingItem.hero_image_url} alt="Hero Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-[#9CA3AF]">HERO</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <label className="px-3 py-1.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Hero Image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'hero_image_url')} />
                      </label>

                      {editingItem?.hero_image_url && (
                        <button
                          type="button"
                          onClick={() => setEditingItem((prev) => ({ ...prev, hero_image_url: '' }))}
                          className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </AdminFormGroup>
              </div>
            )}
          </div>

          {/* Section 3: HOD Message */}
          <div className="border border-[#E5E7EB] rounded-lg overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => toggleAccordion('hod')}
              className="w-full px-5 py-3.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between font-bold text-sm text-[#1F2937] cursor-pointer"
            >
              <span>3. Head of Department (HOD) Section</span>
              {openAccordions.hod ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            {openAccordions.hod && (
              <div className="p-4 space-y-4 border-t border-[#E5E7EB]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminFormGroup label="HOD Name">
                    <AdminInput
                      value={editingItem?.hod_name || ''}
                      onChange={(e) => setEditingItem((prev) => ({ ...prev, hod_name: e.target.value }))}
                      placeholder="Dr. [HOD Name]"
                    />
                  </AdminFormGroup>

                  <AdminFormGroup label="HOD Designation">
                    <AdminInput
                      value={editingItem?.hod_designation || ''}
                      onChange={(e) => setEditingItem((prev) => ({ ...prev, hod_designation: e.target.value }))}
                      placeholder="Head of Department"
                    />
                  </AdminFormGroup>
                </div>

                <AdminFormGroup label="HOD Photo Upload">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                      {editingItem?.hod_photo_url ? (
                        <img src={editingItem.hod_photo_url} alt="HOD Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-[#9CA3AF]" />
                      )}
                    </div>

                    <div className="flex gap-2">
                      <label className="px-3 py-1.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload HOD Photo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'hod_photo_url')} />
                      </label>

                      {editingItem?.hod_photo_url && (
                        <button
                          type="button"
                          onClick={() => setEditingItem((prev) => ({ ...prev, hod_photo_url: '' }))}
                          className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </AdminFormGroup>

                <AdminFormGroup label="HOD Welcome Message">
                  <AdminTextarea
                    rows={4}
                    value={editingItem?.hod_message || ''}
                    onChange={(e) => setEditingItem((prev) => ({ ...prev, hod_message: e.target.value }))}
                    placeholder="Welcome message from the HOD..."
                  />
                </AdminFormGroup>
              </div>
            )}
          </div>
        </div>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemTitle={deleteTarget?.name}
        description="Delete this department? This may also remove it from website navigation and related listings. This action cannot be undone."
        loading={isDeleting}
      />
    </div>
  );
}
