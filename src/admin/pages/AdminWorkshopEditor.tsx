import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import AdminToggle from '../components/ui/AdminToggle';
import { cmsService } from '../../services/cmsService';
import type { WorkshopRecord } from '../../services/cmsService';
import { Save, CheckCircle2, AlertCircle, Upload, ImageIcon, ArrowLeft, BookOpen } from 'lucide-react';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminWorkshopEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [workshop, setWorkshop] = useState<WorkshopRecord | null>(null);
  const [allWorkshops, setAllWorkshops] = useState<WorkshopRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [workshopSlug, setWorkshopSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [overview, setOverview] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [venue, setVenue] = useState('');
  const [dateLabel, setDateLabel] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await cmsService.getSetting<{ items?: WorkshopRecord[] }>('workshops_list', { items: [] });
        const items: WorkshopRecord[] = data?.items || [];
        setAllWorkshops(items);

        const found = items.find((w) => w.slug === slug);
        if (found) {
          setWorkshop(found);
          setTitle(found.title);
          setWorkshopSlug(found.slug);
          setSubtitle(found.subtitle || '');
          setOverview(found.overview || '');
          setHeroImage(found.hero_image || '');
          setVenue(found.venue || '');
          setDateLabel(found.date_label || '');
          setRegistrationLink(found.registration_link || '');
          setIsVisible(found.is_visible);
          setSlugManuallyEdited(true);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  // Auto-generate slug from title until manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited) {
      setWorkshopSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setWorkshopSlug(slugify(val));
    setSlugManuallyEdited(true);
  };

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
    if (!title.trim()) {
      alert('Please enter a Workshop Title.');
      return;
    }
    if (!workshopSlug.trim()) {
      alert('Please enter a Slug.');
      return;
    }

    // Check for duplicate slug (excluding self)
    const duplicate = allWorkshops.find(
      (w) => w.slug === workshopSlug.trim() && w.id !== workshop?.id
    );
    if (duplicate) {
      alert(`Slug "${workshopSlug}" is already used by another workshop. Please choose a unique slug.`);
      return;
    }

    setSaving(true);
    setMessage(null);

    const updated: WorkshopRecord = {
      ...workshop!,
      title: title.trim(),
      slug: workshopSlug.trim(),
      subtitle: subtitle.trim(),
      overview: overview.trim(),
      hero_image: heroImage,
      venue: venue.trim(),
      date_label: dateLabel.trim(),
      registration_link: registrationLink.trim(),
      is_visible: isVisible,
    };

    const updatedList = allWorkshops.map((w) => (w.id === updated.id ? updated : w));
    const res = await cmsService.saveWorkshops(updatedList);
    setSaving(false);

    if (res.success) {
      setAllWorkshops(updatedList);
      setWorkshop(updated);
      // If slug changed, redirect to new URL
      if (workshopSlug.trim() !== slug) {
        navigate(`/admin-panel5463/edc/workshops/${workshopSlug.trim()}/edit`, { replace: true });
      }
      setMessage({ type: 'success', text: 'Workshop saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save workshop.' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-[3px] border-[#0093DD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-20 text-[#6B7280]">
        <p className="text-base font-semibold">Workshop not found.</p>
        <Link to="/admin-panel5463/edc/workshops-hub" className="text-[#0093DD] text-sm mt-2 inline-block">
          ← Back to Workshops Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/edc/workshops-hub"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to Workshops Hub"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title={`Edit: ${workshop?.title}`}
          subtitle={`Editing workshop page at /edc/workshops/${slug}`}
          action={
            <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
              Save Workshop
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

      {/* Section 1: Identity */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#0093DD]" />
          <span>1. Workshop Identity</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormGroup label="Workshop Title" required>
            <AdminInput
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. AI Leadership Workshop"
            />
          </AdminFormGroup>

          <AdminFormGroup label="URL Slug (auto-generated, editable)">
            <AdminInput
              value={workshopSlug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="e.g. ai-leadership-workshop"
            />
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              Public URL: <code className="bg-[#F3F4F6] px-1 rounded">/edc/workshops/{workshopSlug || 'your-slug'}</code>
            </p>
          </AdminFormGroup>
        </div>

        <AdminFormGroup label="Short Subtitle / Organizer Info">
          <AdminInput
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. EDC — FAST-NUCES Multan Campus"
          />
        </AdminFormGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormGroup label="Date / Year">
            <AdminInput
              value={dateLabel}
              onChange={(e) => setDateLabel(e.target.value)}
              placeholder="e.g. June 2026"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Venue / Location">
            <AdminInput
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. FAST-NUCES Multan Campus, Block C"
            />
          </AdminFormGroup>
        </div>

        <AdminFormGroup label="Registration Link (optional)">
          <AdminInput
            value={registrationLink}
            onChange={(e) => setRegistrationLink(e.target.value)}
            placeholder="https://..."
          />
        </AdminFormGroup>
      </AdminCard>

      {/* Section 2: Hero Image */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2">
          2. Hero Banner Image
        </h3>
        <AdminFormGroup label="Hero Background Image Upload">
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

      {/* Section 3: Overview */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2">
          3. Workshop Overview
        </h3>
        <AdminFormGroup label="Overview / Description (use double linebreaks between paragraphs)">
          <AdminTextarea
            rows={6}
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Describe the workshop goals, audience, and structure..."
          />
        </AdminFormGroup>
      </AdminCard>

      {/* Section 4: Visibility */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2">
          4. Visibility Settings
        </h3>
        <AdminToggle
          label="Visible on Website (appears in public Workshops submenu)"
          checked={isVisible}
          onChange={(checked) => setIsVisible(checked)}
        />
      </AdminCard>

      <div className="flex justify-end pt-2">
        <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
          Save Workshop
        </AdminButton>
      </div>
    </div>
  );
}
