import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import { cmsService } from '../../services/cmsService';
import { Save, CheckCircle2, AlertCircle, ArrowLeft, ExternalLink } from 'lucide-react';

export default function AdminComplaintManager() {
  const [buttonUrl, setButtonUrl] = useState('https://flexstudent.nu.edu.pk/');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await cmsService.getSetting<any>('complaint_management_content', null);
      if (data && (data.buttonUrl || data.url)) {
        setButtonUrl(data.buttonUrl || data.url);
      }
    };
    loadData();
  }, []);

  const handleSaveAll = async () => {
    if (!buttonUrl.trim()) {
      alert('Please enter a valid redirect URL.');
      return;
    }

    setIsSaving(true);
    setMessage(null);

    const payload = {
      buttonUrl: buttonUrl.trim(),
      url: buttonUrl.trim(),
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('complaint_management_content', payload, 'Complaint Management System Redirect Settings');

    // Also sync to services_full_list if present
    const existingList = await cmsService.getSetting<any[]>('services_full_list', []);
    if (existingList && existingList.length > 0) {
      const updatedList = existingList.map((item) => {
        if (item.name?.toLowerCase().includes('complaint') || item.id?.toLowerCase().includes('complaint')) {
          return { ...item, url: buttonUrl.trim(), is_external: buttonUrl.trim().startsWith('http') };
        }
        return item;
      });
      await cmsService.saveSetting('services_full_list', updatedList, 'Services List');
    }

    setIsSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Complaint Management System redirect URL saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1000px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/services"
          className="p-2 bg-[#1E3A6D] text-white border border-[#E5E7EB] rounded-md hover:bg-[#0093DD] transition-colors"
          title="Back to Manage Services"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Manage Complaint Management System"
          subtitle="Configure the external redirect URL for the Complaint Management System menu item."
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

      <AdminCard className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#F3F4F6] pb-3">
          <ExternalLink className="w-5 h-5 text-[#0093DD]" />
          <div>
            <h3 className="text-base font-bold text-[#1F2937] m-0">Complaint Management System</h3>
            <p className="text-xs text-[#6B7280] m-0">
              Users clicking Complaint Management System in the SERVICES dropdown will be redirected directly to this external website link.
            </p>
          </div>
        </div>

        <AdminFormGroup label="Redirect URL / Website Link" required>
          <AdminInput
            value={buttonUrl}
            onChange={(e) => setButtonUrl(e.target.value)}
            placeholder="e.g. https://complaints.example.com or https://flexstudent.nu.edu.pk/"
          />
        </AdminFormGroup>

        <div className="pt-2 flex justify-end">
          <AdminButton variant="primary" onClick={handleSaveAll} loading={isSaving} icon={<Save className="w-4 h-4" />}>
            Save Redirect Link
          </AdminButton>
        </div>
      </AdminCard>
    </div>
  );
}

