import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import { cmsService } from '../../services/cmsService';
import { Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminUsefulLinksManager() {
  const [disabilityTitle, setDisabilityTitle] = useState('Disability & Accessibility Policy');
  const [disabilityText, setDisabilityText] = useState('FAST-NUCES Multan Campus is committed to providing an inclusive and accessible environment...');
  
  const [geiahTitle, setGeiahTitle] = useState('Gender Equality & Harassment Policy (GEIAH)');
  const [geiahText, setGeiahText] = useState('The campus strictly enforces HEC policies regarding equal opportunity and zero tolerance for harassment...');

  const [guidebookTitle, setGuidebookTitle] = useState('Student Guide Book');
  const [guidebookText, setGuidebookText] = useState('Official handbook containing campus rules, grading criteria, attendance policies, and academic discipline...');

  const [brandTitle, setBrandTitle] = useState('Brand Identity Guidelines');
  const [brandText, setBrandText] = useState('Official guidelines for logo usage, institutional colors, typography, and official letterheads...');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadUsefulLinksData = async () => {
      const data = await cmsService.getSetting<any>('useful_links_content', null);
      if (data) {
        if (data.disabilityTitle) setDisabilityTitle(data.disabilityTitle);
        if (data.disabilityText) setDisabilityText(data.disabilityText);
        if (data.geiahTitle) setGeiahTitle(data.geiahTitle);
        if (data.geiahText) setGeiahText(data.geiahText);
        if (data.guidebookTitle) setGuidebookTitle(data.guidebookTitle);
        if (data.guidebookText) setGuidebookText(data.guidebookText);
        if (data.brandTitle) setBrandTitle(data.brandTitle);
        if (data.brandText) setBrandText(data.brandText);
      }
    };
    loadUsefulLinksData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      disabilityTitle,
      disabilityText,
      geiahTitle,
      geiahText,
      guidebookTitle,
      guidebookText,
      brandTitle,
      brandText,
    };

    const res = await cmsService.saveSetting('useful_links_content', payload, 'Useful Links Content');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Useful Links content saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save useful links.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage Useful Links & Student Policies"
        subtitle="Update Disability & Accessibility, GEIAH Policy, Student Guidebook, and Brand Guidelines."
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

      {/* Disability & Accessibility */}
      <AdminSection title="Disability & Accessibility Policy" description="Campus accessibility standards and support.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Page Heading Title">
            <AdminInput value={disabilityTitle} onChange={(e) => setDisabilityTitle(e.target.value)} />
          </AdminFormGroup>
          <AdminFormGroup label="Policy Overview Text">
            <AdminTextarea rows={4} value={disabilityText} onChange={(e) => setDisabilityText(e.target.value)} />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* GEIAH Policy */}
      <AdminSection title="Gender Equality & Harassment Policy (GEIAH)" description="HEC & FAST-NUCES harassment prevention policy.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Page Heading Title">
            <AdminInput value={geiahTitle} onChange={(e) => setGeiahTitle(e.target.value)} />
          </AdminFormGroup>
          <AdminFormGroup label="Policy Overview Text">
            <AdminTextarea rows={4} value={geiahText} onChange={(e) => setGeiahText(e.target.value)} />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* Student Guide Book */}
      <AdminSection title="Student Guide Book" description="Academic rules, grading policies, and discipline handbook.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Page Heading Title">
            <AdminInput value={guidebookTitle} onChange={(e) => setGuidebookTitle(e.target.value)} />
          </AdminFormGroup>
          <AdminFormGroup label="Guidebook Overview Text">
            <AdminTextarea rows={4} value={guidebookText} onChange={(e) => setGuidebookText(e.target.value)} />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* Brand Identity Guidelines */}
      <AdminSection title="Brand Identity Guidelines" description="Official logo usage, colors, and typography.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Page Heading Title">
            <AdminInput value={brandTitle} onChange={(e) => setBrandTitle(e.target.value)} />
          </AdminFormGroup>
          <AdminFormGroup label="Brand Guidelines Overview Text">
            <AdminTextarea rows={4} value={brandText} onChange={(e) => setBrandText(e.target.value)} />
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
