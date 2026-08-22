import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';
import { cmsService } from '../../services/cmsService';
import { Save, CheckCircle2, AlertCircle, Upload, ImageIcon, ArrowLeft, Accessibility } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDisabilityEditor() {
  const [title, setTitle] = useState('Disability & Accessibility Policy');
  const [heroImage, setHeroImage] = useState('');
  const [policyText, setPolicyText] = useState(
    'FAST-NUCES Multan Campus is dedicated to ensuring an inclusive, accessible, and supportive environment for students, faculty, and visitors with disabilities.\n\nOur campus infrastructure includes wheelchair ramps, dedicated elevator access, accessible seating in lecture halls, and specialized assistive resources in laboratories.\n\nStudents requiring specialized academic accommodations or assistive exam support are encouraged to contact the Campus Student Affairs Office.'
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await cmsService.getSetting<any>('useful_links_content', null);
      if (data) {
        if (data.disabilityTitle) setTitle(data.disabilityTitle);
        if (data.disabilityHeroImage) setHeroImage(data.disabilityHeroImage);
        if (data.disabilityText) setPolicyText(data.disabilityText);
      }
    };
    loadData();
  }, []);

  const { cropperProps, openCropper } = useImageCropper();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          setHeroImage(res.publicUrl);
        } else {
          alert(`Upload failed: ${res.error}`);
        }
      },
      { aspectRatio: 16 / 9, title: 'Crop Disability Policy Hero Image (16:9 Wide)' }
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const existing = (await cmsService.getSetting<any>('useful_links_content', {})) || {};
    const payload = {
      ...existing,
      disabilityTitle: title,
      disabilityHeroImage: heroImage,
      disabilityText: policyText,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('useful_links_content', payload, 'Disability & Accessibility Policy');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Disability & Accessibility page saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/useful-links"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to Useful Links Hub"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Edit Disability & Accessibility Page"
          subtitle="Manage page title, hero banner media, and multiline policy text for /useful-links/disability-accessibility."
          action={
            <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
              Save Page Changes
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

      {/* Hero */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <Accessibility className="w-5 h-5 text-[#0093DD]" />
          <span>1. Hero Banner Settings</span>
        </h3>

        <AdminFormGroup label="Hero Page Title">
          <AdminInput value={title} onChange={(e) => setTitle(e.target.value)} />
        </AdminFormGroup>

        <AdminFormGroup label="Hero Background Image Upload (Preview / Replace / Remove)">
          <div className="flex items-center gap-4">
            <div className="w-24 h-14 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
              {heroImage ? (
                <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
              )}
            </div>

            <div className="flex gap-2">
              <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                <Upload className="w-4 h-4" />
                <span>{heroImage ? 'Replace Image' : 'Upload Image'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>

              {heroImage && (
                <button
                  type="button"
                  onClick={() => setHeroImage('')}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </AdminFormGroup>
      </AdminCard>

      {/* Body */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2">
          2. Policy Content & Body Text
        </h3>

        <AdminFormGroup label="Policy Paragraphs (Use double linebreaks between paragraphs)">
          <AdminTextarea rows={8} value={policyText} onChange={(e) => setPolicyText(e.target.value)} />
        </AdminFormGroup>
      </AdminCard>

      <div className="flex justify-end pt-2">
        <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
          Save Page Changes
        </AdminButton>
      </div>

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
