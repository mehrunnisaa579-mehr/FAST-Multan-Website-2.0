import { useEffect, useState } from 'react';
import { homepageContent } from '../../data/homepage';
import { cmsService } from '../../services/cmsService';

export default function WhyChooseUs() {
  const [heading, setHeading] = useState('Why Choose Us');
  const [subtitle, setSubtitle] = useState('Discover the FAST-NUCES Multan advantage');
  const [items, setItems] = useState<any[]>(homepageContent.whyChooseUs);

  useEffect(() => {
    const fetchWhyUsData = async () => {
      const data = await cmsService.getSetting<any>('homepage_full_content', null);
      if (data) {
        if (data.whyUsHeading) setHeading(data.whyUsHeading);
        if (data.whyUsSubtitle) setSubtitle(data.whyUsSubtitle);
        if (data.whyUsItems && data.whyUsItems.length > 0) {
          const visibleItems = data.whyUsItems.filter((i: any) => i.visible !== false);
          if (visibleItems.length > 0) {
            setItems(visibleItems);
          }
        }
      }
    };
    fetchWhyUsData();
  }, []);

  return (
    <section className="py-[60px] w-full bg-white">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        {/* Section Heading & Subheading */}
        <h2 className="text-[28px] font-bold text-[#0C71C3] text-center mb-2">
          {heading}
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[40px] font-medium">
          {subtitle}
        </p>

        {/* 4 columns in 1 horizontal row on desktop (lg:grid-cols-4), 2x2 tablet (sm:grid-cols-2), 1 col mobile */}
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[32px] justify-items-center">
          {items.map((item, index) => {
            const hasIcon = !!(item.icon || item.iconUrl);
            const iconSrc = item.iconUrl || item.icon;

            return (
              <div key={index} className="flex flex-col items-center text-center w-full max-w-[270px] card-hover-lift rounded-[8px] p-[16px]">
                {/* Responsive Dynamic Icon Wrapper (72px to 100px) */}
                <div className="w-[85px] sm:w-[95px] lg:w-[100px] h-[85px] sm:h-[95px] lg:h-[100px] flex items-center justify-center p-[8px] flex-shrink-0 mx-auto mb-[18px]">
                  {hasIcon ? (
                    <img
                      src={iconSrc}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-[12px] flex items-center justify-center">
                      <span className="text-[11px] font-bold text-[#888888] tracking-wider select-none">
                        ICON
                      </span>
                    </div>
                  )}
                </div>

                {/* Centered Title */}
                <h3 className="text-[18px] font-bold text-[#333333] mb-[12px] leading-snug">
                  {item.title}
                </h3>

                {/* Centered Readable Description */}
                <p className="text-[14px] text-[#666666] leading-[1.6]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
