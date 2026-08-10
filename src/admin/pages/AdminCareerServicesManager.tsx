import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import AdminToggle from '../components/ui/AdminToggle';
import AdminModal, { DeleteConfirmModal } from '../components/ui/AdminModal';
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
  ImageIcon,
  BriefcaseBusiness,
} from 'lucide-react';

interface ContentBlock {
  id: string;
  heading: string;
  description: string;
  imageUrl?: string;
  visible: boolean;
}

export default function AdminCareerServicesManager() {
  const [heroTitle, setHeroTitle] = useState('Career Services Office (CSO)');
  const [heroImageUrl, setHeroImageUrl] = useState('');

  const [introText, setIntroText] = useState(
    'The Career Services Office (CSO) at FAST-NUCES Multan Campus is dedicated to empowering students with professional development tools, industry networking, and internship placements.'
  );

  const [mainDescription, setMainDescription] = useState(
    'CSO organizes annual Job Fairs, mock interview sessions, resume writing workshops, and corporate recruitment drives with leading tech firms in Pakistan.'
  );

  const [contactInfo, setContactInfo] = useState('Email: cso.multan@nu.edu.pk | Phone: +92 (61) 111-128-128');

  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    {
      id: 'block-1',
      heading: 'Annual Job Fairs & Placement Drives',
      description: 'Connecting graduating batches with national and multinational IT companies, software houses, and enterprises.',
      imageUrl: '',
      visible: true,
    },
    {
      id: 'block-2',
      heading: 'Corporate Training & Resume Workshops',
      description: 'Equipping students with modern interview skills, LinkedIn optimization, and professional resume writing.',
      imageUrl: '',
      visible: true,
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ index: number; title: string } | null>(null);

  useEffect(() => {
    const loadCareerData = async () => {
      const data = await cmsService.getSetting<any>('career_services_content', null);
      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroImageUrl) setHeroImageUrl(data.heroImageUrl);
        if (data.introText) setIntroText(data.introText);
        if (data.mainDescription) setMainDescription(data.mainDescription);
        if (data.contactInfo) setContactInfo(data.contactInfo);
        if (Array.isArray(data.contentBlocks) && data.contentBlocks.length > 0) {
          setContentBlocks(data.contentBlocks);
        }
      }
    };
    loadCareerData();
  }, []);

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

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newList = [...contentBlocks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setContentBlocks(newList);
  };

  const handleAddBlock = () => {
    setContentBlocks([
      ...contentBlocks,
      {
        id: `block-${Date.now()}`,
        heading: 'New Services Section',
        description: 'Description of the career service or initiative...',
        imageUrl: '',
        visible: true,
      },
    ]);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImageUrl,
      introText,
      mainDescription,
      contactInfo,
      contentBlocks,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('career_services_content', payload, 'Career Services Office Content');
    setIsSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Changes saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || "We couldn't save your changes. Please try again." });
    }
  };

  const confirmDeleteBlock = () => {
    if (!deleteTarget) return;
    setContentBlocks((prev) => prev.filter((_, i) => i !== deleteTarget.index));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 text-left max-w-[1300px]">
      <AdminPageHeader
        title="Manage Career Services"
        subtitle="Edit the Career Services Office (CSO) page text, hero media, additional content blocks, and contact information."
        action={
          <AdminButton variant="primary" onClick={handleSaveAll} loading={isSaving} icon={<Save className="w-4 h-4" />}>
            Save All Changes
          </AdminButton>
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

      {/* Hero Settings */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <BriefcaseBusiness className="w-5 h-5 text-[#0093DD]" />
          <span>1. Page Hero Settings</span>
        </h3>

        <AdminFormGroup label="Hero Banner Title">
          <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
        </AdminFormGroup>

        <AdminFormGroup label="Hero Banner Image Upload">
          <div className="flex items-center gap-4">
            <div className="w-24 h-14 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
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
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setHeroImageUrl(url))} />
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

      {/* Main Content Settings */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2">
          2. Main Overview & Description Text
        </h3>

        <AdminFormGroup label="Page Introduction Paragraph">
          <AdminTextarea rows={3} value={introText} onChange={(e) => setIntroText(e.target.value)} />
        </AdminFormGroup>

        <AdminFormGroup label="Main Description / Details">
          <AdminTextarea rows={5} value={mainDescription} onChange={(e) => setMainDescription(e.target.value)} />
        </AdminFormGroup>

        <AdminFormGroup label="Contact Information / Placement Email">
          <AdminInput value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
        </AdminFormGroup>
      </AdminCard>

      {/* Additional Content Blocks */}
      <AdminCard className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#1F2937]">3. Additional Services & Feature Blocks</h3>
            <p className="text-xs text-[#6B7280]">Add, edit, reorder, or show/hide specialized CSO initiatives.</p>
          </div>

          <AdminButton variant="secondary" onClick={handleAddBlock} icon={<Plus className="w-4 h-4" />}>
            Add Content Block
          </AdminButton>
        </div>

        <div className="space-y-4">
          {contentBlocks.map((block, idx) => (
            <div key={block.id || idx} className="p-4 border border-[#E5E7EB] rounded-lg bg-white space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                <span className="text-xs font-bold uppercase text-[#0093DD]">Block #{idx + 1}</span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, 'down')}
                    disabled={idx === contentBlocks.length - 1}
                    className="p-1 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ index: idx, title: block.heading })}
                    className="p-1 text-[#DC2626] hover:bg-red-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormGroup label="Block Heading">
                  <AdminInput
                    value={block.heading}
                    onChange={(e) => {
                      const updated = [...contentBlocks];
                      updated[idx].heading = e.target.value;
                      setContentBlocks(updated);
                    }}
                  />
                </AdminFormGroup>

                <AdminFormGroup label="Block Image / Icon Upload">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-10 bg-[#F3F4F6] border border-[#E5E7EB] rounded flex items-center justify-center flex-shrink-0">
                      {block.imageUrl ? (
                        <img src={block.imageUrl} alt={block.heading} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-[#9CA3AF]" />
                      )}
                    </div>

                    <div className="flex gap-2">
                      <label className="px-3 py-1.5 bg-[#0093DD] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => {
                              const updated = [...contentBlocks];
                              updated[idx].imageUrl = url;
                              setContentBlocks(updated);
                            })
                          }
                        />
                      </label>

                      {block.imageUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...contentBlocks];
                            updated[idx].imageUrl = '';
                            setContentBlocks(updated);
                          }}
                          className="px-3 py-1.5 bg-red-50 text-[#DC2626] text-xs font-semibold rounded border border-red-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </AdminFormGroup>
              </div>

              <AdminFormGroup label="Description">
                <AdminTextarea
                  rows={2}
                  value={block.description}
                  onChange={(e) => {
                    const updated = [...contentBlocks];
                    updated[idx].description = e.target.value;
                    setContentBlocks(updated);
                  }}
                />
              </AdminFormGroup>

              <AdminToggle
                label="Visible on Website"
                checked={block.visible}
                onChange={(checked) => {
                  const updated = [...contentBlocks];
                  updated[idx].visible = checked;
                  setContentBlocks(updated);
                }}
              />
            </div>
          ))}
        </div>
      </AdminCard>

      <div className="flex justify-end pt-2">
        <AdminButton variant="primary" onClick={handleSaveAll} loading={isSaving} icon={<Save className="w-4 h-4" />}>
          Save All Changes
        </AdminButton>
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteBlock}
        itemTitle={deleteTarget?.title}
      />
    </div>
  );
}
