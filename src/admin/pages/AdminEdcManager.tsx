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

export default function AdminEdcManager() {
  const [aboutTitle, setAboutTitle] = useState('Executive Development Center (EDC)');
  const [aboutIntro, setAboutIntro] = useState('Bridging industry and academia through specialized workshops, corporate training, and conferences.');
  const [vision, setVision] = useState('To be the leading hub for corporate learning and executive training in South Punjab.');
  const [mission, setMission] = useState('Delivering high-impact professional programs, leadership seminars, and tech bootcamps.');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadEdcData = async () => {
      const data = await cmsService.getSetting<any>('edc_content', null);
      if (data) {
        if (data.aboutTitle) setAboutTitle(data.aboutTitle);
        if (data.aboutIntro) setAboutIntro(data.aboutIntro);
        if (data.vision) setVision(data.vision);
        if (data.mission) setMission(data.mission);
      }
    };
    loadEdcData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      aboutTitle,
      aboutIntro,
      vision,
      mission,
    };

    const res = await cmsService.saveSetting('edc_content', payload, 'EDC Page Content');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'EDC details saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save EDC details.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage Executive Development Center (EDC)"
        subtitle="Update EDC vision, mission, executive workshops, conferences, and speakers."
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

      {/* EDC About Section */}
      <AdminSection title="EDC Overview & Intro" description="Main heading and introductory text for Executive Development Center pages.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="EDC Heading Title">
            <AdminInput value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} />
          </AdminFormGroup>

          <AdminFormGroup label="Introductory Text">
            <AdminTextarea rows={4} value={aboutIntro} onChange={(e) => setAboutIntro(e.target.value)} />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* Vision & Mission */}
      <AdminSection title="EDC Vision & Mission" description="Corporate training vision and mission statements.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Vision Statement">
            <AdminTextarea rows={3} value={vision} onChange={(e) => setVision(e.target.value)} />
          </AdminFormGroup>

          <AdminFormGroup label="Mission Statement">
            <AdminTextarea rows={3} value={mission} onChange={(e) => setMission(e.target.value)} />
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
