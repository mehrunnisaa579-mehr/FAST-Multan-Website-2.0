import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import '../../styles/about-pages.css';

export default function UniversityCharterPage() {
  const [title, setTitle] = useState('University Charter');
  const [charterText, setCharterText] = useState('');

  useEffect(() => {
    const fetchCharterData = async () => {
      const data = await cmsService.getSetting<any>('about_pages_content', null);
      if (data) {
        if (data.charterTitle) setTitle(data.charterTitle);
        if (data.charterText) setCharterText(data.charterText);
      }
    };
    fetchCharterData();
  }, []);

  return (
    <div className="w-full bg-white select-none">
      <AboutPageHero title={title} />

      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[65px] min-[1100px]:pb-[85px] text-[#444444] text-[16px] leading-[1.75] font-normal text-left space-y-[18px]">
        {charterText ? (
          charterText.split('\n\n').map((para, idx) => <p key={idx}>{para}</p>)
        ) : (
          <>
            <p>
              The National University of Computer and Emerging Sciences (FAST-NUCES) was established under Federal Legislation as a premier degree-awarding university in Pakistan.
            </p>
            <p>
              With multiple campuses across the country, FAST-NUCES is chartered to grant degrees in undergraduate, graduate, and doctoral disciplines in computer science, engineering, and management.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
