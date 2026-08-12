import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import '../../styles/about-pages.css';

export default function CareerServicesPage() {
  const [title, setTitle] = useState('Career Services Office (CSO)');
  const [heroImage, setHeroImage] = useState('');
  const [introText, setIntroText] = useState(
    'The Career Services Office (CSO) at FAST-NUCES Multan Campus is dedicated to empowering students with professional development tools, industry networking, and internship placements.'
  );
  const [mainDescription, setMainDescription] = useState(
    'CSO organizes annual Job Fairs, mock interview sessions, resume writing workshops, and corporate recruitment drives with leading tech firms in Pakistan.'
  );
  const [contactInfo, setContactInfo] = useState('');
  const [contentBlocks, setContentBlocks] = useState<any[]>([]);

  useEffect(() => {
    const fetchCareerData = async () => {
      const data = await cmsService.getSetting<any>('career_services_content', null);
      if (data) {
        if (data.heroTitle) setTitle(data.heroTitle);
        const img = data.heroImageUrl || data.hero_image_url || '';
        if (img) setHeroImage(img);
        if (data.introText) setIntroText(data.introText);
        if (data.mainDescription) setMainDescription(data.mainDescription);
        if (data.contactInfo) setContactInfo(data.contactInfo);
        if (Array.isArray(data.contentBlocks) && data.contentBlocks.length > 0) {
          const visible = data.contentBlocks.filter((b: any) => b.visible !== false);
          if (visible.length > 0) setContentBlocks(visible);
        }
      }
    };
    fetchCareerData();
  }, []);

  return (
    <div className="w-full bg-white text-left">
      <AboutPageHero title={title} backgroundImage={heroImage} />

      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[65px] min-[1100px]:pb-[85px] text-[#444444] text-[16px] leading-[1.75] font-normal space-y-[24px]">
        {/* Intro & Main Description */}
        <p className="text-[17px] font-medium text-[#333333] leading-[1.8]">{introText}</p>
        <p className="text-[#555555]">{mainDescription}</p>

        {/* Additional Content Blocks */}
        {contentBlocks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] pt-[20px]">
            {contentBlocks.map((block, idx) => (
              <div key={idx} className="p-[24px] bg-[#F9FAFB] border border-[#EAEAEA] rounded-[8px] space-y-[10px] card-hover-lift">
                {block.imageUrl && (
                  <div className="w-[60px] h-[60px] rounded-md overflow-hidden bg-white border border-[#E5E7EB] p-2 mb-2">
                    <img src={block.imageUrl} alt={block.heading} className="w-full h-full object-contain" />
                  </div>
                )}
                <h3 className="text-[18px] font-bold text-[#0C71C3]">{block.heading}</h3>
                <p className="text-[14px] text-[#666666] leading-[1.6]">{block.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Contact Info Footer */}
        {contactInfo && (
          <div className="mt-[32px] p-[16px] bg-[#F0F9FF] border border-[#BAE6FD] rounded-[6px] text-[14px] text-[#0369A1] font-medium">
            {contactInfo}
          </div>
        )}
      </div>
    </div>
  );
}
