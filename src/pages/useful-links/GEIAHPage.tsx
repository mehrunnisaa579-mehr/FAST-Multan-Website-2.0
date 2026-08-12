import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import '../../styles/about-pages.css';

export default function GEIAHPage() {
  const [title, setTitle] = useState('Gender Equality & Harassment Policy (GEIAH)');
  const [heroImage, setHeroImage] = useState('');
  const [policyText, setPolicyText] = useState('');

  useEffect(() => {
    const fetchPolicyData = async () => {
      const data = await cmsService.getSetting<any>('useful_links_content', null);
      if (data) {
        if (data.geiahTitle) setTitle(data.geiahTitle);
        if (data.geiahHeroImage) setHeroImage(data.geiahHeroImage);
        if (data.geiahText) setPolicyText(data.geiahText);
      }
    };
    fetchPolicyData();
  }, []);

  return (
    <div className="w-full bg-white text-left">
      <AboutPageHero title={title} backgroundImage={heroImage} />

      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[65px] min-[1100px]:pb-[85px] text-[#444444] text-[16px] leading-[1.75] font-normal space-y-[18px]">
        {policyText ? (
          policyText.split('\n\n').map((para, idx) => <p key={idx}>{para}</p>)
        ) : (
          <>
            <p>
              FAST-NUCES Multan Campus upholds a zero-tolerance policy against all forms of harassment, discrimination, or inequality in accordance with HEC and Federal guidelines.
            </p>
            <p>
              The Gender Equality & Harassment Inquiry Committee (GEIAH) ensures fair treatment, equal opportunities, and confidential grievance redressal for all campus members.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
