import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import SocietyLeadership from '../../components/societies/SocietyLeadership';
import SocietyInstagramCTA from '../../components/societies/SocietyInstagramCTA';
import { societiesData } from '../../data/societies';
import { cmsService } from '../../services/cmsService';
import '../../styles/society-pages.css';

export default function DhanakPage() {
  const defaultData = societiesData.dhanak;
  const [intro, setIntro] = useState(defaultData.intro);
  const [instagramUrl, setInstagramUrl] = useState(defaultData.instagramUrl);
  const [leadership, setLeadership] = useState(defaultData.leadership);

  useEffect(() => {
    const fetchCmsData = async () => {
      const societies = await cmsService.getSocieties();
      const current = societies.find((s) => s.slug === 'dhanak');
      if (current) {
        if (current.description) setIntro(current.description);
        if (current.instagram_url) setInstagramUrl(current.instagram_url);

        setLeadership([
          {
            role: 'Mentor',
            name: current.mentor_name || defaultData.leadership[0].name,
            photoPlaceholder: 'PLACEHOLDER: MENTOR PHOTO',
            photoUrl: current.mentor_photo_url || '',
          },
          {
            role: 'President',
            name: current.president_name || defaultData.leadership[1].name,
            photoPlaceholder: 'PLACEHOLDER: PRESIDENT PHOTO',
            photoUrl: current.president_photo_url || '',
          },
          {
            role: 'Vice President',
            name: current.vp1_name || defaultData.leadership[2].name,
            photoPlaceholder: 'PLACEHOLDER: VICE PRESIDENT PHOTO 1',
            photoUrl: current.vice_president_1_photo_url || current.vp1_photo_url || '',
          },
          {
            role: 'Vice President',
            name: current.vp2_name || defaultData.leadership[3].name,
            photoPlaceholder: 'PLACEHOLDER: VICE PRESIDENT PHOTO 2',
            photoUrl: current.vice_president_2_photo_url || current.vp2_photo_url || '',
          },
        ]);
      }
    };
    fetchCmsData();
  }, []);

  return (
    <div className="society-page-bg">
      <AboutPageHero title={defaultData.heroTitle} />
      <div className="society-content-wrapper text-center flex flex-col items-center">
        <h1 className="text-[26px] sm:text-[32px] font-bold text-[#0C71C3] mb-[24px] text-center max-w-[850px] mx-auto leading-tight">
          {defaultData.headingTitle}
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
