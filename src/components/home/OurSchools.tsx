import { useEffect, useState, useRef } from 'react';
import { homepageContent } from '../../data/homepage';
import { Monitor, Briefcase, BookOpen, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { useVisibilityObserver } from '../ui/ViewportObserver';

// Exact official FAST-NUCES nu.edu.pk program URLs
const OFFICIAL_PROGRAM_MAPPINGS: Record<string, string> = {
  'bs business analytics': 'https://nu.edu.pk/Program/BS(BA)',
  'bs artificial intelligence': 'https://nu.edu.pk/Program/BS(AI)',
  'bs computer science': 'https://nu.edu.pk/Program/BS(CS)',
  'bs software engineering': 'https://nu.edu.pk/Program/BS(SE)',
};

interface OurSchoolsProps {
  data?: any;
}

export default function OurSchools({ data }: OurSchoolsProps) {
  const [heading, setHeading] = useState('Programs We Offer');
  const [subtitle, setSubtitle] = useState('Explore the program that matches your interests');
  const [schools, setSchools] = useState<any[]>(homepageContent.ourSchools);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { ref, isVisible } = useVisibilityObserver('100px');

  useEffect(() => {
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
  }, [data]);

  // Merge CMS schools data with fallback defaults to ensure all 4 programs are present
  const displaySchools = [...schools];
  const defaultPrograms = homepageContent.ourSchools;

  defaultPrograms.forEach((defProg) => {
    const exists = displaySchools.some((s) => {
      const sName = (s.name || '').toLowerCase();
      const dName = defProg.name.toLowerCase();
      return sName.includes(dName) || dName.includes(sName);
    });

    if (!exists) {
      displaySchools.push(defProg);
    }
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 330; // Exactly 310px card width + 20px gap
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      if (direction === 'right') {
        // Forward loop: when reaching the end, loop back to start (0)
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      } else {
        // Backward manual step: when at or near start, wrap to end
        if (scrollLeft <= 10) {
          scrollRef.current.scrollTo({ left: scrollWidth - clientWidth, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    timerRef.current = setInterval(() => {
      scroll('right');
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if (!isVisible) {
      stopAutoSlide();
      return;
    }
    startAutoSlide();
    return () => {
      stopAutoSlide();
    };
  }, [displaySchools.length, isVisible]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    scroll(direction);
    startAutoSlide(); // Reset 5s timer on manual click
  };

  const getProgramTargetUrl = (school: any): string => {
    const nameLower = (school.name || '').toLowerCase().trim();
    const hrefLower = (school.href || school.destinationUrl || '').toLowerCase().trim();

    if (
      nameLower.includes('business analytics') ||
      nameLower.includes('bs(ba)') ||
      hrefLower.includes('bs(ba)')
    ) {
      return 'https://nu.edu.pk/Program/BS(BA)';
    }

    if (
      nameLower.includes('artificial intelligence') ||
      nameLower.includes('bs(ai)') ||
      nameLower.includes('ai & data') ||
      hrefLower.includes('bs(ai)')
    ) {
      return 'https://nu.edu.pk/Program/BS(AI)';
    }

    if (
      nameLower.includes('software engineering') ||
      nameLower.includes('bs(se)') ||
      hrefLower.includes('bs(se)')
    ) {
      return 'https://nu.edu.pk/Program/BS(SE)';
    }

    if (
      nameLower.includes('computer science') ||
      nameLower.includes('computing') ||
      nameLower.includes('bs(cs)') ||
      hrefLower.includes('bs(cs)')
    ) {
      return 'https://nu.edu.pk/Program/BS(CS)';
    }

    if (OFFICIAL_PROGRAM_MAPPINGS[nameLower]) {
      return OFFICIAL_PROGRAM_MAPPINGS[nameLower];
    }

    const recordUrl = school.destinationUrl || school.href;
    if (recordUrl && (recordUrl.startsWith('http://') || recordUrl.startsWith('https://'))) {
      return recordUrl;
    }

    return 'https://nu.edu.pk/Program/BS(CS)';
  };

  const handleCardClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.assign(url);
  };

  return (
    <section ref={ref} className="py-[60px] w-full bg-[#F7F9FC]">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        <h2 className="text-[32px] sm:text-[38px] md:text-[40px] lg:text-[46px] leading-[1.1] font-bold text-[#0C71C3] uppercase tracking-tight md:tracking-[-1px] text-center mb-2">
          {heading}
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[40px] font-medium">
          {subtitle}
        </p>

        {/* Centered Carousel Viewport Wrapper — Exactly 3 Full Cards (970px = 3*310px + 2*20px) */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[970px] overflow-hidden relative">
            <div
              ref={scrollRef}
              className="flex gap-[20px] overflow-x-auto scroll-smooth no-scrollbar w-full py-4 flex-nowrap justify-start"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollSnapType: 'x mandatory',
              }}
            >
              {displaySchools.map((school, index) => {
                const nameLower = (school.name || '').toLowerCase();
                const mediaUrl = school.iconUrl || school.icon;
                let IconComponent = HelpCircle;

                if (nameLower.includes('computing') || nameLower.includes('computer science')) {
                  IconComponent = Monitor;
                } else if (nameLower.includes('management') || nameLower.includes('business')) {
                  IconComponent = Briefcase;
                } else if (school.isPlaceholder) {
                  IconComponent = HelpCircle;
                } else {
                  IconComponent = BookOpen;
                }

                const targetUrl = getProgramTargetUrl(school);

                // Card Layout (310px width fits exactly 3 full cards in 970px viewport)
                const cardClassName = `group w-[310px] h-[160px] flex-shrink-0 bg-white border border-[#E5E7EB] rounded-[8px] overflow-hidden shadow-xs card-hover-lift flex items-center justify-center relative cursor-pointer ${mediaUrl ? 'p-0' : 'p-6'}`;

                if (school.isPlaceholder) {
                  return (
                    <div
                      key={index}
                      className={`${cardClassName} select-none`}
                      style={{
                        scrollSnapAlign: 'start',
                      }}
                    >
                      <div className="flex flex-col items-center justify-center text-center w-full h-full pointer-events-none">
                        <div className="mb-3 text-[#9CA3AF]">
                          <IconComponent className="w-[36px] h-[36px]" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-[14px] font-bold text-[#9CA3AF] uppercase tracking-wider leading-snug w-full">
                          {school.name}
                        </h3>
                      </div>
                    </div>
                  );
                }

                const cardContent = mediaUrl ? (
                  <div className="w-full h-full relative pointer-events-none">
                    <img
                      src={mediaUrl}
                      alt={school.name}
                      className="w-full h-full object-cover object-center block animate-fade-in pointer-events-none"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center w-full h-full pointer-events-none">
                    <div className="mb-3 text-[#0C71C3] group-hover:scale-[1.08] transition-transform duration-300 pointer-events-none">
                      <IconComponent className="w-[40px] h-[40px]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[14px] font-bold text-[#0C71C3] uppercase tracking-wider leading-snug w-full pointer-events-none">
                      {school.name}
                    </h3>
                  </div>
                );

                return (
                  <a
                    key={index}
                    href={targetUrl}
                    onClick={(e) => handleCardClick(e, targetUrl)}
                    className={`${cardClassName} no-underline select-none`}
                    style={{
                      scrollSnapAlign: 'start',
                    }}
                  >
                    {cardContent}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Carousel controls — Previous & Next Buttons */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handleManualScroll('left')}
            className="carousel-arrow-btn w-10 h-10 rounded-full border flex items-center justify-center text-white shadow-xs hover:shadow-md cursor-pointer"
            aria-label="Previous Program"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => handleManualScroll('right')}
            className="carousel-arrow-btn w-10 h-10 rounded-full border flex items-center justify-center text-white shadow-xs hover:shadow-md cursor-pointer"
            aria-label="Next Program"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}
