import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import { cmsService } from '../../services/cmsService';
import { Save, CheckCircle2, AlertCircle, Upload } from 'lucide-react';

export default function AdminAboutManager() {
  const [missionTitle, setMissionTitle] = useState('Mission and Vision');
  const [missionText, setMissionText] = useState('To become a premier center of excellence in education and research...');
  const [visionText, setVisionText] = useState('Empowering future leaders through cutting-edge technology...');

  const [introTitle, setIntroTitle] = useState('Campus Introduction');
  const [introText, setIntroText] = useState('FAST-NUCES Multan Campus is dedicated to offering state-of-the-art educational facilities...');
  const [introPhotoUrl, setIntroPhotoUrl] = useState('');

  const [charterTitle, setCharterTitle] = useState('University Charter');
  const [charterText, setCharterText] = useState('Established under Federal Legislation, FAST-NUCES is recognized nationwide...');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadAboutData = async () => {
      const data = await cmsService.getSetting<any>('about_pages_content', null);
      if (data) {
        if (data.missionTitle) setMissionTitle(data.missionTitle);
        if (data.missionText) setMissionText(data.missionText);
        if (data.visionText) setVisionText(data.visionText);
        if (data.introTitle) setIntroTitle(data.introTitle);
        if (data.introText) setIntroText(data.introText);
        if (data.introPhotoUrl) setIntroPhotoUrl(data.introPhotoUrl);
        if (data.charterTitle) setCharterTitle(data.charterTitle);
        if (data.charterText) setCharterText(data.charterText);
      }
    };
    loadAboutData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setIntroPhotoUrl(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      missionTitle,
      missionText,
      visionText,
      introTitle,
      introText,
      introPhotoUrl,
      charterTitle,
      charterText,
    };

    const res = await cmsService.saveSetting('about_pages_content', payload, 'About Pages Content');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'About pages content saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage About Pages"
        subtitle="Update Campus Introduction, Mission & Vision statements, and University Charter details."
        action={
          <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
            Save Changes
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

      {/* Mission & Vision */}
      <AdminSection title="Mission & Vision Section" description="Campus mission statement and strategic vision.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Section Title">
            <AdminInput value={missionTitle} onChange={(e) => setMissionTitle(e.target.value)} />
          </AdminFormGroup>
          <AdminFormGroup label="Mission Statement">
            <AdminTextarea rows={4} value={missionText} onChange={(e) => setMissionText(e.target.value)} />
          </AdminFormGroup>
          <AdminFormGroup label="Vision Statement">
            <AdminTextarea rows={4} value={visionText} onChange={(e) => setVisionText(e.target.value)} />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* Campus Introduction */}
      <AdminSection title="Campus Introduction Section" description="Overview description and campus photograph.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Page Title">
            <AdminInput value={introTitle} onChange={(e) => setIntroTitle(e.target.value)} />
          </AdminFormGroup>
          <AdminFormGroup label="Introduction Text">
            <AdminTextarea rows={5} value={introText} onChange={(e) => setIntroText(e.target.value)} />
          </AdminFormGroup>
          <AdminFormGroup label="Campus Banner Photo">
            <div className="flex gap-2">
              <AdminInput value={introPhotoUrl} onChange={(e) => setIntroPhotoUrl(e.target.value)} placeholder="https://..." />
              <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB]">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* University Charter */}
      <AdminSection title="University Charter Section" description="Legal charter background and accreditation.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Page Title">
            <AdminInput value={charterTitle} onChange={(e) => setCharterTitle(e.target.value)} />
          </AdminFormGroup>
          <AdminFormGroup label="Charter Information Text">
            <AdminTextarea rows={5} value={charterText} onChange={(e) => setCharterText(e.target.value)} />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
        <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
          Save Changes
        </AdminButton>
      </div>
    </div>
  );
}
