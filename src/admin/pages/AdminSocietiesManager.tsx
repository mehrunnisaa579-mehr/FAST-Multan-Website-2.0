import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../lib/supabase';
import { Save, CheckCircle2, AlertCircle, Upload, Trash2, User } from 'lucide-react';

const societySlugs = [
  { slug: 'techsoc', name: 'TechSoc — Technical Society' },
  { slug: 'fmm', name: 'FMM — FAST Multan Media' },
  { slug: 'figs', name: 'FIGS — FAST Gaming & Sports Society' },
  { slug: 'dhanak', name: 'Dhanak — Arts & Dramatic Society' },
  { slug: 'bayaan', name: 'Bayaan — Literary & Debating Society' },
];

export default function AdminSocietiesManager() {
  const [selectedSlug, setSelectedSlug] = useState('techsoc');
  const [description, setDescription] = useState('');
  
  // Leadership Names & Photos
  const [mentorName, setMentorName] = useState('');
  const [mentorPhotoUrl, setMentorPhotoUrl] = useState('');

  const [presidentName, setPresidentName] = useState('');
  const [presidentPhotoUrl, setPresidentPhotoUrl] = useState('');

  const [vp1Name, setVp1Name] = useState('');
  const [vp1PhotoUrl, setVp1PhotoUrl] = useState('');

  const [vp2Name, setVp2Name] = useState('');
  const [vp2PhotoUrl, setVp2PhotoUrl] = useState('');

  const [instagramUrl, setInstagramUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchSocietyData = async () => {
    const societies = await cmsService.getSocieties();
    const current = societies.find((s) => s.slug === selectedSlug);
    if (current) {
      setDescription(current.description || '');
      setMentorName(current.mentor_name || '');
      setMentorPhotoUrl(current.mentor_photo_url || '');

      setPresidentName(current.president_name || '');
      setPresidentPhotoUrl(current.president_photo_url || '');

      setVp1Name(current.vp1_name || '');
      setVp1PhotoUrl(current.vice_president_1_photo_url || current.vp1_photo_url || '');

      setVp2Name(current.vp2_name || '');
      setVp2PhotoUrl(current.vice_president_2_photo_url || current.vp2_photo_url || '');

      setInstagramUrl(current.instagram_url || '');
    } else {
      setDescription('');
      setMentorName('');
      setMentorPhotoUrl('');
      setPresidentName('');
      setPresidentPhotoUrl('');
      setVp1Name('');
      setVp1PhotoUrl('');
      setVp2Name('');
      setVp2PhotoUrl('');
      setInstagramUrl('');
    }
  };

  useEffect(() => {
    fetchSocietyData();
  }, [selectedSlug]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setPhotoFn: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setPhotoFn(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      slug: selectedSlug,
      name: societySlugs.find((s) => s.slug === selectedSlug)?.name || selectedSlug,
      description,
      mentor_name: mentorName,
      mentor_photo_url: mentorPhotoUrl,
      president_name: presidentName,
      president_photo_url: presidentPhotoUrl,
      vp1_name: vp1Name,
      vice_president_1_photo_url: vp1PhotoUrl,
      vp2_name: vp2Name,
      vice_president_2_photo_url: vp2PhotoUrl,
      instagram_url: instagramUrl,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from('societies').upsert([payload], { onConflict: 'slug' });
      if (error) throw error;

      setMessage({ type: 'success', text: 'Society details saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save society details.' });
    } finally {
      setSaving(false);
    }
  };

  const renderMemberBlock = (
    title: string,
    name: string,
    setName: (v: string) => void,
    photoUrl: string,
    setPhotoUrl: (v: string) => void,
    placeholderRole: string
  ) => (
    <div className="p-4 border border-[#E5E7EB] rounded-lg bg-white space-y-3 text-left">
      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0093DD]">{title}</h4>

      <AdminFormGroup label="Full Name">
        <AdminInput value={name} onChange={(e) => setName(e.target.value)} placeholder={`${placeholderRole} Name`} />
      </AdminFormGroup>

      <AdminFormGroup label="Photo Upload">
        <div className="flex items-center gap-3">
          <div className="w-16 h-20 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
            {photoUrl ? (
              <img src={photoUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-[#9CA3AF]" />
            )}
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <div className="flex gap-2">
              <label className="px-3 py-1.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>{photoUrl ? 'Replace Photo' : 'Upload Photo'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setPhotoUrl)} />
              </label>

              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-[#6B7280]">Recommended format: JPG or PNG portrait photo.</p>
          </div>
        </div>
      </AdminFormGroup>
    </div>
  );

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage Student Societies"
        subtitle="Update leadership members, mentor details, photos, and descriptions for campus societies."
        action={
          <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
            Save Changes
          </AdminButton>
        }
      />

      {/* Society Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E5E7EB] pb-3">
        {societySlugs.map((soc) => (
          <button
            key={soc.slug}
            type="button"
            onClick={() => setSelectedSlug(soc.slug)}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              selectedSlug === soc.slug
                ? 'bg-[#0093DD] text-white shadow-xs'
                : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
            }`}
          >
            {soc.slug.toUpperCase()}
          </button>
        ))}
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

      {/* Overview Section */}
      <AdminSection title="Society Information" description={`Edit overview and social links for ${selectedSlug.toUpperCase()}.`}>
        <AdminCard className="space-y-4">
          <AdminFormGroup label="Society Overview Description">
            <AdminTextarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Overview of society activities..." />
          </AdminFormGroup>

          <AdminFormGroup label="Instagram Profile Link">
            <AdminInput value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." />
          </AdminFormGroup>
        </AdminCard>
      </AdminSection>

      {/* Leadership Photos & Names Grid */}
      <AdminSection title="Leadership Members & Photo Uploads" description="Upload portrait photos and edit names for mentor, president, and vice presidents.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {renderMemberBlock('Faculty Mentor', mentorName, setMentorName, mentorPhotoUrl, setMentorPhotoUrl, 'Faculty Mentor')}
          {renderMemberBlock('President', presidentName, setPresidentName, presidentPhotoUrl, setPresidentPhotoUrl, 'President')}
          {renderMemberBlock('Vice President 1', vp1Name, setVp1Name, vp1PhotoUrl, setVp1PhotoUrl, 'Vice President')}
          {renderMemberBlock('Vice President 2', vp2Name, setVp2Name, vp2PhotoUrl, setVp2PhotoUrl, 'Vice President')}
        </div>
      </AdminSection>

      <div className="pt-4 border-t border-[#E5E7EB] flex justify-end">
        <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
          Save Changes
        </AdminButton>
      </div>
    </div>
  );
}
