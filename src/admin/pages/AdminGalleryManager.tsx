import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminModal, { DeleteConfirmModal } from '../components/ui/AdminModal';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, CheckCircle2, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  row_number: number;
  display_order: number;
  published: boolean;
}

export default function AdminGalleryManager() {
  const [selectedRow, setSelectedRow] = useState<number>(1);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [targetRow, setTargetRow] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchGallery = async () => {
    setLoading(true);
    const data = await cmsService.getGalleryItems();
    setGalleryItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredItems = galleryItems.filter((item) => item.row_number === selectedRow);

  const handleOpenAdd = (row: number) => {
    setTargetRow(row);
    setNewCaption('');
    setNewImageUrl('');
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!newImageUrl.trim()) {
      alert('Please upload an image or provide an image URL.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        image_url: newImageUrl.trim(),
        caption: newCaption || '',
        row_number: targetRow,
        display_order: filteredItems.length + 1,
        published: true,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('gallery_items').insert([payload]);
      if (error) throw error;

      setIsModalOpen(false);
      setMessage({ type: 'success', text: 'Image added to photo gallery.' });
      setTimeout(() => setMessage(null), 4000);
      fetchGallery();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to add image.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('gallery_items').delete().eq('id', deleteTarget.id);
      if (error) throw error;

      setDeleteTarget(null);
      setMessage({ type: 'success', text: 'Image removed from gallery.' });
      setTimeout(() => setMessage(null), 4000);
      fetchGallery();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to delete image.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      setNewImageUrl(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1300px]">
      <AdminPageHeader
        title="Manage Photo Gallery"
        subtitle="Manage images for the 3 horizontal carousel rows on the About page photo gallery."
        action={
          <AdminButton variant="primary" onClick={() => handleOpenAdd(selectedRow)} icon={<Plus className="w-4 h-4" />}>
            Add Image to Row {selectedRow}
          </AdminButton>
        }
      />

      {/* Row Tabs */}
      <div className="flex gap-3 border-b border-[#E5E7EB] pb-3">
        {[1, 2, 3].map((rowNum) => (
          <button
            key={rowNum}
            type="button"
            onClick={() => setSelectedRow(rowNum)}
            className={`px-5 py-2.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
              selectedRow === rowNum
                ? 'bg-[#0093DD] text-white shadow-xs'
                : 'bg-white text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB]'
            }`}
          >
            Gallery Row {rowNum}
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

      {loading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center text-sm text-[#6B7280]">
          Loading gallery images...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center">
          <p className="text-sm font-medium text-[#1F2937] mb-2">No custom images uploaded for Row {selectedRow} yet.</p>
          <p className="text-xs text-[#6B7280] mb-6">
            The public website is currently displaying standard campus activity images for Row {selectedRow}. Upload an image to customize!
          </p>
          <AdminButton variant="primary" onClick={() => handleOpenAdd(selectedRow)} icon={<Plus className="w-4 h-4" />}>
            Upload Image to Row {selectedRow}
          </AdminButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <AdminCard key={item.id} className="p-3 flex flex-col justify-between group">
              <div>
                <div className="aspect-[4/3] rounded-md bg-[#F3F4F6] overflow-hidden mb-2 border border-[#E5E7EB]">
                  <img src={item.image_url} alt={item.caption || 'Gallery Image'} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-semibold text-[#1F2937] truncate">{item.caption || 'Campus Photo'}</p>
              </div>

              <div className="pt-2 mt-2 border-t border-[#F3F4F6] flex justify-end">
                <AdminButton variant="danger" onClick={() => setDeleteTarget(item)} icon={<Trash2 className="w-3.5 h-3.5" />}>
                  Delete
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Add Image Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add Image to Gallery Row ${targetRow}`}
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSave} loading={isSaving}>
              Upload & Add Image
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminFormGroup label="Select Target Carousel Row">
            <select
              value={targetRow}
              onChange={(e) => setTargetRow(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]"
            >
              <option value={1}>Gallery Row 1 (Top Carousel)</option>
              <option value={2}>Gallery Row 2 (Middle Carousel)</option>
              <option value={3}>Gallery Row 3 (Bottom Carousel)</option>
            </select>
          </AdminFormGroup>

          <AdminFormGroup label="Image File or URL" required>
            <div className="flex gap-2 items-center">
              <AdminInput
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Upload file or paste image URL https://..."
              />
              <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB]">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </AdminFormGroup>

          {newImageUrl && (
            <div className="w-full aspect-[16/9] rounded-md overflow-hidden bg-[#F3F4F6] border border-[#E5E7EB]">
              <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}

          <AdminFormGroup label="Image Caption (Optional)">
            <AdminInput value={newCaption} onChange={(e) => setNewCaption(e.target.value)} placeholder="e.g. Orientation Ceremony 2026" />
          </AdminFormGroup>
        </div>
      </AdminModal>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemTitle={deleteTarget?.caption || 'Gallery Image'}
        loading={isDeleting}
      />
    </div>
  );
}
