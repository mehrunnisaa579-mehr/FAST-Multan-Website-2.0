import React, { useState, useEffect } from 'react';
import AdminModal from './AdminModal';
import AdminButton from './AdminButton';
import AdminFormGroup from './AdminFormGroup';
import AdminInput from './AdminInput';
import AdminTextarea from './AdminTextarea';
import AdminToggle from './AdminToggle';
import ImageCropModal from './ImageCropModal';
import { cmsService } from '../../../services/cmsService';
import { Upload } from 'lucide-react';

export interface FacultyMemberData {
  id?: string;
  name?: string;
  designation?: string;
  qualification?: string;
  slug?: string;
  photo_url?: string;
  photoUrl?: string;
  badge_photo_url?: string;
  badgePhotoUrl?: string;
  email?: string;
  phone?: string;
  extension?: string;
  biography?: string;
  introduction?: string;
  education?: string;
  publications?: string;
  collaborations?: string;
  funded_projects?: string;
  fundedProjects?: string;
  school?: string;
  department?: string;
  display_order?: number;
  visible?: boolean;
  is_visible?: boolean;
  isHOD?: boolean;
}

interface FacultyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FacultyMemberData) => void | Promise<void>;
  title?: string;
  initialData?: Partial<FacultyMemberData> | null;
  loading?: boolean;
  isStaff?: boolean;
}

