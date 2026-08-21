import { useState, useEffect } from 'react';
import { cmsService } from '../../services/cmsService';

interface AboutPageHeroProps {
  title: string;
  backgroundImage?: string;
}

export default function AboutPageHero({ title, backgroundImage }: AboutPageHeroProps) {
  const [globalHero, setGlobalHero] = useState<string>('');

  useEffect(() => {
    const fetchGlobalHero = async () => {
      const settings = await cmsService.getSetting<any>('header_footer_content', null);
      if (settings && settings.globalHeroImageUrl) {
        setGlobalHero(settings.globalHeroImageUrl);
      }
    };
    fetchGlobalHero();
  }, []);

  const activeImage = backgroundImage || globalHero;
  const hasImage = !!activeImage;

  return (
    <section 
      className={`relative w-full h-[230px] min-[700px]:h-[290px] min-[1100px]:h-[355px] overflow-hidden flex items-center justify-center ${
        hasImage ? 'bg-cover bg-center bg-no-repeat' : 'bg-white'
      }`}
      style={hasImage ? { backgroundImage: `url(${activeImage})` } : undefined}
    >
      {/* Dark semi-transparent overlay */}
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.48)] z-10" />

      {/* Developer-facing Placeholder Label if no image */}
      {!hasImage && (
        <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
          <span className="text-[11px] font-semibold text-white/80 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-[4px]">
            PLACEHOLDER: MULTAN CAMPUS HERO IMAGE
          </span>
        </div>
      )}

      {/* Page Title Centered */}
      <div className="relative z-20 w-full max-w-[1300px] mx-auto px-[20px] min-[700px]:px-[36px] min-[1100px]:px-[40px] text-center">
        <h1 className="text-[22px] sm:text-[26px] min-[700px]:text-[30px] min-[1100px]:text-[36px] font-bold text-white leading-[1.2] text-center break-words max-w-full">
          {title}
        </h1>
      </div>
    </section>
  );
}
