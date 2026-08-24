import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import AdminToggle from '../components/ui/AdminToggle';
import AdminModal, { DeleteConfirmModal } from '../components/ui/AdminModal';
import FacultyEditModal, { type FacultyMemberData } from '../components/ui/FacultyEditModal';
import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';
import { useAdminAuth } from '../auth/useAdminAuth';
import { canAccessDepartmentSection } from '../config/rolePermissions';
import { cmsService } from '../../services/cmsService';
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
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  GraduationCap,
  Users,
  BookOpen,
  User,
} from 'lucide-react';

interface ProgramItem {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
  url?: string;
  display_order: number;
  is_visible: boolean;
}

interface FacultyItem extends FacultyMemberData {
  id: string;
  name: string;
  designation: string;
  qualification?: string;
  photoUrl?: string;
  display_order: number;
  is_visible: boolean;
}

interface ResearchItem {
  id: string;
  title: string;
  description: string;
  url?: string;
  display_order: number;
  is_visible: boolean;
}

export default function AdminGenericDepartmentEditor() {
  const { slug } = useParams<{ slug: string }>();
  const { adminProfile } = useAdminAuth();

  // Department Basic Info State
  const [deptName, setDeptName] = useState('');
  const [shortName, setShortName] = useState('');
  const [description, setDescription] = useState('');

  // 1. Hero Section State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroImageUrl, setHeroImageUrl] = useState('');

  // 2. HOD / Head Message Section State
  const [hodHeading, setHodHeading] = useState("HOD'S MESSAGE");
  const [hodName, setHodName] = useState('');
  const [hodDesignation, setHodDesignation] = useState('');
  const [hodPhotoUrl, setHodPhotoUrl] = useState('');
  const [hodEmail, setHodEmail] = useState('');
  const [hodPhone, setHodPhone] = useState('');
  const [hodMessage, setHodMessage] = useState('');
  const [hodEducation, setHodEducation] = useState('');
  const [hodPublications, setHodPublications] = useState('');
  const [hodCollaborations, setHodCollaborations] = useState('');
  const [hodProjects, setHodProjects] = useState('');

  // 3. Degree Programs Section State
  const [programsHeading, setProgramsHeading] = useState('OUR PROGRAMS');
  const [viewAllProgramsText, setViewAllProgramsText] = useState('VIEW ALL PROGRAMS →');
  const [viewAllProgramsUrl, setViewAllProgramsUrl] = useState('');
  const [programsList, setProgramsList] = useState<ProgramItem[]>([]);

  // 4. Department Faculty Section State
  const [facultyHeading, setFacultyHeading] = useState('DEPARTMENT FACULTY');
  const [viewAllFacultyText, setViewAllFacultyText] = useState('VIEW ALL FACULTY →');
  const [viewAllFacultyUrl, setViewAllFacultyUrl] = useState('');
  const [facultyList, setFacultyList] = useState<FacultyItem[]>([]);

  // 5. Allied Faculty Section State
  const [showAlliedFacultySection, setShowAlliedFacultySection] = useState(true);
  const [alliedFacultyHeading, setAlliedFacultyHeading] = useState('ALLIED FACULTY');
  const [alliedFacultyList, setAlliedFacultyList] = useState<FacultyItem[]>([]);

  // 6. Research Groups & Areas Section State
  const [researchHeading, setResearchHeading] = useState('RESEARCH GROUPS & AREAS');
  const [exploreResearchText, setExploreResearchText] = useState('EXPLORE RESEARCH GROUPS →');
  const [exploreResearchUrl, setExploreResearchUrl] = useState('');
  const [researchList, setResearchList] = useState<ResearchItem[]>([]);

  // Accordion State
  const [accordions, setAccordions] = useState<Record<string, boolean>>({
    basic: false,
    hero: true,
    hod: true,
    programs: false,
    faculty: false,
    alliedFaculty: false,
    research: false,
  });

  const toggleAccordion = (key: string) => {
    setAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Modals state
  const [isProgModalOpen, setIsProgModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<Partial<ProgramItem> | null>(null);
  const [deleteProgTarget, setDeleteProgTarget] = useState<ProgramItem | null>(null);

  const [isFacModalOpen, setIsFacModalOpen] = useState(false);
  const [editingFac, setEditingFac] = useState<Partial<FacultyItem> | null>(null);
  const [deleteFacTarget, setDeleteFacTarget] = useState<FacultyItem | null>(null);

  const [isAlliedModalOpen, setIsAlliedModalOpen] = useState(false);
  const [editingAllied, setEditingAllied] = useState<Partial<FacultyItem> | null>(null);
  const [deleteAlliedTarget, setDeleteAlliedTarget] = useState<FacultyItem | null>(null);

  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<Partial<ResearchItem> | null>(null);
  const [deleteResTarget, setDeleteResTarget] = useState<ResearchItem | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      // 1. Fetch metadata from custom_departments_list
      const depts = await cmsService.getCustomDepartments();
      const meta = depts.find((d: any) => d.slug === slug);
      if (meta) {
        setDeptName(meta.name || '');
        setShortName(meta.short_name || meta.code || '');
        setDescription(meta.description || '');
      }

      // 2. Fetch full content schema
      const cleanStr = (s?: string) => s ? s.replace(/^(department\s+of\s+)+/i, 'Department of ') : '';

      const saved = await cmsService.getCustomDepartmentContent(slug);
      if (saved) {
        if (saved.deptName) setDeptName(cleanStr(saved.deptName));
        if (saved.shortName) setShortName(saved.shortName);
        if (saved.description) setDescription(saved.description);

        if (saved.heroTitle) setHeroTitle(cleanStr(saved.heroTitle));
        if (saved.heroSubtitle) setHeroSubtitle(saved.heroSubtitle);
        if (saved.heroImageUrl) setHeroImageUrl(saved.heroImageUrl);

        if (saved.hodHeading) setHodHeading(saved.hodHeading);
        if (saved.hodName) setHodName(saved.hodName);
        if (saved.hodDesignation) setHodDesignation(cleanStr(saved.hodDesignation));
        if (saved.hodPhotoUrl) setHodPhotoUrl(saved.hodPhotoUrl);
        if (saved.hodEmail) setHodEmail(saved.hodEmail);
        if (saved.hodPhone) setHodPhone(saved.hodPhone);
        if (saved.hodMessage) setHodMessage(saved.hodMessage);
        if (saved.hodEducation) setHodEducation(saved.hodEducation);
        if (saved.hodPublications) setHodPublications(saved.hodPublications);
        if (saved.hodCollaborations) setHodCollaborations(saved.hodCollaborations);
        if (saved.hodProjects) setHodProjects(saved.hodProjects);

        if (saved.programsHeading) setProgramsHeading(saved.programsHeading);
        if (saved.viewAllProgramsText) setViewAllProgramsText(saved.viewAllProgramsText);
        if (saved.viewAllProgramsUrl) setViewAllProgramsUrl(saved.viewAllProgramsUrl);
        if (Array.isArray(saved.programsList)) setProgramsList(saved.programsList);

        if (saved.facultyHeading) setFacultyHeading(saved.facultyHeading);
        if (saved.viewAllFacultyText) setViewAllFacultyText(saved.viewAllFacultyText);
        if (saved.viewAllFacultyUrl) setViewAllFacultyUrl(saved.viewAllFacultyUrl);
        if (Array.isArray(saved.facultyList)) setFacultyList(saved.facultyList);

        if (saved.showAlliedFacultySection !== undefined) setShowAlliedFacultySection(saved.showAlliedFacultySection);
        else if (saved.alliedFacultyVisible !== undefined) setShowAlliedFacultySection(saved.alliedFacultyVisible);
        if (saved.alliedFacultyHeading) setAlliedFacultyHeading(saved.alliedFacultyHeading);
        if (Array.isArray(saved.alliedFacultyList)) setAlliedFacultyList(saved.alliedFacultyList);

        if (saved.researchHeading) setResearchHeading(saved.researchHeading);
        if (saved.exploreResearchText) setExploreResearchText(saved.exploreResearchText);
        if (saved.exploreResearchUrl) setExploreResearchUrl(saved.exploreResearchUrl);
        if (Array.isArray(saved.researchList)) setResearchList(saved.researchList);
      } else if (meta) {
        setHeroTitle(meta.name);
        setHodDesignation(`Head, ${meta.name}`);
        setViewAllProgramsUrl(`/departments/${slug}`);
        setViewAllFacultyUrl(`/departments/${slug}`);
        setExploreResearchUrl(`/departments/${slug}`);
      }
    };

    fetchData();
  }, [slug]);

  const { cropperProps, openCropper } = useImageCropper();

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void,
    opts?: { aspectRatio?: number; cropShape?: 'rect' | 'round'; title?: string }
  ) => {
    openCropper(
      e,
      async (croppedFile) => {
        setUploading(true);
        try {
          const res = await cmsService.uploadMedia(croppedFile);
          if (res.success && res.publicUrl) {
            setter(res.publicUrl);
            setMessage({ type: 'success', text: 'Image uploaded successfully!' });
          } else {
            setMessage({ type: 'error', text: res.error || 'Failed to upload image' });
          }
        } catch {
          setMessage({ type: 'error', text: 'Error uploading file' });
        } finally {
          setUploading(false);
        }
      },
      opts
    );
  };

  const handleSaveAll = async () => {
    if (!slug) return;
    setSaving(true);
    setMessage(null);

    try {
      // 1. Update basic info in custom_departments_list
      const depts = await cmsService.getCustomDepartments();
      const updatedDepts = depts.map((d: any) => {
        if (d.slug === slug) {
          return {
            ...d,
            name: deptName || d.name,
            short_name: shortName || d.short_name,
            description: description || d.description,
          };
        }
        return d;
      });
      await cmsService.saveCustomDepartments(updatedDepts);

      // 2. Save full content payload
      const payload = {
        deptName,
        shortName,
        description,
        heroTitle,
        heroSubtitle,
        heroImageUrl,
        hodHeading,
        hodName,
        hodDesignation,
        hodPhotoUrl,
        hodEmail,
        hodPhone,
        hodMessage,
        hodEducation,
        hodPublications,
        hodCollaborations,
        hodProjects,
        programsHeading,
        viewAllProgramsText,
        viewAllProgramsUrl,
        programsList,
        facultyHeading,
        viewAllFacultyText,
        viewAllFacultyUrl,
        facultyList,
        showAlliedFacultySection,
        alliedFacultyHeading,
        alliedFacultyList,
        researchHeading,
        exploreResearchText,
        exploreResearchUrl,
        researchList,
        updated_at: new Date().toISOString(),
      };

      const res = await cmsService.saveCustomDepartmentContent(slug, payload);
      if (res.success) {
        setMessage({ type: 'success', text: 'Department content saved successfully!' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Failed to save department content.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Error saving department.' });
    } finally {
      setSaving(false);
    }
  };

  // Program Handlers
  const handleOpenAddProg = () => {
    setEditingProg({
      id: `prog-${Date.now()}`,
      title: 'New Degree Program',
      subtitle: '4 Years Undergraduate Program',
      description: '',
      image: '',
      url: `/departments/${slug}`,
      display_order: programsList.length + 1,
      is_visible: true,
    });
    setIsProgModalOpen(true);
  };

  const handleSaveProgram = () => {
    if (!editingProg?.title?.trim()) {
      alert('Please enter a program title.');
      return;
    }
    const updated = [...programsList];
    const idx = updated.findIndex((p) => p.id === editingProg.id);
    if (idx >= 0) {
      updated[idx] = editingProg as ProgramItem;
    } else {
      updated.push(editingProg as ProgramItem);
    }
    setProgramsList(updated);
    setIsProgModalOpen(false);
    setEditingProg(null);
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

  // Faculty Handlers
  const handleOpenAddFac = () => {
    setEditingFac({
      id: `fac-${Date.now()}`,
      name: 'Dr. New Faculty Member',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. / M.S. Degree',
      photoUrl: '',
      display_order: facultyList.length + 1,
      is_visible: true,
    });
    setIsFacModalOpen(true);
  };

  const handleSaveFacultyModal = (savedData: FacultyMemberData) => {
    const updated = [...facultyList];
    const itemToSave = { ...editingFac, ...savedData } as FacultyItem;
    const idx = updated.findIndex((f) => f.id === itemToSave.id);
    if (idx >= 0) {
      updated[idx] = itemToSave;
    } else {
      updated.push(itemToSave);
    }
    setFacultyList(updated);
    setIsFacModalOpen(false);
    setEditingFac(null);
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

  // Allied Faculty Handlers
  const handleOpenAddAllied = () => {
    setEditingAllied({
      id: `allied-${Date.now()}`,
      name: 'Dr. New Allied Faculty Member',
      designation: 'Associated Professor',
      qualification: 'Ph.D. / M.S. Degree',
      photoUrl: '',
      display_order: alliedFacultyList.length + 1,
      is_visible: true,
    });
    setIsAlliedModalOpen(true);
  };

  const handleSaveAlliedModal = (savedData: FacultyMemberData) => {
    const updated = [...alliedFacultyList];
    const itemToSave = { ...editingAllied, ...savedData } as FacultyItem;
    const idx = updated.findIndex((f) => f.id === itemToSave.id);
    if (idx >= 0) {
      updated[idx] = itemToSave;
    } else {
      updated.push(itemToSave);
    }
    setAlliedFacultyList(updated);
    setIsAlliedModalOpen(false);
    setEditingAllied(null);
  };

  const handleDeleteAllied = () => {
    if (!deleteAlliedTarget) return;
    setAlliedFacultyList((prev) => prev.filter((a) => a.id !== deleteAlliedTarget.id));
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

  // Research Handlers
  const handleOpenAddRes = () => {
    setEditingRes({
      id: `res-${Date.now()}`,
      title: 'New Research Area / Group',
      description: 'Focuses on advanced research and technical innovations...',
      url: `/departments/${slug}`,
      display_order: researchList.length + 1,
      is_visible: true,
    });
    setIsResModalOpen(true);
  };

  const handleSaveRes = () => {
    if (!editingRes?.title?.trim()) {
      alert('Please enter a research area title.');
      return;
    }
    const updated = [...researchList];
    const idx = updated.findIndex((r) => r.id === editingRes.id);
    if (idx >= 0) {
      updated[idx] = editingRes as ResearchItem;
    } else {
      updated.push(editingRes as ResearchItem);
    }
    setResearchList(updated);
    setIsResModalOpen(false);
    setEditingRes(null);
  };

  const handleDeleteRes = () => {
    if (!deleteResTarget) return;
    setResearchList((prev) => prev.filter((r) => r.id !== deleteResTarget.id));
    setDeleteResTarget(null);
  };

  const handleMoveRes = (index: number, direction: 'up' | 'down') => {
    const newList = [...researchList];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setResearchList(newList);
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px] pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin-panel5463/manage-departments"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0093DD] hover:underline mb-2 no-underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Manage Departments
          </Link>
          <AdminPageHeader
            title={deptName ? `Manage ${deptName}` : 'Manage Department'}
            subtitle={`Full no-code control for /departments/${slug} — Hero, HOD Message, Programs, Faculty, Allied Faculty & Research.`}
          />
        </div>

        <AdminButton
          onClick={handleSaveAll}
          disabled={saving || uploading}
          className="bg-[#0093DD] hover:bg-[#007BB8] text-white flex items-center gap-2 px-6"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving Changes...' : 'Save All Changes'}
        </AdminButton>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* ── 0. BASIC INFORMATION ── */}
      {canAccessDepartmentSection(adminProfile?.role, 'basic') && (
        <AdminCard>
          <button
          onClick={() => toggleAccordion('basic')}
          className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors rounded-t-lg border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 font-bold text-base text-[#1F2937]">
            <BookOpen className="w-5 h-5 text-[#0093DD]" />
            <span>0. Department Meta Info</span>
          </div>
          {accordions.basic ? (
            <ChevronDown className="w-5 h-5 text-[#6B7280]" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          )}
        </button>

        {accordions.basic && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Department Full Name">
                <AdminInput
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g. Department of Electrical Engineering"
                />
              </AdminFormGroup>

              <AdminFormGroup label="Short Name / Code">
                <AdminInput
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="e.g. EE"
                />
              </AdminFormGroup>
            </div>

            <AdminFormGroup label="Overview Description">
              <AdminTextarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of department goals..."
              />
            </AdminFormGroup>
          </div>
        )}
      </AdminCard>
      )}

      {/* ── 1. HERO BANNER SECTION ── */}
      {canAccessDepartmentSection(adminProfile?.role, 'hero') && (
      <AdminCard>
        <button
          onClick={() => toggleAccordion('hero')}
          className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors rounded-t-lg border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 font-bold text-base text-[#1F2937]">
            <span className="w-7 h-7 rounded bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center text-xs font-bold">1</span>
            <span>Hero Banner</span>
          </div>
          {accordions.hero ? (
            <ChevronDown className="w-5 h-5 text-[#6B7280]" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          )}
        </button>

        {accordions.hero && (
          <div className="p-6 space-y-4">
            <AdminFormGroup label="Department Page Title">
              <AdminInput
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Department Page Title"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Hero Subtitle">
              <AdminInput
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Academic Excellence & Innovation"
              />
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
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setHeroImageUrl, { aspectRatio: 16 / 9, title: 'Crop Hero Banner Image (16:9 Wide)' })}
                    />
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
      </AdminCard>
      )}

      {/* ── 2. HOD'S MESSAGE SECTION ── */}
      {canAccessDepartmentSection(adminProfile?.role, 'hod') && (
      <AdminCard>
        <button
          onClick={() => toggleAccordion('hod')}
          className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors rounded-t-lg border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 font-bold text-base text-[#1F2937]">
            <span className="w-7 h-7 rounded bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center text-xs font-bold">2</span>
            <span>HOD's Message</span>
          </div>
          {accordions.hod ? (
            <ChevronDown className="w-5 h-5 text-[#6B7280]" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          )}
        </button>

        {accordions.hod && (
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Basic Information</h4>
              <AdminFormGroup label="Section Heading">
                <AdminInput
                  value={hodHeading}
                  onChange={(e) => setHodHeading(e.target.value)}
                  placeholder="HOD'S MESSAGE"
                />
              </AdminFormGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormGroup label="HOD Name">
                  <AdminInput
                    value={hodName}
                    onChange={(e) => setHodName(e.target.value)}
                    placeholder="Dr. Head of Department"
                  />
                </AdminFormGroup>

                <AdminFormGroup label="HOD Designation">
                  <AdminInput
                    value={hodDesignation}
                    onChange={(e) => setHodDesignation(e.target.value)}
                    placeholder={`Head, ${deptName || 'Department'}`}
                  />
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
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setHodPhotoUrl, { aspectRatio: 13 / 15, title: 'Crop HOD Photograph (13:15 Rectangle)' })}
                      />
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
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormGroup label="HOD Email">
                  <AdminInput
                    value={hodEmail}
                    onChange={(e) => setHodEmail(e.target.value)}
                    placeholder="hod@multan.nu.edu.pk"
                  />
                </AdminFormGroup>
                <AdminFormGroup label="HOD Phone">
                  <AdminInput
                    value={hodPhone}
                    onChange={(e) => setHodPhone(e.target.value)}
                    placeholder="+92 (61) 111-128-128"
                  />
                </AdminFormGroup>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Profile Content</h4>
              <AdminFormGroup label="HOD Message / Overview Paragraph">
                <AdminTextarea
                  rows={4}
                  value={hodMessage}
                  onChange={(e) => setHodMessage(e.target.value)}
                  placeholder="Welcome message text..."
                />
              </AdminFormGroup>

              <AdminFormGroup label="Education">
                <AdminTextarea
                  rows={3}
                  value={hodEducation}
                  onChange={(e) => setHodEducation(e.target.value)}
                  placeholder="Ph.D. degree details..."
                />
              </AdminFormGroup>
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Academic Details</h4>
              <AdminFormGroup label="Publications">
                <AdminTextarea
                  rows={4}
                  value={hodPublications}
                  onChange={(e) => setHodPublications(e.target.value)}
                  placeholder="List of journal and conference publications..."
                />
              </AdminFormGroup>

              <AdminFormGroup label="Collaborations at National and International Level">
                <AdminTextarea
                  rows={4}
                  value={hodCollaborations}
                  onChange={(e) => setHodCollaborations(e.target.value)}
                  placeholder="Academic and research collaborations..."
                />
              </AdminFormGroup>

              <AdminFormGroup label="Detail of Funded Projects">
                <AdminTextarea
                  rows={4}
                  value={hodProjects}
                  onChange={(e) => setHodProjects(e.target.value)}
                  placeholder="HEC grants, sponsored research projects..."
                />
              </AdminFormGroup>
            </div>
          </div>
        )}
      </AdminCard>
      )}

      {/* ── 3. DEGREE PROGRAMS SECTION ── */}
      {canAccessDepartmentSection(adminProfile?.role, 'programs') && (
      <AdminCard>
        <button
          onClick={() => toggleAccordion('programs')}
          className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors rounded-t-lg border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 font-bold text-base text-[#1F2937]">
            <span className="w-7 h-7 rounded bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center text-xs font-bold">3</span>
            <span>Degree Programs ({programsList.length} Items)</span>
          </div>
          {accordions.programs ? (
            <ChevronDown className="w-5 h-5 text-[#6B7280]" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          )}
        </button>

        {accordions.programs && (
          <div className="p-6 space-y-4">
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
              <h4 className="text-sm font-bold text-[#374151]">Degree Programs List</h4>
              <AdminButton variant="primary" onClick={handleOpenAddProg} icon={<Plus className="w-4 h-4" />}>
                Add Program
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
      </AdminCard>
      )}

      {/* ── 4. DEPARTMENT FACULTY SECTION ── */}
      {canAccessDepartmentSection(adminProfile?.role, 'faculty') && (
      <AdminCard>
        <button
          onClick={() => toggleAccordion('faculty')}
          className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors rounded-t-lg border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 font-bold text-base text-[#1F2937]">
            <span className="w-7 h-7 rounded bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center text-xs font-bold">4</span>
            <span>Department Faculty ({facultyList.length} Members)</span>
          </div>
          {accordions.faculty ? (
            <ChevronDown className="w-5 h-5 text-[#6B7280]" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          )}
        </button>

        {accordions.faculty && (
          <div className="p-6 space-y-4">
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
              <h4 className="text-sm font-bold text-[#374151]">Department Faculty List</h4>
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

                  <div className="flex items-center gap-2 self-end sm:self-center">
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
      </AdminCard>
      )}

      {/* ── 5. ALLIED FACULTY SECTION ── */}
      {canAccessDepartmentSection(adminProfile?.role, 'alliedFaculty') && (
      <AdminCard>
        <button
          onClick={() => toggleAccordion('alliedFaculty')}
          className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors rounded-t-lg border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 font-bold text-base text-[#1F2937]">
            <span className="w-7 h-7 rounded bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center text-xs font-bold">5</span>
            <span>Allied Faculty ({alliedFacultyList.length} Members)</span>
          </div>
          {accordions.alliedFaculty ? (
            <ChevronDown className="w-5 h-5 text-[#6B7280]" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          )}
        </button>

        {accordions.alliedFaculty && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <AdminFormGroup label="Section Heading">
                <AdminInput
                  value={alliedFacultyHeading}
                  onChange={(e) => setAlliedFacultyHeading(e.target.value)}
                />
              </AdminFormGroup>
              <AdminFormGroup label="Show Section on Public Website">
                <AdminToggle
                  checked={showAlliedFacultySection}
                  onChange={(val) => setShowAlliedFacultySection(val)}
                  label={showAlliedFacultySection ? "Show on Website (ON)" : "Show on Website (OFF)"}
                  description="Toggle whether the Allied Faculty section appears on public website."
                />
              </AdminFormGroup>
            </div>

            <div className="flex justify-between items-center pt-2">
              <h4 className="text-sm font-bold text-[#374151]">Allied Faculty List</h4>
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

                  <div className="flex items-center gap-2 self-end sm:self-center">
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
      </AdminCard>
      )}

      {/* ── 6. RESEARCH GROUPS SECTION ── */}
      {canAccessDepartmentSection(adminProfile?.role, 'research') && (
      <AdminCard>
        <button
          onClick={() => toggleAccordion('research')}
          className="w-full flex items-center justify-between p-4 bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-colors rounded-t-lg border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div className="flex items-center gap-2 font-bold text-base text-[#1F2937]">
            <span className="w-7 h-7 rounded bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center text-xs font-bold">6</span>
            <span>Research Groups & Areas ({researchList.length} Items)</span>
          </div>
          {accordions.research ? (
            <ChevronDown className="w-5 h-5 text-[#6B7280]" />
          ) : (
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          )}
        </button>

        {accordions.research && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AdminFormGroup label="Section Heading">
                <AdminInput value={researchHeading} onChange={(e) => setResearchHeading(e.target.value)} />
              </AdminFormGroup>
              <AdminFormGroup label="Explore Link Text">
                <AdminInput value={exploreResearchText} onChange={(e) => setExploreResearchText(e.target.value)} />
              </AdminFormGroup>
              <AdminFormGroup label="Explore Destination Link">
                <AdminInput value={exploreResearchUrl} onChange={(e) => setExploreResearchUrl(e.target.value)} />
              </AdminFormGroup>
            </div>

            <div className="flex justify-between items-center pt-2">
              <h4 className="text-sm font-bold text-[#374151]">Research Areas List</h4>
              <AdminButton variant="primary" onClick={handleOpenAddRes} icon={<Plus className="w-4 h-4" />}>
                Add Research Area
              </AdminButton>
            </div>

            <div className="space-y-3">
              {researchList.map((res, idx) => (
                <AdminCard key={res.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center flex-shrink-0 font-bold border border-[#E5E7EB]">
                      <BookOpen className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">Order #{idx + 1}</span>
                        {!res.is_visible && (
                          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Hidden</span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-[#1F2937]">{res.title}</h4>
                      <p className="text-xs text-[#6B7280] line-clamp-1">{res.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleMoveRes(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleMoveRes(idx, 'down')}
                      disabled={idx === researchList.length - 1}
                      className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <AdminButton variant="secondary" onClick={() => { setEditingRes({ ...res }); setIsResModalOpen(true); }} icon={<Edit2 className="w-4 h-4" />}>
                      Edit
                    </AdminButton>

                    <AdminButton variant="danger" onClick={() => setDeleteResTarget(res)} icon={<Trash2 className="w-4 h-4" />}>
                      Remove
                    </AdminButton>
                  </div>
                </AdminCard>
              ))}
            </div>
          </div>
        )}
      </AdminCard>
      )}

      {/* Program Modal */}
      <AdminModal
        isOpen={isProgModalOpen}
        onClose={() => setIsProgModalOpen(false)}
        title={editingProg?.id ? 'Edit Program' : 'Add Program'}
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsProgModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveProgram}>
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
              placeholder="e.g. BS Electrical Engineering"
            />
          </AdminFormGroup>
          <AdminFormGroup label="Subtitle">
            <AdminInput
              value={editingProg?.subtitle || ''}
              onChange={(e) => setEditingProg((prev) => ({ ...prev, subtitle: e.target.value }))}
              placeholder="e.g. 4 Years Degree Program"
            />
          </AdminFormGroup>
          <AdminFormGroup label="Description">
            <AdminTextarea
              rows={3}
              value={editingProg?.description || ''}
              onChange={(e) => setEditingProg((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Program summary..."
            />
          </AdminFormGroup>
          <AdminFormGroup label="Image URL">
            <div className="flex gap-2">
              <AdminInput
                value={editingProg?.image || ''}
                onChange={(e) => setEditingProg((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="https://..."
              />
              <label className="bg-[#0093DD] hover:bg-[#007BB8] text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer flex-shrink-0">
                <Upload className="w-4 h-4" /> Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, (url) => setEditingProg((prev) => ({ ...prev, image: url })))}
                />
              </label>
            </div>
          </AdminFormGroup>
          <AdminToggle
            label="Visible on Website"
            checked={editingProg?.is_visible ?? true}
            onChange={(checked) => setEditingProg((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      {/* Research Modal */}
      <AdminModal
        isOpen={isResModalOpen}
        onClose={() => setIsResModalOpen(false)}
        title={editingRes?.id ? 'Edit Research Area' : 'Add Research Area'}
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsResModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveRes}>
              Save Research Area
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <AdminFormGroup label="Research Area Title" required>
            <AdminInput
              value={editingRes?.title || ''}
              onChange={(e) => setEditingRes((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Artificial Intelligence & Robotics"
            />
          </AdminFormGroup>
          <AdminFormGroup label="Description">
            <AdminTextarea
              rows={3}
              value={editingRes?.description || ''}
              onChange={(e) => setEditingRes((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed focus area description..."
            />
          </AdminFormGroup>
          <AdminFormGroup label="Destination Link URL">
            <AdminInput
              value={editingRes?.url || ''}
              onChange={(e) => setEditingRes((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="https://..."
            />
          </AdminFormGroup>
          <AdminToggle
            label="Visible on Website"
            checked={editingRes?.is_visible ?? true}
            onChange={(checked) => setEditingRes((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      {/* Shared Faculty Edit Modal for Department Faculty */}
      <FacultyEditModal
        isOpen={isFacModalOpen}
        onClose={() => setIsFacModalOpen(false)}
        onSave={handleSaveFacultyModal}
        title={editingFac?.id ? 'Edit Faculty Member' : 'Add Faculty Member'}
        initialData={editingFac}
      />

      {/* Shared Faculty Edit Modal for Allied Faculty */}
      <FacultyEditModal
        isOpen={isAlliedModalOpen}
        onClose={() => setIsAlliedModalOpen(false)}
        onSave={handleSaveAlliedModal}
        title={editingAllied?.id ? 'Edit Allied Faculty Member' : 'Add Allied Faculty Member'}
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

      <DeleteConfirmModal
        isOpen={!!deleteResTarget}
        onClose={() => setDeleteResTarget(null)}
        onConfirm={handleDeleteRes}
        itemTitle={deleteResTarget?.title}
      />

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
