import { useEffect, useState } from 'react';
import { cmsService } from '../../services/cmsService';
import CmsImage from '../ui/CmsImage';

export default function CampusTour() {
  const [heading, setHeading] = useState('Campus Tour');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const fetchCampusTourData = async () => {
      const data = await cmsService.getSetting<any>('homepage_full_content', null);
      if (data) {
        if (data.campusTourHeading) setHeading(data.campusTourHeading);
        if (data.showCampusTourSection !== undefined) setIsVisible(data.showCampusTourSection);
        if (data.campusTourVideoUrl || data.campusTourVideo || data.campusTourMedia) {
          setVideoUrl(data.campusTourVideoUrl || data.campusTourVideo || data.campusTourMedia);
        }
      }
    };

    fetchCampusTourData();
  }, []);

  if (!isVisible) return null;

  const hasVideo = !!videoUrl && videoUrl.trim().length > 0;

  return (
    <section className="py-[50px] sm:py-[64px] w-full bg-white">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[32px] md:px-[40px]">
        {/* Section Heading */}
        <h2 className="text-[28px] font-bold text-[#0C71C3] text-center mb-[24px] uppercase tracking-tight relative -top-[30px]">
          {heading}
        </h2>

        {/* Large Hero-Sized Video Container (~16:9 Cinematic Aspect Ratio) */}
        <div className="w-full aspect-[16/9] max-h-[640px] rounded-[12px] overflow-hidden shadow-lg border border-[#E2E8F0] bg-white relative flex items-center justify-center">
          {hasVideo ? (
            <video
              src={videoUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-cover block"
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
