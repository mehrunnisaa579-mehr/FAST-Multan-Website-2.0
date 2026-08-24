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
import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';
import { cmsService } from '../../services/cmsService';
import { archiveService } from '../../services/archiveService';
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
  Code,
  Sparkles,
  Palette,
  Terminal,
  Cpu,
  Globe,
  Database,
  Shield,
  Zap,
  Award,
  Monitor,
  Layout,
  ImageIcon,
} from 'lucide-react';

export interface WebTeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  iconName: string;
  customIconUrl?: string;
  display_order: number;
  is_visible: boolean;
}

export interface WebTeamSettings {
  pageTitle: string;
  pageSubtitle: string;
  heroImageUrl?: string;
  teamMembers: WebTeamMember[];
}

export const ICON_OPTIONS = [
  { name: 'Code', icon: Code },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Palette', icon: Palette },
  { name: 'Terminal', icon: Terminal },
  { name: 'Cpu', icon: Cpu },
  { name: 'Globe', icon: Globe },
  { name: 'Database', icon: Database },
  { name: 'Shield', icon: Shield },
  { name: 'Zap', icon: Zap },
  { name: 'Award', icon: Award },
  { name: 'Monitor', icon: Monitor },
  { name: 'Layout', icon: Layout },
];

export const defaultWebTeamMembers: WebTeamMember[] = [
  {
    id: 'member-1',
    name: 'Syed Shahzaneer Ahmed',
    role: 'Lead Full-Stack Developer',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    iconName: 'Code',
    display_order: 1,
    is_visible: true,
  },
  {
    id: 'member-2',
    name: 'Muhammad Umar',
    role: 'Frontend Architect',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    iconName: 'Layout',
    display_order: 2,
    is_visible: true,
  },
  {
    id: 'member-3',
    name: 'Ali Raza',
    role: 'UI/UX & Graphics Lead',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    iconName: 'Palette',
    display_order: 3,
    is_visible: true,
  },
  {
    id: 'member-4',
    name: 'Hassan Mustafa',
    role: 'Backend & Supabase Specialist',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    iconName: 'Database',
    display_order: 4,
    is_visible: true,
  },
  {
    id: 'member-5',
    name: 'Zainab Fatima',
    role: 'CMS Content & Quality Lead',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    iconName: 'Sparkles',
    display_order: 5,
    is_visible: true,
  },
  {
    id: 'member-6',
    name: 'Usman Khalid',
    role: 'DevOps & Performance Engineer',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    iconName: 'Terminal',
    display_order: 6,
    is_visible: true,
  },
];

