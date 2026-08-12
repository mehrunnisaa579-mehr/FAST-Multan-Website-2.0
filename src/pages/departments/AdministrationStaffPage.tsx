import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import StaffAccordion from '../../components/departments/StaffAccordion';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function AdministrationStaffPage() {
  const [heroTitle, setHeroTitle] = useState('Administration Staff');
  const [heroImageUrl, setHeroImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchHeroData = async () => {
      const heroData = await cmsService.getSetting<any>('admin_staff_hero_settings', null);
      if (heroData) {
        if (heroData.heroTitle) setHeroTitle(heroData.heroTitle);
        if (heroData.heroImageUrl || heroData.heroImage) {
          setHeroImageUrl(heroData.heroImageUrl || heroData.heroImage);
        } else {
          setHeroImageUrl(undefined);
        }
      }
    };

    fetchHeroData();
  }, []);

  return (
    <div className="dept-page-container">
      {/* Shared Hero */}
      <AboutPageHero title={heroTitle} backgroundImage={heroImageUrl} />

      {/* Main Content Area */}
      <div className="w-full max-w-[1380px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[45px] min-[1100px]:pb-[75px]">
        <StaffAccordion />
      </div>
    </div>
  );
}
