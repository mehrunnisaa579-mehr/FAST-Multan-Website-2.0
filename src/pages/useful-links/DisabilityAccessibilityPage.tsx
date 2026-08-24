import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import '../../styles/about-pages.css';

export default function DisabilityAccessibilityPage() {
  const [title, setTitle] = useState('Disability & Accessibility Policy');
  const [heroImage, setHeroImage] = useState('');
  const [policyText, setPolicyText] = useState('');

  useEffect(() => {
    const fetchPolicyData = async () => {
      const data = await cmsService.getSetting<any>('useful_links_content', null);
      if (data) {
        if (data.disabilityTitle) setTitle(data.disabilityTitle);
        if (data.disabilityHeroImage) setHeroImage(data.disabilityHeroImage);
        if (data.disabilityText) setPolicyText(data.disabilityText);
      }
    };
    fetchPolicyData();
  }, []);

  return (
    <div className="w-full bg-white text-left">
      <AboutPageHero title={title} backgroundImage={heroImage} />

      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[65px] min-[1100px]:pb-[85px] text-[#444444] text-[16px] leading-[1.75] font-normal space-y-[18px]">
        {policyText ? (
          policyText.split('\n\n').map((para, idx) => <p key={idx}>{para}</p>)
        ) : (
          <>
            <p>
              FAST-NUCES Multan Campus is dedicated to ensuring an inclusive, accessible, and supportive environment for students, faculty, and visitors with disabilities.
            </p>
            <p>
              Our campus infrastructure includes wheelchair ramps, dedicated elevator access, accessible seating in lecture halls, and specialized assistive resources in laboratories.
            </p>
            <p>
              Students requiring specialized academic accommodations or assistive exam support are encouraged to contact the Campus Student Affairs Office.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
