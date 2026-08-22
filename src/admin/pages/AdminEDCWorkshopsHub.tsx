import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import AdminToggle from '../components/ui/AdminToggle';
import AdminModal, { DeleteConfirmModal } from '../components/ui/AdminModal';
import ImageCropModal from '../components/ui/ImageCropModal';
import { useImageCropper } from '../hooks/useImageCropper';
import AdminSection from '../components/ui/AdminSection';
import { cmsService } from '../../services/cmsService';
import { archiveService } from '../../services/archiveService';
import type { WorkshopRecord } from '../../services/cmsService';
import {
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Plus,
  Edit2,
  Archive,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Upload,
  ImageIcon,
} from 'lucide-react';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// The built-in Summer Bootcamp record that always appears first
const SUMMER_BOOTCAMP_RECORD: WorkshopRecord = {
  id: 'builtin-summer-bootcamp-2026',
  title: 'Summer Bootcamp 2026',
  slug: 'summer-bootcamp-2026',
  subtitle: 'Executive Development Centre — FAST-NUCES Multan Campus',
  overview: '',
  is_visible: true,
  is_builtin: true,
  display_order: 0,
};

export default function AdminEDCWorkshopsHub() {
  const [workshops, setWorkshops] = useState<WorkshopRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add Workshop modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newSlugManual, setNewSlugManual] = useState(false);
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newOverview, setNewOverview] = useState('');
  const [newHeroImage, setNewHeroImage] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newDateLabel, setNewDateLabel] = useState('');
  const [newRegLink, setNewRegLink] = useState('');
  const [newVisible, setNewVisible] = useState(true);
  const [isSavingNew, setIsSavingNew] = useState(false);

  // Archive confirmation modal
  const [archiveTarget, setArchiveTarget] = useState<WorkshopRecord | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const data = await cmsService.getSetting<{ items?: WorkshopRecord[] }>('workshops_list', { items: [] });
      const items: WorkshopRecord[] = (data?.items || []).filter((w) => w.is_archived !== true);
      // Sort by display_order, builtins first
      items.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      setWorkshops(items);
    } catch {
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  // Ensure Summer Bootcamp record always exists in workshops_list
  const ensureSummerBootcamp = async (currentItems: WorkshopRecord[]): Promise<WorkshopRecord[]> => {
    const hasSB = currentItems.some((w) => w.id === SUMMER_BOOTCAMP_RECORD.id);
    if (!hasSB) {
      return [SUMMER_BOOTCAMP_RECORD, ...currentItems];
    }
    return currentItems;
  };

  // ── Add Workshop ──────────────────────────────────────────
  const handleOpenAdd = () => {
    setNewTitle('');
    setNewSlug('');
    setNewSlugManual(false);
    setNewSubtitle('');
    setNewOverview('');
    setNewHeroImage('');
    setNewVenue('');
    setNewDateLabel('');
    setNewRegLink('');
    setNewVisible(true);
    setIsAddModalOpen(true);
  };

  const handleNewTitleChange = (val: string) => {
    setNewTitle(val);
    if (!newSlugManual) setNewSlug(slugify(val));
  };

  const handleNewSlugChange = (val: string) => {
    setNewSlug(slugify(val));
    setNewSlugManual(true);
  };

  const { cropperProps, openCropper } = useImageCropper();

  const handleNewHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          setNewHeroImage(res.publicUrl);
        } else {
          alert(`Upload failed: ${res.error}`);
        }
      },
      { aspectRatio: 16 / 9, title: 'Crop Workshop Hero Image (16:9 Wide)' }
    );
  };

  const handleSaveNew = async () => {
    if (!newTitle.trim()) { alert('Please enter a Workshop Title.'); return; }
    if (!newSlug.trim()) { alert('Please enter a Slug.'); return; }

    // Reserved slug
    if (newSlug === 'summer-bootcamp-2026') {
      alert('This slug is reserved for Summer Bootcamp 2026. Please choose a different slug.');
      return;
    }

    // Duplicate slug check
    const data = await cmsService.getSetting<{ items?: WorkshopRecord[] }>('workshops_list', { items: [] });
    const currentItems: WorkshopRecord[] = data?.items || [];
    const dup = currentItems.find((w) => w.slug === newSlug.trim());
    if (dup) {
      alert(`Slug "${newSlug}" is already in use. Please choose a unique slug.`);
      return;
    }

    setIsSavingNew(true);
    const newRecord: WorkshopRecord = {
      id: `workshop-${Date.now()}`,
      title: newTitle.trim(),
      slug: newSlug.trim(),
      subtitle: newSubtitle.trim(),
      overview: newOverview.trim(),
      hero_image: newHeroImage,
      venue: newVenue.trim(),
      date_label: newDateLabel.trim(),
      registration_link: newRegLink.trim(),
      is_visible: newVisible,
      is_archived: false,
      display_order: currentItems.length + 1,
    };

    const withSB = await ensureSummerBootcamp(currentItems);
    const updatedList = [...withSB, newRecord];
    const res = await cmsService.saveWorkshops(updatedList);
    setIsSavingNew(false);

    if (res.success) {
      setIsAddModalOpen(false);
      setMessage({ type: 'success', text: `Workshop "${newRecord.title}" created successfully.` });
      setTimeout(() => setMessage(null), 4000);
      fetchWorkshops();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to create workshop.' });
    }
  };

  // ── Toggle Visibility ─────────────────────────────────────
  const handleToggleVisibility = async (target: WorkshopRecord) => {
    const data = await cmsService.getSetting<{ items?: WorkshopRecord[] }>('workshops_list', { items: [] });
    const currentItems: WorkshopRecord[] = data?.items || [];
    const withSB = await ensureSummerBootcamp(currentItems);
    const updatedList = withSB.map((w) =>
      w.id === target.id ? { ...w, is_visible: !w.is_visible } : w
    );
    await cmsService.saveWorkshops(updatedList);
    fetchWorkshops();
  };

  // ── Reorder ───────────────────────────────────────────────
  const handleMove = async (idx: number, dir: 'up' | 'down') => {
    // idx is index within the non-builtin list
    const mutable = workshops.filter((w) => !w.is_builtin);
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= mutable.length) return;

    const reordered = [...mutable];
    const temp = reordered[idx];
    reordered[idx] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    reordered.forEach((w, i) => (w.display_order = i + 1));

    const data = await cmsService.getSetting<{ items?: WorkshopRecord[] }>('workshops_list', { items: [] });
    const currentItems: WorkshopRecord[] = data?.items || [];
    const withSB = await ensureSummerBootcamp(currentItems);
    // Replace non-builtin entries in the master list with reordered
    const updatedList = [...withSB.filter((w) => w.is_builtin), ...reordered];
    await cmsService.saveWorkshops(updatedList);
    fetchWorkshops();
  };

  // ── Archive ───────────────────────────────────────────────
  const handleArchiveConfirm = async () => {
    if (!archiveTarget) return;
    setIsArchiving(true);

    const res = await archiveService.archiveItem({
      settingKey: 'workshops_list',
      arrayKey: 'items',
      itemId: archiveTarget.id,
      moduleName: 'Workshops',
      title: archiveTarget.title,
      subtitle: archiveTarget.subtitle,
      image_url: archiveTarget.hero_image,
      itemData: archiveTarget,
    });

    setIsArchiving(false);
    setArchiveTarget(null);

    if (res.success) {
      setMessage({ type: 'success', text: `"${archiveTarget.title}" archived. Restore from Archive if needed.` });
      setTimeout(() => setMessage(null), 5000);
      fetchWorkshops();
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to archive workshop.' });
    }
  };

  const nonBuiltinWorkshops = workshops.filter((w) => !w.is_builtin);

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/services"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to Services"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Workshops Hub"
          subtitle="Manage all workshops. New workshops appear dynamically under Services → Workshops in the public navbar."
          action={
            <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
              Add Workshop
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

      {/* ── Built-in: Summer Bootcamp 2026 ── */}
      <AdminSection
        title="Built-in Workshop"
        description="Summer Bootcamp 2026 is a permanent workshop with a dedicated full editor. It cannot be archived."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                  Summer Bootcamp 2026
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                  BUILT-IN
                </span>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage hero media, overview text, bootcamp modules, schedule rows, and registration details.
              </p>
            </div>
            <Link
              to="/admin-panel5463/edc/workshops/summer-bootcamp-2026"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open Bootcamp Editor</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>
        </div>
      </AdminSection>

      {/* ── Custom Workshops ── */}
      <AdminSection
        title="Custom Workshops"
        description="Add and manage additional workshops. Each workshop appears dynamically under Services → Workshops in the public navbar when visible."
      >
        {loading ? (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center text-sm text-[#6B7280]">
            <div className="w-6 h-6 border-[3px] border-[#0093DD] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading workshops...
          </div>
        ) : nonBuiltinWorkshops.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center">
            <BookOpen className="w-10 h-10 text-[#9CA3AF] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#1F2937] mb-1">No custom workshops yet.</p>
            <p className="text-xs text-[#6B7280] mb-4">
              Click "Add Workshop" to create one. It will appear automatically in the public navbar.
            </p>
            <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
              Add Workshop
            </AdminButton>
          </div>
        ) : (
          <div className="space-y-3">
            {nonBuiltinWorkshops.map((w, idx) => (
              <AdminCard
                key={w.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg bg-[#F0F9FF] border border-[#E5E7EB] overflow-hidden flex items-center justify-center flex-shrink-0">
                    {w.hero_image ? (
                      <img src={w.hero_image} alt={w.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-[#0093DD]" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="text-sm font-bold text-[#1F2937] truncate">{w.title}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          w.is_visible
                            ? 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]'
                            : 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]'
                        }`}
                      >
                        {w.is_visible ? 'VISIBLE' : 'HIDDEN'}
                      </span>
                    </div>
                    {w.subtitle && (
                      <p className="text-xs text-[#6B7280] truncate">{w.subtitle}</p>
                    )}
                    {w.date_label && (
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{w.date_label}</p>
                    )}
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                      /edc/workshops/{w.slug}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  {/* Reorder */}
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-2 border border-[#E5E7EB] rounded bg-white text-[#6B7280] disabled:opacity-30 hover:text-[#0093DD] transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === nonBuiltinWorkshops.length - 1}
                    className="p-2 border border-[#E5E7EB] rounded bg-white text-[#6B7280] disabled:opacity-30 hover:text-[#0093DD] transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Visibility toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleVisibility(w)}
                    className={`p-2 border rounded transition-colors ${
                      w.is_visible
                        ? 'border-[#E5E7EB] bg-white text-[#0093DD] hover:bg-[#F0F9FF]'
                        : 'border-[#E5E7EB] bg-white text-[#9CA3AF] hover:text-[#0093DD]'
                    }`}
                    title={w.is_visible ? 'Hide from website' : 'Show on website'}
                  >
                    {w.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Edit */}
                  <Link
                    to={`/admin-panel5463/edc/workshops/${w.slug}/edit`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0093DD] bg-[#F0F9FF] border border-[#BAE6FD] rounded-md hover:bg-[#0093DD] hover:text-white transition-colors no-underline"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  {/* Archive */}
                  <button
                    type="button"
                    onClick={() => setArchiveTarget(w)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#DC2626] bg-red-50 border border-red-100 rounded-md hover:bg-[#DC2626] hover:text-white transition-colors cursor-pointer"
                    title="Archive this workshop"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Archive</span>
                  </button>
                </div>
              </AdminCard>
            ))}
          </div>
        )}
      </AdminSection>

      {/* ── Add Workshop Modal ── */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Workshop"
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveNew} loading={isSavingNew}>
              Create Workshop
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Workshop Title" required>
              <AdminInput
                value={newTitle}
                onChange={(e) => handleNewTitleChange(e.target.value)}
                placeholder="e.g. AI Leadership Workshop"
              />
            </AdminFormGroup>

            <AdminFormGroup label="URL Slug">
              <AdminInput
                value={newSlug}
                onChange={(e) => handleNewSlugChange(e.target.value)}
                placeholder="e.g. ai-leadership-workshop"
              />
              <p className="text-[11px] text-[#9CA3AF] mt-1">
                URL: <code className="bg-[#F3F4F6] px-1 rounded">/edc/workshops/{newSlug || 'your-slug'}</code>
              </p>
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Short Subtitle">
            <AdminInput
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
              placeholder="e.g. EDC — FAST-NUCES Multan Campus"
            />
          </AdminFormGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Date / Year">
              <AdminInput
                value={newDateLabel}
                onChange={(e) => setNewDateLabel(e.target.value)}
                placeholder="e.g. June 2026"
              />
            </AdminFormGroup>
            <AdminFormGroup label="Venue / Location">
              <AdminInput
                value={newVenue}
                onChange={(e) => setNewVenue(e.target.value)}
                placeholder="e.g. FAST-NUCES Multan Campus"
              />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Registration Link (optional)">
            <AdminInput
              value={newRegLink}
              onChange={(e) => setNewRegLink(e.target.value)}
              placeholder="https://..."
            />
          </AdminFormGroup>

          <AdminFormGroup label="Hero Banner Image">
            <div className="flex items-center gap-3">
              <div className="w-16 h-10 bg-[#F3F4F6] border border-[#E5E7EB] rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                {newHeroImage ? (
                  <img src={newHeroImage} alt="Hero" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-[#9CA3AF]" />
                )}
              </div>
              <label className="px-3 py-1.5 bg-[#0093DD] text-white text-xs font-semibold rounded cursor-pointer flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleNewHeroUpload} />
              </label>
              {newHeroImage && (
                <button
                  type="button"
                  onClick={() => setNewHeroImage('')}
                  className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded border border-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          </AdminFormGroup>

          <AdminFormGroup label="Overview / Description">
            <AdminTextarea
              rows={4}
              value={newOverview}
              onChange={(e) => setNewOverview(e.target.value)}
              placeholder="Brief description of the workshop..."
            />
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Website"
            checked={newVisible}
            onChange={(checked) => setNewVisible(checked)}
          />
        </div>
      </AdminModal>

      {/* ── Archive Confirm Modal ── */}
      <DeleteConfirmModal
        isOpen={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchiveConfirm}
        itemTitle={archiveTarget?.title}
        loading={isArchiving}
        confirmLabel="Archive Workshop"
        message="This workshop will be hidden from the CMS and public website. You can restore it from the Archive at any time."
      />

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
