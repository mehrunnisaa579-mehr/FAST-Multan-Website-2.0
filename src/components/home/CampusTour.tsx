import { useEffect, useState } from 'react';
import CmsImage from '../ui/CmsImage';
import { getYouTubeEmbedUrl } from '../../utils/youtube';

interface CampusTourProps {
  data?: any;
}

export default function CampusTour({ data }: CampusTourProps) {
  const [heading, setHeading] = useState('Campus Tour');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    if (data) {
      if (data.campusTourHeading) setHeading(data.campusTourHeading);
      if (data.showCampusTourSection !== undefined) setIsVisible(data.showCampusTourSection);
      if (data.campusTourVideoUrl || data.campusTourVideo || data.campusTourMedia) {
        setVideoUrl(data.campusTourVideoUrl || data.campusTourVideo || data.campusTourMedia);
      }
    }
  }, [data]);

  if (!isVisible) return null;

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <section className="py-[50px] sm:py-[64px] w-full bg-white">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[32px] md:px-[40px]">
        <h2 className="text-[32px] sm:text-[38px] md:text-[40px] lg:text-[46px] leading-[1.1] font-bold text-[#0C71C3] uppercase tracking-tight md:tracking-[-1px] text-center mb-[24px] relative -top-[30px]">
          {heading}
        </h2>

        {/* Large Hero-Sized Video Container (~16:9 Cinematic Aspect Ratio) */}
        <div className="w-full max-w-[1240px] mx-auto aspect-[16/9] max-h-[640px] rounded-[12px] overflow-hidden shadow-lg border border-[#E2E8F0] bg-white relative flex items-center justify-center">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={heading || 'Campus Tour Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0 block"
            />
          ) : (
            <CmsImage
              src={null}
              alt="Campus Tour"
              fallbackLabel="CAMPUS TOUR VIDEO"
              fit="cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
