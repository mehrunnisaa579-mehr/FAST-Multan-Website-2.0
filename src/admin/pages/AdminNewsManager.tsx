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
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Upload, Eye, EyeOff } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  published: boolean;
  published_at?: string;
  author?: string;
  display_order?: number;
}

export default function AdminNewsManager() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<NewsItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await cmsService.getNews();
      setNewsList(data);
    } catch {
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      title: '',
      excerpt: '',
      content: '',
      image_url: '',
      category: 'Campus News',
      published: true,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveItem = async () => {
    if (!editingItem?.title?.trim()) {
      alert('Please enter a title for the news item.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: editingItem.title.trim(),
        excerpt: editingItem.excerpt || '',
        content: editingItem.content || '',
        image_url: editingItem.image_url || '',
        category: editingItem.category || 'Campus News',
        published: editingItem.published ?? true,
        updated_at: new Date().toISOString(),
      };

      if (editingItem.id) {
        // Update
        const { error } = await supabase.from('news').update(payload).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from('news').insert([payload]);
        if (error) throw error;
      }

      setIsEditModalOpen(false);
      setMessage({ type: 'success', text: 'News item saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
      fetchNews();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save news item.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await archiveService.archiveItem({
        table: 'news',
        itemId: deleteTarget.id,
        moduleName: 'Campus News & Announcements',
        title: deleteTarget.title,
        subtitle: deleteTarget.category || deleteTarget.excerpt,
        image_url: deleteTarget.image_url,
        itemData: deleteTarget,
      });

      if (!res.success) throw new Error(res.error || 'Failed to archive item');

      setDeleteTarget(null);
      setMessage({ type: 'success', text: 'News item moved to Archive.' });
      setTimeout(() => setMessage(null), 4000);
      fetchNews();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to archive item.' });
    } finally {
      setIsDeleting(false);
    }
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

  return (
    <div className="space-y-6 text-left max-w-[1300px]">
      <AdminPageHeader
        title="Manage News & Announcements"
        subtitle="Publish campus news articles, orientation notices, and press updates."
        action={
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add News Item
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

      {/* News List */}
      {loading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center text-sm text-[#6B7280]">
          Loading news items...
        </div>
      ) : newsList.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center">
          <p className="text-sm font-medium text-[#1F2937] mb-3">No news items in database yet.</p>
          <p className="text-xs text-[#6B7280] mb-6">
            The public website is currently displaying standard campus announcements as fallback. Add a new item to override with live CMS news!
          </p>
          <AdminButton variant="primary" onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
            Add First News Item
          </AdminButton>
        </div>
      ) : (
        <div className="space-y-4">
          {newsList.map((item) => (
            <AdminCard key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded-md flex-shrink-0 border border-[#E5E7EB]" />
                ) : (
                  <div className="w-16 h-16 bg-[#F3F4F6] rounded-md flex items-center justify-center text-[10px] font-bold text-[#9CA3AF] flex-shrink-0">
                    NO IMAGE
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${item.published ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-[#6B7280]">{item.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#1F2937]">{item.title}</h3>
                  <p className="text-xs text-[#6B7280] line-clamp-1 mt-0.5">{item.excerpt}</p>
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

      {/* Edit / Add Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={editingItem?.id ? 'Edit News Item' : 'Add New News Item'}
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveItem} loading={isSaving}>
              Save News Item
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminFormGroup label="News Title" required>
            <AdminInput
              value={editingItem?.title || ''}
              onChange={(e) => setEditingItem((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Orientation Ceremony 2026"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Category">
            <AdminInput
              value={editingItem?.category || ''}
              onChange={(e) => setEditingItem((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="Campus News / Announcement"
            />
          </AdminFormGroup>

          <AdminFormGroup label="Short Summary / Excerpt">
            <AdminTextarea
              rows={2}
              value={editingItem?.excerpt || ''}
              onChange={(e) => setEditingItem((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief overview shown on news listing..."
            />
          </AdminFormGroup>

          <AdminFormGroup label="Full Article Content">
            <AdminTextarea
              rows={6}
              value={editingItem?.content || ''}
              onChange={(e) => setEditingItem((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Full news story text..."
            />
          </AdminFormGroup>

          <AdminFormGroup label="Featured Image URL or File Upload">
            <div className="flex gap-2 items-center">
              <AdminInput
                value={editingItem?.image_url || ''}
                onChange={(e) => setEditingItem((prev) => ({ ...prev, image_url: e.target.value }))}
                placeholder="https://..."
              />
              <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB]">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </AdminFormGroup>

          <AdminToggle
            label="Visible on Website (Published)"
            checked={editingItem?.published ?? true}
            onChange={(checked) => setEditingItem((prev) => ({ ...prev, published: checked }))}
            description="When enabled, this news article will be displayed to public visitors."
          />
        </div>
      </AdminModal>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        itemTitle={deleteTarget?.title}
        loading={isDeleting}
      />
    </div>
  );
}
