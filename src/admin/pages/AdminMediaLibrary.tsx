import React, { useState, useEffect } from 'react';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import { DeleteConfirmModal } from '../components/ui/AdminModal';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../lib/supabase';
import { Upload, Copy, Check, Trash2, FileText, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';

interface FileItem {
  name: string;
  id?: string;
  updated_at?: string;
  created_at?: string;
  metadata?: {
    size?: number;
    mimetype?: string;
  };
}

export default function AdminMediaLibrary() {
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<FileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from('site-media').list('uploads', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error || !data) {
        setFileList([]);
      } else {
        setFileList(
          data
            .filter((f) => f.name !== '.emptyFolderPlaceholder')
            .map((f) => ({
              name: f.name,
              id: f.id || undefined,
              updated_at: f.updated_at || undefined,
              created_at: f.created_at || undefined,
              metadata: f.metadata || undefined,
            }))
        );
      }
    } catch {
      setFileList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage(null);

    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      const res = await cmsService.uploadMedia(files[i]);
      if (res.success) successCount++;
    }

    setUploading(false);
    if (successCount > 0) {
      setMessage({ type: 'success', text: `Uploaded ${successCount} file(s) to Media Library.` });
      setTimeout(() => setMessage(null), 4000);
      fetchFiles();
    } else {
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
    }
  };

  const getPublicUrl = (fileName: string) => {
    const { data } = supabase.storage.from('site-media').getPublicUrl(`uploads/${fileName}`);
    return data.publicUrl;
  };

  const handleCopyLink = (fileName: string) => {
    const url = getPublicUrl(fileName);
    navigator.clipboard.writeText(url);
    setCopiedName(fileName);
    setTimeout(() => setCopiedName(null), 2500);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.storage
        .from('site-media')
        .remove([`uploads/${deleteTarget.name}`]);

      if (error) throw error;

      setDeleteTarget(null);
      setMessage({ type: 'success', text: 'File deleted from Media Library.' });
      setTimeout(() => setMessage(null), 4000);
      fetchFiles();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to delete file.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1300px]">
      <AdminPageHeader
        title="Media Library"
        subtitle="Upload photos, document PDFs, and campus assets. Use public links in website pages."
        action={
          <label className="px-4 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-2 shadow-xs">
            <Upload className="w-4 h-4" />
            <span>Upload Media</span>
            <input type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
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

      {loading || uploading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center text-sm text-[#6B7280]">
          {uploading ? 'Uploading media files...' : 'Loading media files...'}
        </div>
      ) : fileList.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center">
          <p className="text-sm font-medium text-[#1F2937] mb-3">No uploaded files in Media Library yet.</p>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Upload First File</span>
            <input type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {fileList.map((file) => {
            const url = getPublicUrl(file.name);
            const isPdf = file.name.toLowerCase().endsWith('.pdf');
            const isCopied = copiedName === file.name;

            return (
              <AdminCard key={file.name} className="p-3 flex flex-col justify-between group">
                <div>
                  <div className="aspect-[4/3] rounded-md bg-[#F3F4F6] overflow-hidden mb-2 border border-[#E5E7EB] flex items-center justify-center">
                    {isPdf ? (
                      <div className="flex flex-col items-center gap-1 text-[#DC2626]">
                        <FileText className="w-10 h-10" />
                        <span className="text-[10px] font-bold uppercase">PDF Document</span>
                      </div>
                    ) : (
                      <img src={url} alt={file.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-[#1F2937] truncate" title={file.name}>
                    {file.name}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-[#F3F4F6] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(file.name)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#0093DD] hover:underline cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <AdminButton variant="danger" onClick={() => setDeleteTarget(file)} icon={<Trash2 className="w-3.5 h-3.5" />}>
                    Delete
                  </AdminButton>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemTitle={deleteTarget?.name}
        loading={isDeleting}
      />
    </div>
  );
}
