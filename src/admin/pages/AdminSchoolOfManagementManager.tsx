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
import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';
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
  User,
  GraduationCap,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface MgmtProgramItem {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
  display_order: number;
  is_visible: boolean;
}

interface MgmtFacultyItem extends FacultyMemberData {
  id: string;
  name: string;
  designation: string;
  qualification?: string;
  photoUrl?: string;
  display_order: number;
  is_visible: boolean;
}


export default function AdminSchoolOfManagementManager() {
  const [heroTitle, setHeroTitle] = useState('FAST School Of Management');
  const [heroImageUrl, setHeroImageUrl] = useState('');

  // Head of School
  const [headName, setHeadName] = useState('Dr. Head of Department');
  const [headDesignation, setHeadDesignation] = useState('Head, Department of Management Sciences');
  const [headPhotoUrl, setHeadPhotoUrl] = useState('');
  const [headMessage, setHeadMessage] = useState(
    'Welcome to the FAST School of Management at Multan Campus. Our degree programs foster strategic business leadership, corporate management, marketing, finance, and entrepreneurship.'
  );
  const [headEmail, setHeadEmail] = useState('');
  const [headPhone, setHeadPhone] = useState('');
  const [headEducation, setHeadEducation] = useState('');
  const [headPublications, setHeadPublications] = useState('');
  const [headCollaborations, setHeadCollaborations] = useState('');
  const [headProjects, setHeadProjects] = useState('');


  // Management Programs List
  const [programsList, setProgramsList] = useState<MgmtProgramItem[]>([
    {
      id: 'bba',
      title: 'Bachelor of Business Administration (BBA)',
      subtitle: '4 Years Undergraduate Program',
      display_order: 1,
      is_visible: true,
    },
    {
      id: 'mba',
      title: 'Master of Business Administration (MBA)',
      subtitle: '2 Years Graduate Program',
      display_order: 2,
      is_visible: true,
    },
    {
      id: 'phd-mgmt',
      title: 'PhD Management Sciences',
      subtitle: 'Postgraduate Research Program',
      display_order: 3,
      is_visible: true,
    },
  ]);

  // Management Faculty List
  const [facultyList, setFacultyList] = useState<MgmtFacultyItem[]>([
    {
      id: 'fac-1',
      name: 'Dr. Head of Department',
      designation: 'Professor & HOD',
      qualification: 'PhD Management Sciences',
      display_order: 1,
      is_visible: true,
    },
    {
      id: 'fac-2',
      name: 'Dr. Management Faculty Member 2',
      designation: 'Associate Professor',
      qualification: 'PhD Business Administration',
      display_order: 2,
      is_visible: true,
    },
    {
      id: 'fac-3',
      name: 'Dr. Management Faculty Member 3',
      designation: 'Assistant Professor',
      qualification: 'PhD Finance',
      display_order: 3,
      is_visible: true,
    },
  ]);

  // Allied Faculty State
  const [showAlliedFacultySection, setShowAlliedFacultySection] = useState(true);
  const [alliedFacultyHeading, setAlliedFacultyHeading] = useState('ALLIED FACULTY');
  const [alliedFacultyList, setAlliedFacultyList] = useState<MgmtFacultyItem[]>([]);

  // Modals state
  const [isProgModalOpen, setIsProgModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<Partial<MgmtProgramItem> | null>(null);
  const [deleteProgTarget, setDeleteProgTarget] = useState<MgmtProgramItem | null>(null);

  const [isFacModalOpen, setIsFacModalOpen] = useState(false);
  const [editingFac, setEditingFac] = useState<Partial<MgmtFacultyItem> | null>(null);
  const [deleteFacTarget, setDeleteFacTarget] = useState<MgmtFacultyItem | null>(null);

  const [isAlliedModalOpen, setIsAlliedModalOpen] = useState(false);
  const [editingAllied, setEditingAllied] = useState<Partial<MgmtFacultyItem> | null>(null);
  const [deleteAlliedTarget, setDeleteAlliedTarget] = useState<MgmtFacultyItem | null>(null);


  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    const savedData = await cmsService.getSetting<any>('school_of_management_content', null);
    if (savedData) {
      if (savedData.heroTitle) setHeroTitle(savedData.heroTitle);
      if (savedData.heroImageUrl) setHeroImageUrl(savedData.heroImageUrl);
      if (savedData.headName) setHeadName(savedData.headName);
      if (savedData.headDesignation) setHeadDesignation(savedData.headDesignation);
      if (savedData.headPhotoUrl) setHeadPhotoUrl(savedData.headPhotoUrl);
      if (savedData.headMessage) setHeadMessage(savedData.headMessage);
      if (savedData.headEmail || savedData.hodEmail) setHeadEmail(savedData.headEmail || savedData.hodEmail);
      if (savedData.headPhone || savedData.hodPhone) setHeadPhone(savedData.headPhone || savedData.hodPhone);
      if (savedData.headEducation || savedData.hodEducation) setHeadEducation(savedData.headEducation || savedData.hodEducation);
      if (savedData.headPublications || savedData.hodPublications) setHeadPublications(savedData.headPublications || savedData.hodPublications);
      if (savedData.headCollaborations || savedData.hodCollaborations) setHeadCollaborations(savedData.headCollaborations || savedData.hodCollaborations);
      if (savedData.headProjects || savedData.hodProjects) setHeadProjects(savedData.headProjects || savedData.hodProjects);
      if (savedData.programsList && savedData.programsList.length > 0) {
        setProgramsList(savedData.programsList);
      }
      if (savedData.facultyList && savedData.facultyList.length > 0) {
        setFacultyList(savedData.facultyList);
      }
      if (savedData.showAlliedFacultySection !== undefined) setShowAlliedFacultySection(savedData.showAlliedFacultySection);
      else if (savedData.alliedFacultyVisible !== undefined) setShowAlliedFacultySection(savedData.alliedFacultyVisible);
      if (savedData.alliedFacultyHeading) setAlliedFacultyHeading(savedData.alliedFacultyHeading);
      if (savedData.alliedFacultyList && Array.isArray(savedData.alliedFacultyList)) {
        setAlliedFacultyList(savedData.alliedFacultyList);
      }

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { cropperProps, openCropper } = useImageCropper();

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setUrlFn: (url: string) => void,
    opts?: { aspectRatio?: number; cropShape?: 'rect' | 'round'; title?: string }
  ) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          setUrlFn(res.publicUrl);
        } else {
          alert(`Upload failed: ${res.error}`);
        }
      },
      opts
    );
  };


  // Program CRUD Handlers
  const handleOpenAddProg = () => {
    setEditingProg({
      id: `prog-${Date.now()}`,
      title: 'New Management Program',
      subtitle: '4 Years Undergraduate Program',
      description: '',
      image: '',
      display_order: programsList.length + 1,
      is_visible: true,
    });
    setIsProgModalOpen(true);
  };

  const handleOpenEditProg = (prog: MgmtProgramItem) => {
    setEditingProg({ ...prog });
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
      updated[idx] = editingProg as MgmtProgramItem;
    } else {
      updated.push(editingProg as MgmtProgramItem);
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
      id: `fac-${Date.now()}`,
      name: 'New Faculty Member',
      designation: 'Assistant Professor',
      qualification: 'PhD Business Administration',
      photoUrl: '',
      display_order: facultyList.length + 1,
      is_visible: true,
    });
    setIsFacModalOpen(true);
  };

  const handleOpenEditFac = (fac: MgmtFacultyItem) => {
    setEditingFac({ ...fac });
    setIsFacModalOpen(true);
  };

  const handleSaveFacModal = (savedData: FacultyMemberData) => {
    const updated = [...facultyList];
    const itemToSave = { ...editingFac, ...savedData } as MgmtFacultyItem;
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
      id: `allied-mgmt-${Date.now()}`,
      name: 'Dr. New Allied Faculty Member',
      designation: 'Associated Professor',
      qualification: 'PhD Management Sciences',
      photoUrl: '',
      display_order: alliedFacultyList.length + 1,
      is_visible: true,
    });
    setIsAlliedModalOpen(true);
  };

  const handleOpenEditAllied = (fac: MgmtFacultyItem) => {
    setEditingAllied({ ...fac });
    setIsAlliedModalOpen(true);
  };

  const handleSaveAlliedModal = (savedData: FacultyMemberData) => {
    const updated = [...alliedFacultyList];
    const itemToSave = { ...editingAllied, ...savedData } as MgmtFacultyItem;
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
      headEmail,
      headPhone,
      headEducation,
      headPublications,
      headCollaborations,
      headProjects,
      programsList,
      facultyList,
      showAlliedFacultySection,
      alliedFacultyHeading,
      alliedFacultyList,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('school_of_management_content', payload, 'School of Management page content');

    if (res.success) {
      setMessage({ type: 'success', text: 'School of Management settings saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/manage-departments"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to Manage Departments"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Department of Management Sciences Page"
          subtitle="Manage Management Sciences page, HOD message, programs, department faculty and allied faculty."
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

      {/* Hero Section */}
      <AdminSection title="School Hero Banner" description="Manage page title and hero background image.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Page Hero Title">
            <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="FAST School Of Management" />
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
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setHeroImageUrl, { aspectRatio: 16 / 9, title: 'Crop Hero Banner Image (16:9 Wide)' })} />
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

      {/* Head of Department Section */}
      <AdminSection title="Head, Department of Management Sciences" description="Manage HOD details, photograph, contact information, and academic profile.">
        <AdminCard className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Head Name">
                <AdminInput value={headName} onChange={(e) => setHeadName(e.target.value)} placeholder="Dr. Head Name" />
              </AdminFormGroup>

              <AdminFormGroup label="Designation">
                <AdminInput value={headDesignation} onChange={(e) => setHeadDesignation(e.target.value)} placeholder="Head, Department of Management Sciences" />
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
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setHeadPhotoUrl, { aspectRatio: 3 / 4, title: 'Crop Head Photograph (3:4 Rectangle)' })} />
                  </label>

                  {headPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => setHeadPhotoUrl('')}
                      className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </AdminFormGroup>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Email Address">
                <AdminInput value={headEmail} onChange={(e) => setHeadEmail(e.target.value)} placeholder="hod.mgmt@multan.nu.edu.pk" />
              </AdminFormGroup>
              <AdminFormGroup label="Phone Number">
                <AdminInput value={headPhone} onChange={(e) => setHeadPhone(e.target.value)} placeholder="+92 (61) 111-128-128" />
              </AdminFormGroup>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Profile Content</h4>
            <AdminFormGroup label="HOD Message / Overview Paragraph">
              <AdminTextarea rows={4} value={headMessage} onChange={(e) => setHeadMessage(e.target.value)} placeholder="Welcome message text..." />
            </AdminFormGroup>

            <AdminFormGroup label="Education">
              <AdminTextarea rows={3} value={headEducation} onChange={(e) => setHeadEducation(e.target.value)} placeholder="Ph.D. in Management Sciences / Business Administration..." />
            </AdminFormGroup>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Academic Details</h4>
            <AdminFormGroup label="Publications">
              <AdminTextarea rows={4} value={headPublications} onChange={(e) => setHeadPublications(e.target.value)} placeholder="List of journal and conference publications..." />
            </AdminFormGroup>

            <AdminFormGroup label="Collaborations at National and International Level">
              <AdminTextarea rows={4} value={headCollaborations} onChange={(e) => setHeadCollaborations(e.target.value)} placeholder="Academic and research collaborations..." />
            </AdminFormGroup>

            <AdminFormGroup label="Detail of Funded Projects">
              <AdminTextarea rows={4} value={headProjects} onChange={(e) => setHeadProjects(e.target.value)} placeholder="HEC grants, corporate projects, sponsored research..." />
            </AdminFormGroup>
          </div>
        </AdminCard>
      </AdminSection>

      {/* Programs Section */}
      <AdminSection
        title="Management Degree Programs"
        description="Add, edit, reorder, or remove degree programs for FAST School of Management."
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-[#374151]">Degree Programs List</h4>
          <AdminButton variant="primary" onClick={handleOpenAddProg} icon={<Plus className="w-4 h-4" />}>
            Add Management Program
          </AdminButton>
        </div>

        <div className="space-y-3">
          {programsList.map((prog, idx) => (
            <AdminCard key={prog.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center flex-shrink-0 font-bold border border-[#E5E7EB]">
                  <GraduationCap className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                      Order #{idx + 1}
                    </span>
                    <span className="text-xs text-[#6B7280]">{prog.subtitle}</span>
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

                <AdminButton variant="secondary" onClick={() => handleOpenEditProg(prog)} icon={<Edit2 className="w-4 h-4" />}>
                  Edit
                </AdminButton>

                <AdminButton variant="danger" onClick={() => setDeleteProgTarget(prog)} icon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      </AdminSection>

      {/* Faculty Section */}
      <AdminSection
        title="Management Faculty Members"
        description="Add, edit, reorder, or remove faculty members assigned to FAST School of Management."
      >
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-sm font-bold text-[#374151]">Faculty List</h4>
          <AdminButton variant="primary" onClick={handleOpenAddFac} icon={<Plus className="w-4 h-4" />}>
            Add Management Faculty Member
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
                    <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                      Order #{idx + 1}
                    </span>
                    <span className="text-xs text-[#6B7280]">{fac.qualification}</span>
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

                <AdminButton variant="secondary" onClick={() => handleOpenEditFac(fac)} icon={<Edit2 className="w-4 h-4" />}>
                  Edit Faculty Member
                </AdminButton>

                <AdminButton variant="danger" onClick={() => setDeleteFacTarget(fac)} icon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      </AdminSection>


      {/* Allied Faculty Section */}
      <AdminSection
        title="Allied Faculty Section"
        description="Manage Allied Faculty members and section visibility on the public website."
        action={
          <AdminButton variant="primary" onClick={handleOpenAddAllied} icon={<Plus className="w-4 h-4" />}>
            Add Allied Faculty Member
          </AdminButton>
        }
      >
        <AdminCard className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <AdminFormGroup label="Section Heading">
              <AdminInput
                value={alliedFacultyHeading}
                onChange={(e) => setAlliedFacultyHeading(e.target.value)}
                placeholder="ALLIED FACULTY"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Show Section on Public Website">
              <AdminToggle
                checked={showAlliedFacultySection}
                onChange={(val) => setShowAlliedFacultySection(val)}
                label={showAlliedFacultySection ? "Show on Website (ON)" : "Show on Website (OFF)"}
                description="Toggle whether the Allied Faculty section appears on the public website."
              />
            </AdminFormGroup>
          </div>

          <div className="space-y-3 pt-2">
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

                  <AdminButton variant="secondary" onClick={() => handleOpenEditAllied(fac)} icon={<Edit2 className="w-4 h-4" />}>
                    Edit Faculty Member
                  </AdminButton>

                  <AdminButton variant="danger" onClick={() => setDeleteAlliedTarget(fac)} icon={<Trash2 className="w-4 h-4" />}>
                    Delete
                  </AdminButton>
                </div>
              </AdminCard>
            ))}
          </div>
        </AdminCard>
      </AdminSection>

      {/* Edit Program Modal */}
      <AdminModal
        isOpen={isProgModalOpen}
        onClose={() => setIsProgModalOpen(false)}
        title={editingProg?.id ? 'Edit Management Program' : 'Add Management Program'}
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
              placeholder="e.g. Bachelor of Business Administration (BBA)"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Program Subtitle / Duration">
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
                  <User className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
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

      {/* Edit Faculty Modal */}
      <FacultyEditModal
        isOpen={isFacModalOpen}
        onClose={() => setIsFacModalOpen(false)}
        onSave={handleSaveFacModal}
        title={editingFac?.id ? 'Edit Management Faculty Member' : 'Add Management Faculty Member'}
        initialData={editingFac}
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

      {/* Edit Allied Faculty Modal */}
      <FacultyEditModal
        isOpen={isAlliedModalOpen}
        onClose={() => setIsAlliedModalOpen(false)}
        onSave={handleSaveAlliedModal}
        title={editingAllied?.id ? 'Edit Management Allied Faculty Member' : 'Add Management Allied Faculty Member'}
        initialData={editingAllied}
      />

      <DeleteConfirmModal
        isOpen={!!deleteAlliedTarget}
        onClose={() => setDeleteAlliedTarget(null)}
        onConfirm={handleDeleteAllied}
        itemTitle={deleteAlliedTarget?.name}
      />

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