export default function AdminWebTeamManager() {
  const [pageTitle, setPageTitle] = useState('DevQuad — Web Development Team');
  const [pageSubtitle, setPageSubtitle] = useState(
    'Meet the talented developers, designers, and engineers behind the FAST-NUCES Multan Campus digital experience.'
  );
  const [heroImageUrl, setHeroImageUrl] = useState('');

  const [teamMembers, setTeamMembers] = useState<WebTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<WebTeamMember> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WebTeamMember | null>(null);

  const { cropperProps, openCropper } = useImageCropper();

  const fetchData = async () => {
    setLoading(true);
    const data = await cmsService.getSetting<any>('webteam_content', null);
    if (data) {
      if (data.pageTitle) setPageTitle(data.pageTitle);
      if (data.pageSubtitle) setPageSubtitle(data.pageSubtitle);
      if (data.heroImageUrl || data.heroImage) {
        setHeroImageUrl(data.heroImageUrl || data.heroImage);
      }
      if (Array.isArray(data.teamMembers) && data.teamMembers.length > 0) {
        setTeamMembers(data.teamMembers);
      } else {
        setTeamMembers(defaultWebTeamMembers);
      }
    } else {
      setTeamMembers(defaultWebTeamMembers);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          setHeroImageUrl(res.publicUrl);
        } else {
          alert(`Hero image upload failed: ${res.error || 'Unknown error'}`);
        }
      },
      { aspectRatio: 16 / 9, title: 'Crop Web Team Hero Image (16:9 Wide)' }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          setEditingMember((prev) => ({ ...prev, photoUrl: res.publicUrl }));
        } else {
          alert(`Photo upload failed: ${res.error || 'Unknown error'}`);
        }
      },
      { aspectRatio: 3 / 4, title: 'Crop Team Member Portrait Photo (3:4 Tall)' }
    );
  };

  const handleCustomIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          setEditingMember((prev) => ({ ...prev, customIconUrl: res.publicUrl }));
        } else {
          alert(`Icon upload failed: ${res.error || 'Unknown error'}`);
        }
      },
      { aspectRatio: 1, cropShape: 'round', title: 'Crop Team Member Circular Logo (1:1 Circle)' }
    );
  };

  const handleSavePageSettings = async () => {
    setSaving(true);
    setMessage(null);

    const payload: WebTeamSettings = {
      pageTitle: pageTitle.trim() || 'DevQuad — Web Development Team',
      pageSubtitle: pageSubtitle.trim(),
      heroImageUrl,
      teamMembers,
    };

    const res = await cmsService.saveSetting('webteam_content', payload, 'Web Team Page Content');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Web Team Page settings and member cards saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save settings.' });
    }
  };

  const handleOpenAddMember = () => {
    setEditingMember({
      id: `member-${Date.now()}`,
      name: 'New Team Member',
      role: 'Software Engineer',
      photoUrl: '',
      iconName: 'Code',
      display_order: teamMembers.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditMember = (member: WebTeamMember) => {
    setEditingMember({ ...member });
    setIsModalOpen(true);
  };

  const handleSaveMemberModal = () => {
    if (!editingMember?.name?.trim()) {
      alert('Please enter a team member name.');
      return;
    }

    const updated = [...teamMembers];
    const idx = updated.findIndex((m) => m.id === editingMember.id);
    const memberData = editingMember as WebTeamMember;

    if (idx >= 0) {
      updated[idx] = memberData;
    } else {
      updated.push(memberData);
    }

    setTeamMembers(updated);
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    const updated = teamMembers.filter((m) => m.id !== deleteTarget.id);
    setTeamMembers(updated);
    setDeleteTarget(null);

    // Archive via archiveService
    await archiveService.archiveItem({
      table: 'site_settings',
      itemId: deleteTarget.id,
      moduleName: 'Web Team',
      title: deleteTarget.name,
      subtitle: deleteTarget.role,
      image_url: deleteTarget.photoUrl,
      itemData: deleteTarget,
    });

    setMessage({ type: 'success', text: `Team member "${deleteTarget.name}" removed and archived.` });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleMoveMember = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= teamMembers.length) return;

    const updated = [...teamMembers];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    // re-index display orders
    updated.forEach((m, idx) => {
      m.display_order = idx + 1;
    });

    setTeamMembers(updated);
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Web Team Page Management"
        subtitle="Manage the DevQuad web team section, hero titles, tall arch-shaped member cards, photos, and badge icons."
        action={
          <div className="flex gap-2">
            <AdminButton variant="secondary" onClick={handleOpenAddMember} icon={<Plus className="w-4 h-4" />}>
              Add Team Member
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSavePageSettings} loading={saving} icon={<Save className="w-4 h-4" />}>
              Save All Changes
            </AdminButton>
          </div>
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

      {/* Page Header & Intro Settings */}
      <AdminSection
        title="Page Header & Hero Settings"
        description="Configure the main title, subtitle, and optional hero banner image for the /webteam page."
      >
        <AdminCard className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Page Heading">
              <AdminInput
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="DevQuad — Web Development Team"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Hero Background Image (Optional)">
              <div className="flex items-center gap-3">
                <div className="w-20 h-10 bg-[#F3F4F6] border border-[#E5E7EB] rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                  {heroImageUrl ? (
                    <img src={heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-[#9CA3AF]" />
                  )}
                </div>

                <label className="px-3 py-1.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{heroImageUrl ? 'Replace' : 'Upload'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleHeroFileUpload} />
                </label>

                {heroImageUrl && (
                  <button
                    type="button"
                    onClick={() => setHeroImageUrl('')}
                    className="px-2.5 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded border border-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Page Subtitle / Intro Text">
            <AdminTextarea
              rows={2}
              value={pageSubtitle}
              onChange={(e) => setPageSubtitle(e.target.value)}
              placeholder="Introductory text describing the web team..."
            />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* Team Member Cards Management */}
      <AdminSection
        title={`Team Member Cards (${teamMembers.length})`}
        description="Add, edit, reorder, or remove team members. Each member renders as a tall arched pill card with a white bottom label area."
      >
        <div className="space-y-3">
          {teamMembers.map((member, idx) => {
            const IconComp = ICON_OPTIONS.find((i) => i.name === member.iconName)?.icon || Code;

            return (
              <AdminCard key={member.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Photo Thumbnail */}
                  <div className="w-12 h-16 rounded-t-full rounded-b-md bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex items-center justify-center flex-shrink-0">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-[#9CA3AF]" />
                    )}
                  </div>

                  {/* Circular Logo / Badge Icon Preview */}
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 shadow-xs">
                    {member.customIconUrl ? (
                      <img src={member.customIconUrl} alt="Logo" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center">
                        <IconComp className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                        Card #{idx + 1}
                      </span>
                      {!member.is_visible && (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Hidden
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-[#1F2937]">{member.name}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleMoveMember(idx, 'up')}
                    disabled={idx === 0}
                    className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveMember(idx, 'down')}
                    disabled={idx === teamMembers.length - 1}
                    className="p-2 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded-md bg-white cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <AdminButton variant="secondary" onClick={() => handleOpenEditMember(member)} icon={<Edit2 className="w-4 h-4" />}>
                    Edit Member
                  </AdminButton>

                  <AdminButton variant="danger" onClick={() => setDeleteTarget(member)} icon={<Trash2 className="w-4 h-4" />}>
                    Delete
                  </AdminButton>
                </div>
              </AdminCard>
            );
          })}
        </div>
      </AdminSection>

      {/* Edit Team Member Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember?.id && teamMembers.some((m) => m.id === editingMember.id) ? 'Edit Web Team Member' : 'Add Web Team Member'}
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveMemberModal}>
              Done
            </AdminButton>
          </>
        }
      >
        <div className="space-y-5 text-left">
          <AdminFormGroup label="Full Name" required>
            <AdminInput
              value={editingMember?.name || ''}
              onChange={(e) => setEditingMember((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Syed Shahzaneer Ahmed"
            />
          </AdminFormGroup>

          {/* Member Photo Upload */}
          <AdminFormGroup label="Portrait Photograph Upload (Fills Arched Card)">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 bg-[#F3F4F6] border border-[#E5E7EB] rounded-t-full rounded-b-md overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
                {editingMember?.photoUrl ? (
                  <img src={editingMember.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>{editingMember?.photoUrl ? 'Replace Portrait Photo' : 'Upload Portrait Photo'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>

                {editingMember?.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setEditingMember((prev) => ({ ...prev, photoUrl: '' }))}
                    className="px-3 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-md border border-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          {/* Badge Icon Selection */}
          <AdminFormGroup label="Circular Badge Icon (Overlaps Bottom Label Area)">
            <div className="space-y-3">
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {ICON_OPTIONS.map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = editingMember?.iconName === item.name && !editingMember?.customIconUrl;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setEditingMember((prev) => ({ ...prev, iconName: item.name, customIconUrl: '' }))}
                      className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F0F9FF] border-[#0093DD] text-[#0093DD] font-bold shadow-xs'
                          : 'bg-white border-[#E5E7EB] text-[#4B5563] hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-[11px] truncate w-full text-center">{item.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Optional Custom Logo Upload */}
              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs text-[#6B7280] font-semibold">Or upload custom logo:</span>
                
                {editingMember?.customIconUrl && (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E5E7EB] bg-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <img src={editingMember.customIconUrl} alt="Circular Logo Preview" className="w-full h-full object-cover rounded-full" />
                  </div>
                )}

                <label className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#374151] text-xs font-semibold rounded cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{editingMember?.customIconUrl ? 'Replace Custom Logo' : 'Upload Custom Logo'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleCustomIconUpload} />
                </label>

                {editingMember?.customIconUrl && (
                  <button
                    type="button"
                    onClick={() => setEditingMember((prev) => ({ ...prev, customIconUrl: '' }))}
                    className="px-2.5 py-1 text-xs text-red-600 hover:underline cursor-pointer"
                  >
                    Clear Logo
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Public Website"
            checked={editingMember?.is_visible ?? true}
            onChange={(checked) => setEditingMember((prev) => ({ ...prev, is_visible: checked }))}
          />
        </div>
      </AdminModal>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Team Member?"
        confirmLabel="Remove Member"
        message={deleteTarget ? `Are you sure you want to remove "${deleteTarget.name}" from the Web Team?` : ''}
      />

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
