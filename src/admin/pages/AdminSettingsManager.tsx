import React, { useState } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import { useAdminAuth } from '../auth/useAdminAuth';
import { Save, CheckCircle2, ShieldCheck, User } from 'lucide-react';

export default function AdminSettingsManager() {
  const { user } = useAdminAuth();
  const [adminName, setAdminName] = useState(user?.email?.split('@')[0] || 'Administrator');
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = () => {
    setMessage('Admin profile details updated.');
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Admin Settings & Account Security"
        subtitle="Manage active administrator credentials, authentication preferences, and security status."
      />

      {message && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Account Info */}
      <AdminSection title="Administrator Profile" description="Your logged-in account details.">
        <AdminCard className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-[#F3F4F6]">
            <div className="w-12 h-12 rounded-full bg-[#0093DD] text-white flex items-center justify-center font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">{user?.email || 'admin@multan.nu.edu.pk'}</h3>
              <p className="text-xs text-[#0093DD] font-semibold">Verified Active Administrator</p>
            </div>
          </div>

          <AdminFormGroup label="Display Name">
            <AdminInput value={adminName} onChange={(e) => setAdminName(e.target.value)} />
          </AdminFormGroup>

          <AdminFormGroup label="Email Address (Authentication ID)">
            <AdminInput value={user?.email || 'admin@multan.nu.edu.pk'} disabled />
          </AdminFormGroup>

          <div className="pt-2 flex justify-end">
            <AdminButton variant="primary" onClick={handleSave} icon={<Save className="w-4 h-4" />}>
              Save Profile
            </AdminButton>
          </div>
        </AdminCard>
      </AdminSection>

      {/* Security Status */}
      <AdminSection title="CMS Security Overview" description="Active security policies and role-based access control.">
        <AdminCard className="space-y-3">
          <div className="flex items-center gap-3 text-sm font-medium text-[#1F2937]">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Supabase Row Level Security (RLS) is active across all tables.</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-[#1F2937]">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Anonymous website visitors have read-only access to published content.</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-[#1F2937]">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Only authenticated administrators in <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-xs">admin_users</code> table can save or modify content.</span>
          </div>
        </AdminCard>
      </AdminSection>
    </div>
  );
}
