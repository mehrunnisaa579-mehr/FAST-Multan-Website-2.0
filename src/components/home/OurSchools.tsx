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
    <section className="py-[60px] w-full bg-[#F7F9FC] select-none">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        {/* Section Heading & Subheading */}
        <h2 className="text-[28px] font-bold text-[#0C71C3] text-center mb-2">
          {heading}
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[40px] font-medium">
          {subtitle}
        </p>

        {/* Compact Centered School Tiles (Horizontally Centered as a Group) */}
        <div className="flex flex-wrap gap-[28px] justify-center items-center max-w-[800px] mx-auto w-full">
          {schools.map((school, index) => {
            const hasIcon = !!(school.icon || school.iconUrl);
            const iconSrc = school.iconUrl || school.icon;

            return (
              <Link
                key={index}
                to={school.href || '/departments'}
                className="w-full max-w-[330px] sm:w-[320px] min-h-[160px] bg-white border border-[#EAEAEA] rounded-[8px] p-[24px] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-center text-center no-underline cursor-pointer block"
              >
                {/* Dynamic Icon / Logo Container (70px-90px height, object-contain) */}
                <div className="h-[80px] w-full max-w-[160px] mb-[14px] flex items-center justify-center flex-shrink-0">
                  {hasIcon ? (
                    <img 
                      src={iconSrc} 
                      alt={school.name} 
                      className="max-w-full max-h-full object-contain transition-transform duration-200 hover:scale-105"
                    />
                  ) : (
                    <div className="w-[75px] h-[75px] bg-[#F3F4F6] border border-[#E5E7EB] rounded-[10px] flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#888888] tracking-wider select-none">
                        SCHOOL ICON
                      </span>
                    </div>
                  )}
                </div>

                {/* Centered School Name */}
                <h3 className="text-[15px] font-bold text-[#333333] uppercase leading-snug text-center tracking-wide">
                  {school.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
