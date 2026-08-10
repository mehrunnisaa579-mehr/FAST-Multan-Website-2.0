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
} from 'lucide-react';
import { homepageContent } from '../../data/homepage';

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

  const [schoolsHeading, setSchoolsHeading] = useState('Our Schools');
  const [schoolsSubtitle, setSchoolsSubtitle] = useState('Explore the program that matches your interests');
  const [schoolCards, setSchoolCards] = useState<any[]>(defaultSchoolCards);

  const [whyUsHeading, setWhyUsHeading] = useState('Why Choose Us');
  const [whyUsSubtitle, setWhyUsSubtitle] = useState('Discover the FAST-NUCES Multan advantage');
  const [whyUsItems, setWhyUsItems] = useState<any[]>(defaultWhyUsItems);

  const [galleryHeading, setGalleryHeading] = useState('Campus Gallery');
  const [gallerySubtitle, setGallerySubtitle] = useState('Moments from FAST-NUCES Multan');

  const [eventsHeading, setEventsHeading] = useState('Upcoming Events');
  const [eventsSubtitle, setEventsSubtitle] = useState("Have a look at what's coming up");

  const [highlightsHeading, setHighlightsHeading] = useState('Campus Highlights & Life');
  const [highlightsSubtitle, setHighlightsSubtitle] = useState('Video tours, student experiences and campus achievements');
  const [showHighlightsSection, setShowHighlightsSection] = useState<boolean>(true);
  const [highlightItems, setHighlightItems] = useState<any[]>(defaultHighlightItems);

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

        if (data.schoolsHeading) setSchoolsHeading(data.schoolsHeading);
        if (data.schoolsSubtitle) setSchoolsSubtitle(data.schoolsSubtitle);
        if (Array.isArray(data.schoolCards) && data.schoolCards.length > 0) setSchoolCards(data.schoolCards);

        if (data.whyUsHeading) setWhyUsHeading(data.whyUsHeading);
        if (data.whyUsSubtitle) setWhyUsSubtitle(data.whyUsSubtitle);
        if (Array.isArray(data.whyUsItems) && data.whyUsItems.length > 0) setWhyUsItems(data.whyUsItems);

        if (data.galleryHeading) setGalleryHeading(data.galleryHeading);
        if (data.gallerySubtitle) setGallerySubtitle(data.gallerySubtitle);

        if (data.eventsHeading) setEventsHeading(data.eventsHeading);
        if (data.eventsSubtitle) setEventsSubtitle(data.eventsSubtitle);

        if (data.highlightsHeading) setHighlightsHeading(data.highlightsHeading);
        if (data.highlightsSubtitle) setHighlightsSubtitle(data.highlightsSubtitle);
        if (data.showHighlightsSection !== undefined) setShowHighlightsSection(data.showHighlightsSection);
        if (Array.isArray(data.highlightItems) && data.highlightItems.length > 0) setHighlightItems(data.highlightItems);
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
      schoolsHeading,
      schoolsSubtitle,
      schoolCards,
      whyUsHeading,
      whyUsSubtitle,
      whyUsItems,
      galleryHeading,
      gallerySubtitle,
      eventsHeading,
      eventsSubtitle,
      highlightsHeading,
      highlightsSubtitle,
      showHighlightsSection,
      highlightItems,
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

                  <AdminFormGroup label="Media Upload">
                    <div className="flex gap-2">
                      <AdminInput value={slide.mediaUrl || ''} onChange={(e) => {
                        const updated = [...heroSlides];
                        updated[idx].mediaUrl = e.target.value;
                        setHeroSlides(updated);
                      }} placeholder="Media URL..." />

                      <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB]">
                        <Upload className="w-4 h-4" />
                        <span>Upload</span>
                        <input type="file" accept={slide.mediaType === 'video' ? 'video/*' : 'image/*'} className="hidden" onChange={(e) => handleFileUpload(e, (url) => {
                          const updated = [...heroSlides];
                          updated[idx].mediaUrl = url;
                          setHeroSlides(updated);
                        })} />
                      </label>
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
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Director Name">
                <AdminInput value={directorName} onChange={(e) => setDirectorName(e.target.value)} />
              </AdminFormGroup>

              <AdminFormGroup label="Designation / Title">
                <AdminInput value={directorTitle} onChange={(e) => setDirectorTitle(e.target.value)} />
              </AdminFormGroup>
            </div>

            <AdminFormGroup label="Director Photograph Upload">
              <div className="flex gap-2">
                <AdminInput value={directorPhoto} onChange={(e) => setDirectorPhoto(e.target.value)} placeholder="Image URL..." />
                <label className="px-3 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1F2937] text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1.5 flex-shrink-0 border border-[#E5E7EB]">
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => setDirectorPhoto(url))} />
                </label>
              </div>
            </AdminFormGroup>

            <AdminFormGroup label="Message Content">
              <AdminTextarea rows={5} value={directorMessage} onChange={(e) => setDirectorMessage(e.target.value)} />
            </AdminFormGroup>

            <div className="flex justify-end pt-2">
              <AdminButton variant="primary" onClick={() => handleSaveSection('director')} loading={savingSection === 'director'} icon={<Save className="w-4 h-4" />}>
                Save Director's Message
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

      {/* 5. PHOTO GALLERY HEADINGS ACCORDION */}
      <AdminCard className="p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('gallery')}
          className="w-full px-6 py-5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between transition-colors border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">5. Photo Gallery Headings</h3>
            <p className="text-xs text-[#6B7280]">Update section heading and subtitle for homepage Photo Gallery.</p>
          </div>
          {openAccordions.gallery ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {openAccordions.gallery && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Section Heading">
                <AdminInput value={galleryHeading} onChange={(e) => setGalleryHeading(e.target.value)} />
              </AdminFormGroup>

              <AdminFormGroup label="Section Subtitle">
                <AdminInput value={gallerySubtitle} onChange={(e) => setGallerySubtitle(e.target.value)} />
              </AdminFormGroup>
            </div>

            <div className="flex justify-end pt-2">
              <AdminButton variant="primary" onClick={() => handleSaveSection('gallery')} loading={savingSection === 'gallery'} icon={<Save className="w-4 h-4" />}>
                Save Gallery Headings
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* 6. UPCOMING EVENTS ACCORDION */}
      <AdminCard className="p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => toggleAccordion('events')}
          className="w-full px-6 py-5 bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-between transition-colors border-b border-[#E5E7EB] text-left cursor-pointer"
        >
          <div>
            <h3 className="text-lg font-bold text-[#1F2937]">6. Upcoming Events Section</h3>
            <p className="text-xs text-[#6B7280]">Update section heading and subtitle (uses Manage Events records).</p>
          </div>
          {openAccordions.events ? <ChevronDown className="w-5 h-5 text-[#6B7280]" /> : <ChevronRight className="w-5 h-5 text-[#6B7280]" />}
        </button>

        {openAccordions.events && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminFormGroup label="Section Heading">
                <AdminInput value={eventsHeading} onChange={(e) => setEventsHeading(e.target.value)} />
              </AdminFormGroup>

              <AdminFormGroup label="Section Subtitle">
                <AdminInput value={eventsSubtitle} onChange={(e) => setEventsSubtitle(e.target.value)} />
              </AdminFormGroup>
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

                  <AdminFormGroup label="Thumbnail Image Upload">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-14 bg-[#F3F4F6] border border-[#E5E7EB] rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
                        {item.thumbnailUrl ? (
                          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-[#9CA3AF]">THUMBNAIL</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <label className="px-3 py-1.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md cursor-pointer flex items-center gap-1 shadow-xs">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{item.thumbnailUrl ? 'Replace Thumbnail' : 'Upload Thumbnail'}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (url) => {
                            const updated = [...highlightItems];
                            updated[idx].thumbnailUrl = url;
                            setHighlightItems(updated);
                          })} />
                        </label>

                        {item.thumbnailUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...highlightItems];
                              updated[idx].thumbnailUrl = '';
                              setHighlightItems(updated);
                            }}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#DC2626] text-xs font-semibold rounded-md border border-red-200 cursor-pointer"
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

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        itemTitle={deleteTarget?.title}
      />
    </div>
  );
}
