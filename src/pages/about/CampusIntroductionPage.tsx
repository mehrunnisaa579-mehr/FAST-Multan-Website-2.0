import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import AboutGallerySlider from '../../components/about/AboutGallerySlider';
import { cmsService } from '../../services/cmsService';
import '../../styles/about-pages.css';

export default function CampusIntroductionPage() {
  const [title, setTitle] = useState('Campus Introduction');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [introText, setIntroText] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const fetchIntroData = async () => {
      const data = await cmsService.getSetting<any>('about_campus_intro_content', null);
      const legacyData = await cmsService.getSetting<any>('about_pages_content', null);

      if (data) {
        if (data.heroTitle) setTitle(data.heroTitle);
        if (data.heroImageUrl) setHeroImageUrl(data.heroImageUrl);
        if (data.introText) setIntroText(data.introText);
        if (data.introPhotoUrl) setPhotoUrl(data.introPhotoUrl);
      } else if (legacyData) {
        if (legacyData.introTitle) setTitle(legacyData.introTitle);
        if (legacyData.introText) setIntroText(legacyData.introText);
        if (legacyData.introPhotoUrl) setPhotoUrl(legacyData.introPhotoUrl);
      }
    };

    fetchIntroData();
  }, []);

  return (
    <div className="w-full bg-white">
      <AboutPageHero title={title} backgroundImage={heroImageUrl} />

      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[65px] min-[1100px]:pb-[70px] text-[#444444] text-[16px] leading-[1.75] font-normal text-left space-y-[18px]">
        {photoUrl && (
          <div className="w-full max-h-[420px] rounded-lg overflow-hidden mb-6 bg-[#F3F4F6] border border-[#E5E7EB]">
            <img src={photoUrl} alt={title} className="w-full h-full object-cover" />
          </div>
        )}

        {introText ? (
          introText.split(/\n\n|\n/).map((para, idx) => (para.trim() ? <p key={idx}>{para}</p> : null))
        ) : (
          <>
            <p>
              FAST-NUCES Multan Campus is a leading institution of higher learning in South Punjab, delivering high quality academic programs in Computer Science, Software Engineering, AI & Data Science, and Management Sciences.
            </p>
            <p>
              Equipped with modern computing laboratories, digital library resources, spacious auditoriums, and active student societies, the campus provides a vibrant learning ecosystem for holistic student development.
            </p>
          </>
        )}
      </div>

      <AboutGallerySlider />
    </div>
  );
}
