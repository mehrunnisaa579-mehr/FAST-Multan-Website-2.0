import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import SocietyLeadership from '../../components/societies/SocietyLeadership';
import SocietyInstagramCTA from '../../components/societies/SocietyInstagramCTA';
import { societiesData } from '../../data/societies';
import { cmsService } from '../../services/cmsService';
import '../../styles/society-pages.css';

export default function SocietyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const currentSlug = (slug || '').toLowerCase();

  // Lookup default item for THIS specific slug
  const defaultItem = societiesData[currentSlug];

  const [societyName, setSocietyName] = useState(defaultItem?.name || currentSlug.toUpperCase());
  const [heroTitle, setHeroTitle] = useState(defaultItem?.heroTitle || currentSlug.toUpperCase());
  const [headingTitle, setHeadingTitle] = useState(defaultItem?.headingTitle || `${currentSlug.toUpperCase()} — Campus Student Society`);
  const [intro, setIntro] = useState(defaultItem?.intro || 'The official introduction, purpose, activities, and achievements of this society will be displayed here.');
  const [heroImage, setHeroImage] = useState('');
  const [instagramUrl, setInstagramUrl] = useState(defaultItem?.instagramUrl || 'https://www.instagram.com');
  const [leadership, setLeadership] = useState(defaultItem?.leadership || [
    { role: 'Mentor', name: 'Faculty Mentor', photoPlaceholder: 'MENTOR PHOTO' },
    { role: 'President', name: 'Society President', photoPlaceholder: 'PRESIDENT PHOTO' },
    { role: 'Vice President', name: 'Vice President 1', photoPlaceholder: 'VICE PRESIDENT PHOTO 1' },
    { role: 'Vice President', name: 'Vice President 2', photoPlaceholder: 'VICE PRESIDENT PHOTO 2' },
  ]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!currentSlug) {
      setNotFound(true);
      return;
    }

    const fetchCmsData = async () => {
      setNotFound(false);

      // 1. Try fetching full CMS setting list first
      const fullList = await cmsService.getSetting<any[]>('student_societies_full_list', []);
      let currentCms = Array.isArray(fullList) ? fullList.find((s: any) => (s.slug || '').toLowerCase() === currentSlug) : null;

      // 2. Fallback to Supabase societies table if not found in setting
      if (!currentCms) {
        const dbSocieties = await cmsService.getSocieties();
        if (Array.isArray(dbSocieties)) {
          currentCms = dbSocieties.find((s: any) => (s.slug || '').toLowerCase() === currentSlug);
        }
      }

      const specificDefault = societiesData[currentSlug];

      if (currentCms) {
        // Render CMS Data for THIS society
        const nameStr = currentCms.name || specificDefault?.name || currentSlug.toUpperCase();
        setSocietyName(nameStr);
        setHeroTitle(currentCms.name || specificDefault?.heroTitle || currentSlug.toUpperCase());
        setHeadingTitle(
          currentCms.short_name
            ? `${nameStr} — ${currentCms.short_name}`
            : specificDefault?.headingTitle || `${nameStr} — Campus Student Society`
        );

        setIntro(currentCms.description || specificDefault?.intro || 'Society overview and details will be updated here.');
        setHeroImage(currentCms.hero_image_url || currentCms.hero_image || '');
        setInstagramUrl(currentCms.instagram_url || specificDefault?.instagramUrl || 'https://www.instagram.com');

        setLeadership([
          {
            role: 'Mentor',
            name: currentCms.mentor_name || 'Faculty Mentor',
            photoPlaceholder: 'MENTOR PHOTO',
            photoUrl: currentCms.mentor_photo_url || currentCms.mentor_photo || '',
          },
          {
            role: 'President',
            name: currentCms.president_name || 'Society President',
            photoPlaceholder: 'PRESIDENT PHOTO',
            photoUrl: currentCms.president_photo_url || currentCms.president_photo || '',
          },
          {
            role: 'Vice President',
            name: currentCms.vp1_name || 'Vice President',
            photoPlaceholder: 'VICE PRESIDENT PHOTO 1',
            photoUrl: currentCms.vice_president_1_photo_url || currentCms.vp1_photo_url || currentCms.vp1_photo || '',
          },
          {
            role: 'Vice President',
            name: currentCms.vp2_name || 'Vice President',
            photoPlaceholder: 'VICE PRESIDENT PHOTO 2',
            photoUrl: currentCms.vice_president_2_photo_url || currentCms.vp2_photo_url || currentCms.vp2_photo || '',
          },
        ]);
      } else if (specificDefault) {
        // Render Default Data for THIS specific society (e.g. fmm, figs, dhanak, bayaan)
        setSocietyName(specificDefault.name);
        setHeroTitle(specificDefault.heroTitle);
        setHeadingTitle(specificDefault.headingTitle);
        setIntro(specificDefault.intro);
        setHeroImage('');
        setInstagramUrl(specificDefault.instagramUrl);
        setLeadership(specificDefault.leadership);
      } else {
        // Unknown society slug
        setNotFound(true);
      }
    };

    fetchCmsData();
  }, [currentSlug]);

  if (notFound) {
    return (
      <div className="society-page-bg min-h-[60vh] flex items-center justify-center py-20 text-center">
        <div className="max-w-md mx-auto p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Society Not Found</h2>
          <p className="text-sm text-gray-600 mb-6">
            The society "<span className="font-semibold text-[#0093DD]">{currentSlug}</span>" could not be found or is not currently active.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#0093DD] hover:bg-[#0C71C3] text-white text-sm font-semibold py-2.5 px-5 rounded transition-colors no-underline"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="society-page-bg">
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />
      <div className="society-content-wrapper text-center flex flex-col items-center">
        <h1 className="text-[26px] sm:text-[32px] font-bold text-[#0C71C3] mb-[24px] text-center max-w-[850px] mx-auto leading-tight">
          {headingTitle}
        </h1>
        <p className="text-[16px] leading-[1.8] text-[#444444] max-w-[850px] w-full mx-auto mb-[56px] text-center whitespace-pre-line">
          {intro}
        </p>
        <SocietyLeadership leadership={leadership} />
        <SocietyInstagramCTA instagramUrl={instagramUrl} />
      </div>
    </div>
  );
}
