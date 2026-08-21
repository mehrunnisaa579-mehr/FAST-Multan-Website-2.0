import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { csResearchAreas, csResearchTeam } from '../../data/departments';
import { cmsService } from '../../services/cmsService';
import CmsImage from '../../components/ui/CmsImage';
import '../../styles/department-pages.css';

export default function CSResearchGroupsPage() {
  const [cmsContent, setCmsContent] = useState<any>(null);

  useEffect(() => {
    const fetchCmsData = async () => {
      const data = await cmsService.getSetting<any>('department_cs_content', null);
      if (data) {
        setCmsContent(data);
      }
    };
    fetchCmsData();
  }, []);

  const heroTitle = cmsContent?.heroTitle ? `${cmsContent.heroTitle} - Research` : 'Research Groups';
  const heroImage = cmsContent?.heroImageUrl || '';
  const researchHeading = cmsContent?.researchHeading || 'Research Areas';
  const researchList =
    cmsContent?.researchList && Array.isArray(cmsContent.researchList) && cmsContent.researchList.length > 0
      ? cmsContent.researchList.filter((r: any) => r.is_visible !== false)
      : csResearchAreas;

  return (
    <div className="department-page-bg">
      {/* Shared Hero */}
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      {/* Main Content Area */}
      <div className="department-content-wrapper text-left">
        {/* 1. Goal Section */}
        <div className="mb-[45px]">
          <h2 className="text-[22px] min-[700px]:text-[24px] font-bold text-[#0C71C3] uppercase mb-[16px]">
            Goal
          </h2>

          <div className="flex flex-col md:flex-row gap-[28px] items-center bg-white p-[24px] border border-[#EAEAEA] rounded-[4px] shadow-sm">
            {/* Goal Text */}
            <div className="flex-1 space-y-[12px] text-[15px] leading-[1.75] text-[#444444]">
              <p>
                The primary research goal of the Department of Computer Science at FAST-NUCES Multan Campus is to advance state-of-the-art knowledge and foster innovation in key computing domains.
              </p>
              <p>
                Our research groups focus on solving complex real-world problems through interdisciplinary collaboration, industry partnerships, and high-impact scholarly publications.
              </p>
            </div>

            {/* Research Graphic Placeholder */}
            <div className="w-full md:w-[300px] h-[200px] bg-white border border-[#CCCCCC] rounded-[4px] flex items-center justify-center p-[16px] flex-shrink-0">
              <span className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase text-center">
                RESEARCH GRAPHIC
              </span>
            </div>
          </div>
        </div>

        {/* 2. Research Areas Section */}
        <div className="mb-[50px]">
          <h2 className="text-[20px] min-[700px]:text-[22px] font-bold text-[#0C71C3] uppercase mb-[20px]">
            {researchHeading}
          </h2>

          <div className="dept-card-row flex flex-wrap justify-center gap-[20px]">
            {researchList.map((area: any, idx: number) => (
              <div key={area.id || idx} className="w-full max-w-[340px] bg-white p-[20px] border border-[#EAEAEA] rounded-[4px] shadow-sm card-hover-lift">
                <h3 className="text-[16px] font-bold text-[#333333] mb-[8px]">
                  {area.title}
                </h3>
                <p className="text-[14px] leading-[1.6] text-[#555555]">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Our Team Section */}
        <div>
          <h2 className="text-[22px] min-[700px]:text-[24px] font-bold text-[#0C71C3] uppercase mb-[24px]">
            Our Team
          </h2>

          <div className="space-y-[20px]">
            {csResearchTeam.map((member) => (
              <div
                key={member.id}
                className="flex flex-col sm:flex-row gap-[20px] items-start p-[20px] bg-white border border-[#EAEAEA] rounded-[4px] shadow-sm card-hover-lift"
              >
                {/* Researcher Portrait */}
                <div className="w-full sm:w-[140px] h-[175px] bg-white border border-[#E5E7EB] rounded-[4px] overflow-hidden flex items-center justify-center flex-shrink-0">
                  <CmsImage
                    src={(member as any).photoUrl}
                    alt={member.name}
                    fallbackLabel={member.photoPlaceholder || 'RESEARCHER PHOTO'}
                    fit="cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-left">
                  <h3 className="text-[18px] font-bold text-[#333333]">
                    {member.name}
                  </h3>
                  <p className="text-[14px] font-semibold text-[#0093DD] mt-[2px]">
                    {member.designation}
                  </p>
                  <p className="text-[13px] font-medium text-[#666666] mt-[1px]">
                    {member.qualification}
                  </p>
                  <p className="text-[14px] leading-[1.7] text-[#444444] mt-[10px]">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
