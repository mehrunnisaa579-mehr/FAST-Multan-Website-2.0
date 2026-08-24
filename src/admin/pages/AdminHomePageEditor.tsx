import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../auth/useAdminAuth';
import { supabase } from '../../lib/supabase';
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
  RefreshCcw,
  Layers,
} from 'lucide-react';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

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

  const { adminProfile } = useAdminAuth();

  const [galleryHeading, setGalleryHeading] = useState('Campus Gallery');
  const [gallerySubtitle, setGallerySubtitle] = useState('Moments from FAST-NUCES Multan');
  const [galleryRow1Count, setGalleryRow1Count] = useState<number>(6);
  const [galleryRow2Count, setGalleryRow2Count] = useState<number>(6);
  const [galleryRow3Count, setGalleryRow3Count] = useState<number>(6);
  const [gallerySource, setGallerySource] = useState<'instagram' | 'local'>('instagram');
  const [localGalleryImages, setLocalGalleryImages] = useState<any[]>([]);
  const [uploadingLocalGallery, setUploadingLocalGallery] = useState(false);

  // Instagram Integration State
  const [igAccessToken, setIgAccessToken] = useState('');
  const [igBusinessId, setIgBusinessId] = useState('');
  const [savingIgCredentials, setSavingIgCredentials] = useState(false);
  const [syncingIg, setSyncingIg] = useState(false);
  const [igLastSynced, setIgLastSynced] = useState<string | null>(null);

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
        if (data.gallerySource) setGallerySource(data.gallerySource);
        if (Array.isArray(data.localGalleryImages)) setLocalGalleryImages(data.localGalleryImages);

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

      // Load Instagram Last Synced
      const { data: syncData } = await supabase
        .from('integration_settings')
        .select('updated_at')
        .eq('key', 'instagram_last_synced')
        .single();
      if (syncData?.updated_at) {
        setIgLastSynced(new Date(syncData.updated_at).toLocaleString());
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
      gallerySource,
      localGalleryImages,
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

  const { cropperProps, openCropper } = useImageCropper();

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (url: string) => void,
    opts?: { aspectRatio?: number; cropShape?: 'rect' | 'round'; title?: string }
  ) => {
    openCropper(
      e,
      async (croppedFile) => {
        const res = await cmsService.uploadMedia(croppedFile);
        if (res.success && res.publicUrl) {
          callback(res.publicUrl);
        } else {
          alert(`Upload failed: ${res.error}`);
        }
      },
      opts
    );
  };

  const handleHeroMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    mediaType: string,
    callback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (mediaType === 'video') {
      const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm');
      if (!isVideo) {
        alert('Invalid file format. Please select an MP4 or WebM video file for video background slides.');
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
    } else {
      openCropper(
        e,
        async (croppedFile) => {
          const res = await cmsService.uploadMedia(croppedFile);
          if (res.success && res.publicUrl) {
            callback(res.publicUrl);
          } else {
            alert(`Upload failed: ${res.error}`);
          }
        },
        { aspectRatio: 16 / 9, title: 'Crop Hero Slide Image (16:9 Wide)' }
      );
    }
  };

  const handleLocalGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingLocalGallery(true);
    const newItems: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await cmsService.uploadMedia(file);
      if (res.success && res.publicUrl) {
        newItems.push({
          id: 'local-' + Date.now() + '-' + i + '-' + Math.random().toString(36).substr(2, 4),
          image_url: res.publicUrl,
          caption: file.name.split('.')[0] || 'Gallery Image',
          display_order: localGalleryImages.length + newItems.length + 1,
          created_at: new Date().toISOString(),
        });
      } else {
        alert(`Upload failed for ${file.name}: ${res.error}`);
      }
    }
    if (newItems.length > 0) {
      setLocalGalleryImages((prev) => [...prev, ...newItems]);
      setMessage({ type: 'success', text: `Uploaded ${newItems.length} image(s) to local gallery.` });
    }
    setUploadingLocalGallery(false);
    e.target.value = '';
  };

  // ── INSTAGRAM INTEGRATION HANDLERS ──────────────────────────────────────────

  const handleSaveIgCredentials = async () => {
    if (!igAccessToken || !igBusinessId) {
      setMessage({ type: 'error', text: 'Both Access Token and Business ID are required.' });
      return;
    }
    setSavingIgCredentials(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/save-instagram-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ accessToken: igAccessToken, businessAccountId: igBusinessId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Instagram credentials saved to Vault securely.' });
        setIgAccessToken('');
        setIgBusinessId('');
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save credentials.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error while saving credentials.' });
    }
    setSavingIgCredentials(false);
  };

  const handleSyncInstagram = async () => {
    setSyncingIg(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-instagram-posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: data.message || 'Instagram feed synced successfully!' });
        setIgLastSynced(new Date().toLocaleString());
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to sync Instagram feed.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error while syncing feed.' });
    }
    setSyncingIg(false);
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
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setDirectorPhoto(url), { aspectRatio: 1, title: 'Crop Director Photo (1:1 Square)' })} />
                    </label>
                  </div>
                </AdminFormGroup>

                <AdminFormGroup label="Circular Badge Image (Overlapping Frame)">
                  <div className="flex gap-2">
                    <AdminInput value={directorBadgePhoto} onChange={(e) => setDirectorBadgePhoto(e.target.value)} placeholder="Badge photo URL (Optional)..." />
                    <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB]">
                      <Upload className="w-4 h-4" />
                      <span>Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setDirectorBadgePhoto(url), { aspectRatio: 1, cropShape: 'round', title: 'Crop Director Badge Photo (1:1 Circle)' })} />
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

      {/* 5. INSTAGRAM INTEGRATION & LOCAL PHOTO GALLERY ACCORDION */}
      {(adminProfile?.role === 'admin' || adminProfile?.role === 'super_admin') && (
        <AdminCard className="p-0 overflow-hidden">
          <button
            type="button"
            onClick={() => toggleAccordion('gallery')}
            className="w-full px-6 py-5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between transition-colors border-b border-[#E5E7EB] text-left cursor-pointer"
          >
            <div>
              <h3 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
                <InstagramIcon className="w-5 h-5 text-pink-600" />
                5. Photo Gallery & Instagram Integration
              </h3>
              <p className="text-xs text-[#6B7280]">Manage the homepage photo gallery source (Instagram feed or CMS local uploads) and layout settings.</p>
            </div>
            {openAccordions.gallery ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
          </button>

          {openAccordions.gallery && (
            <div className="p-6 space-y-6">
              {/* Headings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormGroup label="Gallery Section Heading">
                  <AdminInput value={galleryHeading} onChange={(e) => setGalleryHeading(e.target.value)} />
                </AdminFormGroup>
                <AdminFormGroup label="Gallery Section Subtitle">
                  <AdminInput value={gallerySubtitle} onChange={(e) => setGallerySubtitle(e.target.value)} />
                </AdminFormGroup>
              </div>

              {/* Gallery Source Selection */}
              <div className="p-4 bg-[#F0F9FF] border border-[#B9E6FE] rounded-lg space-y-3">
                <h4 className="text-xs font-bold text-[#0093DD] uppercase tracking-wide flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Gallery Source
                </h4>
                <p className="text-xs text-[#475467]">
                  Choose whether the homepage Photo Gallery displays images from the connected Instagram feed or locally uploaded images.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label
                    className={`flex items-start gap-3 p-3.5 border rounded-lg cursor-pointer transition-all ${
                      gallerySource === 'instagram'
                        ? 'bg-white border-[#0093DD] ring-2 ring-[#0093DD]/20 shadow-sm'
                        : 'bg-white/60 border-[#D0D5DD] hover:border-[#98A2B3]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gallerySource"
                      value="instagram"
                      checked={gallerySource === 'instagram'}
                      onChange={() => setGallerySource('instagram')}
                      className="mt-0.5 text-[#0093DD] focus:ring-[#0093DD]"
                    />
                    <div>
                      <span className="text-sm font-bold text-[#1D2939] block flex items-center gap-1.5">
                        <InstagramIcon className="w-4 h-4 text-pink-600 inline" />
                        Instagram
                      </span>
                      <span className="text-xs text-[#667085] block mt-0.5">
                        Display images from the connected Instagram feed.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 border rounded-lg cursor-pointer transition-all ${
                      gallerySource === 'local'
                        ? 'bg-white border-[#0093DD] ring-2 ring-[#0093DD]/20 shadow-sm'
                        : 'bg-white/60 border-[#D0D5DD] hover:border-[#98A2B3]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gallerySource"
                      value="local"
                      checked={gallerySource === 'local'}
                      onChange={() => setGallerySource('local')}
                      className="mt-0.5 text-[#0093DD] focus:ring-[#0093DD]"
                    />
                    <div>
                      <span className="text-sm font-bold text-[#1D2939] block flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-[#0093DD] inline" />
                        Local Uploads
                      </span>
                      <span className="text-xs text-[#667085] block mt-0.5">
                        Display images uploaded manually through this CMS.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Layout Settings */}
              <div className="p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg space-y-3">
                <h4 className="text-xs font-bold text-[#1F2937] uppercase tracking-wide">Gallery Layout (Posts Per Row)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <AdminFormGroup label="Row 1 Images">
                    <select value={galleryRow1Count} onChange={(e) => setGalleryRow1Count(parseInt(e.target.value, 10))} className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} post{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </AdminFormGroup>
                  <AdminFormGroup label="Row 2 Images">
                    <select value={galleryRow2Count} onChange={(e) => setGalleryRow2Count(parseInt(e.target.value, 10))} className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} post{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </AdminFormGroup>
                  <AdminFormGroup label="Row 3 Images">
                    <select value={galleryRow3Count} onChange={(e) => setGalleryRow3Count(parseInt(e.target.value, 10))} className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#1F2937]">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} post{n > 1 ? 's' : ''}</option>)}
                    </select>
                  </AdminFormGroup>
                </div>
              </div>

              <div className="flex justify-end">
                <AdminButton variant="primary" onClick={() => handleSaveSection('gallery')} loading={savingSection === 'gallery'} icon={<Save className="w-4 h-4" />}>
                  Save Gallery Source & Settings
                </AdminButton>
              </div>

              {/* Local Uploads Management Area */}
              {gallerySource === 'local' && (
                <div className="border-t border-[#E5E7EB] pt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#0093DD]" />
                        Local Gallery Images ({localGalleryImages.length})
                      </h4>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        Upload and manage local images for the homepage photo gallery.
                      </p>
                    </div>
                    <label className="px-4 py-2 bg-[#0093DD] text-white text-xs font-semibold rounded-md hover:bg-[#007BB8] cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>{uploadingLocalGallery ? 'Uploading...' : 'Upload Images'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                        onChange={handleLocalGalleryUpload}
                        disabled={uploadingLocalGallery}
                      />
                    </label>
                  </div>

                  {localGalleryImages.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-[#D0D5DD] rounded-lg text-center bg-[#F9FAFB]">
                      <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-gray-600">No local gallery images uploaded yet</p>
                      <p className="text-xs text-gray-400 mt-1">Click "Upload Images" above to add photos to the local gallery.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {localGalleryImages.map((img, idx) => (
                        <div key={img.id || idx} className="relative group bg-white border border-[#E5E7EB] rounded-lg overflow-hidden flex flex-col shadow-sm">
                          <div className="w-full h-28 bg-gray-100 overflow-hidden relative">
                            <img src={img.image_url} alt={img.caption || 'Gallery item'} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Delete this image from the local gallery?')) {
                                  setLocalGalleryImages(prev => prev.filter((_, i) => i !== idx));
                                }
                              }}
                              className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                              title="Delete image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="p-2 flex flex-col gap-1">
                            <input
                              type="text"
                              value={img.caption || ''}
                              onChange={(e) => {
                                const updated = [...localGalleryImages];
                                updated[idx].caption = e.target.value;
                                setLocalGalleryImages(updated);
                              }}
                              placeholder="Caption / Alt text"
                              className="w-full px-2 py-1 bg-gray-50 border border-[#E5E7EB] rounded text-[11px] text-gray-700"
                            />
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] text-gray-400 font-mono">#{idx + 1}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const updated = [...localGalleryImages];
                                    const temp = updated[idx];
                                    updated[idx] = updated[idx - 1];
                                    updated[idx - 1] = temp;
                                    setLocalGalleryImages(updated);
                                  }}
                                  className="p-1 text-gray-500 hover:text-[#0093DD] disabled:opacity-30 cursor-pointer"
                                  title="Move Left/Up"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === localGalleryImages.length - 1}
                                  onClick={() => {
                                    const updated = [...localGalleryImages];
                                    const temp = updated[idx];
                                    updated[idx] = updated[idx + 1];
                                    updated[idx + 1] = temp;
                                    setLocalGalleryImages(updated);
                                  }}
                                  className="p-1 text-gray-500 hover:text-[#0093DD] disabled:opacity-30 cursor-pointer"
                                  title="Move Right/Down"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Instagram Credentials */}
              <div className="border-t border-[#E5E7EB] pt-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-[#1F2937] flex items-center gap-2">
                      <InstagramIcon className="w-4 h-4 text-pink-600" />
                      API Credentials
                    </h4>
                    <p className="text-xs text-[#6B7280] mt-0.5">Tokens are stored securely in Supabase Vault and never exposed to the frontend.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AdminFormGroup label="Instagram Graph API Access Token">
                    <AdminInput type="password" value={igAccessToken} onChange={(e) => setIgAccessToken(e.target.value)} placeholder="IGQ..." />
                  </AdminFormGroup>
                  <AdminFormGroup label="Instagram Business Account ID">
                    <AdminInput type="password" value={igBusinessId} onChange={(e) => setIgBusinessId(e.target.value)} placeholder="178414..." />
                  </AdminFormGroup>
                </div>
                <div className="flex justify-end mt-4">
                  <AdminButton variant="secondary" onClick={handleSaveIgCredentials} loading={savingIgCredentials} icon={<Save className="w-4 h-4" />}>
                    Save API Credentials
                  </AdminButton>
                </div>
              </div>

              {/* Sync Actions */}
              <div className="border-t border-[#E5E7EB] pt-5">
                <div className="flex items-center justify-between bg-blue-50 border border-blue-100 p-4 rounded-lg">
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">Manual Feed Sync</h4>
                    <p className="text-xs text-blue-700 mt-0.5">
                      The feed automatically syncs hourly via a background cron job. You can also trigger a manual sync right now.
                    </p>
                    {igLastSynced && (
                      <p className="text-xs font-semibold text-blue-800 mt-2">
                        Last Synced: {igLastSynced}
                      </p>
                    )}
                  </div>
                  <AdminButton variant="primary" onClick={handleSyncInstagram} loading={syncingIg} icon={<RefreshCcw className="w-4 h-4" />}>
                    Sync Instagram Feed Now
                  </AdminButton>
                </div>
              </div>

            </div>
          )}
        </AdminCard>
      )}



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

      <ImageCropModal {...cropperProps} />
    </div>
  );
}
