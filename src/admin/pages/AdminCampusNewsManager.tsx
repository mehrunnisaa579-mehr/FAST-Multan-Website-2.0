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
import { supabase } from '../../lib/supabase';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowUp,
  ArrowDown,
  FileText,
  ImageIcon,
  Save,
  Tag,
} from 'lucide-react';

interface CampusArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  category: string;
  published_at: string;
  published: boolean;
  display_order: number;
}

export default function AdminCampusNewsManager() {
  const [heroTitle, setHeroTitle] = useState('CAMPUS NEWS');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [articlesPerPage, setArticlesPerPage] = useState<number>(6);
  const [categories, setCategories] = useState<string[]>([
    'Academic Announcements',
    'Campus Life & Events',
    'Research & Innovation',
    'Admissions & Fees',
  ]);

  const [articles, setArticles] = useState<CampusArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<CampusArticle> | null>(null);

  const [newCatName, setNewCatName] = useState('');
  const [isSavingSetting, setIsSavingSetting] = useState(false);
  const [isSavingArticle, setIsSavingArticle] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<CampusArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCampusNewsData = async () => {
    setLoading(true);
    const settingsData = await cmsService.getSetting<any>('campus_news_settings', null);
    if (settingsData) {
      if (settingsData.heroTitle) setHeroTitle(settingsData.heroTitle);
      if (settingsData.heroImageUrl) setHeroImageUrl(settingsData.heroImageUrl);
      if (settingsData.articlesPerPage) setArticlesPerPage(Number(settingsData.articlesPerPage));
      if (Array.isArray(settingsData.categories) && settingsData.categories.length > 0) setCategories(settingsData.categories);
    }

    const { data: dbNews } = await supabase.from('news').select('*').order('display_order', { ascending: true });
    if (dbNews && dbNews.length > 0) {
      setArticles(
        dbNews.map((n: any) => ({
          id: n.id,
          title: n.title,
          excerpt: n.excerpt || '',
          content: n.content || '',
          image_url: n.image_url || '',
          author: n.author || 'Admin',
          category: n.category || 'Academic Announcements',
          published_at: n.published_at || new Date().toISOString(),
          published: n.published ?? true,
          display_order: n.display_order ?? 1,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCampusNewsData();
  }, []);

  const handleSaveSettings = async () => {
    setIsSavingSetting(true);
    setMessage(null);

    const payload = {
      heroTitle,
      heroImageUrl,
      articlesPerPage,
      categories,
    };

    const res = await cmsService.saveSetting('campus_news_settings', payload, 'Campus News Page Settings');
    setIsSavingSetting(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Campus News settings saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save settings.' });
    }
  };

  const handleOpenAddArticle = () => {
    setEditingArticle({
      title: '',
      excerpt: '',
      content: '',
      image_url: '',
      author: 'FAST Admin',
      category: categories[0] || 'Academic Announcements',
      published_at: new Date().toISOString().split('T')[0],
      published: true,
      display_order: articles.length + 1,
    });
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art: CampusArticle) => {
    setEditingArticle({
      ...art,
      published_at: art.published_at ? art.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setIsArticleModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      callback(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error}`);
    }
  };

  const handleSaveArticle = async () => {
    if (!editingArticle?.title?.trim()) {
      alert('Please enter an article title.');
      return;
    }

    setIsSavingArticle(true);
    try {
      const payload = {
        title: editingArticle.title.trim(),
        excerpt: editingArticle.excerpt || '',
        content: editingArticle.content || '',
        image_url: editingArticle.image_url || '',
        author: editingArticle.author || 'Admin',
        category: editingArticle.category || categories[0] || 'General',
        published_at: editingArticle.published_at ? new Date(editingArticle.published_at).toISOString() : new Date().toISOString(),
        published: editingArticle.published ?? true,
        display_order: editingArticle.display_order || 1,
        news_type: 'campus_news',
        updated_at: new Date().toISOString(),
      };

      if (editingArticle.id && !editingArticle.id.startsWith('art-')) {
        const { error } = await supabase.from('news').update(payload).eq('id', editingArticle.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('news').insert([payload]);
        if (error) throw error;
      }

      setIsArticleModalOpen(false);
      setMessage({ type: 'success', text: 'Article saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
      fetchCampusNewsData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to save article.' });
    } finally {
      setIsSavingArticle(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (!deleteTarget.id.startsWith('art-')) {
        const { error } = await supabase.from('news').delete().eq('id', deleteTarget.id);
        if (error) throw error;
      }
      setArticles((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
      setMessage({ type: 'success', text: 'Article deleted.' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Failed to delete article.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    if (categories.includes(newCatName.trim())) return;
    setCategories([...categories, newCatName.trim()]);
    setNewCatName('');
  };

  const handleDeleteCategory = (catName: string) => {
    if (confirm(`Delete category "${catName}"?`)) {
      setCategories(categories.filter((c) => c !== catName));
    }
  };

  return (
    <div className="space-y-6 text-left max-w-[1300px]">
      <AdminPageHeader
        title="Manage Campus News"
        subtitle="Manage the full Campus News page (/news), articles, hero banner, images, categories, and pagination."
        action={
          <AdminButton variant="primary" onClick={handleOpenAddArticle} icon={<Plus className="w-4 h-4" />}>
            Add Article
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

      {/* Page Hero & Pagination Settings */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2">
          Campus News Page Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormGroup label="Page Hero Title">
            <AdminInput value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
          </AdminFormGroup>

          <AdminFormGroup label="Articles Per Page">
            <AdminInput
              type="number"
              value={articlesPerPage}
              onChange={(e) => setArticlesPerPage(parseInt(e.target.value, 10) || 6)}
            />
          </AdminFormGroup>
        </div>

        <AdminFormGroup label="Hero Banner Image Upload">
          <div className="flex items-center gap-4">
            <div className="w-24 h-14 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
              {heroImageUrl ? (
                <img src={heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
              )}
            </div>

            <div className="flex gap-2">
              <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                <Upload className="w-4 h-4" />
                <span>{heroImageUrl ? 'Replace Hero Image' : 'Upload Hero Image'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setHeroImageUrl(url))} />
              </label>

              {heroImageUrl && (
                <button
                  type="button"
                  onClick={() => setHeroImageUrl('')}
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </AdminFormGroup>

        {/* Categories Manager */}
        <div className="pt-2 border-t border-[#F3F4F6] space-y-3">
          <h4 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#0093DD]" />
            <span>Manage News Categories</span>
          </h4>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span key={cat} className="px-3 py-1 bg-[#F0F9FF] border border-[#BAE6FD] text-[#0369A1] rounded-full text-xs font-semibold flex items-center gap-2">
                <span>{cat}</span>
                <button type="button" onClick={() => handleDeleteCategory(cat)} className="text-[#DC2626] hover:text-red-800 cursor-pointer font-bold">
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-[400px]">
            <AdminInput
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="New Category Name..."
            />
            <AdminButton variant="secondary" onClick={handleAddCategory} icon={<Plus className="w-4 h-4" />}>
              Add
            </AdminButton>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <AdminButton variant="primary" onClick={handleSaveSettings} loading={isSavingSetting} icon={<Save className="w-4 h-4" />}>
            Save Page Settings
          </AdminButton>
        </div>
      </AdminCard>

      {/* Articles List */}
      {loading ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center text-sm text-[#6B7280]">
          Loading articles...
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-12 text-center">
          <p className="text-sm font-medium text-[#1F2937] mb-3">No campus news articles created yet.</p>
          <AdminButton variant="primary" onClick={handleOpenAddArticle} icon={<Plus className="w-4 h-4" />}>
            Add First Article
          </AdminButton>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((item) => (
            <AdminCard key={item.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-[#F0F9FF] border border-[#E5E7EB] overflow-hidden flex items-center justify-center flex-shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-6 h-6 text-[#0093DD]" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0093DD] bg-[#F0F9FF] px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-xs text-[#6B7280]">• {new Date(item.published_at).toLocaleDateString()}</span>
                    <span className="text-xs text-[#6B7280]">• {item.author}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#1F2937]">{item.title}</h3>
                  <p className="text-xs text-[#6B7280] line-clamp-1 mt-0.5">{item.excerpt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <AdminButton variant="secondary" onClick={() => handleOpenEditArticle(item)} icon={<Edit2 className="w-4 h-4" />}>
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

      {/* Add / Edit Article Modal */}
      <AdminModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        title={editingArticle?.id ? 'Edit Campus News Article' : 'Add Campus News Article'}
        maxWidth="lg"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsArticleModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleSaveArticle} loading={isSavingArticle}>
              Save Article
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <AdminFormGroup label="Article Title" required>
            <AdminInput
              value={editingArticle?.title || ''}
              onChange={(e) => setEditingArticle((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. Academic Announcement for Fall 2026"
            />
          </AdminFormGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminFormGroup label="Category">
              <select
                value={editingArticle?.category || categories[0]}
                onChange={(e) => setEditingArticle((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </AdminFormGroup>

            <AdminFormGroup label="Author">
              <AdminInput
                value={editingArticle?.author || 'FAST Admin'}
                onChange={(e) => setEditingArticle((prev) => ({ ...prev, author: e.target.value }))}
              />
            </AdminFormGroup>
          </div>

          <AdminFormGroup label="Featured Image Upload">
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                {editingArticle?.image_url ? (
                  <img src={editingArticle.image_url} alt="Article Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
                )}
              </div>

              <div className="flex gap-2">
                <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-4 h-4" />
                  <span>{editingArticle?.image_url ? 'Replace Image' : 'Upload Image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setEditingArticle((prev) => ({ ...prev, image_url: url })))} />
                </label>

                {editingArticle?.image_url && (
                  <button
                    type="button"
                    onClick={() => setEditingArticle((prev) => ({ ...prev, image_url: '' }))}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </AdminFormGroup>

          <AdminFormGroup label="Short Excerpt">
            <AdminTextarea
              rows={2}
              value={editingArticle?.excerpt || ''}
              onChange={(e) => setEditingArticle((prev) => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief summary for list views..."
            />
          </AdminFormGroup>

          <AdminFormGroup label="Full Article Content">
            <AdminTextarea
              rows={6}
              value={editingArticle?.content || ''}
              onChange={(e) => setEditingArticle((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Write full article content..."
            />
          </AdminFormGroup>

          <AdminToggle
            label="Published / Visible on Website"
            checked={editingArticle?.published ?? true}
            onChange={(checked) => setEditingArticle((prev) => ({ ...prev, published: checked }))}
          />
        </div>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteArticle}
        itemTitle={deleteTarget?.title}
        loading={isDeleting}
      />
    </div>
  );
}
