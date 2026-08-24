import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminModal from '../components/ui/AdminModal';
import { cmsService } from '../../services/cmsService';
import {
  FileText,
  ShieldCheck,
  BriefcaseBusiness,
  BookOpen,
  GraduationCap,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';

interface ChildServiceItem {
  id: string;
  name: string;
  url: string;
}

export default function AdminServicesOverview() {
  const [childrenList, setChildrenList] = useState<ChildServiceItem[]>([
    { id: 'fan', name: 'FAN', url: 'https://alumni.nu.edu.pk/' },
  ]);
  const [isAlumniModalOpen, setIsAlumniModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Child Add/Edit Form State
  const [isEditingChild, setIsEditingChild] = useState(false);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [childNameInput, setChildNameInput] = useState('');
  const [childUrlInput, setChildUrlInput] = useState('');

  useEffect(() => {
    const loadAlumniConfig = async () => {
      const data = await cmsService.getSetting<any>('alumni_service_content', null);
      if (data) {
        if (data.children && Array.isArray(data.children) && data.children.length > 0) {
          setChildrenList(data.children);
        } else if (data.fanUrl || data.url) {
          setChildrenList([{ id: 'fan', name: 'FAN', url: data.fanUrl || data.url }]);
        }
      }
    };
    loadAlumniConfig();
  }, []);

  const handleOpenAddChild = () => {
    setEditingChildId(null);
    setChildNameInput('');
    setChildUrlInput('');
    setIsEditingChild(true);
  };

  const handleEditChild = (child: ChildServiceItem) => {
    setEditingChildId(child.id);
    setChildNameInput(child.name);
    setChildUrlInput(child.url);
    setIsEditingChild(true);
  };

  const handleDeleteChild = (id: string) => {
    setChildrenList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveChildForm = () => {
    if (!childNameInput.trim()) {
      alert('Please enter a child service name.');
      return;
    }
    if (!childUrlInput.trim()) {
      alert('Please enter a redirect URL.');
      return;
    }

    if (editingChildId) {
      setChildrenList((prev) =>
        prev.map((c) => (c.id === editingChildId ? { ...c, name: childNameInput.trim(), url: childUrlInput.trim() } : c))
      );
    } else {
      setChildrenList((prev) => [
        ...prev,
        {
          id: `child-${Date.now()}`,
          name: childNameInput.trim(),
          url: childUrlInput.trim(),
        },
      ]);
    }

    setIsEditingChild(false);
    setEditingChildId(null);
    setChildNameInput('');
    setChildUrlInput('');
  };

  const handleSaveAlumni = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      children: childrenList,
      updated_at: new Date().toISOString(),
    };

    // Save to alumni_service_content setting
    const res = await cmsService.saveSetting('alumni_service_content', payload, 'Alumni Service Settings');

    // Sync to services_full_list for global dynamic nav
    const existingList = await cmsService.getSetting<any[]>('services_full_list', []);
    if (existingList && existingList.length > 0) {
      // Retain non-alumni children, and rebuild Alumni children
      const nonAlumni = existingList.filter(
        (s) => s.parent_id !== 'alumni' && s.parent_name?.toLowerCase() !== 'alumni'
      );
      const alumniChildren = childrenList.map((c, idx) => ({
        id: c.id,
        name: c.name,
        parent_id: 'alumni',
        parent_name: 'Alumni',
        url: c.url,
        is_external: c.url.startsWith('http'),
        display_order: idx + 1,
        is_active: true,
      }));
      await cmsService.saveSetting('services_full_list', [...nonAlumni, ...alumniChildren], 'Services List');
    }

    setSaving(false);
    setIsAlumniModalOpen(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Alumni service settings saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save Alumni settings.' });
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage Services"
        subtitle="Manage editable service pages and service-related website content."
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

      {/* Editable Campus Services */}
      <AdminSection
        title="Editable Campus Services"
        description="Select a service module below to edit public service content, instructions, and application links."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card 1 — Complaint Management System */}
          <AdminCard className="p-5 flex flex-col justify-between space-y-4 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Complaint Management System
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Manage Complaint Management page text and details.
              </p>
            </div>
            <Link
              to="/admin-panel5463/complaint-management"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Manage Page</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </AdminCard>

          {/* Card 2 — Gatepass Application */}
          <AdminCard className="p-5 flex flex-col justify-between space-y-4 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Gatepass Application
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Manage Gatepass Application service page text.
              </p>
            </div>
            <Link
              to="/admin-panel5463/gatepass-application"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Manage Page</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </AdminCard>

          {/* Card 4 — Workshops */}
          <AdminCard className="p-5 flex flex-col justify-between space-y-4 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Workshops Hub
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Manage Bootcamp schedule and registration.
              </p>
            </div>
            <Link
              to="/admin-panel5463/edc/workshops-hub"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </AdminCard>

          {/* Card 5 — Alumni */}
          <AdminCard className="p-5 flex flex-col justify-between space-y-4 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Alumni
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Manage Alumni service page and link.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsEditingChild(false);
                setIsAlumniModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full border-none cursor-pointer"
            >
              <span>Manage Page</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </AdminCard>
        </div>
      </AdminSection>

      {/* Edit Alumni Settings Modal */}
      <AdminModal
        isOpen={isAlumniModalOpen}
        onClose={() => {
          setIsEditingChild(false);
          setIsAlumniModalOpen(false);
        }}
        title="Alumni Service Settings"
        maxWidth="md"
        footer={
          <>
            <AdminButton
              variant="secondary"
              onClick={() => {
                setIsEditingChild(false);
                setIsAlumniModalOpen(false);
              }}
            >
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveAlumni} loading={saving}>
              Save Settings
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#1F2937] m-0">Child Services</h4>

            {childrenList.length === 0 ? (
              <div className="p-4 border border-dashed border-[#CBD5E1] rounded-md text-xs text-[#64748B] text-center">
                No child services added.
              </div>
            ) : (
              <div className="space-y-2">
                {childrenList.map((child) => (
                  <div
                    key={child.id}
                    className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-[#1E293B] truncate">{child.name}</div>
                      <div className="text-xs text-[#64748B] font-mono truncate">{child.url}</div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditChild(child)}
                        className="p-1 text-[#0093DD] hover:bg-[#F0F9FF] rounded border border-[#BAE6FD] transition-colors cursor-pointer"
                        title="Edit Child Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteChild(child.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded border border-red-200 transition-colors cursor-pointer"
                        title="Delete Child Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Inline Add / Edit Child Form */}
            {isEditingChild ? (
              <div className="p-4 bg-[#F1F5F9] border border-[#CBD5E1] rounded-md space-y-3 mt-3">
                <h5 className="text-xs font-bold text-[#334155] uppercase tracking-wider m-0">
                  {editingChildId ? 'Edit Child Service' : 'Add Child Service'}
                </h5>
                <AdminFormGroup label="Child Service Name" required>
                  <AdminInput
                    value={childNameInput}
                    onChange={(e) => setChildNameInput(e.target.value)}
                    placeholder="e.g. FAN, Alumni Portal"
                  />
                </AdminFormGroup>
                <AdminFormGroup label="Redirect URL / Website Link" required>
                  <AdminInput
                    value={childUrlInput}
                    onChange={(e) => setChildUrlInput(e.target.value)}
                    placeholder="e.g. https://example.com/fan"
                  />
                </AdminFormGroup>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <AdminButton
                    variant="secondary"
                    onClick={() => {
                      setIsEditingChild(false);
                      setEditingChildId(null);
                    }}
                  >
                    Cancel
                  </AdminButton>
                  <AdminButton variant="primary" onClick={handleSaveChildForm}>
                    Save Child
                  </AdminButton>
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <AdminButton
                  variant="secondary"
                  onClick={handleOpenAddChild}
                  icon={<Plus className="w-4 h-4" />}
                >
                  + Add Child Service
                </AdminButton>
              </div>
            )}
          </div>
        </div>
      </AdminModal>
    </div>
  );
}



