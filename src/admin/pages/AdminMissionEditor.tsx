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
import { Save, ArrowLeft, CheckCircle2, AlertCircle, Upload, ImageIcon } from 'lucide-react';

export default function AdminMissionEditor() {
  const [heroTitle, setHeroTitle] = useState('Our Mission');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [missionText, setMissionText] = useState(
    'The official FAST-NUCES mission statement and institutional objectives are dedicated to excellence in computing and emerging sciences education.\n\nOur mission is to offer world-class education in computing and emerging sciences, foster cutting-edge research, and instill ethical leadership principles in our graduates.\n\nWe strive to cultivate an inspiring learning environment that encourages critical thinking, technological innovation, and meaningful societal contribution across local and global communities.\n\nThrough continuous curriculum development, industry collaboration, and rigorous academic standards, we prepare students to excel in rapidly evolving professional sectors.'
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await cmsService.getSetting<any>('about_mission_content', null);
      const legacyData = await cmsService.getSetting<any>('about_pages_content', null);

      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroImageUrl) setHeroImageUrl(data.heroImageUrl);
        if (data.missionText) setMissionText(data.missionText);
      } else if (legacyData && legacyData.missionText) {
        setMissionText(legacyData.missionText);
        if (legacyData.missionTitle) setHeroTitle(legacyData.missionTitle);
      }
    };

    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setHeroImageUrl(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImageUrl,
      missionText,
      updated_at: new Date().toISOString(),
    };

    // Save to primary setting
    const res = await cmsService.saveSetting('about_mission_content', payload, 'Our Mission Page Content');

    // Also sync legacy about_pages_content setting
    const legacy = (await cmsService.getSetting<any>('about_pages_content', {})) || {};
    await cmsService.saveSetting('about_pages_content', {
      ...legacy,
      missionTitle: heroTitle,
      missionText,
    });

    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Our Mission page content saved successfully.' });
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
          title="Our Mission Editor"
          subtitle="Manage the public Our Mission page (/about/mission), hero banner image, title, and mission paragraphs."
          action={
            <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
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

      {/* Hero Section */}
      <AdminSection title="Page Hero Banner" description="Manage hero title and background image.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Hero Title">
            <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="Our Mission" />
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
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
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

      {/* Mission Content Section */}
      <AdminSection title="Mission & Vision Paragraphs" description="Edit the body text paragraphs displayed on the Our Mission page. Use double line breaks between paragraphs.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Mission Content Paragraphs">
            <AdminTextarea
              rows={10}
              value={missionText}
              onChange={(e) => setMissionText(e.target.value)}
              placeholder="Enter mission statements, vision, and objectives. Separate paragraphs with double line breaks..."
            />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>
    </div>
  );
}
