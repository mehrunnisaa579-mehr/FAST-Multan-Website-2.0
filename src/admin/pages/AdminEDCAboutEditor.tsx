import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import { cmsService } from '../../services/cmsService';
import { Save, CheckCircle2, AlertCircle, Upload, ImageIcon, ArrowLeft, BriefcaseBusiness } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminEDCAboutEditor() {
  const [heroTitle, setHeroTitle] = useState('Executive Development Center (EDC)');
  const [heroImage, setHeroImage] = useState('');
  const [aboutIntro, setAboutIntro] = useState(
    'The Executive Development Center (EDC) at FAST-NUCES Multan Campus serves as a dynamic bridge between industry leadership and academic excellence. Through specialized corporate training, leadership seminars, and professional workshops, EDC empowers executives and organizations.'
  );
  const [vision, setVision] = useState(
    'To be the premier corporate training hub in South Punjab, fostering strategic leadership, technological innovation, and organizational transformation.'
  );
  const [mission, setMission] = useState(
    'Delivering high-impact executive programs, hands-on technical bootcamps, and industrial conferences that elevate professional competencies.'
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = (await cmsService.getSetting<any>('edc_about_content', null)) || (await cmsService.getSetting<any>('edc_content', null));
      if (data) {
        if (data.aboutTitle || data.title) setHeroTitle(data.aboutTitle || data.title);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.aboutIntro || data.intro) setAboutIntro(data.aboutIntro || data.intro);
        if (data.vision) setVision(data.vision);
        if (data.mission) setMission(data.mission);
      }
    };
    loadData();
  }, []);

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setHeroImage(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      aboutTitle: heroTitle,
      heroImage,
      aboutIntro,
      vision,
      mission,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('edc_about_content', payload, 'About EDC Page Content');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'About EDC page saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/edc"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to EDC Admin Hub"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Edit About EDC Page"
          subtitle="Manage Executive Development Center hero banner, overview paragraphs, vision card, and mission statement for /edc/about."
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
          <BriefcaseBusiness className="w-5 h-5 text-[#0093DD]" />
          <span>1. Hero Banner Settings</span>
        </h3>

        <AdminFormGroup label="Hero Page Title">
          <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
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

      {/* Overview */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2">
          2. EDC Overview Paragraphs
        </h3>

        <AdminFormGroup label="Overview Content">
          <AdminTextarea rows={5} value={aboutIntro} onChange={(e) => setAboutIntro(e.target.value)} />
        </AdminFormGroup>
      </AdminCard>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminCard className="space-y-4">
          <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 text-[#0093DD]">
            3. EDC Vision Card
          </h3>
          <AdminFormGroup label="Vision Description">
            <AdminTextarea rows={4} value={vision} onChange={(e) => setVision(e.target.value)} />
          </AdminFormGroup>
        </AdminCard>

        <AdminCard className="space-y-4">
          <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 text-[#0093DD]">
            4. EDC Mission Card
          </h3>
          <AdminFormGroup label="Mission Description">
            <AdminTextarea rows={4} value={mission} onChange={(e) => setMission(e.target.value)} />
          </AdminFormGroup>
        </AdminCard>
      </div>

      <div className="flex justify-end pt-2">
        <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
          Save Page Changes
        </AdminButton>
      </div>
    </div>
  );
}
