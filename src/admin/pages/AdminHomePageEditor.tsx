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
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  ArrowUp,
  ArrowDown,
  Video,
  Eye,
  EyeOff,
  Edit2,
} from 'lucide-react';
import { homepageContent } from '../../data/homepage';
import { getYouTubeEmbedUrl } from '../../utils/youtube';

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
  is_visible: boolean;
}

export default function AdminHomePageEditor() {
  // Accordion state (News & Announcements section removed per Part 1)
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    hero: true,
    director: false,
    schools: false,
    whyUs: false,
    gallery: false,
    events: false,
    highlights: false,
    news: false,
    campusTour: false,
  });

  // Safe defaults
  const defaultHeroSlides = (homepageContent.heroSlides || []).map((slide, idx) => ({
    id: `hero-${idx}`,
    heading: slide.heading || '',
    subheading: slide.subheading || '',
    mediaType: 'image',
    mediaUrl: slide.backgroundImage || '',
    visible: true,
  }));

  const defaultSchoolCards = (homepageContent.ourSchools || []).map((s, idx) => ({
    id: `school-${idx}`,
    name: s.name || '',
    iconUrl: s.icon || '',
    href: s.href || '/departments',
    visible: true,
  }));

  const defaultWhyUsItems = (homepageContent.whyChooseUs || []).map((w, idx) => ({
    id: `why-${idx}`,
    title: w.title || '',
    description: w.description || '',
    iconUrl: w.icon || '',
    visible: true,
  }));

  const defaultHighlightItems = (homepageContent.campusHighlights || []).map((h, idx) => ({
    id: `hl-${idx}`,
    title: h.title || '',
    subtitle: h.subtitle || '',
    videoType: 'youtube',
    videoUrl: '',
    thumbnailUrl: h.thumbnail || '',
    visible: true,
  }));

  // State definitions
  const [heroSlides, setHeroSlides] = useState<any[]>(defaultHeroSlides);

  const [directorName, setDirectorName] = useState(homepageContent.directorMessage?.name || 'Dr. Director');
  const [directorTitle, setDirectorTitle] = useState(homepageContent.directorMessage?.title || 'Director, FAST-NUCES Multan Campus');
  const [directorMessage, setDirectorMessage] = useState(homepageContent.directorMessage?.message || '');
  const [directorPhoto, setDirectorPhoto] = useState(homepageContent.directorMessage?.photo || '');
  const [directorBadgePhoto, setDirectorBadgePhoto] = useState('');
  const [directorEmail, setDirectorEmail] = useState('');
  const [directorPhone, setDirectorPhone] = useState('');
  const [directorExt, setDirectorExt] = useState('');
  const [directorEducation, setDirectorEducation] = useState('');
  const [directorPublications, setDirectorPublications] = useState('');
  const [directorCollaborations, setDirectorCollaborations] = useState('');
  const [directorProjects, setDirectorProjects] = useState('');

  const [schoolsHeading, setSchoolsHeading] = useState('Our Schools');
  const [schoolsSubtitle, setSchoolsSubtitle] = useState('Explore the program that matches your interests');
  const [schoolCards, setSchoolCards] = useState<any[]>(defaultSchoolCards);

  const [whyUsHeading, setWhyUsHeading] = useState('Why Choose Us');
  const [whyUsSubtitle, setWhyUsSubtitle] = useState('Discover the FAST-NUCES Multan advantage');
  const [whyUsItems, setWhyUsItems] = useState<any[]>(defaultWhyUsItems);

  const [galleryHeading, setGalleryHeading] = useState('Campus Gallery');
  const [gallerySubtitle, setGallerySubtitle] = useState('Moments from FAST-NUCES Multan');
  const [galleryRow1Count, setGalleryRow1Count] = useState<number>(6);
  const [galleryRow2Count, setGalleryRow2Count] = useState<number>(6);
  const [galleryRow3Count, setGalleryRow3Count] = useState<number>(6);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<Partial<GalleryItem> | null>(null);
  const [galleryDeleteTarget, setGalleryDeleteTarget] = useState<GalleryItem | null>(null);
  const [galleryImageUploading, setGalleryImageUploading] = useState(false);
  const [savingGallery, setSavingGallery] = useState(false);

  const [eventsHeading, setEventsHeading] = useState('Upcoming Events');
  const [eventsSubtitle, setEventsSubtitle] = useState("Have a look at what's coming up");

  const [highlightsHeading, setHighlightsHeading] = useState('Campus Highlights & Life');
  const [highlightsSubtitle, setHighlightsSubtitle] = useState('Video tours, student experiences and campus achievements');
  const [showHighlightsSection, setShowHighlightsSection] = useState<boolean>(true);
  const [highlightItems, setHighlightItems] = useState<any[]>(defaultHighlightItems);

  const [newsHeading, setNewsHeading] = useState('News and Announcements');
  const [newsSubtitle, setNewsSubtitle] = useState('Stay updated with the latest news, announcements, and achievements from FAST-NUCES Multan Campus.');
  const [showNewsSection, setShowNewsSection] = useState<boolean>(true);

  // Campus Tour Video State
  const [campusTourHeading, setCampusTourHeading] = useState('Campus Tour');
  const [showCampusTourSection, setShowCampusTourSection] = useState<boolean>(true);
  const [campusTourVideoUrl, setCampusTourVideoUrl] = useState<string>('');

  // UI state
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; index: number; title: string } | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    const loadFullHomepageData = async () => {
      const data = await cmsService.getSetting<any>('homepage_full_content', null);
      if (data && typeof data === 'object') {
        if (Array.isArray(data.heroSlides) && data.heroSlides.length > 0) setHeroSlides(data.heroSlides);
        if (data.directorName) setDirectorName(data.directorName);
        if (data.directorTitle) setDirectorTitle(data.directorTitle);
        if (data.directorMessage) setDirectorMessage(data.directorMessage);
        if (data.directorPhoto) setDirectorPhoto(data.directorPhoto);
        if (data.directorBadgePhoto || data.directorBadgePhotoUrl) setDirectorBadgePhoto(data.directorBadgePhoto || data.directorBadgePhotoUrl);
        if (data.directorEmail) setDirectorEmail(data.directorEmail);
        if (data.directorPhone) setDirectorPhone(data.directorPhone);
        if (data.directorExt) setDirectorExt(data.directorExt);
        if (data.directorEducation) setDirectorEducation(data.directorEducation);
        if (data.directorPublications) setDirectorPublications(data.directorPublications);
        if (data.directorCollaborations) setDirectorCollaborations(data.directorCollaborations);
        if (data.directorProjects) setDirectorProjects(data.directorProjects);

        if (data.schoolsHeading) setSchoolsHeading(data.schoolsHeading);
        if (data.schoolsSubtitle) setSchoolsSubtitle(data.schoolsSubtitle);
        if (Array.isArray(data.schoolCards) && data.schoolCards.length > 0) setSchoolCards(data.schoolCards);

        if (data.whyUsHeading) setWhyUsHeading(data.whyUsHeading);
        if (data.whyUsSubtitle) setWhyUsSubtitle(data.whyUsSubtitle);
        if (Array.isArray(data.whyUsItems) && data.whyUsItems.length > 0) setWhyUsItems(data.whyUsItems);

        if (data.galleryHeading) setGalleryHeading(data.galleryHeading);
        if (data.gallerySubtitle) setGallerySubtitle(data.gallerySubtitle);
        if (data.galleryRow1Count) setGalleryRow1Count(data.galleryRow1Count);
        if (data.galleryRow2Count) setGalleryRow2Count(data.galleryRow2Count);
        if (data.galleryRow3Count) setGalleryRow3Count(data.galleryRow3Count);

        if (data.eventsHeading) setEventsHeading(data.eventsHeading);
        if (data.eventsSubtitle) setEventsSubtitle(data.eventsSubtitle);

        if (data.highlightsHeading) setHighlightsHeading(data.highlightsHeading);
        if (data.highlightsSubtitle) setHighlightsSubtitle(data.highlightsSubtitle);
        if (data.showHighlightsSection !== undefined) setShowHighlightsSection(data.showHighlightsSection);
        if (Array.isArray(data.highlightItems) && data.highlightItems.length > 0) setHighlightItems(data.highlightItems);

        if (data.newsHeading) setNewsHeading(data.newsHeading);
        if (data.newsSubtitle) setNewsSubtitle(data.newsSubtitle);
        if (data.showNewsSection !== undefined) setShowNewsSection(data.showNewsSection);

        if (data.campusTourHeading) setCampusTourHeading(data.campusTourHeading);
        if (data.showCampusTourSection !== undefined) setShowCampusTourSection(data.showCampusTourSection);
        if (data.campusTourVideoUrl || data.campusTourVideo) setCampusTourVideoUrl(data.campusTourVideoUrl || data.campusTourVideo);
      }

      // Load homepage photo gallery items from dedicated key
      const galleryData = await cmsService.getSetting<GalleryItem[]>('homepage_photo_gallery_list', []);
      if (Array.isArray(galleryData) && galleryData.length > 0) {
        setGalleryItems(galleryData.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)));
      }
    };
    loadFullHomepageData();
  }, []);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const moveHighlight = (index: number, direction: 'up' | 'down') => {
    const newList = [...highlightItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    setHighlightItems(newList);
  };

  const handleSaveSection = async (sectionKey: string) => {
    setSavingSection(sectionKey);
    setMessage(null);

    const payload = {
      heroSlides,
      directorName,
      directorTitle,
      directorMessage,
      directorPhoto,
      directorBadgePhoto,
      directorEmail,
      directorPhone,
      directorExt,
      directorEducation,
      directorPublications,
      directorCollaborations,
      directorProjects,
      schoolsHeading,
      schoolsSubtitle,
      schoolCards,
      whyUsHeading,
      whyUsSubtitle,
      whyUsItems,
      galleryHeading,
      gallerySubtitle,
      galleryRow1Count,
      galleryRow2Count,
      galleryRow3Count,
      eventsHeading,
      eventsSubtitle,
      highlightsHeading,
      highlightsSubtitle,
      showHighlightsSection,
      highlightItems,
      newsHeading,
      newsSubtitle,
      showNewsSection,
      campusTourHeading,
      showCampusTourSection,
      campusTourVideoUrl,
    };

    const res = await cmsService.saveSetting('homepage_full_content', payload, 'Full Homepage Content Settings');
    setSavingSection(null);

    if (res.success) {
      setMessage({ type: 'success', text: 'Changes saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || "We couldn't save your changes. Please try again." });
    }
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

  const handleHeroMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    mediaType: string,
    callback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm');
    const isImage = file.type.startsWith('image/');

    if (mediaType === 'video' && !isVideo) {
      alert('Invalid file format. Please select an MP4 or WebM video file for video background slides.');
      e.target.value = '';
      return;
    }
    if (mediaType === 'image' && !isImage) {
      alert('Invalid file format. Please select an image file (JPG, PNG, WebP) for image background slides.');
      e.target.value = '';
      return;
    }

    const res = await cmsService.uploadMedia(file);
    if (res.success && res.publicUrl) {
      callback(res.publicUrl);
    } else {
      alert(`Upload failed: ${res.error}`);
    }
    e.target.value = '';
  };

  // ── HOMEPAGE PHOTO GALLERY CRUD HELPERS ─────────────────────────────────────

  const persistGalleryItems = async (items: GalleryItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, display_order: idx + 1 }));
    setGalleryItems(ordered);
    const res = await cmsService.saveSetting('homepage_photo_gallery_list', ordered, 'Homepage Photo Gallery Items');
    return res;
  };

  const handleGalleryAddOpen = () => {
    setEditingGalleryItem({
      id: '',
      image_url: '',
      caption: '',
      display_order: galleryItems.length + 1,
      is_visible: true,
    });
    setGalleryModalOpen(true);
  };

  const handleGalleryEditOpen = (item: GalleryItem) => {
    setEditingGalleryItem({ ...item });
    setGalleryModalOpen(true);
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryImageUploading(true);
    const res = await cmsService.uploadMedia(file);
    setGalleryImageUploading(false);
    if (res.success && res.publicUrl) {
      setEditingGalleryItem((prev) => ({ ...prev, image_url: res.publicUrl }));
    } else {
      alert(`Image upload failed: ${res.error}`);
    }
    e.target.value = '';
  };

  const handleGallerySaveItem = async () => {
    if (!editingGalleryItem) return;
    setSavingGallery(true);
    const isNew = !editingGalleryItem.id;
    const finalItem: GalleryItem = {
      id: editingGalleryItem.id || `gal-${Date.now()}`,
      image_url: editingGalleryItem.image_url || '',
      caption: editingGalleryItem.caption || 'Campus Photo',
      display_order: editingGalleryItem.display_order || galleryItems.length + 1,
      is_visible: editingGalleryItem.is_visible !== false,
    };
    let updatedList: GalleryItem[];
    if (isNew) {
      updatedList = [...galleryItems, finalItem];
    } else {
      updatedList = galleryItems.map((item) => (item.id === finalItem.id ? finalItem : item));
    }
    const res = await persistGalleryItems(updatedList);
    setSavingGallery(false);
    if (res.success) {
      setGalleryModalOpen(false);
      setEditingGalleryItem(null);
      setMessage({ type: 'success', text: isNew ? 'Gallery item added successfully.' : 'Gallery item updated.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save gallery item.' });
    }
  };

  const handleGalleryDeleteConfirm = async () => {
    if (!galleryDeleteTarget) return;
    setSavingGallery(true);
    const updatedList = galleryItems.filter((item) => item.id !== galleryDeleteTarget.id);
    const res = await persistGalleryItems(updatedList);
    setSavingGallery(false);
    setGalleryDeleteTarget(null);
    if (res.success) {
      setMessage({ type: 'success', text: 'Gallery item deleted.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to delete gallery item.' });
    }
  };

  const handleGalleryToggleVisibility = async (id: string) => {
    const updatedList = galleryItems.map((item) =>
      item.id === id ? { ...item, is_visible: !item.is_visible } : item
    );
    await persistGalleryItems(updatedList);
  };

  const handleGalleryMove = async (index: number, direction: 'up' | 'down') => {
    const newList = [...galleryItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newList.length) return;
    const temp = newList[index];
    newList[index] = newList[targetIdx];
    newList[targetIdx] = temp;
    await persistGalleryItems(newList);
  };



  const confirmDelete = () => {
    if (!deleteTarget) return;
    const { type, index } = deleteTarget;
    if (type === 'hero') {
      setHeroSlides((prev) => prev.filter((_, i) => i !== index));
    } else if (type === 'school') {
      setSchoolCards((prev) => prev.filter((_, i) => i !== index));
    } else if (type === 'whyUs') {
      setWhyUsItems((prev) => prev.filter((_, i) => i !== index));
    } else if (type === 'highlight') {
      setHighlightItems((prev) => prev.filter((_, i) => i !== index));
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6 text-left max-w-[1350px]">
      <AdminPageHeader
        title="Edit Home Page"
        subtitle="Manage homepage sections: Hero, Director's Message, Our Schools, Why Choose Us, Gallery, Events, and Campus Highlights."
      />

      {message && (
        <div
          className={`p-4 rounded-lg border text-sm font-medium flex items-center gap-3 sticky top-20 z-40 shadow-md ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* 1. HERO SLIDES ACCORDION */}
      <AdminCard className="p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('hero')}
          className="w-full px-6 py-5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between transition-colors border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">1. Hero Banner Slides & Backgrounds</h3>
            <p className="text-xs text-[#6B7280]">Manage main homepage slides, background images, and MP4/WebM videos.</p>
          </div>
          {openAccordions.hero ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {openAccordions.hero && (
          <div className="p-6 space-y-6">
            {(heroSlides || []).map((slide, idx) => (
              <div key={slide.id || idx} className="p-4 border border-[#E5E7EB] rounded-lg bg-white space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                  <span className="text-xs font-bold uppercase text-[#0093DD]">Slide #{idx + 1}</span>
                  <button type="button" onClick={() => setDeleteTarget({ type: 'hero', index: idx, title: slide.heading })} className="p-1 text-[#DC2626] hover:bg-red-50 rounded cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminFormGroup label="Slide Heading">
                    <AdminInput value={slide.heading || ''} onChange={(e) => {
                      const updated = [...heroSlides];
                      updated[idx].heading = e.target.value;
                      setHeroSlides(updated);
                    }} />
                  </AdminFormGroup>

                  <AdminFormGroup label="Slide Subheading">
                    <AdminInput value={slide.subheading || ''} onChange={(e) => {
                      const updated = [...heroSlides];
                      updated[idx].subheading = e.target.value;
                      setHeroSlides(updated);
                    }} />
                  </AdminFormGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminFormGroup label="Media Type">
                    <select
                      value={slide.mediaType || 'image'}
                      onChange={(e) => {
                        const updated = [...heroSlides];
                        updated[idx].mediaType = e.target.value;
                        setHeroSlides(updated);
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]"
                    >
                      <option value="image">Image Background</option>
                      <option value="video">Video Background (MP4 / WebM)</option>
                    </select>
                  </AdminFormGroup>

                  <AdminFormGroup label={`Media Upload (${slide.mediaType === 'video' ? 'MP4 / WebM' : 'Image'})`}>
                    <div className="flex gap-2">
                      <AdminInput
                        value={slide.mediaUrl || ''}
                        onChange={(e) => {
                          const updated = [...heroSlides];
                          updated[idx].mediaUrl = e.target.value;
                          setHeroSlides(updated);
                        }}
                        placeholder={slide.mediaType === 'video' ? 'Video URL (.mp4 / .webm)...' : 'Image URL...'}
                      />

                      <label className="px-3.5 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 shadow-xs">
                        <Upload className="w-4 h-4" />
                        <span>Upload {slide.mediaType === 'video' ? 'Video' : 'Image'}</span>
                        <input
                          type="file"
                          accept={slide.mediaType === 'video' ? 'video/mp4,video/webm' : 'image/*'}
                          className="hidden"
                          onChange={(e) =>
                            handleHeroMediaUpload(e, slide.mediaType || 'image', (url) => {
                              const updated = [...heroSlides];
                              updated[idx].mediaUrl = url;
                              setHeroSlides(updated);
                            })
                          }
                        />
                      </label>
                    </div>

                    {/* Media Preview Box */}
                    <div className="mt-3 w-full max-w-[360px] h-[150px] bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center relative shadow-xs">
                      {slide.mediaUrl ? (
                        slide.mediaType === 'video' ? (
                          <video controls src={slide.mediaUrl} className="w-full h-full object-cover" />
                        ) : (
                          <img src={slide.mediaUrl} alt="Slide Preview" className="w-full h-full object-cover" />
                        )
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-[#9CA3AF]">
                          <ImageIcon className="w-6 h-6" />
                          <span className="text-[11px] font-semibold uppercase">No Media Uploaded Yet</span>
                        </div>
                      )}
                    </div>
                  </AdminFormGroup>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <AdminButton variant="secondary" onClick={() => setHeroSlides([...heroSlides, { id: `hero-${Date.now()}`, heading: 'New Slide Heading', subheading: 'New Slide Subtitle', mediaType: 'image', mediaUrl: '', visible: true }])} icon={<Plus className="w-4 h-4" />}>
                Add Hero Slide
              </AdminButton>
              <AdminButton variant="primary" onClick={() => handleSaveSection('hero')} loading={savingSection === 'hero'} icon={<Save className="w-4 h-4" />}>
                Save Hero Section
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* 2. DIRECTOR'S MESSAGE ACCORDION */}
      <AdminCard className="p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('director')}
          className="w-full px-6 py-5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between transition-colors border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">2. Director's Message</h3>
            <p className="text-xs text-[#6B7280]">Update Director photograph, name, title, and welcome text.</p>
          </div>
          {openAccordions.director ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {openAccordions.director && (
          <div className="p-6 space-y-6">
            {/* BASIC INFORMATION */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormGroup label="Director Name">
                  <AdminInput value={directorName} onChange={(e) => setDirectorName(e.target.value)} />
                </AdminFormGroup>

                <AdminFormGroup label="Designation / Title">
                  <AdminInput value={directorTitle} onChange={(e) => setDirectorTitle(e.target.value)} />
                </AdminFormGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormGroup label="Main Profile Image (Rectangular Frame)">
                  <div className="flex gap-2">
                    <AdminInput value={directorPhoto} onChange={(e) => setDirectorPhoto(e.target.value)} placeholder="Main photo URL..." />
                    <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB]">
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setDirectorPhoto(url))} />
                    </label>
                  </div>
                </AdminFormGroup>

                <AdminFormGroup label="Circular Badge Image (Overlapping Frame)">
                  <div className="flex gap-2">
                    <AdminInput value={directorBadgePhoto} onChange={(e) => setDirectorBadgePhoto(e.target.value)} placeholder="Badge photo URL (Optional)..." />
                    <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB]">
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setDirectorBadgePhoto(url))} />
                    </label>
                  </div>
                </AdminFormGroup>
              </div>
            </div>

            {/* CONTACT INFORMATION */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminFormGroup label="Email">
                  <AdminInput value={directorEmail} onChange={(e) => setDirectorEmail(e.target.value)} placeholder="director@multan.nu.edu.pk" />
                </AdminFormGroup>
                <AdminFormGroup label="Phone">
                  <AdminInput value={directorPhone} onChange={(e) => setDirectorPhone(e.target.value)} placeholder="+92 (61) 111-128-128" />
                </AdminFormGroup>
                <AdminFormGroup label="Extension">
                  <AdminInput value={directorExt} onChange={(e) => setDirectorExt(e.target.value)} placeholder="101" />
                </AdminFormGroup>
              </div>
            </div>

            {/* PROFILE CONTENT */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Profile Content</h4>
              <AdminFormGroup label="Introduction / Welcome Message">
                <AdminTextarea rows={5} value={directorMessage} onChange={(e) => setDirectorMessage(e.target.value)} placeholder="Director welcome message and introduction..." />
              </AdminFormGroup>
              <AdminFormGroup label="Education">
                <AdminTextarea rows={3} value={directorEducation} onChange={(e) => setDirectorEducation(e.target.value)} placeholder="Ph.D. in Computer Science..." />
              </AdminFormGroup>
            </div>

            {/* ACADEMIC DETAILS */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">Academic Details</h4>
              <AdminFormGroup label="Publications">
                <AdminTextarea rows={4} value={directorPublications} onChange={(e) => setDirectorPublications(e.target.value)} placeholder="List of journal and conference publications..." />
              </AdminFormGroup>
              <AdminFormGroup label="Collaborations at National and International Level">
                <AdminTextarea rows={4} value={directorCollaborations} onChange={(e) => setDirectorCollaborations(e.target.value)} placeholder="Academic and research collaborations..." />
              </AdminFormGroup>
              <AdminFormGroup label="Detail of Funded Projects">
                <AdminTextarea rows={4} value={directorProjects} onChange={(e) => setDirectorProjects(e.target.value)} placeholder="Grants, research funding, and sponsored projects..." />
              </AdminFormGroup>
            </div>

            <div className="flex justify-end pt-2">
              <AdminButton variant="primary" onClick={() => handleSaveSection('director')} loading={savingSection === 'director'} icon={<Save className="w-4 h-4" />}>
                Save Director's Profile & Message
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* 3. OUR SCHOOLS ACCORDION */}
      <AdminCard className="p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('schools')}
          className="w-full px-6 py-5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between transition-colors border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">3. Our Schools Section</h3>
            <p className="text-xs text-[#6B7280]">Manage School of Computing and School of Management cards and icons.</p>
          </div>
          {openAccordions.schools ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {openAccordions.schools && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Section Heading">
                <AdminInput value={schoolsHeading} onChange={(e) => setSchoolsHeading(e.target.value)} />
              </AdminFormGroup>

              <AdminFormGroup label="Section Subtitle">
                <AdminInput value={schoolsSubtitle} onChange={(e) => setSchoolsSubtitle(e.target.value)} />
              </AdminFormGroup>
            </div>

            <div className="space-y-4">
              {(schoolCards || []).map((school, idx) => (
                <div key={school.id || idx} className="p-4 border border-[#E5E7EB] rounded-lg bg-white space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                    <span className="text-xs font-bold uppercase text-[#0093DD]">School Card #{idx + 1}</span>
                    <button type="button" onClick={() => setDeleteTarget({ type: 'school', index: idx, title: school.name })} className="p-1 text-[#DC2626] hover:bg-red-50 rounded cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminFormGroup label="School Name">
                      <AdminInput value={school.name || ''} onChange={(e) => {
                        const updated = [...schoolCards];
                        updated[idx].name = e.target.value;
                        setSchoolCards(updated);
                      }} />
                    </AdminFormGroup>

                    <AdminFormGroup label="Destination Link">
                      <AdminInput value={school.href || ''} onChange={(e) => {
                        const updated = [...schoolCards];
                        updated[idx].href = e.target.value;
                        setSchoolCards(updated);
                      }} />
                    </AdminFormGroup>
                  </div>

                  <AdminFormGroup label="School Icon Upload">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#F3F4F6] border border-[#E5E7EB] rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                        {school.iconUrl ? (
                          <img src={school.iconUrl} alt={school.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-[#9CA3AF]" />
                        )}
                      </div>

                      <div className="flex gap-2">
                        <label className="px-3 py-1.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{school.iconUrl ? 'Replace Icon' : 'Upload Icon'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => {
                            const updated = [...schoolCards];
                            updated[idx].iconUrl = url;
                            setSchoolCards(updated);
                          })} />
                        </label>

                        {school.iconUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...schoolCards];
                              updated[idx].iconUrl = '';
                              setSchoolCards(updated);
                            }}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </AdminFormGroup>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <AdminButton variant="secondary" onClick={() => setSchoolCards([...schoolCards, { id: `school-${Date.now()}`, name: 'New School', iconUrl: '', href: '/departments', visible: true }])} icon={<Plus className="w-4 h-4" />}>
                Add School Card
              </AdminButton>
              <AdminButton variant="primary" onClick={() => handleSaveSection('schools')} loading={savingSection === 'schools'} icon={<Save className="w-4 h-4" />}>
                Save Schools Section
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* 4. WHY CHOOSE US ACCORDION */}
      <AdminCard className="p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('whyUs')}
          className="w-full px-6 py-5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between transition-colors border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">4. Why Choose Us Section</h3>
            <p className="text-xs text-[#6B7280]">Manage Faculty, Facilities, Library, and Campus Life highlight cards and icons.</p>
          </div>
          {openAccordions.whyUs ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {openAccordions.whyUs && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Section Heading">
                <AdminInput value={whyUsHeading} onChange={(e) => setWhyUsHeading(e.target.value)} />
              </AdminFormGroup>

              <AdminFormGroup label="Section Subtitle">
                <AdminInput value={whyUsSubtitle} onChange={(e) => setWhyUsSubtitle(e.target.value)} />
              </AdminFormGroup>
            </div>

            <div className="space-y-4">
              {(whyUsItems || []).map((item, idx) => (
                <div key={item.id || idx} className="p-4 border border-[#E5E7EB] rounded-lg bg-white space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                    <span className="text-xs font-bold uppercase text-[#0093DD]">Feature Card #{idx + 1}</span>
                    <button type="button" onClick={() => setDeleteTarget({ type: 'whyUs', index: idx, title: item.title })} className="p-1 text-[#DC2626] hover:bg-red-50 rounded cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminFormGroup label="Title">
                      <AdminInput value={item.title || ''} onChange={(e) => {
                        const updated = [...whyUsItems];
                        updated[idx].title = e.target.value;
                        setWhyUsItems(updated);
                      }} />
                    </AdminFormGroup>

                    <AdminFormGroup label="Feature Icon Upload">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                          {item.iconUrl ? (
                            <img src={item.iconUrl} alt={item.title} className="w-full h-full object-contain p-1.5" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-[#9CA3AF]" />
                          )}
                        </div>

                        <div className="flex gap-2">
                          <label className="px-3 py-1.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1 shadow-xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{item.iconUrl ? 'Replace Icon' : 'Upload Icon'}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => {
                              const updated = [...whyUsItems];
                              updated[idx].iconUrl = url;
                              setWhyUsItems(updated);
                            })} />
                          </label>

                          {item.iconUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...whyUsItems];
                                updated[idx].iconUrl = '';
                                setWhyUsItems(updated);
                              }}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </AdminFormGroup>
                  </div>

                  <AdminFormGroup label="Description">
                    <AdminTextarea rows={2} value={item.description || ''} onChange={(e) => {
                      const updated = [...whyUsItems];
                      updated[idx].description = e.target.value;
                      setWhyUsItems(updated);
                    }} />
                  </AdminFormGroup>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <AdminButton variant="secondary" onClick={() => setWhyUsItems([...whyUsItems, { id: `why-${Date.now()}`, title: 'New Feature', description: 'Feature description', iconUrl: '', visible: true }])} icon={<Plus className="w-4 h-4" />}>
                Add Feature Card
              </AdminButton>
              <AdminButton variant="primary" onClick={() => handleSaveSection('whyUs')} loading={savingSection === 'whyUs'} icon={<Save className="w-4 h-4" />}>
                Save Why Choose Us
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* 5. PHOTO GALLERY ACCORDION — FULL CRUD */}
      <AdminCard className="p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('gallery')}
          className="w-full px-6 py-5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between transition-colors border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">5. Photo Gallery</h3>
            <p className="text-xs text-[#6B7280]">Manage homepage Photo Gallery images, captions, order, and visibility.</p>
          </div>
          {openAccordions.gallery ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {openAccordions.gallery && (
          <div className="p-6 space-y-6">
            {/* Gallery Layout Settings */}
            <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg space-y-3">
              <h4 className="text-xs font-bold text-[#1F2937] uppercase tracking-wide">Gallery Layout (Images Per Row)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <AdminFormGroup label="Row 1 Images">
                  <select
                    value={galleryRow1Count}
                    onChange={(e) => setGalleryRow1Count(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n} image{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </AdminFormGroup>

                <AdminFormGroup label="Row 2 Images">
                  <select
                    value={galleryRow2Count}
                    onChange={(e) => setGalleryRow2Count(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n} image{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </AdminFormGroup>

                <AdminFormGroup label="Row 3 Images">
                  <select
                    value={galleryRow3Count}
                    onChange={(e) => setGalleryRow3Count(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n} image{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </AdminFormGroup>
              </div>
            </div>

            <div className="flex justify-end">
              <AdminButton variant="primary" onClick={() => handleSaveSection('gallery')} loading={savingSection === 'gallery'} icon={<Save className="w-4 h-4" />}>
                Save Gallery Layout & Headings
              </AdminButton>
            </div>

            {/* Gallery Items List */}
            <div className="border-t border-[#E5E7EB] pt-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-[#1F2937]">Gallery Images</h4>
                  <p className="text-xs text-[#6B7280] mt-0.5">{galleryItems.length} image{galleryItems.length !== 1 ? 's' : ''} in homepage gallery</p>
                </div>
                <AdminButton variant="primary" onClick={handleGalleryAddOpen} icon={<Plus className="w-4 h-4" />}>
                  Add Gallery Image
                </AdminButton>
              </div>

              {galleryItems.length === 0 ? (
                <div className="bg-[#F9FAFB] border border-dashed border-[#D1D5DB] rounded-lg p-10 text-center">
                  <ImageIcon className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#374151] mb-1">No gallery images yet</p>
                  <p className="text-xs text-[#6B7280] mb-4">Add photos to show them in the Homepage Photo Gallery carousel.</p>
                  <AdminButton variant="primary" onClick={handleGalleryAddOpen} icon={<Plus className="w-4 h-4" />}>
                    Add First Image
                  </AdminButton>
                </div>
              ) : (
                <div className="space-y-3">
                  {galleryItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 p-3 rounded-lg border ${item.is_visible ? 'border-[#E5E7EB] bg-white' : 'border-[#E5E7EB] bg-[#F9FAFB] opacity-60'}`}
                    >
                      {/* Thumbnail */}
                      <div className="w-[72px] h-[54px] flex-shrink-0 rounded-md overflow-hidden bg-[#F3F4F6] border border-[#E5E7EB]">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.caption} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-[#9CA3AF]" />
                          </div>
                        )}
                      </div>

                      {/* Caption + Order badge */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1F2937] truncate">{item.caption || 'Untitled'}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">Position #{idx + 1} · {item.is_visible ? 'Visible' : 'Hidden'}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          title="Move Up"
                          disabled={idx === 0}
                          onClick={() => handleGalleryMove(idx, 'up')}
                          className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3F4F6] rounded-md disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Move Down"
                          disabled={idx === galleryItems.length - 1}
                          onClick={() => handleGalleryMove(idx, 'down')}
                          className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3F4F6] rounded-md disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title={item.is_visible ? 'Hide' : 'Show'}
                          onClick={() => handleGalleryToggleVisibility(item.id)}
                          className="p-1.5 text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3F4F6] rounded-md cursor-pointer"
                        >
                          {item.is_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => handleGalleryEditOpen(item)}
                          className="p-1.5 text-[#6B7280] hover:text-[#0C71C3] hover:bg-[#EFF6FF] rounded-md cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => setGalleryDeleteTarget(item)}
                          className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </AdminCard>

      {/* GALLERY ADD/EDIT MODAL */}
      <AdminModal
        isOpen={galleryModalOpen}
        onClose={() => { setGalleryModalOpen(false); setEditingGalleryItem(null); }}
        title={editingGalleryItem?.id ? 'Edit Gallery Image' : 'Add Gallery Image'}
        maxWidth="md"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => { setGalleryModalOpen(false); setEditingGalleryItem(null); }}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleGallerySaveItem} loading={savingGallery || galleryImageUploading}>
              {editingGalleryItem?.id ? 'Update Image' : 'Add to Gallery'}
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          {/* Image Upload / Preview */}
          <AdminFormGroup label="Gallery Photo">
            <div className="space-y-2">
              {/* Preview */}
              <div className="w-full h-[160px] bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center">
                {editingGalleryItem?.image_url ? (
                  <img src={editingGalleryItem.image_url} alt="Gallery preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-[#9CA3AF]">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-[11px] font-semibold uppercase">No Image Yet</span>
                  </div>
                )}
              </div>

              {/* Upload & Remove buttons */}
              <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer">
                  {galleryImageUploading ? (
                    <span>Uploading…</span>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{editingGalleryItem?.image_url ? 'Replace Image' : 'Upload Image'}</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={galleryImageUploading}
                    onChange={handleGalleryImageUpload}
                  />
                </label>
                {editingGalleryItem?.image_url && (
                  <button
                    type="button"
                    onClick={() => setEditingGalleryItem((prev) => ({ ...prev, image_url: '' }))}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Manual URL fallback */}
              <AdminInput
                value={editingGalleryItem?.image_url || ''}
                onChange={(e) => setEditingGalleryItem((prev) => ({ ...prev, image_url: e.target.value }))}
                placeholder="Or paste image URL directly…"
              />
            </div>
          </AdminFormGroup>

          {/* Caption */}
          <AdminFormGroup label="Caption / Title">
            <AdminInput
              value={editingGalleryItem?.caption || ''}
              onChange={(e) => setEditingGalleryItem((prev) => ({ ...prev, caption: e.target.value }))}
              placeholder="e.g. Campus Life, Convocation 2026…"
            />
          </AdminFormGroup>

          {/* Visible toggle */}
          <AdminToggle
            label="Visible on Homepage Gallery"
            checked={editingGalleryItem?.is_visible !== false}
            onChange={(checked) => setEditingGalleryItem((prev) => ({ ...prev, is_visible: checked }))}
            description="When enabled, this photo will appear in the Homepage photo gallery carousel."
          />
        </div>
      </AdminModal>

      {/* GALLERY DELETE CONFIRM MODAL */}
      <DeleteConfirmModal
        isOpen={!!galleryDeleteTarget}
        onClose={() => setGalleryDeleteTarget(null)}
        onConfirm={handleGalleryDeleteConfirm}
        itemTitle={galleryDeleteTarget?.caption}
        loading={savingGallery}
      />



      {/* 6. UPCOMING EVENTS ACCORDION */}
      <AdminCard className="p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('events')}
          className="w-full px-6 py-5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between transition-colors border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">6. Upcoming Events Section</h3>
            <p className="text-xs text-[#6B7280]">Update section heading, subtitle, and manage upcoming events schedule.</p>
          </div>
          {openAccordions.events ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {openAccordions.events && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Section Heading">
                <AdminInput value={eventsHeading} onChange={(e) => setEventsHeading(e.target.value)} />
              </AdminFormGroup>

              <AdminFormGroup label="Section Subtitle">
                <AdminInput value={eventsSubtitle} onChange={(e) => setEventsSubtitle(e.target.value)} />
              </AdminFormGroup>
            </div>

            <div className="p-4 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-[#1F2937]">Manage Events Schedule</h4>
                <p className="text-xs text-[#6B7280]">Add, edit and manage the upcoming events displayed on the homepage.</p>
              </div>
              <a
                href="/admin-panel5463/events"
                className="px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline flex-shrink-0"
              >
                Open Events CMS
              </a>
            </div>

            <div className="flex justify-end pt-2">
              <AdminButton variant="primary" onClick={() => handleSaveSection('events')} loading={savingSection === 'events'} icon={<Save className="w-4 h-4" />}>
                Save Events Settings
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* 7. CAMPUS HIGHLIGHTS ACCORDION */}
      <AdminCard className="p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('highlights')}
          className="w-full px-6 py-5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between transition-colors border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">7. Campus Highlights & Life Section</h3>
            <p className="text-xs text-[#6B7280]">Manage video tours, event highlight reels, thumbnails, and YouTube embeds.</p>
          </div>
          {openAccordions.highlights ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {openAccordions.highlights && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Section Heading">
                <AdminInput value={highlightsHeading} onChange={(e) => setHighlightsHeading(e.target.value)} />
              </AdminFormGroup>

              <AdminFormGroup label="Section Subtitle">
                <AdminInput value={highlightsSubtitle} onChange={(e) => setHighlightsSubtitle(e.target.value)} />
              </AdminFormGroup>
            </div>

            <AdminToggle
              label="Visible on Homepage"
              checked={showHighlightsSection}
              onChange={(checked) => setShowHighlightsSection(checked)}
            />

            <div className="space-y-4">
              {(highlightItems || []).map((item, idx) => (
                <div key={item.id || idx} className="p-4 border border-[#E5E7EB] rounded-lg bg-white space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-[#0093DD]">Highlight #{idx + 1}</span>
                      <Video className="w-4 h-4 text-[#0093DD]" />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveHighlight(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveHighlight(idx, 'down')}
                        disabled={idx === highlightItems.length - 1}
                        className="p-1 text-[#6B7280] hover:text-[#1F2937] disabled:opacity-30 border border-[#E5E7EB] rounded cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => setDeleteTarget({ type: 'highlight', index: idx, title: item.title })} className="p-1 text-[#DC2626] hover:bg-red-50 rounded cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminFormGroup label="Highlight Title">
                      <AdminInput value={item.title || ''} onChange={(e) => {
                        const updated = [...highlightItems];
                        updated[idx].title = e.target.value;
                        setHighlightItems(updated);
                      }} placeholder="e.g. Campus Event Highlight Reel" />
                    </AdminFormGroup>

                    <AdminFormGroup label="Subtitle / Caption">
                      <AdminInput value={item.subtitle || ''} onChange={(e) => {
                        const updated = [...highlightItems];
                        updated[idx].subtitle = e.target.value;
                        setHighlightItems(updated);
                      }} placeholder="e.g. FAST-NUCES Multan Campus" />
                    </AdminFormGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AdminFormGroup label="Video Source Type">
                      <select
                        value={item.videoType || 'youtube'}
                        onChange={(e) => {
                          const updated = [...highlightItems];
                          updated[idx].videoType = e.target.value;
                          setHighlightItems(updated);
                        }}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]"
                      >
                        <option value="youtube">YouTube Video URL</option>
                        <option value="upload">Upload Video (MP4 / WebM)</option>
                      </select>
                    </AdminFormGroup>

                    <AdminFormGroup label={item.videoType === 'upload' ? 'Upload Video File' : 'YouTube URL'}>
                      {item.videoType === 'upload' ? (
                        <div className="flex gap-2">
                          <AdminInput value={item.videoUrl || ''} onChange={(e) => {
                            const updated = [...highlightItems];
                            updated[idx].videoUrl = e.target.value;
                            setHighlightItems(updated);
                          }} placeholder="Video URL..." />

                          <label className="px-3 py-2 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1 flex-shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => {
                              const updated = [...highlightItems];
                              updated[idx].videoUrl = url;
                              setHighlightItems(updated);
                            })} />
                          </label>
                        </div>
                      ) : (
                        <AdminInput
                          value={item.videoUrl || ''}
                          onChange={(e) => {
                            const updated = [...highlightItems];
                            updated[idx].videoUrl = e.target.value;
                            setHighlightItems(updated);
                          }}
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      )}
                    </AdminFormGroup>
                  </div>

                  <AdminFormGroup label="Video Preview">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                        {(() => {
                          if (item.thumbnailUrl) return <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />;
                          const vUrl = item.videoUrl || '';
                          const isDirect = vUrl.endsWith('.mp4') || vUrl.endsWith('.webm');
                          if (isDirect && vUrl) return <video src={vUrl} muted playsInline preload="metadata" className="w-full h-full object-cover" />;
                          const ytm = vUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&#]+)/);
                          if (ytm) return <img src={`https://img.youtube.com/vi/${ytm[1]}/hqdefault.jpg`} alt="Preview" className="w-full h-full object-cover" />;
                          return <span className="text-[10px] text-[#9CA3AF]">AUTO</span>;
                        })()}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-[#374151]">Auto-generated from video</p>
                        <p className="text-[11px] text-[#6B7280]">Preview uses the video's first frame or YouTube thumbnail.</p>
                        {item.thumbnailUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...highlightItems];
                              updated[idx].thumbnailUrl = '';
                              setHighlightItems(updated);
                            }}
                            className="mt-1 px-2 py-0.5 bg-red-50 text-[#DC2626] text-[10px] font-semibold rounded border border-red-200 cursor-pointer"
                          >
                            Clear Custom Thumbnail
                          </button>
                        )}
                      </div>
                    </div>
                  </AdminFormGroup>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <AdminButton variant="secondary" onClick={() => setHighlightItems([...highlightItems, { id: `hl-${Date.now()}`, title: 'New Video Highlight', subtitle: 'FAST-NUCES Multan Campus', videoType: 'youtube', videoUrl: '', thumbnailUrl: '', visible: true }])} icon={<Plus className="w-4 h-4" />}>
                Add Highlight Video
              </AdminButton>
              <AdminButton variant="primary" onClick={() => handleSaveSection('highlights')} loading={savingSection === 'highlights'} icon={<Save className="w-4 h-4" />}>
                Save Highlights Section
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* 8. NEWS & ANNOUNCEMENTS ACCORDION */}
      <AdminCard className="p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('news')}
          className="w-full px-6 py-5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between transition-colors border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">8. News & Announcements Section</h3>
            <p className="text-xs text-[#6B7280]">Manage section headings, homepage visibility, and announcements published on the homepage.</p>
          </div>
          {openAccordions.news ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {openAccordions.news && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Section Heading">
                <AdminInput value={newsHeading} onChange={(e) => setNewsHeading(e.target.value)} placeholder="News and Announcements" />
              </AdminFormGroup>

              <AdminFormGroup label="Section Subtitle">
                <AdminInput value={newsSubtitle} onChange={(e) => setNewsSubtitle(e.target.value)} placeholder="Stay updated with the latest news..." />
              </AdminFormGroup>
            </div>

            <AdminToggle
              label="Visible on Homepage"
              checked={showNewsSection}
              onChange={(checked) => setShowNewsSection(checked)}
              description="Show or hide the News & Announcements section on the main homepage."
            />

            <div className="p-4 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-[#1F2937]">Publish & Edit News Articles</h4>
                <p className="text-xs text-[#6B7280]">Add new announcements, edit title/excerpt/images, or publish/unpublish homepage news.</p>
              </div>
              <a
                href="/admin-panel5463/news"
                className="px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline flex-shrink-0"
              >
                Open News & Announcements CMS
              </a>
            </div>

            <div className="flex justify-end pt-2">
              <AdminButton variant="primary" onClick={() => handleSaveSection('news')} loading={savingSection === 'news'} icon={<Save className="w-4 h-4" />}>
                Save News & Announcements Section
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* 9. CAMPUS TOUR VIDEO ACCORDION */}
      <AdminCard className="p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('campusTour')}
          className="w-full px-6 py-5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between transition-colors border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">9. Campus Tour Section</h3>
            <p className="text-xs text-[#6B7280]">Manage YouTube embed URL, heading, and section visibility.</p>
          </div>
          {openAccordions.campusTour ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {openAccordions.campusTour && (
          <div className="p-6 space-y-6">
            <AdminFormGroup label="Section Heading">
              <AdminInput
                value={campusTourHeading}
                onChange={(e) => setCampusTourHeading(e.target.value)}
                placeholder="Campus Tour"
              />
            </AdminFormGroup>

            <AdminToggle
              label="Visible on Homepage"
              checked={showCampusTourSection}
              onChange={(checked) => setShowCampusTourSection(checked)}
              description="Show or hide the large Campus Tour video section on the homepage."
            />

            <AdminFormGroup label="YouTube Video URL">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <AdminInput
                    value={campusTourVideoUrl}
                    onChange={(e) => setCampusTourVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  />

                  {campusTourVideoUrl && (
                    <button
                      type="button"
                      onClick={() => setCampusTourVideoUrl('')}
                      className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer flex items-center gap-1 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {/* Video Preview Box */}
                <div className="w-full max-w-[640px] aspect-[16/9] bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg overflow-hidden flex items-center justify-center relative shadow-xs">
                  {getYouTubeEmbedUrl(campusTourVideoUrl) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(campusTourVideoUrl)!}
                      title="Campus Tour Preview"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#9CA3AF] p-4 text-center">
                      <Video className="w-8 h-8 text-[#9CA3AF]" />
                      <span className="text-xs font-semibold uppercase tracking-wider">No Valid YouTube URL Provided</span>
                      <span className="text-[11px]">Enter a YouTube video URL above to preview and display it on the homepage.</span>
                    </div>
                  )}
                </div>
              </div>
            </AdminFormGroup>

            <div className="flex justify-end pt-2">
              <AdminButton
                variant="primary"
                onClick={() => handleSaveSection('campusTour')}
                loading={savingSection === 'campusTour'}
                icon={<Save className="w-4 h-4" />}
              >
                Save Campus Tour Section
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        itemTitle={deleteTarget?.title}
      />
    </div>
  );
}
