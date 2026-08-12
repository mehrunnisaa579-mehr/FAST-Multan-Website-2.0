import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import '../../styles/about-pages.css';

export default function AboutEDCPage() {
  const [title, setTitle] = useState('Executive Development Center (EDC)');
  const [heroImage, setHeroImage] = useState('');
  const [intro, setIntro] = useState('');
  const [vision, setVision] = useState('');
  const [mission, setMission] = useState('');

  useEffect(() => {
    const fetchEdcData = async () => {
      const data = await cmsService.getSetting<any>('edc_about_content', null) || await cmsService.getSetting<any>('edc_content', null);
      if (data) {
        if (data.aboutTitle || data.title) setTitle(data.aboutTitle || data.title);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.aboutIntro || data.intro) setIntro(data.aboutIntro || data.intro);
        if (data.vision) setVision(data.vision);
        if (data.mission) setMission(data.mission);
      }
    };
    fetchEdcData();
  }, []);

  return (
    <div className="w-full bg-white">
      <AboutPageHero title={title} backgroundImage={heroImage} />

      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[65px] min-[1100px]:pb-[85px] text-[#444444] text-[16px] leading-[1.75] font-normal text-left space-y-[24px]">
        <div>
          <h2 className="text-[22px] font-bold text-[#0C71C3] uppercase mb-2">Overview</h2>
          <p>
            {intro || 'The Executive Development Center (EDC) at FAST-NUCES Multan Campus serves as a dynamic bridge between industry leadership and academic excellence. Through specialized corporate training, leadership seminars, and professional workshops, EDC empowers executives and organizations.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#EAEAEA]">
          <div className="bg-[#F9FAFB] p-6 rounded-lg border border-[#EAEAEA] card-hover-lift">
            <h3 className="text-[18px] font-bold text-[#0C71C3] uppercase mb-2">EDC Vision</h3>
            <p className="text-[15px] leading-relaxed">
              {vision || 'To be the premier corporate training hub in South Punjab, fostering strategic leadership, technological innovation, and organizational transformation.'}
            </p>
          </div>

          <div className="bg-[#F9FAFB] p-6 rounded-lg border border-[#EAEAEA] card-hover-lift">
            <h3 className="text-[18px] font-bold text-[#0C71C3] uppercase mb-2">EDC Mission</h3>
            <p className="text-[15px] leading-relaxed">
              {mission || 'Delivering high-impact executive programs, hands-on technical bootcamps, and industrial conferences that elevate professional competencies.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
