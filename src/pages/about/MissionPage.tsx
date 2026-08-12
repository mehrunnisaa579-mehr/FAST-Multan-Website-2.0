import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import '../../styles/about-pages.css';

export default function MissionPage() {
  const [title, setTitle] = useState('Our Mission');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [missionText, setMissionText] = useState('');

  useEffect(() => {
    const fetchMissionData = async () => {
      const data = await cmsService.getSetting<any>('about_mission_content', null);
      const legacyData = await cmsService.getSetting<any>('about_pages_content', null);

      if (data) {
        if (data.heroTitle) setTitle(data.heroTitle);
        if (data.heroImageUrl) setHeroImageUrl(data.heroImageUrl);
        if (data.missionText) setMissionText(data.missionText);
      } else if (legacyData) {
        if (legacyData.missionTitle) setTitle(legacyData.missionTitle);
        if (legacyData.missionText) setMissionText(legacyData.missionText);
      }
    };

    fetchMissionData();
  }, []);

  return (
    <div className="w-full bg-white">
      <AboutPageHero title={title} backgroundImage={heroImageUrl} />

      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[65px] min-[1100px]:pb-[85px] text-[#444444] text-[16px] leading-[1.75] font-normal text-left space-y-[18px]">
        {missionText ? (
          missionText.split(/\n\n|\n/).map((para, idx) => (para.trim() ? <p key={idx}>{para}</p> : null))
        ) : (
          <>
            <p>
              The official FAST-NUCES mission statement and institutional objectives are dedicated to excellence in computing and emerging sciences education.
            </p>
            <p>
              Our mission is to offer world-class education in computing and emerging sciences, foster cutting-edge research, and instill ethical leadership principles in our graduates.
            </p>
            <p>
              We strive to cultivate an inspiring learning environment that encourages critical thinking, technological innovation, and meaningful societal contribution across local and global communities.
            </p>
            <p>
              Through continuous curriculum development, industry collaboration, and rigorous academic standards, we prepare students to excel in rapidly evolving professional sectors.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
