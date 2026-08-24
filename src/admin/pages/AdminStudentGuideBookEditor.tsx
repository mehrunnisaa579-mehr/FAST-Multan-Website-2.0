import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';
import { cmsService } from '../../services/cmsService';
import { Save, CheckCircle2, AlertCircle, Upload, ImageIcon, ArrowLeft, FileText, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminStudentGuideBookEditor() {
  const [heroTitle, setHeroTitle] = useState('Student Guide Book');
  const [heroImage, setHeroImage] = useState('');
  const [heading, setHeading] = useState('STUDENT GUIDE BOOK');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [buttonLabel, setButtonLabel] = useState('Download Guide Book');

  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await cmsService.getSetting<any>('useful_links_content', null);
      if (data) {
        if (data.guidebookHeroTitle) setHeroTitle(data.guidebookHeroTitle);
        if (data.guidebookHeroImage) setHeroImage(data.guidebookHeroImage);
        if (data.guidebookHeading) setHeading(data.guidebookHeading);
        if (data.guidebookPdfUrl) setPdfUrl(data.guidebookPdfUrl);
        if (data.guidebookPdfFileName) setPdfFileName(data.guidebookPdfFileName);
        if (data.guidebookButtonLabel) setButtonLabel(data.guidebookButtonLabel);
      }
    };
    loadData();
  }, []);

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
      { aspectRatio: 16 / 9, title: 'Crop Student Guidebook Hero Image (16:9 Wide)' }
    );
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('File size must not exceed 15 MB.');
      return;
    }

    setUploadingPdf(true);
    // Increased size limit to 15MB for Student Handbook as requested
    const res = await cmsService.uploadMedia(file, { maxSizeBytes: 15 * 1024 * 1024 });
    if (res.success && res.publicUrl) {
      setPdfUrl(res.publicUrl);
      setPdfFileName(file.name);
    } else {
      alert(`PDF upload failed: ${res.error}`);
    }
    setUploadingPdf(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const existing = (await cmsService.getSetting<any>('useful_links_content', {})) || {};
    const payload = {
      ...existing,
      guidebookHeroTitle: heroTitle,
      guidebookHeroImage: heroImage,
      guidebookHeading: heading,
      guidebookPdfUrl: pdfUrl,
      guidebookPdfFileName: pdfFileName,
      guidebookButtonLabel: buttonLabel,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('useful_links_content', payload, 'Student Guide Book Page');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Student Guide Book page saved successfully.' });
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
          title="Edit Student Guide Book Page"
          subtitle="Manage Student Guide Book title, hero media, section heading, PDF file upload/preview, and download button."
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

      {/* Guide Book PDF Upload & Controls */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <Download className="w-5 h-5 text-[#0093DD]" />
          <span>2. Guide Book PDF Document & Download Button</span>
        </h3>

        <AdminFormGroup label="Uploaded Guide Book PDF Document (Preview / Upload / Replace / Remove)" required>
          <div className="p-4 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] space-y-3">
            {pdfUrl ? (
              <div className="flex items-center justify-between p-3 bg-white border border-emerald-200 rounded-md">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#1F2937] truncate">{pdfFileName || 'Uploaded Guidebook PDF'}</p>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#0093DD] hover:underline">
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
                      setPdfUrl('');
                      setPdfFileName('');
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
                  <p className="text-[11px] text-[#6B7280]">Public site currently shows the placeholder box: "PLACEHOLDER: STUDENT GUIDE BOOK PDF PREVIEW".</p>
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
          <AdminInput value={buttonLabel} onChange={(e) => setButtonLabel(e.target.value)} placeholder="Download Guide Book" />
        </AdminFormGroup>
      </AdminCard>

      <div className="flex justify-end pt-2">
        <AdminButton variant="primary" onClick={handleSave} loading={saving || uploadingPdf} icon={<Save className="w-4 h-4" />}>
          Save Page Changes
        </AdminButton>
      </div>

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
