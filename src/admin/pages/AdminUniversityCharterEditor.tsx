import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';
import { cmsService } from '../../services/cmsService';
import { Save, ArrowLeft, CheckCircle2, AlertCircle, Upload, ImageIcon, FileText, Download } from 'lucide-react';

export default function AdminUniversityCharterEditor() {
  const [heroTitle, setHeroTitle] = useState('University Charter');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [charterHeading, setCharterHeading] = useState('UNIVERSITY CHARTER');
  const [charterPdfUrl, setCharterPdfUrl] = useState('');
  const [charterPdfFileName, setCharterPdfFileName] = useState('');
  const [buttonLabel, setButtonLabel] = useState('Download University Charter');

  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await cmsService.getSetting<any>('about_charter_content', null);
      const legacyData = await cmsService.getSetting<any>('about_pages_content', null);

      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroImageUrl) setHeroImageUrl(data.heroImageUrl);
        if (data.charterHeading) setCharterHeading(data.charterHeading);
        if (data.charterPdfUrl) setCharterPdfUrl(data.charterPdfUrl);
        if (data.charterPdfFileName) setCharterPdfFileName(data.charterPdfFileName);
        if (data.buttonLabel) setButtonLabel(data.buttonLabel);
      } else if (legacyData) {
        if (legacyData.charterTitle) setHeroTitle(legacyData.charterTitle);
      }
    };

    fetchData();
  }, []);

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
      { aspectRatio: 16 / 9, title: 'Crop University Charter Hero Image (16:9 Wide)' }
    );
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    const res = await cmsService.uploadMedia(file);
    setUploadingPdf(false);

    if (res.success && res.publicUrl) {
      setCharterPdfUrl(res.publicUrl);
      setCharterPdfFileName(file.name);
    } else {
      alert(`PDF upload failed: ${res.error || 'Unknown error'}`);
    }
    e.target.value = '';
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImageUrl,
      charterHeading,
      charterPdfUrl,
      charterPdfFileName,
      buttonLabel,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('about_charter_content', payload, 'University Charter Content');

    // Sync legacy setting
    const legacy = (await cmsService.getSetting<any>('about_pages_content', {})) || {};
    await cmsService.saveSetting('about_pages_content', {
      ...legacy,
      charterTitle: heroTitle,
    });

    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'University Charter page saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save content.' });
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
          title="University Charter Editor"
          subtitle="Manage the public University Charter page (/about/university-charter), hero banner media, heading, PDF document upload/preview, and download button."
          action={
            <AdminButton variant="primary" onClick={handleSave} loading={saving || uploadingPdf} icon={<Save className="w-4 h-4" />}>
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

      {/* Hero Section */}
      <AdminSection title="Page Hero Banner" description="Manage hero title and background image.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Hero Title">
            <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="University Charter" />
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

      {/* Charter Document Section */}
      <AdminSection title="University Charter Document" description="Manage section heading, PDF file upload/preview, and download button label.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Document Section Heading">
            <AdminInput value={charterHeading} onChange={(e) => setCharterHeading(e.target.value)} placeholder="UNIVERSITY CHARTER" />
          </AdminFormGroup>

          <AdminFormGroup label="Uploaded University Charter PDF (Preview / Upload / Replace / Remove)" required>
            <div className="p-4 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] space-y-3">
              {charterPdfUrl ? (
                <div className="flex items-center justify-between p-3 bg-white border border-emerald-200 rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#1F2937] truncate">{charterPdfFileName || 'University Charter PDF'}</p>
                      <a href={charterPdfUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#0093DD] hover:underline">
                        View Uploaded PDF Document
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <label className="px-3 py-1.5 bg-[#0093DD] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1 shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Replace PDF</span>
                      <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setCharterPdfUrl('');
                        setCharterPdfFileName('');
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
                    <p className="text-xs font-bold text-[#1F2937]">No PDF Document Uploaded Yet</p>
                    <p className="text-[11px] text-[#6B7280]">Public site currently shows the placeholder box: "PLACEHOLDER: UNIVERSITY CHARTER PDF PREVIEW".</p>
                  </div>

                  <label className="px-4 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md cursor-pointer flex items-center gap-2 shadow-xs flex-shrink-0">
                    <Upload className="w-4 h-4" />
                    <span>{uploadingPdf ? 'Uploading...' : 'Upload PDF Document'}</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                  </label>
                </div>
              )}
            </div>
          </AdminFormGroup>

          <AdminFormGroup label="Download Button Label">
            <AdminInput value={buttonLabel} onChange={(e) => setButtonLabel(e.target.value)} placeholder="Download University Charter" />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      <div className="flex justify-end pt-2">
        <AdminButton variant="primary" onClick={handleSave} loading={saving || uploadingPdf} icon={<Save className="w-4 h-4" />}>
          Save Page Changes
        </AdminButton>
      </div>

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
