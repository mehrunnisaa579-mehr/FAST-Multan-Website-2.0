import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import AdminToggle from '../components/ui/AdminToggle';
import AdminModal, { DeleteConfirmModal } from '../components/ui/AdminModal';
import { cmsService } from '../../services/cmsService';
import { archiveService } from '../../services/archiveService';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Calendar as CalendarIcon, Upload, ImageIcon } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  image_url: string;
  published: boolean;
  display_order: number;
}

// Normalize database time strings (e.g. "09:00:00") into HH:mm for <input type="time">
const normalizeTimeForInput = (timeStr?: string) => {
  if (!timeStr || !timeStr.trim()) return '';
  const clean = timeStr.trim();
  const parts = clean.split(':');
  if (parts.length >= 2) {
    const hh = parts[0].padStart(2, '0');
    const mm = parts[1].padStart(2, '0');
    return `${hh}:${mm}`;
  }
  return clean;
};

export default function AdminEventsManager() {
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<EventItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    const data = await cmsService.getEvents();
    setEventsList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      event_date: '',
      start_time: '09:00',
      end_time: '17:00',
      location: 'Main Auditorium, FAST-NUCES Multan',
      description: '',
      image_url: '',
      published: true,
      display_order: eventsList.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: EventItem) => {
    setEditingItem({
      id: item.id,
      title: item.title || '',
      event_date: item.event_date || '',
      start_time: normalizeTimeForInput(item.start_time),
      end_time: normalizeTimeForInput(item.end_time),
      location: item.location || '',
      description: item.description || '',
      image_url: item.image_url || '',
      published: item.published ?? true,
      display_order: item.display_order ?? 1,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setEditingItem((prev) => ({ ...prev, image_url: res.publicUrl }));
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  const handleSave = async () => {
    if (!editingItem?.title?.trim()) {
      alert('Please enter an event title.');
      return;
    }

    if (!editingItem?.event_date?.trim()) {
      alert('Please enter an event date.');
      return;
    }

    if (editingItem.start_time && editingItem.end_time && editingItem.end_time < editingItem.start_time) {
      alert('End time cannot be earlier than start time.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: editingItem.title.trim(),
        event_date: editingItem.event_date.trim(),
        start_time: editingItem.start_time || '',
        end_time: editingItem.end_time || '',
        location: editingItem.location || '',
        description: editingItem.description || '',
        image_url: editingItem.image_url || '',
        published: editingItem.published ?? true,
        display_order: editingItem.display_order || 1,
        updated_at: new Date().toISOString(),
      };

      if (editingItem.id) {
        const { error } = await supabase.from('events').update(payload).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('events').insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      setMessage({ type: 'success', text: 'Event saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
      fetchEvents();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save event.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await archiveService.archiveItem({
        table: 'events',
        itemId: deleteTarget.id,
        moduleName: 'Events Calendar',
        title: deleteTarget.title,
        subtitle: `${deleteTarget.event_date || 'Event'} • ${deleteTarget.location || ''}`,
        image_url: deleteTarget.image_url,
        itemData: deleteTarget,
      });

      if (!res.success) throw new Error(res.error || 'Failed to archive event');

      setDeleteTarget(null);
      setMessage({ type: 'success', text: 'Event moved to Archive.' });
      setTimeout(() => setMessage(null), 4000);
      fetchEvents();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to archive event.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1300px]">
      <AdminPageHeader
        title="Manage Events"
        subtitle="Schedule upcoming workshops, seminars, and orientation ceremonies with images and start/end time controls."
        action={
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add Event
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

      {loading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center text-sm text-[#6B7280]">
          Loading events...
        </div>
      ) : eventsList.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center">
          <p className="text-sm font-medium text-[#1F2937] mb-3">No upcoming events scheduled in database yet.</p>
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add First Event
          </AdminButton>
        </div>
      ) : (
        <div className="space-y-4">
          {eventsList.map((item) => (
            <AdminCard key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-[#F0F9FF] border border-[#E5E7EB] overflow-hidden flex items-center justify-center flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <CalendarIcon className="w-6 h-6 text-[#0093DD]" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#0093DD]">{item.event_date || 'TBA'}</span>
                    {item.start_time && (
                      <span className="text-xs text-[#6B7280]">
                        • {item.start_time} {item.end_time ? `– ${item.end_time}` : ''}
                      </span>
                    )}
                    <span className="text-xs text-[#6B7280]">• {item.location}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#1F2937]">{item.title}</h3>
                  <p className="text-xs text-[#6B7280] line-clamp-1 mt-0.5">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <AdminButton variant="secondary" onClick={() => handleOpenEdit(item)} icon={<Edit2 className="w-4 h-4" />}>
                  Edit
                </AdminButton>
                <AdminButton variant="danger" onClick={() => setDeleteTarget(item)} icon={<Trash2 className="w-4 h-4" />}>
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Add / Edit Event Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem?.id ? 'Edit Event' : 'Add New Event'}
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSave} loading={isSaving}>
              Save Event
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminFormGroup label="Event Title" required>
            <AdminInput
              value={editingItem?.title || ''}
              onChange={(e) => setEditingItem((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Orientation Ceremony 2026"
            />
          </AdminFormGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Event Date" required>
              <AdminInput
                type="text"
                value={editingItem?.event_date || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, event_date: e.target.value }))}
                placeholder="e.g. 16 August 2026 or 19 Aug"
              />
            </AdminFormGroup>

            <AdminFormGroup label="Location / Venue">
              <AdminInput
                value={editingItem?.location || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Main Auditorium, FAST-NUCES Multan"
              />
            </AdminFormGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Start Time">
              <AdminInput
                type="time"
                value={editingItem?.start_time || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, start_time: e.target.value }))}
              />
            </AdminFormGroup>

            <AdminFormGroup label="End Time">
              <AdminInput
                type="time"
                value={editingItem?.end_time || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, end_time: e.target.value }))}
              />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Event Image Upload">
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {editingItem?.image_url ? (
                  <img src={editingItem.image_url} alt="Event Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <div className="flex gap-2">
                  <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>{editingItem?.image_url ? 'Replace Image' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>

                  {editingItem?.image_url && (
                    <button
                      type="button"
                      onClick={() => setEditingItem((prev) => ({ ...prev, image_url: '' }))}
                      className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#6B7280]">Accepted formats: JPG, PNG, WEBP. Uploads to <code className="bg-[#F3F4F6] px-1 rounded">site-media</code> bucket.</p>
              </div>
            </div>
          </AdminFormGroup>

          <AdminFormGroup label="Event Description">
            <AdminTextarea
              rows={4}
              value={editingItem?.description || ''}
              onChange={(e) => setEditingItem((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide event details, schedule, and registration links..."
            />
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Website"
            checked={editingItem?.published ?? true}
            onChange={(checked) => setEditingItem((prev) => ({ ...prev, published: checked }))}
          />
        </div>
      </AdminModal>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemTitle={deleteTarget?.title}
        loading={isDeleting}
      />
    </div>
  );
}
