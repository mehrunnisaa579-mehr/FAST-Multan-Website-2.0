import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import AdminToggle from '../components/ui/AdminToggle';
import AdminModal, { DeleteConfirmModal } from '../components/ui/AdminModal';
import FacultyEditModal, { type FacultyMemberData } from '../components/ui/FacultyEditModal';
import { cmsService } from '../../services/cmsService';
import { sePrograms, seFaculty } from '../../data/departments';
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
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SEProgramItem {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
  imageLabel?: string;
  url?: string;
  display_order: number;
  is_visible: boolean;
}

interface SEFacultyItem extends FacultyMemberData {
  id: string;
  name: string;
  designation: string;
  qualification?: string;
  photoUrl?: string;
  photoPlaceholder?: string;
  display_order: number;
  is_visible: boolean;
}

export default function AdminSEDepartmentEditor() {
  // Hero Section State
  const [heroTitle, setHeroTitle] = useState('Department Of Software Engineering');
  const [heroImageUrl, setHeroImageUrl] = useState('');

  // HOD Message Section State
  const [hodHeading, setHodHeading] = useState("HOD'S MESSAGE");
  const [hodName, setHodName] = useState('Dr. Head of Department');
  const [hodDesignation, setHodDesignation] = useState('Head, Department of Software Engineering');
  const [hodPhotoUrl, setHodPhotoUrl] = useState('');
  const [hodMessage, setHodMessage] = useState(
    'Welcome to the Department of Software Engineering at FAST-NUCES Multan Campus. Our degree programs prepare students for industrial software design, quality assurance, agile methodology, and enterprise software architecture.'
  );

  // Programs Section State
  const [programsHeading, setProgramsHeading] = useState('OUR PROGRAMS');
  const [viewAllProgramsText, setViewAllProgramsText] = useState('VIEW ALL PROGRAMS →');
  const [viewAllProgramsUrl, setViewAllProgramsUrl] = useState('/departments/computing/software-engineering/programs');
  const [programsList, setProgramsList] = useState<SEProgramItem[]>(
    sePrograms.map((p, idx) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      imageLabel: p.imageLabel,
      image: '',
      url: '/departments/computing/software-engineering/programs',
      display_order: idx + 1,
      is_visible: true,
    }))
  );

  // Faculty Section State
  const [facultyHeading, setFacultyHeading] = useState('DEPARTMENT FACULTY');
  const [viewAllFacultyText, setViewAllFacultyText] = useState('VIEW ALL FACULTY →');
  const [viewAllFacultyUrl, setViewAllFacultyUrl] = useState('/departments/computing/software-engineering/faculty');
  const [facultyList, setFacultyList] = useState<SEFacultyItem[]>(
    seFaculty.map((f, idx) => ({
      id: f.id,
      name: f.name,
      designation: f.designation,
      photoUrl: '',
      photoPlaceholder: f.photoPlaceholder,
      display_order: idx + 1,
      is_visible: true,
    }))
  );

  // Allied Faculty Section State
  const [alliedFacultyHeading, setAlliedFacultyHeading] = useState('ALLIED FACULTY');
  const [alliedFacultyList, setAlliedFacultyList] = useState<SEFacultyItem[]>([]);

  // Accordion Section Expansion State
  const [accordions, setAccordions] = useState<Record<string, boolean>>({
    hero: true,
    hod: true,
    programs: false,
    faculty: false,
    allied: false,
  });

  const toggleAccordion = (key: string) => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Modals state
  const [isProgModalOpen, setIsProgModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<Partial<SEProgramItem> | null>(null);
  const [deleteProgTarget, setDeleteProgTarget] = useState<SEProgramItem | null>(null);

  const [isFacModalOpen, setIsFacModalOpen] = useState(false);
  const [editingFac, setEditingFac] = useState<Partial<SEFacultyItem> | null>(null);
  const [deleteFacTarget, setDeleteFacTarget] = useState<SEFacultyItem | null>(null);

  const [isAlliedModalOpen, setIsAlliedModalOpen] = useState(false);
  const [editingAllied, setEditingAllied] = useState<Partial<SEFacultyItem> | null>(null);
  const [deleteAlliedTarget, setDeleteAlliedTarget] = useState<SEFacultyItem | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    const saved = await cmsService.getSetting<any>('department_se_content', null);
    if (saved) {
      if (saved.heroTitle) setHeroTitle(saved.heroTitle);
      if (saved.heroImageUrl) setHeroImageUrl(saved.heroImageUrl);

      if (saved.hodHeading) setHodHeading(saved.hodHeading);
      if (saved.hodName) setHodName(saved.hodName);
      if (saved.hodDesignation) setHodDesignation(saved.hodDesignation);
      if (saved.hodPhotoUrl) setHodPhotoUrl(saved.hodPhotoUrl);
      if (saved.hodMessage) setHodMessage(saved.hodMessage);

      if (saved.programsHeading) setProgramsHeading(saved.programsHeading);
      if (saved.viewAllProgramsText) setViewAllProgramsText(saved.viewAllProgramsText);
      if (saved.viewAllProgramsUrl) setViewAllProgramsUrl(saved.viewAllProgramsUrl);
      if (Array.isArray(saved.programsList)) setProgramsList(saved.programsList);

      if (saved.facultyHeading) setFacultyHeading(saved.facultyHeading);
      if (saved.viewAllFacultyText) setViewAllFacultyText(saved.viewAllFacultyText);
      if (saved.viewAllFacultyUrl) setViewAllFacultyUrl(saved.viewAllFacultyUrl);
      if (Array.isArray(saved.facultyList)) setFacultyList(saved.facultyList);

      if (saved.alliedFacultyHeading) setAlliedFacultyHeading(saved.alliedFacultyHeading);
      if (Array.isArray(saved.alliedFacultyList)) setAlliedFacultyList(saved.alliedFacultyList);
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

  // Program CRUD Handlers
  const handleOpenAddProg = () => {
    setEditingProg({
      id: `prog-se-${Date.now()}`,
      title: 'New SE Program',
      subtitle: '4 Years Undergraduate Program',
      description: '',
      image: '',
      url: '/departments/computing/software-engineering/programs',
      display_order: programsList.length + 1,
      is_visible: true,
    });
    setIsProgModalOpen(true);
  };

  const handleSaveProg = () => {
    if (!editingProg?.title?.trim()) {
      alert('Please enter a program title.');
      return;
    }
    const updated = [...programsList];
    const idx = updated.findIndex((p) => p.id === editingProg.id);
    if (idx >= 0) {
      updated[idx] = editingProg as SEProgramItem;
    } else {
      updated.push(editingProg as SEProgramItem);
    }
    setProgramsList(updated);
    setIsProgModalOpen(false);
  };

  const handleDeleteProg = () => {
    if (!deleteProgTarget) return;
    setProgramsList((prev) => prev.filter((p) => p.id !== deleteProgTarget.id));
    setDeleteProgTarget(null);
  };

  const handleMoveProg = (index: number, direction: 'up' | 'down') => {
    const newList = [...programsList];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setProgramsList(newList);
  };

  // Faculty CRUD Handlers
  const handleOpenAddFac = () => {
    setEditingFac({
      id: `fac-se-${Date.now()}`,
      name: 'Dr. New Faculty Member',
      designation: 'Assistant Professor',
      qualification: 'PhD Software Engineering',
      photoUrl: '',
      display_order: facultyList.length + 1,
      is_visible: true,
    });
    setIsFacModalOpen(true);
  };

  const handleSaveFacModal = (savedData: FacultyMemberData) => {
    const updated = [...facultyList];
    const itemToSave = { ...editingFac, ...savedData } as SEFacultyItem;
    const idx = updated.findIndex((f) => f.id === itemToSave.id);
    if (idx >= 0) {
      updated[idx] = itemToSave;
    } else {
      updated.push(itemToSave);
    }
    setFacultyList(updated);
    setIsFacModalOpen(false);
  };

  const handleDeleteFac = () => {
    if (!deleteFacTarget) return;
    setFacultyList((prev) => prev.filter((f) => f.id !== deleteFacTarget.id));
    setDeleteFacTarget(null);
  };

  const handleMoveFac = (index: number, direction: 'up' | 'down') => {
    const newList = [...facultyList];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setFacultyList(newList);
  };

  // Allied Faculty CRUD Handlers
  const handleOpenAddAllied = () => {
    setEditingAllied({
      id: `allied-se-${Date.now()}`,
      name: 'Dr. New Allied Faculty',
      designation: 'Associated Professor (SE)',
      qualification: 'M.S. / Ph.D.',
      photoUrl: '',
      display_order: alliedFacultyList.length + 1,
      is_visible: true,
    });
    setIsAlliedModalOpen(true);
  };

  const handleSaveAlliedModal = (savedData: FacultyMemberData) => {
    const updated = [...alliedFacultyList];
    const itemToSave = { ...editingAllied, ...savedData } as SEFacultyItem;
    const idx = updated.findIndex((f) => f.id === itemToSave.id);
    if (idx >= 0) {
      updated[idx] = itemToSave;
    } else {
      updated.push(itemToSave);
    }
    setAlliedFacultyList(updated);
    setIsAlliedModalOpen(false);
  };

  const handleDeleteAllied = () => {
    if (!deleteAlliedTarget) return;
    setAlliedFacultyList((prev) => prev.filter((f) => f.id !== deleteAlliedTarget.id));
    setDeleteAlliedTarget(null);
  };

  const handleMoveAllied = (index: number, direction: 'up' | 'down') => {
    const newList = [...alliedFacultyList];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setAlliedFacultyList(newList);
  };

  // Save All
  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImageUrl,
      hodHeading,
      hodName,
      hodDesignation,
      hodPhotoUrl,
      hodMessage,
      programsHeading,
      viewAllProgramsText,
      viewAllProgramsUrl,
      programsList,
      facultyHeading,
      viewAllFacultyText,
      viewAllFacultyUrl,
      facultyList,
      alliedFacultyHeading,
      alliedFacultyList,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('department_se_content', payload, 'Department of Software Engineering Content');

    if (res.success) {
      setMessage({ type: 'success', text: 'Department of Software Engineering page content saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save content.' });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/school-of-computing"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to School of Computing"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Department of Software Engineering Editor"
          subtitle="No-code control for public Software Engineering page, Hero, HOD Message, Programs, and Faculty."
          action={
            <AdminButton variant="primary" onClick={handleSaveAll} loading={saving} icon={<Save className="w-4 h-4" />}>
              Save Changes
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

      {/* 1. HERO SECTION */}
      <div className="border border-[#E5E7EB] rounded-lg bg-white overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleAccordion('hero')}
          className="w-full p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between font-bold text-base text-[#1F2937] transition-colors cursor-pointer border-b border-[#E5E7EB]"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center text-xs font-bold">1</span>
            <span>Hero Banner</span>
          </div>
          {accordions.hero ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {accordions.hero && (
          <div className="p-5 space-y-4">
            <AdminFormGroup label="Department Page Title">
              <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="Department Of Software Engineering" />
            </AdminFormGroup>

            <AdminFormGroup label="Hero Background Image Upload">
              <div className="flex items-center gap-4">
                <div className="w-32 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                  {heroImageUrl ? (
                    <img src={heroImageUrl} alt="Hero Banner Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-[#9CA3AF] font-medium">DEFAULT HERO</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{heroImageUrl ? 'Replace Photo' : 'Upload Photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setHeroImageUrl)} />
                  </label>

                  {heroImageUrl && (
                    <button
                      type="button"
                      onClick={() => setHeroImageUrl('')}
                      className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
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

      {/* 2. HOD'S MESSAGE SECTION */}
      <div className="border border-[#E5E7EB] rounded-lg bg-white overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleAccordion('hod')}
          className="w-full p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between font-bold text-base text-[#1F2937] transition-colors cursor-pointer border-b border-[#E5E7EB]"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center text-xs font-bold">2</span>
            <span>HOD's Message</span>
          </div>
          {accordions.hod ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {accordions.hod && (
          <div className="p-5 space-y-4">
            <AdminFormGroup label="Section Heading">
              <AdminInput value={hodHeading} onChange={(e) => setHodHeading(e.target.value)} placeholder="HOD'S MESSAGE" />
            </AdminFormGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="HOD Name">
                <AdminInput value={hodName} onChange={(e) => setHodName(e.target.value)} placeholder="Dr. Head of Department" />
              </AdminFormGroup>

              <AdminFormGroup label="HOD Designation">
                <AdminInput value={hodDesignation} onChange={(e) => setHodDesignation(e.target.value)} placeholder="Head, Department of Software Engineering" />
              </AdminFormGroup>
            </div>

            <AdminFormGroup label="HOD Photograph Upload">
              <div className="flex items-center gap-4">
                <div className="w-20 h-24 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                  {hodPhotoUrl ? (
                    <img src={hodPhotoUrl} alt={hodName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[#9CA3AF]" />
                  )}
                </div>

                <div className="flex gap-2">
                  <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{hodPhotoUrl ? 'Replace Photo' : 'Upload Photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setHodPhotoUrl)} />
                  </label>

                  {hodPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setHodPhotoUrl('')}
                      className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </AdminFormGroup>

            <AdminFormGroup label="HOD Message / Overview Paragraph">
              <AdminTextarea rows={4} value={hodMessage} onChange={(e) => setHodMessage(e.target.value)} placeholder="Welcome message text..." />
            </AdminFormGroup>
          </div>
        )}
      </div>

      {/* 3. OUR PROGRAMS SECTION */}
      <div className="border border-[#E5E7EB] rounded-lg bg-white overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleAccordion('programs')}
          className="w-full p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between font-bold text-base text-[#1F2937] transition-colors cursor-pointer border-b border-[#E5E7EB]"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center text-xs font-bold">3</span>
            <span>Degree Programs</span>
          </div>
          {accordions.programs ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {accordions.programs && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AdminFormGroup label="Section Heading">
                <AdminInput value={programsHeading} onChange={(e) => setProgramsHeading(e.target.value)} />
              </AdminFormGroup>
              <AdminFormGroup label="View All Button Text">
                <AdminInput value={viewAllProgramsText} onChange={(e) => setViewAllProgramsText(e.target.value)} />
              </AdminFormGroup>
              <AdminFormGroup label="View All Destination Link">
                <AdminInput value={viewAllProgramsUrl} onChange={(e) => setViewAllProgramsUrl(e.target.value)} />
              </AdminFormGroup>
            </div>

            <div className="flex justify-between items-center pt-2">
              <h4 className="text-sm font-bold text-[#374151]">SE Degree Programs List</h4>
              <AdminButton variant="primary" onClick={handleOpenAddProg} icon={<Plus className="w-4 h-4" />}>
                Add SE Program
              </AdminButton>
            </div>

            <div className="space-y-3">
              {programsList.map((prog, idx) => (
                <AdminCard key={prog.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center flex-shrink-0 font-bold border border-[#E5E7EB] overflow-hidden">
                      {prog.image ? (
                        <img src={prog.image} alt={prog.title} className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">Order #{idx + 1}</span>
                        <span className="text-xs text-[#6B7280]">{prog.subtitle}</span>
                        {!prog.is_visible && (
                          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Hidden</span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-[#1F2937]">{prog.title}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleMoveProg(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveProg(idx, 'down')}
                      disabled={idx === programsList.length - 1}
                      className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <AdminButton variant="secondary" onClick={() => { setEditingProg({ ...prog }); setIsProgModalOpen(true); }} icon={<Edit2 className="w-4 h-4" />}>
                      Edit
                    </AdminButton>

                    <AdminButton variant="danger" onClick={() => setDeleteProgTarget(prog)} icon={<Trash2 className="w-4 h-4" />}>
                      Delete
                    </AdminButton>
                  </div>
                </AdminCard>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. DEPARTMENT FACULTY SECTION */}
      <div className="border border-[#E5E7EB] rounded-lg bg-white overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleAccordion('faculty')}
          className="w-full p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between font-bold text-base text-[#1F2937] transition-colors cursor-pointer border-b border-[#E5E7EB]"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center text-xs font-bold">4</span>
            <span>Department Faculty</span>
          </div>
          {accordions.faculty ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {accordions.faculty && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AdminFormGroup label="Section Heading">
                <AdminInput value={facultyHeading} onChange={(e) => setFacultyHeading(e.target.value)} />
              </AdminFormGroup>
              <AdminFormGroup label="View All Button Text">
                <AdminInput value={viewAllFacultyText} onChange={(e) => setViewAllFacultyText(e.target.value)} />
              </AdminFormGroup>
              <AdminFormGroup label="View All Destination Link">
                <AdminInput value={viewAllFacultyUrl} onChange={(e) => setViewAllFacultyUrl(e.target.value)} />
              </AdminFormGroup>
            </div>

            <div className="flex justify-between items-center pt-2">
              <h4 className="text-sm font-bold text-[#374151]">SE Faculty List</h4>
              <AdminButton variant="primary" onClick={handleOpenAddFac} icon={<Plus className="w-4 h-4" />}>
                Add Faculty Member
              </AdminButton>
            </div>

            <div className="space-y-3">
              {facultyList.map((fac, idx) => (
                <AdminCard key={fac.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-14 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex items-center justify-center flex-shrink-0">
                      {fac.photoUrl ? (
                        <img src={fac.photoUrl} alt={fac.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-[#9CA3AF]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">Order #{idx + 1}</span>
                        {!fac.is_visible && (
                          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Hidden</span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-[#1F2937]">{fac.name}</h4>
                      <p className="text-xs text-[#6B7280]">{fac.designation}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-end sm:self-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleMoveFac(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveFac(idx, 'down')}
                      disabled={idx === facultyList.length - 1}
                      className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <AdminButton variant="secondary" onClick={() => { setEditingFac({ ...fac }); setIsFacModalOpen(true); }} icon={<Edit2 className="w-4 h-4" />}>
                      Edit
                    </AdminButton>

                    <AdminButton variant="danger" onClick={() => setDeleteFacTarget(fac)} icon={<Trash2 className="w-4 h-4" />}>
                      Remove
                    </AdminButton>
                  </div>
                </AdminCard>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. ALLIED FACULTY SECTION */}
      <div className="border border-[#E5E7EB] rounded-lg bg-white overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => toggleAccordion('allied')}
          className="w-full p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between font-bold text-base text-[#1F2937] transition-colors cursor-pointer border-b border-[#E5E7EB]"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center text-xs font-bold">5</span>
            <span>Allied Faculty</span>
          </div>
          {accordions.allied ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {accordions.allied && (
          <div className="p-5 space-y-4">
            <AdminFormGroup label="Section Heading">
              <AdminInput value={alliedFacultyHeading} onChange={(e) => setAlliedFacultyHeading(e.target.value)} />
            </AdminFormGroup>

            <div className="flex justify-between items-center pt-2">
              <h4 className="text-sm font-bold text-[#374151]">SE Allied Faculty List</h4>
              <AdminButton variant="primary" onClick={handleOpenAddAllied} icon={<Plus className="w-4 h-4" />}>
                Add Allied Faculty Member
              </AdminButton>
            </div>

            <div className="space-y-3">
              {alliedFacultyList.map((fac, idx) => (
                <AdminCard key={fac.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-14 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex items-center justify-center flex-shrink-0">
                      {fac.photoUrl ? (
                        <img src={fac.photoUrl} alt={fac.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-[#9CA3AF]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">Order #{idx + 1}</span>
                        {!fac.is_visible && (
                          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Hidden</span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-[#1F2937]">{fac.name}</h4>
                      <p className="text-xs text-[#6B7280]">{fac.designation}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 self-end sm:self-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleMoveAllied(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveAllied(idx, 'down')}
                      disabled={idx === alliedFacultyList.length - 1}
                      className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <AdminButton variant="secondary" onClick={() => { setEditingAllied({ ...fac }); setIsAlliedModalOpen(true); }} icon={<Edit2 className="w-4 h-4" />}>
                      Edit
                    </AdminButton>

                    <AdminButton variant="danger" onClick={() => setDeleteAlliedTarget(fac)} icon={<Trash2 className="w-4 h-4" />}>
                      Remove
                    </AdminButton>
                  </div>
                </AdminCard>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Program Edit Modal */}
      <AdminModal
        isOpen={isProgModalOpen}
        onClose={() => setIsProgModalOpen(false)}
        title={editingProg?.id ? 'Edit SE Program' : 'Add SE Program'}
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsProgModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveProg}>
              Save Program
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <AdminFormGroup label="Program Title" required>
            <AdminInput
              value={editingProg?.title || ''}
              onChange={(e) => setEditingProg((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. BS Software Engineering"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Subtitle / Duration">
            <AdminInput
              value={editingProg?.subtitle || ''}
              onChange={(e) => setEditingProg((prev) => ({ ...prev, subtitle: e.target.value }))}
              placeholder="e.g. 4 Years Undergraduate Program"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Program Image Upload">
            <div className="flex items-center gap-3">
              <div className="w-20 h-14 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center">
                {editingProg?.image ? (
                  <img src={editingProg.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{editingProg?.image ? 'Replace Image' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (url) => setEditingProg((prev) => ({ ...prev, image: url })))}
                  />
                </label>

                {editingProg?.image && (
                  <button
                    type="button"
                    onClick={() => setEditingProg((prev) => ({ ...prev, image: '' }))}
                    className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Website"
            checked={editingProg?.is_visible ?? true}
            onChange={(checked) => setEditingProg((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      {/* Faculty Edit Modal */}
      <FacultyEditModal
        isOpen={isFacModalOpen}
        onClose={() => setIsFacModalOpen(false)}
        onSave={handleSaveFacModal}
        title={editingFac?.id ? 'Edit SE Faculty Member' : 'Add SE Faculty Member'}
        initialData={editingFac}
      />

      {/* Allied Faculty Edit Modal */}
      <FacultyEditModal
        isOpen={isAlliedModalOpen}
        onClose={() => setIsAlliedModalOpen(false)}
        onSave={handleSaveAlliedModal}
        title={editingAllied?.id ? 'Edit SE Allied Faculty' : 'Add SE Allied Faculty'}
        initialData={editingAllied}
      />

      <DeleteConfirmModal
        isOpen={!!deleteProgTarget}
        onClose={() => setDeleteProgTarget(null)}
        onConfirm={handleDeleteProg}
        itemTitle={deleteProgTarget?.title}
      />

      <DeleteConfirmModal
        isOpen={!!deleteFacTarget}
        onClose={() => setDeleteFacTarget(null)}
        onConfirm={handleDeleteFac}
        itemTitle={deleteFacTarget?.name}
      />

      <DeleteConfirmModal
        isOpen={!!deleteAlliedTarget}
        onClose={() => setDeleteAlliedTarget(null)}
        onConfirm={handleDeleteAllied}
        itemTitle={deleteAlliedTarget?.name}
      />
    </div>
  );
}
