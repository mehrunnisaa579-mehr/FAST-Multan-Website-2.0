import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { homepageContent } from '../../data/homepage';
import { cmsService } from '../../services/cmsService';

export default function OurSchools() {
  const [heading, setHeading] = useState('Our Schools');
  const [subtitle, setSubtitle] = useState('Explore the program that matches your interests');
  const [schools, setSchools] = useState<any[]>(homepageContent.ourSchools);

  useEffect(() => {
    const fetchSchoolsData = async () => {
      const data = await cmsService.getSetting<any>('homepage_full_content', null);
      if (data) {
        if (data.schoolsHeading) setHeading(data.schoolsHeading);
        if (data.schoolsSubtitle) setSubtitle(data.schoolsSubtitle);
        if (data.schoolCards && data.schoolCards.length > 0) {
          const visibleCards = data.schoolCards.filter((s: any) => s.visible !== false);
          if (visibleCards.length > 0) {
            setSchools(visibleCards);
          }
        }
      }
    };
    fetchSchoolsData();
  }, []);

  return (
    <section className="py-[60px] w-full bg-[#F7F9FC]">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        {/* Section Heading & Subheading */}
        <h2 className="text-[28px] font-bold text-[#0C71C3] text-center mb-2">
          {heading}
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[40px] font-medium">
          {subtitle}
        </p>

        {/* 2 Centered School Cards */}
        <div className="flex flex-wrap gap-[32px] justify-center items-center max-w-[960px] mx-auto w-full">
          {schools.map((school, index) => {
            const hasIcon = !!(school.icon || school.iconUrl);
            const iconSrc = school.iconUrl || school.icon;

            return (
              <Link
                key={index}
                to={school.href || '/departments'}
                className="group w-full sm:w-[calc(50%-16px)] max-w-[440px] aspect-[16/9] bg-white border border-[#EAEAEA] rounded-[8px] overflow-hidden shadow-xs card-hover-lift flex items-center justify-center relative no-underline cursor-pointer p-3 sm:p-4"
              >
                {hasIcon ? (
                  <img
                    src={iconSrc}
                    alt={school.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0C71C3] to-[#004B87] p-6 flex flex-col items-center justify-center text-center rounded-[6px]">
                    <h3 className="text-[20px] font-bold text-white uppercase tracking-wide">
                      {school.name}
                    </h3>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
