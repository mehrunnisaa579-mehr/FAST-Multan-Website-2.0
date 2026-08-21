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
import { cmsService } from '../../services/cmsService';
import { archiveService } from '../../services/archiveService';
import { supabase } from '../../lib/supabase';
import { adminOfficesList, initialStaffMembers } from '../../data/staffData';
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
  Building2,
  Image as ImageIcon,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface OfficeItem {
  id: string;
  title: string;
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

export default function AdminAdministrationStaffManager() {
  // Hero Settings State
  const [heroTitle, setHeroTitle] = useState('Administration Staff');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [uploadingHero, setUploadingHero] = useState(false);
  const [savingHero, setSavingHero] = useState(false);

  const [offices, setOffices] = useState<OfficeItem[]>(
    adminOfficesList.map((off, idx) => ({
      id: off.id,
      title: off.title,
      display_order: idx + 1,
      is_visible: true,
    }))
  );

  const [selectedOffice, setSelectedOffice] = useState<string>('admin-office');
  const [staffList, setStaffList] = useState<AdminStaffItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Partial<OfficeItem> | null>(null);
  const [deleteOfficeTarget, setDeleteOfficeTarget] = useState<OfficeItem | null>(null);

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Partial<AdminStaffItem> | null>(null);
  const [deleteStaffTarget, setDeleteStaffTarget] = useState<AdminStaffItem | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const heroData = await cmsService.getSetting<any>('admin_staff_hero_settings', null);
    if (heroData) {
      if (heroData.heroTitle) setHeroTitle(heroData.heroTitle);
      if (heroData.heroImageUrl || heroData.heroImage) {
        setHeroImageUrl(heroData.heroImageUrl || heroData.heroImage);
      }
    }

    const dbStaff = await cmsService.getAdminStaff();
    const savedOffices = await cmsService.getSetting<OfficeItem[]>('admin_offices_list', []);

    if (savedOffices && savedOffices.length > 0) {
      setOffices(savedOffices);
    }

    if (dbStaff && dbStaff.length > 0) {
      setStaffList(dbStaff);
    } else {
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    const res = await cmsService.uploadMedia(file);
    setUploadingHero(false);

    if (res.success && res.publicUrl) {
      setHeroImageUrl(res.publicUrl);
    } else {
      alert(`Hero image upload failed: ${res.error || 'Unknown error'}`);
    }
  };

  const handleRemoveHeroImage = () => {
    setHeroImageUrl('');
  };

  const handleSaveHeroSettings = async () => {
    setSavingHero(true);
    setMessage(null);

    const payload = {
      heroTitle: heroTitle.trim() || 'Administration Staff',
      heroImageUrl,
      heroImage: heroImageUrl,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting(
      'admin_staff_hero_settings',
      payload,
      'Administration Staff Hero Settings'
    );

    setSavingHero(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Administration Staff Hero Settings saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save hero settings.' });
    }
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

  // Office Handlers
  const handleOpenAddOffice = () => {
    setEditingOffice({
      id: `office-${Date.now()}`,
      title: 'New Administration Office',
      display_order: offices.length + 1,
      is_visible: true,
    });
    setIsOfficeModalOpen(true);
  };

  const handleOpenEditOffice = (office: OfficeItem) => {
    setEditingOffice({ ...office });
    setIsOfficeModalOpen(true);
  };

  const handleSaveOffice = async () => {
    if (!editingOffice?.title?.trim()) {
      alert('Please enter an office title.');
      return;
    }

    const updated = [...offices];
    const idx = updated.findIndex((o) => o.id === editingOffice.id);
    if (idx >= 0) {
      updated[idx] = editingOffice as OfficeItem;
    } else {
      updated.push(editingOffice as OfficeItem);
    }

    setOffices(updated);
    setIsOfficeModalOpen(false);
    await cmsService.saveSetting('admin_offices_list', updated, 'Administration Offices List');
  };

  const handleDeleteOffice = async () => {
    if (!deleteOfficeTarget) return;
    const updated = offices.filter((o) => o.id !== deleteOfficeTarget.id);
    setOffices(updated);
    setDeleteOfficeTarget(null);
    await cmsService.saveSetting('admin_offices_list', updated, 'Administration Offices List');
  };

  // Staff Handlers
  const handleOpenAddStaff = () => {
    const num = staffList.filter((s) => s.office === selectedOffice).length + 1;
    const slug = `${selectedOffice}-staff-${Date.now()}`;
    setEditingStaff({
      slug,
      name: `New Staff Member ${num}`,
      designation: 'Officer / Executive',
      office: selectedOffice,
      photo_url: '',
      email: `${slug}@multan.nu.edu.pk`,
      phone: '+92 (61) 111-128-128',
      extension: '100',
      introduction: 'Staff member biography and role overview...',
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

    setSaving(true);
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
      fetchData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save staff member.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStaff = async () => {
    if (!deleteStaffTarget) return;
    try {
      const res = await archiveService.archiveItem({
        table: 'administration_staff',
        itemId: deleteStaffTarget.id,
        moduleName: 'Administration Staff',
        title: deleteStaffTarget.name,
        subtitle: `${deleteStaffTarget.designation || 'Staff'} (${deleteStaffTarget.office || ''})`,
        image_url: deleteStaffTarget.photo_url,
        itemData: deleteStaffTarget,
      });

      if (!res.success) throw new Error(res.error || 'Failed to archive staff member');

      setStaffList((prev) => prev.filter((s) => s.id !== deleteStaffTarget.id));
      setDeleteStaffTarget(null);
      setMessage({ type: 'success', text: 'Staff member moved to Archive.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to archive staff member.' });
    }
  };

  const handleMoveStaff = (index: number, direction: 'up' | 'down') => {
    const officeStaff = staffList.filter((s) => s.office === selectedOffice);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= officeStaff.length) return;

    const newList = [...staffList];
    const itemA = officeStaff[index];
    const itemB = officeStaff[targetIdx];

    const idxA = newList.findIndex((s) => s.id === itemA.id);
    const idxB = newList.findIndex((s) => s.id === itemB.id);

    if (idxA >= 0 && idxB >= 0) {
      const tempOrder = newList[idxA].display_order;
      newList[idxA].display_order = newList[idxB].display_order;
      newList[idxB].display_order = tempOrder;
      setStaffList([...newList]);
    }
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
          title="Administration Staff Page"
          subtitle="Manage administration offices, staff member cards, photo uploads, and individual profile details."
          action={
            <div className="flex gap-2">
              <AdminButton variant="secondary" onClick={handleOpenAddOffice} icon={<Plus className="w-4 h-4" />}>
                Add Office Category
              </AdminButton>
              <AdminButton variant="primary" onClick={handleOpenAddStaff} icon={<Plus className="w-4 h-4" />}>
                Add Staff Member
              </AdminButton>
            </div>
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

      {/* Administration Staff Hero Settings */}
      <AdminSection
        title="Administration Staff Hero"
        description="Manage the hero title and background image for the public Administration Staff page (/departments/administration-staff)."
      >
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Hero Title">
            <AdminInput
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              placeholder="Administration Staff"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Hero Background Image">
            <div className="flex items-center gap-4">
              <div className="w-32 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {heroImageUrl ? (
                  <img src={heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingHero ? 'Uploading...' : heroImageUrl ? 'Replace Hero Image' : 'Upload Hero Image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleHeroFileUpload} disabled={uploadingHero} />
                </label>

                {heroImageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveHeroImage}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer transition-colors"
                  >
                    Remove Hero Image
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <div className="flex justify-end pt-2">
            <AdminButton variant="primary" onClick={handleSaveHeroSettings} loading={savingHero || uploadingHero} icon={<Save className="w-4 h-4" />}>
              Save Hero Settings
            </AdminButton>
          </div>
        </AdminCard>
      </AdminSection>

      {/* Office Filter Tabs */}
      <AdminSection title="Administration Offices" description="Select an office tab to view and manage its staff members.">
        <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] pb-3">
          {offices.map((off) => (
            <button
              key={off.id}
              type="button"
              onClick={() => setSelectedOffice(off.id)}
              className={`px-3.5 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedOffice === off.id
                  ? 'bg-[#0093DD] text-white shadow-xs'
                  : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{off.title}</span>
            </button>
          ))}
        </div>
      </AdminSection>

      {/* Staff Cards List */}
      <AdminSection
        title={`Staff Members (${offices.find((o) => o.id === selectedOffice)?.title || selectedOffice})`}
        description="Add, edit, reorder, or remove staff members in this office."
      >
        <div className="space-y-3">
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
                    <h4 className="text-base font-bold text-[#1F2937]">{staffMember.name}</h4>
                    <p className="text-xs text-[#6B7280]">{staffMember.designation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleMoveStaff(idx, 'up')}
                    disabled={idx === 0}
                    className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveStaff(idx, 'down')}
                    disabled={idx === staffList.filter((s) => s.office === selectedOffice).length - 1}
                    className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <AdminButton variant="secondary" onClick={() => handleOpenEditStaff(staffMember)} icon={<Edit2 className="w-4 h-4" />}>
                    Edit Staff Profile
                  </AdminButton>

                  <AdminButton variant="danger" onClick={() => setDeleteStaffTarget(staffMember)} icon={<Trash2 className="w-4 h-4" />}>
                    Delete
                  </AdminButton>
                </div>
              </AdminCard>
            ))}
        </div>
      </AdminSection>

      {/* Edit Office Modal */}
      <AdminModal
        isOpen={isOfficeModalOpen}
        onClose={() => setIsOfficeModalOpen(false)}
        title={editingOffice?.id ? 'Edit Office Category' : 'Add Office Category'}
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsOfficeModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveOffice}>
              Save Office
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <AdminFormGroup label="Office Title" required>
            <AdminInput
              value={editingOffice?.title || ''}
              onChange={(e) => setEditingOffice((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Accounts Office"
            />
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Website"
            checked={editingOffice?.is_visible ?? true}
            onChange={(checked) => setEditingOffice((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      {/* Edit Staff Member Modal */}
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
            <AdminButton variant="primary" onClick={handleSaveStaff} loading={saving}>
              Save Staff Profile
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
                  value={editingStaff?.name || ''}
                  onChange={(e) => setEditingStaff((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Full Name"
                />
              </AdminFormGroup>

              <AdminFormGroup label="Profile Slug (Optional)">
                <AdminInput
                  value={editingStaff?.slug || ''}
                  onChange={(e) => setEditingStaff((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g. staff-member-name"
                />
              </AdminFormGroup>
            </div>

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
                  <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{editingStaff?.photo_url ? 'Replace Photo' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (url) => setEditingStaff((prev) => ({ ...prev, photo_url: url })))}
                    />
                  </label>

                  {editingStaff?.photo_url && (
                    <button
                      type="button"
                      onClick={() => setEditingStaff((prev) => ({ ...prev, photo_url: '' }))}
                      className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </AdminFormGroup>
          </div>

          {/* CONTACT INFORMATION */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Contact Information</h4>
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
          </div>

          {/* PROFILE CONTENT */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Profile Content</h4>
            <AdminFormGroup label="Introduction / Overview">
              <AdminTextarea
                rows={4}
                value={editingStaff?.introduction || ''}
                onChange={(e) => setEditingStaff((prev) => ({ ...prev, introduction: e.target.value }))}
                placeholder="Staff member biography, responsibilities, and role overview..."
              />
            </AdminFormGroup>

            <AdminFormGroup label="Education / Qualifications">
              <AdminTextarea
                rows={3}
                value={editingStaff?.education || ''}
                onChange={(e) => setEditingStaff((prev) => ({ ...prev, education: e.target.value }))}
                placeholder="Master Degree / Bachelor Degree in relevant discipline..."
              />
            </AdminFormGroup>
          </div>

          {/* SETTINGS */}
          <div className="pt-2">
            <AdminToggle
              label="Visible on Website"
              checked={editingStaff?.is_visible ?? true}
              onChange={(checked) => setEditingStaff((prev) => ({ ...prev, is_visible: checked }))}
            />
          </div>
        </div>
      </AdminModal>

      <DeleteConfirmModal
        isOpen={!!deleteOfficeTarget}
        onClose={() => setDeleteOfficeTarget(null)}
        onConfirm={handleDeleteOffice}
        itemTitle={deleteOfficeTarget?.title}
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
