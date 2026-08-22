import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import AdminToggle from '../components/ui/AdminToggle';
import AdminModal, { DeleteConfirmModal } from '../components/ui/AdminModal';
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
  ImageIcon,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface GatepassStep {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
  visible: boolean;
}

export default function AdminGatepassManager() {
  const [isVisible, setIsVisible] = useState(true);
  const [title, setTitle] = useState('Gatepass Application Service');
  const [heroImage, setHeroImage] = useState('');
  const [introText, setIntroText] = useState(
    'FAST-NUCES Multan Campus provides an online Gatepass registration service for student vehicles, visitor entries, and campus security access cards.'
  );
  const [mainDescription, setMainDescription] = useState(
    'Students and faculty members must register their motorbikes or cars to obtain official FAST RFID gatepass stickers for seamless campus entry.'
  );
  const [buttonText, setButtonText] = useState('Apply for Vehicle Gatepass');
  const [buttonUrl, setButtonUrl] = useState('https://flexstudent.nu.edu.pk/');
  const [contactInfo, setContactInfo] = useState('Security Office: +92 (61) 111-128-128 | Email: security.multan@nu.edu.pk');

  const [steps, setSteps] = useState<GatepassStep[]>([
    {
      id: 'step-1',
      title: '1. Prepare Required Documents',
      description: 'Copy of valid Driving License, CNIC/Student ID, and Vehicle Registration Book.',
      iconUrl: '',
      visible: true,
    },
    {
      id: 'step-2',
      title: '2. Submit Application Online',
      description: 'Fill out vehicle details and upload scanned copies on the campus portal.',
      iconUrl: '',
      visible: true,
    },
    {
      id: 'step-3',
      title: '3. Receive Gatepass RFID Sticker',
      description: 'Collect your verified RFID entry sticker from the Security Desk upon approval.',
      iconUrl: '',
      visible: true,
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ index: number; title: string } | null>(null);

  useEffect(() => {
    const fetchGatepassData = async () => {
      const data = await cmsService.getSetting<any>('gatepass_application_content', null);
      if (data) {
        setIsVisible(data.isVisible ?? data.is_visible ?? true);
        if (data.title) setTitle(data.title);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.introText) setIntroText(data.introText);
        if (data.mainDescription) setMainDescription(data.mainDescription);
        if (data.buttonText) setButtonText(data.buttonText);
        if (data.buttonUrl) setButtonUrl(data.buttonUrl);
        if (data.contactInfo) setContactInfo(data.contactInfo);
        if (Array.isArray(data.steps) && data.steps.length > 0) {
          setSteps(data.steps);
        }
      }
    };
    fetchGatepassData();
  }, []);

  const { cropperProps, openCropper } = useImageCropper();

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void,
    opts?: { aspectRatio?: number; cropShape?: 'rect' | 'round'; title?: string }
  ) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          callback(res.publicUrl);
        } else {
          alert(`Upload failed: ${res.error}`);
        }
      },
      opts
    );
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newList = [...steps];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setSteps(newList);
  };

  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        id: `step-${Date.now()}`,
        title: 'New Registration Requirement',
        description: 'Instructions for vehicle pass submission...',
        iconUrl: '',
        visible: true,
      },
    ]);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setMessage(null);

    const payload = {
      isVisible,
      is_visible: isVisible,
      title,
      heroImage,
      introText,
      mainDescription,
      buttonText,
      buttonUrl,
      contactInfo,
      steps,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('gatepass_application_content', payload, 'Gatepass Application Service Content');
    setIsSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Gatepass Application settings saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
  };

  const confirmDeleteStep = () => {
    if (!deleteTarget) return;
    setSteps((prev) => prev.filter((_, i) => i !== deleteTarget.index));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 text-left max-w-[1300px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/services"
          className="p-2 bg-[#1E3A6D] text-white border border-[#E5E7EB] rounded-md hover:bg-[#0093DD] transition-colors"
          title="Back to Manage Services"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Manage Gatepass Application Service"
          subtitle="Manage Gatepass Application page, hero media, guidelines, portal link, and required registration steps."
          action={
            <AdminButton variant="primary" onClick={handleSaveAll} loading={isSaving} icon={<Save className="w-4 h-4" />}>
              Save All Changes
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

      {/* Website Visibility Toggle Section */}
      <AdminCard className="p-5 border-l-4 border-l-[#0093DD]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#1F2937]">Website Visibility</h3>
            <p className="text-xs text-[#6B7280]">
              Control whether Gatepass Application is enabled and visible on the public website and navigation menus.
            </p>
          </div>
          <AdminToggle
            label="Visible on Website"
            checked={isVisible}
            onChange={(checked) => setIsVisible(checked)}
          />
        </div>
      </AdminCard>

      {/* Hero Settings */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#0093DD]" />
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
                <span>{heroImage ? 'Replace Hero Image' : 'Upload Hero Image'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setHeroImage(url), { aspectRatio: 16 / 9, title: 'Crop Gatepass Hero Image (16:9 Wide)' })} />
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

      {/* Main Details & Portal Link */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2">
          2. Overview & Online Portal Link
        </h3>

        <AdminFormGroup label="Introductory Paragraph">
          <AdminTextarea rows={3} value={introText} onChange={(e) => setIntroText(e.target.value)} />
        </AdminFormGroup>

        <AdminFormGroup label="Main Service Description">
          <AdminTextarea rows={4} value={mainDescription} onChange={(e) => setMainDescription(e.target.value)} />
        </AdminFormGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#F3F4F6]">
          <AdminFormGroup label="CTA Button Text">
            <AdminInput value={buttonText} onChange={(e) => setButtonText(e.target.value)} placeholder="Apply for Vehicle Gatepass" />
          </AdminFormGroup>

          <AdminFormGroup label="Portal Application Link / URL">
            <AdminInput value={buttonUrl} onChange={(e) => setButtonUrl(e.target.value)} placeholder="https://flexstudent.nu.edu.pk/" />
          </AdminFormGroup>
        </div>

        <AdminFormGroup label="Security Desk Contact Information">
          <AdminInput value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
        </AdminFormGroup>
      </AdminCard>

      {/* Gatepass Steps */}
      <AdminCard className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
          <div>
            <h3 className="text-base font-bold text-[#1F2937]">3. Registration Process Steps</h3>
            <p className="text-xs text-[#6B7280]">Add, edit, reorder, or show/hide vehicle pass registration steps.</p>
          </div>

          <AdminButton variant="secondary" onClick={handleAddStep} icon={<Plus className="w-4 h-4" />}>
            Add Process Step
          </AdminButton>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={step.id || idx} className="p-4 border border-[#E5E7EB] rounded-lg bg-white space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                <span className="text-xs font-bold uppercase text-[#0093DD]">Step #{idx + 1}</span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveStep(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStep(idx, 'down')}
                    disabled={idx === steps.length - 1}
                    className="p-1 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget({ index: idx, title: step.title })}
                    className="p-1 text-[#DC2626] hover:bg-red-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormGroup label="Step Title">
                  <AdminInput
                    value={step.title}
                    onChange={(e) => {
                      const updated = [...steps];
                      updated[idx].title = e.target.value;
                      setSteps(updated);
                    }}
                  />
                </AdminFormGroup>

                <AdminFormGroup label="Step Icon / Image Upload">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 bg-[#F3F4F6] border border-[#E5E7EB] rounded flex items-center justify-center flex-shrink-0">
                      {step.iconUrl ? (
                        <img src={step.iconUrl} alt={step.title} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-[#9CA3AF]" />
                      )}
                    </div>

                    <div className="flex gap-2">
                      <label className="px-3 py-1.5 bg-[#0093DD] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Icon</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => {
                              const updated = [...steps];
                              updated[idx].iconUrl = url;
                              setSteps(updated);
                            })
                          }
                        />
                      </label>

                      {step.iconUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...steps];
                            updated[idx].iconUrl = '';
                            setSteps(updated);
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

              <AdminFormGroup label="Step Details">
                <AdminTextarea
                  rows={2}
                  value={step.description}
                  onChange={(e) => {
                    const updated = [...steps];
                    updated[idx].description = e.target.value;
                    setSteps(updated);
                  }}
                />
              </AdminFormGroup>

              <AdminToggle
                label="Visible on Website"
                checked={step.visible}
                onChange={(checked) => {
                  const updated = [...steps];
                  updated[idx].visible = checked;
                  setSteps(updated);
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
        onConfirm={confirmDeleteStep}
        itemTitle={deleteTarget?.title}
      />

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
