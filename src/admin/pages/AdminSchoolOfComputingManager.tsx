import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Eye,
  EyeOff,
  ChevronRight,
} from 'lucide-react';

interface ComputingDept {
  id: string;
  name: string;
  code: string;
  heroTitle?: string;
  heroImage?: string;
  hodName?: string;
  hodDesignation?: string;
  hodPhoto?: string;
  hodMessage?: string;
  display_order: number;
  is_visible: boolean;
}

interface DeptHeadItem {
  id: string;
  department: string;
  headName: string;
  designation: string;
  photoUrl?: string;
  display_order: number;
  is_visible: boolean;
}

export default function AdminSchoolOfComputingManager() {
  const [heroTitle, setHeroTitle] = useState('FAST School Of Computing');
  const [heroImageUrl, setHeroImageUrl] = useState('');

  // Head School of Computing
  const [headName, setHeadName] = useState('Dr. Head of School');
  const [headDesignation, setHeadDesignation] = useState('Head, FAST School of Computing');
  const [headPhotoUrl, setHeadPhotoUrl] = useState('');
  const [headMessage, setHeadMessage] = useState(
    'Welcome to the FAST School of Computing at Multan Campus. Our school offers top-tier academic degree programs in Computer Science, Software Engineering, and Artificial Intelligence & Data Science.'
  );

  // Department Heads List
  const [departmentHeads, setDepartmentHeads] = useState<DeptHeadItem[]>([
    {
      id: 'dh-cs',
      department: 'Computer Science',
      headName: 'Dr. [CS Head Name]',
      designation: 'Head, Department of Computer Science',
      photoUrl: '',
      display_order: 1,
      is_visible: true,
    },
    {
      id: 'dh-se',
      department: 'Software Engineering',
      headName: 'Dr. [SE Head Name]',
      designation: 'Head, Department of Software Engineering',
      photoUrl: '',
      display_order: 2,
      is_visible: true,
    },
    {
      id: 'dh-ai',
      department: 'AI',
      headName: 'Dr. [AI Head Name]',
      designation: 'Incharge, Department of AI',
      photoUrl: '',
      display_order: 3,
      is_visible: true,
    },
  ]);

  // Departments List
  const [computingDepts, setComputingDepts] = useState<ComputingDept[]>([
    {
      id: 'cs-dept',
      name: 'Department of Computer Science',
      code: 'CS',
      heroTitle: 'Department Of Computer Science',
      hodName: 'Dr. Head of Department',
      hodDesignation: 'Head, Department of Computer Science',
      hodMessage: 'Welcome to the Department of Computer Science at FAST-NUCES Multan Campus.',
      display_order: 1,
      is_visible: true,
    },
    {
      id: 'se-dept',
      name: 'Department of Software Engineering',
      code: 'SE',
      heroTitle: 'Department Of Software Engineering',
      hodName: 'Dr. Head of Department',
      hodDesignation: 'Head, Department of Software Engineering',
      hodMessage: 'Welcome to the Department of Software Engineering at FAST-NUCES Multan Campus.',
      display_order: 2,
      is_visible: true,
    },
    {
      id: 'ai-dept',
      name: 'Department of AI & Data Science',
      code: 'AIDS',
      heroTitle: 'Department Of Artificial Intelligence & Data Science',
      hodName: 'Dr. Head of Department',
      hodDesignation: 'Head, Department of Artificial Intelligence & Data Science',
      hodMessage: 'Welcome to the Department of Artificial Intelligence & Data Science.',
      display_order: 3,
      is_visible: true,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Partial<ComputingDept> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ComputingDept | null>(null);

  // Department Heads Modals & State
  const [isHeadModalOpen, setIsHeadModalOpen] = useState(false);
  const [editingHead, setEditingHead] = useState<Partial<DeptHeadItem> | null>(null);
  const [deleteHeadTarget, setDeleteHeadTarget] = useState<DeptHeadItem | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    const savedData = await cmsService.getSetting<any>('school_of_computing_content', null);
    if (savedData) {
      if (savedData.heroTitle) setHeroTitle(savedData.heroTitle);
      if (savedData.heroImageUrl) setHeroImageUrl(savedData.heroImageUrl);
      if (savedData.headName) setHeadName(savedData.headName);
      if (savedData.headDesignation) setHeadDesignation(savedData.headDesignation);
      if (savedData.headPhotoUrl) setHeadPhotoUrl(savedData.headPhotoUrl);
      if (savedData.headMessage) setHeadMessage(savedData.headMessage);
      if (savedData.computingDepts && savedData.computingDepts.length > 0) {
        setComputingDepts(savedData.computingDepts);
      }
      if (savedData.departmentHeads && savedData.departmentHeads.length > 0) {
        setDepartmentHeads(savedData.departmentHeads);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setUrlFn: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setUrlFn(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  // Department Heads Handlers
  const handleOpenAddHead = () => {
    setEditingHead({
      id: `head-${Date.now()}`,
      department: 'New Department',
      headName: 'Dr. Head Name',
      designation: 'Head of Department',
      photoUrl: '',
      display_order: departmentHeads.length + 1,
      is_visible: true,
    });
    setIsHeadModalOpen(true);
  };

  const handleOpenEditHead = (head: DeptHeadItem) => {
    setEditingHead({ ...head });
    setIsHeadModalOpen(true);
  };

  const handleSaveHeadInList = () => {
    if (!editingHead?.department?.trim() || !editingHead?.headName?.trim()) {
      alert('Please fill in Department label and Head Name.');
      return;
    }

    const updated = [...departmentHeads];
    const idx = updated.findIndex((h) => h.id === editingHead.id);
    if (idx >= 0) {
      updated[idx] = editingHead as DeptHeadItem;
    } else {
      updated.push(editingHead as DeptHeadItem);
    }

    setDepartmentHeads(updated);
    setIsHeadModalOpen(false);
  };

  const handleDeleteHead = () => {
    if (!deleteHeadTarget) return;
    setDepartmentHeads((prev) => prev.filter((h) => h.id !== deleteHeadTarget.id));
    setDeleteHeadTarget(null);
  };

  const handleMoveHead = (index: number, direction: 'up' | 'down') => {
    const newList = [...departmentHeads];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setDepartmentHeads(newList);
  };

  const handleToggleHeadVisibility = (id: string) => {
    setDepartmentHeads((prev) =>
      prev.map((h) => (h.id === id ? { ...h, is_visible: !h.is_visible } : h))
    );
  };

  const handleOpenAdd = () => {
    setEditingDept({
      id: `dept-${Date.now()}`,
      name: 'New Computing Department',
      code: 'DEPT',
      heroTitle: 'Department Of ...',
      hodName: 'Dr. Head of Department',
      hodDesignation: 'Head of Department',
      hodMessage: 'Welcome to the department...',
      display_order: computingDepts.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: ComputingDept) => {
    setEditingDept({ ...dept });
    setIsModalOpen(true);
  };

  const handleSaveDeptInList = () => {
    if (!editingDept?.name?.trim()) {
      alert('Please enter a department name.');
      return;
    }

    const updated = [...computingDepts];
    const idx = updated.findIndex((d) => d.id === editingDept.id);
    if (idx >= 0) {
      updated[idx] = editingDept as ComputingDept;
    } else {
      updated.push(editingDept as ComputingDept);
    }

    setComputingDepts(updated);
    setIsModalOpen(false);
  };

  const handleDeleteDept = () => {
    if (!deleteTarget) return;
    setComputingDepts((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newList = [...computingDepts];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setComputingDepts(newList);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImageUrl,
      headName,
      headDesignation,
      headPhotoUrl,
      headMessage,
      computingDepts,
      departmentHeads,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('school_of_computing_content', payload, 'School of Computing page content');

    if (res.success) {
      setMessage({ type: 'success', text: 'School of Computing settings saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="FAST School of Computing Page"
        subtitle="Manage School of Computing page content, Head of School message, and child computing departments (CS, SE, AI)."
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
      <AdminSection title="School Hero Banner" description="Manage page title and hero background image.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Page Hero Title">
            <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="FAST School Of Computing" />
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
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setHeroImageUrl)} />
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

      {/* Head School of Computing Section */}
      <AdminSection title="Head, School of Computing" description="Manage Head of School details, photograph, and message.">
        <AdminCard className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Head Name">
              <AdminInput value={headName} onChange={(e) => setHeadName(e.target.value)} placeholder="Dr. Head Name" />
            </AdminFormGroup>

            <AdminFormGroup label="Designation">
              <AdminInput value={headDesignation} onChange={(e) => setHeadDesignation(e.target.value)} placeholder="Head, FAST School of Computing" />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Head Photograph Upload">
            <div className="flex items-center gap-3">
              <div className="w-16 h-20 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {headPhotoUrl ? (
                  <img src={headPhotoUrl} alt={headName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{headPhotoUrl ? 'Replace Photo' : 'Upload Photo'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setHeadPhotoUrl)} />
                </label>

                {headPhotoUrl && (
                  <button
                    type="button"
                    onClick={() => setHeadPhotoUrl('')}
                    className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <AdminFormGroup label="Head Message">
            <AdminTextarea rows={4} value={headMessage} onChange={(e) => setHeadMessage(e.target.value)} placeholder="Welcome message from Head of School..." />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* Child Department Admin Cards */}
      <AdminSection
        title="Computing Department Modules"
        description="Direct admin management controls for child computing departments."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 — Computer Science */}
          <AdminCard className="p-5 flex flex-col justify-between space-y-4 hover:border-[#0093DD]/50 transition-colors">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center font-bold border border-[#E5E7EB]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1F2937]">Department of Computer Science</h3>
              <p className="text-xs text-[#6B7280]">Manage department page, programs, faculty and media</p>
            </div>
            <Link
              to="/admin-panel5463/departments/cs"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open CS Admin</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </AdminCard>

          {/* Card 2 — Software Engineering */}
          <AdminCard className="p-5 flex flex-col justify-between space-y-4 hover:border-[#0093DD]/50 transition-colors">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center font-bold border border-[#E5E7EB]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1F2937]">Department of Software Engineering</h3>
              <p className="text-xs text-[#6B7280]">Manage department page, programs, faculty and media</p>
            </div>
            <Link
              to="/admin-panel5463/departments/se"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open SE Admin</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </AdminCard>

          {/* Card 3 — AI */}
          <AdminCard className="p-5 flex flex-col justify-between space-y-4 hover:border-[#0093DD]/50 transition-colors">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center font-bold border border-[#E5E7EB]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1F2937]">Department of AI</h3>
              <p className="text-xs text-[#6B7280]">Manage department page, programs, faculty and media</p>
            </div>
            <Link
              to="/admin-panel5463/departments/ai"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open AI Admin</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </AdminCard>
        </div>
      </AdminSection>

      {/* Department Heads Section */}
      <AdminSection
        title="Department Heads"
        description="Manage Department Head profile cards displayed on the public Computing page."
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-[#374151]">Department Heads List</h4>
          <AdminButton variant="primary" onClick={handleOpenAddHead} icon={<Plus className="w-4 h-4" />}>
            Add Department Head
          </AdminButton>
        </div>

        <div className="space-y-3">
          {departmentHeads.map((head, idx) => (
            <AdminCard key={head.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-16 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex items-center justify-center flex-shrink-0">
                  {head.photoUrl ? (
                    <img src={head.photoUrl} alt={head.headName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-[#9CA3AF]" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                      Order #{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-[#4B5563] bg-gray-100 px-2 py-0.5 rounded">
                      {head.department}
                    </span>
                    {!head.is_visible && (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Hidden
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-[#1F2937]">{head.headName}</h4>
                  <p className="text-xs text-[#6B7280]">{head.designation}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleToggleHeadVisibility(head.id)}
                  className={`p-2 border rounded-md cursor-pointer transition-colors ${
                    head.is_visible
                      ? 'text-[#0093DD] bg-[#F0F9FF] border-[#B9E6FE]'
                      : 'text-[#9CA3AF] bg-[#F9FAFB] border-[#E5E7EB]'
                  }`}
                  title={head.is_visible ? 'Visible (Click to Hide)' : 'Hidden (Click to Show)'}
                >
                  {head.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleMoveHead(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleMoveHead(idx, 'down')}
                  disabled={idx === departmentHeads.length - 1}
                  className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <AdminButton variant="secondary" onClick={() => handleOpenEditHead(head)} icon={<Edit2 className="w-4 h-4" />}>
                  Edit
                </AdminButton>

                <AdminButton variant="danger" onClick={() => setDeleteHeadTarget(head)} icon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      </AdminSection>

      {/* Computing Departments Section */}
      <AdminSection
        title="Computing Departments"
        description="Add, edit, reorder, or remove departments under FAST School of Computing (CS, SE, AI)."
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-[#374151]">Departments List</h4>
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add Computing Department
          </AdminButton>
        </div>

        <div className="space-y-3">
          {computingDepts.map((dept, idx) => (
            <AdminCard key={dept.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center flex-shrink-0 font-bold border border-[#E5E7EB]">
                  {dept.code || 'CS'}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                      Order #{idx + 1}
                    </span>
                    <span className="text-xs text-[#6B7280]">Code: {dept.code}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#1F2937]">{dept.name}</h4>
                  <p className="text-xs text-[#6B7280]">{dept.hodName} ({dept.hodDesignation})</p>
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
                  disabled={idx === computingDepts.length - 1}
                  className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <AdminButton variant="secondary" onClick={() => handleOpenEdit(dept)} icon={<Edit2 className="w-4 h-4" />}>
                  Edit Department Details
                </AdminButton>

                <AdminButton variant="danger" onClick={() => setDeleteTarget(dept)} icon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      </AdminSection>

      {/* Edit Department Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept?.id ? `Edit ${editingDept.name}` : 'Add Computing Department'}
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveDeptInList}>
              Save Department
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <AdminFormGroup label="Department Name" required>
            <AdminInput
              value={editingDept?.name || ''}
              onChange={(e) => setEditingDept((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Department of Computer Science"
            />
          </AdminFormGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Short Code">
              <AdminInput
                value={editingDept?.code || ''}
                onChange={(e) => setEditingDept((prev) => ({ ...prev, code: e.target.value }))}
                placeholder="e.g. CS"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Department Page Hero Title">
              <AdminInput
                value={editingDept?.heroTitle || ''}
                onChange={(e) => setEditingDept((prev) => ({ ...prev, heroTitle: e.target.value }))}
                placeholder="e.g. Department Of Computer Science"
              />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Department Page Hero Image">
            <div className="flex items-center gap-3">
              <div className="w-24 h-12 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center">
                {editingDept?.heroImage ? (
                  <img src={editingDept.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-[#9CA3AF]">DEFAULT HERO</span>
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{editingDept?.heroImage ? 'Replace Image' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setEditingDept((prev) => ({ ...prev, heroImage: url })))}
                  />
                </label>

                {editingDept?.heroImage && (
                  <button
                    type="button"
                    onClick={() => setEditingDept((prev) => ({ ...prev, heroImage: '' }))}
                    className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="HOD Name">
              <AdminInput
                value={editingDept?.hodName || ''}
                onChange={(e) => setEditingDept((prev) => ({ ...prev, hodName: e.target.value }))}
                placeholder="Dr. Head of Department"
              />
            </AdminFormGroup>

            <AdminFormGroup label="HOD Designation">
              <AdminInput
                value={editingDept?.hodDesignation || ''}
                onChange={(e) => setEditingDept((prev) => ({ ...prev, hodDesignation: e.target.value }))}
                placeholder="Head, Department of Computer Science"
              />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="HOD Photograph Upload">
            <div className="flex items-center gap-3">
              <div className="w-16 h-20 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {editingDept?.hodPhoto ? (
                  <img src={editingDept.hodPhoto} alt="HOD Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{editingDept?.hodPhoto ? 'Replace Photo' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setEditingDept((prev) => ({ ...prev, hodPhoto: url })))}
                  />
                </label>

                {editingDept?.hodPhoto && (
                  <button
                    type="button"
                    onClick={() => setEditingDept((prev) => ({ ...prev, hodPhoto: '' }))}
                    className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <AdminFormGroup label="HOD Message">
            <AdminTextarea
              rows={4}
              value={editingDept?.hodMessage || ''}
              onChange={(e) => setEditingDept((prev) => ({ ...prev, hodMessage: e.target.value }))}
              placeholder="HOD message for this department..."
            />
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Website"
            checked={editingDept?.is_visible ?? true}
            onChange={(checked) => setEditingDept((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteDept}
        itemTitle={deleteTarget?.name}
      />

      {/* Edit Department Head Modal */}
      <AdminModal
        isOpen={isHeadModalOpen}
        onClose={() => setIsHeadModalOpen(false)}
        title={editingHead?.id ? `Edit Department Head` : 'Add Department Head'}
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsHeadModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveHeadInList}>
              Save Head
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Department / Label" required>
              <AdminInput
                value={editingHead?.department || ''}
                onChange={(e) => setEditingHead((prev) => ({ ...prev, department: e.target.value }))}
                placeholder="e.g. Computer Science"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Head Name" required>
              <AdminInput
                value={editingHead?.headName || ''}
                onChange={(e) => setEditingHead((prev) => ({ ...prev, headName: e.target.value }))}
                placeholder="e.g. Dr. Name"
              />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Designation">
            <AdminInput
              value={editingHead?.designation || ''}
              onChange={(e) => setEditingHead((prev) => ({ ...prev, designation: e.target.value }))}
              placeholder="e.g. Head, Department of Computer Science"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Head Photo Upload">
            <div className="flex items-center gap-3">
              <div className="w-16 h-20 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {editingHead?.photoUrl ? (
                  <img src={editingHead.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{editingHead?.photoUrl ? 'Replace Photo' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setEditingHead((prev) => ({ ...prev, photoUrl: url })))}
                  />
                </label>

                {editingHead?.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setEditingHead((prev) => ({ ...prev, photoUrl: '' }))}
                    className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Website"
            checked={editingHead?.is_visible ?? true}
            onChange={(checked) => setEditingHead((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      <DeleteConfirmModal
        isOpen={!!deleteHeadTarget}
        onClose={() => setDeleteHeadTarget(null)}
        onConfirm={handleDeleteHead}
        itemTitle={deleteHeadTarget ? `${deleteHeadTarget.headName} (${deleteHeadTarget.department})` : ''}
      />
    </div>
  );
}
