import { useEffect, useState } from 'react';
import { homepageContent } from '../../data/homepage';

interface CampusHighlightsProps {
  data?: any;
}

export default function CampusHighlights({ data }: CampusHighlightsProps) {
  const [heading, setHeading] = useState('Campus Highlights');
  const [subtitle, setSubtitle] = useState('A glimpse into life at FAST-NUCES Multan Campus');
  const [highlights, setHighlights] = useState<any[]>(homepageContent.campusHighlights);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [isVideoFile, setIsVideoFile] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      if (data.highlightsHeading) setHeading(data.highlightsHeading);
      if (data.highlightsSubtitle) setSubtitle(data.highlightsSubtitle);
      if (data.showHighlightsSection !== undefined) setIsVisible(data.showHighlightsSection);
      if (Array.isArray(data.highlightItems) && data.highlightItems.length > 0) {
        const visibleItems = data.highlightItems.filter((i: any) => i.visible !== false);
        if (visibleItems.length > 0) {
          setHighlights(visibleItems);
        }
      }
    }
  }, [data]);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  };

  if (!isVisible) return null;

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

        {/* 2 cards side by side */}
        <div className="flex flex-col md:flex-row gap-[24px] justify-center items-center max-w-[1000px] mx-auto w-full">
          {highlights.map((item, index) => {
            const targetUrl = item.videoUrl || item.youtubeUrl || '';
            const isUpload = item.videoType === 'upload' || (targetUrl.endsWith('.mp4') || targetUrl.endsWith('.webm'));
            const thumbSrc = item.thumbnailUrl || item.thumbnail;

            return (
              <div 
                key={index}
                onClick={() => {
                  if (targetUrl) {
                    setIsVideoFile(isUpload);
                    setActiveVideoUrl(isUpload ? targetUrl : getEmbedUrl(targetUrl));
                  }
                }}
                className={`flex-1 w-full aspect-[16/9] rounded-[8px] overflow-hidden relative cursor-pointer select-none group shadow-sm card-hover-lift${!thumbSrc && !targetUrl ? ' bg-white' : ''}`}
              >
                {/* Video / Thumbnail preview */}
                {thumbSrc ? (
                  <img src={thumbSrc} alt={item.title} className="w-full h-full object-cover" />
                ) : isUpload && targetUrl ? (
                  <video
                    src={targetUrl}
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                ) : targetUrl ? (
                  (() => {
                    const ytMatch = targetUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&#]+)/);
                    return ytMatch ? (
                      <img src={`https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white flex items-center justify-center">
                        <span className="text-[14px] font-semibold text-[#888888] tracking-wide">VIDEO</span>
                      </div>
                    );
                  })()
                ) : (
                  <div className="w-full h-full bg-white flex items-center justify-center">
                    <span className="text-[14px] font-semibold text-[#888888] tracking-wide">VIDEO THUMBNAIL</span>
                  </div>
                )}

                {/* Bottom 50% gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent z-10" />

                {/* Centered red circular Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-[60px] h-[60px] rounded-full bg-[#FF0000] flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-lg">
                    <svg className="w-5 h-5 fill-current text-white ml-[4px]" viewBox="0 0 24 24">
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  </div>
                </div>

                {/* Text overlays bottom-left */}
                <div className="absolute bottom-[16px] left-[16px] right-[16px] z-20 text-left">
                  <h3 className="text-[15px] font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-[#E5E5E5] mt-[4px] font-medium leading-none">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal Player (YouTube or Direct Video File) */}
      {activeVideoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setActiveVideoUrl(null)}
        >
          <div className="w-full max-w-[900px] aspect-[16/9] bg-black rounded-lg overflow-hidden relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-3 right-3 z-50 text-white font-bold bg-black/50 hover:bg-black w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
            {isVideoFile ? (
              <video src={activeVideoUrl} controls autoPlay className="w-full h-full object-contain" />
            ) : (
              <iframe
                src={activeVideoUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Campus Highlight Video"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
