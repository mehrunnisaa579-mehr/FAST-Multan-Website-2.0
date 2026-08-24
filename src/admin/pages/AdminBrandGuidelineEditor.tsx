import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import { cmsService } from '../../services/cmsService';
import { Save, CheckCircle2, AlertCircle, Upload, ImageIcon, ArrowLeft, FileText, Download, Archive } from 'lucide-react';
import { Link } from 'react-router-dom';

import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';

export default function AdminBrandGuidelineEditor() {
  const [heroTitle, setHeroTitle] = useState('NUCES Brand Identity Guideline');
  const [heroImage, setHeroImage] = useState('');
  const [heading, setHeading] = useState('NUCES Brand Identity Guideline');

  const [brandPdfUrl, setBrandPdfUrl] = useState('');
  const [brandPdfFileName, setBrandPdfFileName] = useState('');

  const [logoResourceUrl, setLogoResourceUrl] = useState('');
  const [logoResourceFileName, setLogoResourceFileName] = useState('');

  const [logoBtnLabel, setLogoBtnLabel] = useState('Download Logo Variations');
  const [guidebookBtnLabel, setGuidebookBtnLabel] = useState('Download Guide Book');

  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { cropperProps, openCropper } = useImageCropper();

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      { aspectRatio: 16 / 9, title: 'Crop Hero Banner Image (16:9 Wide)' }
    );
  };

  const handleBrandPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setBrandPdfUrl(res.publicUrl);
      setBrandPdfFileName(file.name);
    } else {
      alert(`Brand PDF upload failed: ${res.error}`);
    }
    setUploadingMedia(false);
  };

  const handleLogoResourceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingMedia(true);
    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setLogoResourceUrl(res.publicUrl);
      setLogoResourceFileName(file.name);
    } else {
      alert(`Resource upload failed: ${res.error}`);
    }
    setUploadingMedia(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const existing = (await cmsService.getSetting<any>('useful_links_content', {})) || {};
    const payload = {
      ...existing,
      brandHeroTitle: heroTitle,
      brandHeroImage: heroImage,
      brandHeading: heading,
      brandPdfUrl,
      brandPdfFileName,
      logoResourceUrl,
      logoResourceFileName,
      logoBtnLabel,
      guidebookBtnLabel2: guidebookBtnLabel,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('useful_links_content', payload, 'NUCES Brand Identity Guideline Page');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Brand Identity Guideline page saved successfully.' });
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
          title="Edit NUCES Brand Identity Guideline Page"
          subtitle="Manage Brand Guideline title, hero media, section heading, Brand PDF document, Logo Variations resource, and download button labels."
          action={
            <AdminButton variant="primary" onClick={handleSave} loading={saving || uploadingMedia} icon={<Save className="w-4 h-4" />}>
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
          <FileText className="w-5 h-5 text-[#0093DD]" />
          <span>1. Hero Banner & Heading</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormGroup label="Hero Banner Title">
            <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
          </AdminFormGroup>

          <AdminFormGroup label="Section Main Heading">
            <AdminInput value={heading} onChange={(e) => setHeading(e.target.value)} />
          </AdminFormGroup>
        </div>

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
                <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
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

      {/* Brand Guideline PDF Upload */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <Download className="w-5 h-5 text-[#0093DD]" />
          <span>2. Brand Guideline PDF Document & Button</span>
        </h3>

        <AdminFormGroup label="Brand Identity Guideline PDF File (Preview / Upload / Replace / Remove)">
          <div className="p-4 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] space-y-3">
            {brandPdfUrl ? (
              <div className="flex items-center justify-between p-3 bg-white border border-emerald-200 rounded-md">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#1F2937] truncate">{brandPdfFileName || 'Uploaded Brand Guideline PDF'}</p>
                    <a href={brandPdfUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#0093DD] hover:underline">
                      View Uploaded PDF Document
                    </a>
                  </div>
                </div>

                <div className="flex gap-2">
                  <label className="px-3 py-1.5 bg-[#0093DD] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace PDF</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleBrandPdfUpload} />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setBrandPdfUrl('');
                      setBrandPdfFileName('');
                    }}
                    className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded border border-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-md gap-3">
                <div>
                  <p className="text-xs font-bold text-[#1F2937]">No Brand PDF Document Uploaded Yet</p>
                  <p className="text-[11px] text-[#6B7280]">Public site currently shows placeholder: "PLACEHOLDER: NUCES BRAND IDENTITY GUIDELINE PDF PREVIEW".</p>
                </div>

                <label className="px-4 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer flex items-center gap-2 shadow-xs flex-shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>Upload Brand PDF</span>
                  <input type="file" accept="application/pdf" className="hidden" onChange={handleBrandPdfUpload} />
                </label>
              </div>
            )}
          </div>
        </AdminFormGroup>

        <AdminFormGroup label="Brand Guide Download Button Label">
          <AdminInput value={guidebookBtnLabel} onChange={(e) => setGuidebookBtnLabel(e.target.value)} placeholder="Download Guide Book" />
        </AdminFormGroup>
      </AdminCard>

      {/* Logo Variations Resource Package Upload */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <Archive className="w-5 h-5 text-[#0093DD]" />
          <span>3. Downloadable Logo Variations Resource (ZIP / PDF / Image Package)</span>
        </h3>

        <AdminFormGroup label="Logo Variations Downloadable Resource File (Upload / Replace / Remove)">
          <div className="p-4 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] space-y-3">
            {logoResourceUrl ? (
              <div className="flex items-center justify-between p-3 bg-white border border-emerald-200 rounded-md">
                <div className="flex items-center gap-3">
                  <Archive className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#1F2937] truncate">{logoResourceFileName || 'Uploaded Logo Variations Resource'}</p>
                    <a href={logoResourceUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#0093DD] hover:underline">
                      View Uploaded Resource File
                    </a>
                  </div>
                </div>

                <div className="flex gap-2">
                  <label className="px-3 py-1.5 bg-[#0093DD] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace File</span>
                    <input type="file" accept="application/zip,application/pdf,image/*,.zip,.rar" className="hidden" onChange={handleLogoResourceUpload} />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setLogoResourceUrl('');
                      setLogoResourceFileName('');
                    }}
                    className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded border border-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-md gap-3">
                <div>
                  <p className="text-xs font-bold text-[#1F2937]">No Logo Variations Package Uploaded Yet</p>
                  <p className="text-[11px] text-[#6B7280]">Upload ZIP, PDF, or image archive containing official vector logo assets.</p>
                </div>

                <label className="px-4 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer flex items-center gap-2 shadow-xs flex-shrink-0">
                  <Upload className="w-4 h-4" />
                  <span>Upload Logo Package</span>
                  <input type="file" accept="application/zip,application/pdf,image/*,.zip,.rar" className="hidden" onChange={handleLogoResourceUpload} />
                </label>
              </div>
            )}
          </div>
        </AdminFormGroup>

        <AdminFormGroup label="Logo Variations Button Label">
          <AdminInput value={logoBtnLabel} onChange={(e) => setLogoBtnLabel(e.target.value)} placeholder="Download Logo Variations" />
        </AdminFormGroup>
      </AdminCard>

      <div className="flex justify-end pt-2">
        <AdminButton variant="primary" onClick={handleSave} loading={saving || uploadingMedia} icon={<Save className="w-4 h-4" />}>
          Save Page Changes
        </AdminButton>
      </div>

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