export default function FacultyEditModal({
  isOpen,
  onClose,
  onSave,
  title,
  initialData,
  loading = false,
  isStaff = false,
}: FacultyEditModalProps) {
  const [item, setItem] = useState<Partial<FacultyMemberData>>({});
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingBadge, setUploadingBadge] = useState(false);

  useEffect(() => {
    if (initialData) {
      setItem({ ...initialData });
    } else {
      setItem({
        name: '',
        designation: 'Assistant Professor',
        qualification: 'Ph.D. / M.S. Degree',
        biography: '',
        introduction: '',
        photo_url: '',
        photoUrl: '',
        badge_photo_url: '',
        badgePhotoUrl: '',
        email: '',
        phone: '',
        extension: '',
        education: '',
        publications: '',
        collaborations: '',
        funded_projects: '',
        fundedProjects: '',
        visible: true,
        is_visible: true,
        isHOD: false,
      });
    }
  }, [initialData, isOpen]);

  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropAspect, setCropAspect] = useState<number>(13 / 15);
  const [cropShape, setCropShape] = useState<'rect' | 'round'>('rect');
  const [cropTarget, setCropTarget] = useState<'main' | 'badge' | null>(null);

  const handleMainPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropFile(file);
    setCropAspect(13 / 15);
    setCropShape('rect');
    setCropTarget('main');
    e.target.value = '';
  };

  const handleBadgePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropFile(file);
    setCropAspect(1);
    setCropShape('round');
    setCropTarget('badge');
    e.target.value = '';
  };

  const handleCropComplete = async (croppedFile: File) => {
    if (cropTarget === 'main') {
      setUploadingMain(true);
      const res = await cmsService.uploadMedia(croppedFile);
      setUploadingMain(false);

      if (res.success && res.publicUrl) {
        setItem((prev) => ({ ...prev, photo_url: res.publicUrl, photoUrl: res.publicUrl }));
      } else {
        alert(`Upload failed: ${res.error || 'Unknown error'}`);
      }
    } else if (cropTarget === 'badge') {
      setUploadingBadge(true);
      const res = await cmsService.uploadMedia(croppedFile);
      setUploadingBadge(false);

      if (res.success && res.publicUrl) {
        setItem((prev) => ({ ...prev, badge_photo_url: res.publicUrl, badgePhotoUrl: res.publicUrl }));
      } else {
        alert(`Badge upload failed: ${res.error || 'Unknown error'}`);
      }
    }
    setCropFile(null);
    setCropTarget(null);
  };

  const handleSave = () => {
    if (!item.name?.trim()) {
      alert('Please enter faculty member name.');
      return;
    }

    const mainPhoto = item.photo_url || item.photoUrl || '';
    const badgePhoto = item.badge_photo_url || item.badgePhotoUrl || '';
    const bioText = item.biography || item.introduction || '';
    const projText = item.funded_projects || item.fundedProjects || '';

    const payload: FacultyMemberData = {
      ...item,
      name: item.name.trim(),
      designation: item.designation || (item.isHOD ? 'Head of Department' : 'Lecturer'),
      qualification: item.qualification || '',
      biography: bioText,
      introduction: bioText,
      photo_url: mainPhoto,
      photoUrl: mainPhoto,
      badge_photo_url: badgePhoto,
      badgePhotoUrl: badgePhoto,
      email: item.email || '',
      phone: item.phone || '',
      extension: item.extension || '',
      education: item.education || '',
      publications: item.publications || '',
      collaborations: item.collaborations || '',
      funded_projects: projText,
      fundedProjects: projText,
      visible: item.visible ?? item.is_visible ?? true,
      is_visible: item.visible ?? item.is_visible ?? true,
    };

    onSave(payload);
  };

  const modalTitle =
    title ||
    (item.id
      ? item.isHOD
        ? 'Edit Department Head / HOD Profile'
        : 'Edit Faculty Member Profile'
      : 'Add Faculty Member Profile');

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      maxWidth="lg"
      footer={
        <>
          <AdminButton variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </AdminButton>
          <AdminButton variant="primary" onClick={handleSave} loading={loading}>
            Save Profile
          </AdminButton>
        </>
      }
    >
      <div className="space-y-5 sm:space-y-6 text-left pr-1 sm:pr-2">
        {/* BASIC INFORMATION */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
            Basic Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Full Name" required>
              <AdminInput
                value={item.name || ''}
                onChange={(e) => setItem((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Dr. Faculty Name"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Designation">
              <AdminInput
                value={item.designation || ''}
                onChange={(e) => setItem((prev) => ({ ...prev, designation: e.target.value }))}
                placeholder="Assistant Professor / Lecturer"
              />
            </AdminFormGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Qualification / Degree">
              <AdminInput
                value={item.qualification || ''}
                onChange={(e) => setItem((prev) => ({ ...prev, qualification: e.target.value }))}
                placeholder="Ph.D. / M.S. Computer Science"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Profile Slug (Optional)">
              <AdminInput
                value={item.slug || ''}
                onChange={(e) => setItem((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="dr-faculty-name"
              />
            </AdminFormGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Main Profile Image (Rectangular Frame)">
              <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                <AdminInput
                  value={item.photo_url || item.photoUrl || ''}
                  onChange={(e) =>
                    setItem((prev) => ({ ...prev, photo_url: e.target.value, photoUrl: e.target.value }))
                  }
                  placeholder="https://..."
                />
                <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB] self-stretch sm:self-auto justify-center">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingMain ? 'Uploading...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMainPhotoSelect}
                    disabled={uploadingMain}
                  />
                </label>
              </div>
            </AdminFormGroup>

            <AdminFormGroup label="Circular Badge Image (Overlapping Frame)">
              <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                <AdminInput
                  value={item.badge_photo_url || item.badgePhotoUrl || ''}
                  onChange={(e) =>
                    setItem((prev) => ({
                      ...prev,
                      badge_photo_url: e.target.value,
                      badgePhotoUrl: e.target.value,
                    }))
                  }
                  placeholder="Badge photo URL (Optional)..."
                />
                <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB] self-stretch sm:self-auto justify-center">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingBadge ? 'Uploading...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBadgePhotoSelect}
                    disabled={uploadingBadge}
                  />
                </label>
              </div>
            </AdminFormGroup>
          </div>
        </div>

        {/* CONTACT INFORMATION */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdminFormGroup label="Email">
              <AdminInput
                value={item.email || ''}
                onChange={(e) => setItem((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="faculty@multan.nu.edu.pk"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Phone">
              <AdminInput
                value={item.phone || ''}
                onChange={(e) => setItem((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+92 (61) 111-128-128"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Extension">
              <AdminInput
                value={item.extension || ''}
                onChange={(e) => setItem((prev) => ({ ...prev, extension: e.target.value }))}
                placeholder="205"
              />
            </AdminFormGroup>
          </div>
        </div>

        {/* PROFILE CONTENT */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
            Profile Content
          </h4>
          <AdminFormGroup label="Introduction / Biography">
            <AdminTextarea
              rows={4}
              value={item.biography || item.introduction || ''}
              onChange={(e) =>
                setItem((prev) => ({ ...prev, biography: e.target.value, introduction: e.target.value }))
              }
              placeholder="Faculty member biography and academic background..."
            />
          </AdminFormGroup>

          <AdminFormGroup label="Education">
            <AdminTextarea
              rows={3}
              value={item.education || ''}
              onChange={(e) => setItem((prev) => ({ ...prev, education: e.target.value }))}
              placeholder="Ph.D. in Computer Science (University, Year)..."
            />
          </AdminFormGroup>
        </div>

        {/* ACADEMIC DETAILS */}
        {!isStaff && (
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
              Academic Details
            </h4>
            <AdminFormGroup label="Publications">
              <AdminTextarea
                rows={4}
                value={item.publications || ''}
                onChange={(e) => setItem((prev) => ({ ...prev, publications: e.target.value }))}
                placeholder="List of journal articles, conference papers, and patents..."
              />
            </AdminFormGroup>

            <AdminFormGroup label="Collaborations at National and International Level">
              <AdminTextarea
                rows={4}
                value={item.collaborations || ''}
                onChange={(e) => setItem((prev) => ({ ...prev, collaborations: e.target.value }))}
                placeholder="Joint research initiatives, university collaborations..."
              />
            </AdminFormGroup>

            <AdminFormGroup label="Detail of Funded Projects">
              <AdminTextarea
                rows={4}
                value={item.funded_projects || item.fundedProjects || ''}
                onChange={(e) =>
                  setItem((prev) => ({
                    ...prev,
                    funded_projects: e.target.value,
                    fundedProjects: e.target.value,
                  }))
                }
                placeholder="HEC grants, industry sponsored projects, research funding..."
              />
            </AdminFormGroup>
          </div>
        )}

        {/* SETTINGS */}
        <div className="pt-2">
          <AdminToggle
            label="Visible on Website"
            checked={item.visible ?? item.is_visible ?? true}
            onChange={(checked) => setItem((prev) => ({ ...prev, visible: checked, is_visible: checked }))}
          />
        </div>
      </div>

      <ImageCropModal
        isOpen={!!cropFile}
        imageFile={cropFile}
        aspectRatio={cropAspect}
        cropShape={cropShape}
        title={cropTarget === 'badge' ? 'Crop Badge Image (1:1 Circle)' : 'Crop Main Profile Photo (13:15 Rectangle)'}
        onClose={() => {
          setCropFile(null);
          setCropTarget(null);
        }}
        onCropComplete={handleCropComplete}
      />
    </AdminModal>
  );
}
