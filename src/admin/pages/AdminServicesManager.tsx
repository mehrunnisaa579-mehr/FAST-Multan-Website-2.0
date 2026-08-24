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

export default function AdminServicesManager() {
  const [gatepassTitle, setGatepassTitle] = useState('Gatepass Application Service');
  const [gatepassText, setGatepassText] = useState('Online application for student and visitor vehicle entry passes...');
  

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadServicesData = async () => {
      const data = await cmsService.getSetting<any>('services_content', null);
      if (data) {
        if (data.gatepassTitle) setGatepassTitle(data.gatepassTitle);
        if (data.gatepassText) setGatepassText(data.gatepassText);
      }
    };
    loadServicesData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      gatepassTitle,
      gatepassText,
    };

    const res = await cmsService.saveSetting('services_content', payload, 'Campus Services Content');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Services content saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save services.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage Campus Services"
        subtitle="Update Gatepass Application details."
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

      {/* Gatepass Application */}
      <AdminSection title="Gatepass Application Service" description="Student vehicle pass rules and submission information.">
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Service Title">
            <AdminInput value={gatepassTitle} onChange={(e) => setGatepassTitle(e.target.value)} />
          </AdminFormGroup>
          <AdminFormGroup label="Gatepass Service Description">
            <AdminTextarea rows={4} value={gatepassText} onChange={(e) => setGatepassText(e.target.value)} />
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
