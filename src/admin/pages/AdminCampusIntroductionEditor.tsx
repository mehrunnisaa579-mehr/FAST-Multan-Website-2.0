import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import { cmsService } from '../../services/cmsService';
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  ImageIcon,
} from 'lucide-react';

import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';

export default function AdminCampusIntroductionEditor() {
  const [heroTitle, setHeroTitle] = useState('Campus Introduction');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [introText, setIntroText] = useState(
    'FAST-NUCES Multan Campus is a leading institution of higher learning in South Punjab, delivering high quality academic programs in Computer Science, Software Engineering, AI & Data Science, and Management Sciences.\n\nEquipped with modern computing laboratories, digital library resources, spacious auditoriums, and active student societies, the campus provides a vibrant learning ecosystem for holistic student development.'
  );

  // Preserve existing gallery data in background state so DB data is not deleted
  const [galleryHeading, setGalleryHeading] = useState('CAMPUS GALLERY');
  const [galleryRow1Count, setGalleryRow1Count] = useState<number>(6);
  const [galleryRow2Count, setGalleryRow2Count] = useState<number>(6);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { cropperProps, openCropper } = useImageCropper();

  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          setHeroImageUrl(res.publicUrl);
        } else {
          alert(`Upload failed: ${res.error || 'Unknown error'}`);
        }
      },
      { aspectRatio: 16 / 9, title: 'Crop Hero Banner Image (16:9 Wide)' }
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImageUrl,
      introText,
      galleryHeading,
      galleryRow1Count,
      galleryRow2Count,
      galleryItems,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('about_campus_intro_content', payload, 'Campus Introduction Content');

    // Sync legacy about_pages_content setting
    const legacy = (await cmsService.getSetting<any>('about_pages_content', {})) || {};
    await cmsService.saveSetting('about_pages_content', {
      ...legacy,
      introTitle: heroTitle,
      introText,
    });

    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Campus Introduction content saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/about"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to Manage About"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Campus Introduction Editor"
          subtitle="Manage the Campus Introduction page (/about/campus-introduction), hero image, and detailed introduction text."
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

      {/* 1. Hero Section */}
      <AdminSection title="Page Hero Banner" description="Manage hero title and background image.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Hero Title">
            <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="Campus Introduction" />
          </AdminFormGroup>

          <AdminFormGroup label="Hero Background Image Upload">
            <div className="flex items-center gap-4">
              <div className="w-32 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {heroImageUrl ? (
                  <img src={heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>{heroImageUrl ? 'Replace Hero Image' : 'Upload Hero Image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleHeroFileUpload} />
                </label>

                {heroImageUrl && (
                  <button
                    type="button"
                    onClick={() => setHeroImageUrl('')}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* 2. Introduction Content */}
      <AdminSection title="Campus Introduction & Detailed Content" description="Enter and edit full campus overview text paragraphs. Double line breaks create distinct paragraphs.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Detailed Campus Introduction Text">
            <AdminTextarea
              rows={16}
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              placeholder="Enter detailed campus introduction content. Separate paragraphs with double line breaks..."
              className="min-h-[350px] font-normal leading-relaxed text-base"
            />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
