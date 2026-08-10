import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import '../../styles/about-pages.css';

export default function GatepassApplicationPage() {
  const [title, setTitle] = useState('Gatepass Application Service');
  const [gatepassText, setGatepassText] = useState('');

  useEffect(() => {
    const fetchGatepassData = async () => {
      const data = await cmsService.getSetting<any>('services_content', null);
      if (data) {
        if (data.gatepassTitle) setTitle(data.gatepassTitle);
        if (data.gatepassText) setGatepassText(data.gatepassText);
      }
    };
    fetchGatepassData();
  }, []);

  return (
    <div className="w-full bg-white select-none">
      <AboutPageHero title={title} />

      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[65px] min-[1100px]:pb-[85px] text-[#444444] text-[16px] leading-[1.75] font-normal text-left space-y-[18px]">
        {gatepassText ? (
          gatepassText.split('\n\n').map((para, idx) => <p key={idx}>{para}</p>)
        ) : (
          <>
            <p>
              FAST-NUCES Multan Campus offers an online gatepass registration service for student vehicles and official campus entry cards.
            </p>
            <p>
              Students must submit their vehicle registration details, driving license copy, and student ID to obtain an authorized campus RFID entry sticker.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
