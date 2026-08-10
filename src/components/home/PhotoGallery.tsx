import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { homepageContent } from '../../data/homepage';
import { cmsService } from '../../services/cmsService';

export default function PhotoGallery() {
  const [heading, setHeading] = useState('Photo Gallery');
  const [subtitle, setSubtitle] = useState('A glimpse into campus life');
  const [images, setImages] = useState<any[]>(homepageContent.galleryImages);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGalleryData = async () => {
      const data = await cmsService.getSetting<any>('homepage_full_content', null);
      if (data) {
        if (data.galleryHeading) setHeading(data.galleryHeading);
        if (data.gallerySubtitle) setSubtitle(data.gallerySubtitle);
      }
      const cmsGallery = await cmsService.getGalleryItems();
      if (cmsGallery && cmsGallery.length > 0) {
        setImages(
          cmsGallery.map((item: any) => ({
            image: item.image_url,
            caption: item.caption || 'Campus Photo',
          }))
        );
      }
    };
    fetchGalleryData();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth > 640 ? 276 : scrollRef.current.clientWidth * 0.7;
      const offset = direction === 'left' ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveImageIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => {
          if (prev === null) return null;
          return (prev - 1 + images.length) % images.length;
        });
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => {
          if (prev === null) return null;
          return (prev + 1) % images.length;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, images.length]);

  const activeImage = activeImageIndex !== null ? images[activeImageIndex] : null;
  const hasLightboxImage = activeImage ? !!(activeImage.image || activeImage.image_url) : false;
  const lightboxSrc = activeImage?.image || activeImage?.image_url || '';

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + images.length) % images.length;
    });
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % images.length;
    });
  };

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

        {/* Gallery Wrapper with Arrows */}
        <div className="relative w-full">
          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            className="flex gap-[16px] overflow-x-auto scroll-smooth no-scrollbar w-full py-2 select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((item, index) => {
              const imgSrc = item.image || item.image_url;
              const hasImage = !!imgSrc;
              return (
                <div 
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className="w-[70vw] sm:w-[260px] h-[180px] rounded-[6px] overflow-hidden flex-shrink-0 shadow-sm relative group bg-[#D9D9D9] transition-transform duration-[250ms] ease-in-out hover:scale-[1.06] cursor-pointer"
                >
                  {hasImage ? (
                    <img 
                      src={imgSrc} 
                      alt={item.caption} 
                      className="w-full h-full object-cover select-none"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#D9D9D9] flex items-center justify-center">
                      <span className="text-[13px] font-semibold text-[#888888] tracking-wide">
                        IMAGE
                      </span>
                    </div>
                  )}
                  {/* Subtle caption overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                    <span className="text-white text-[12px] font-medium block text-left">
                      {item.caption}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-[10px] sm:-left-[20px] top-1/2 -translate-y-1/2 z-30 w-[44px] h-[44px] rounded-full bg-white text-[#333333] shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-[#F5F5F5] flex items-center justify-center transition-colors cursor-pointer outline-none border border-gray-100"
            aria-label="Scroll Gallery Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-[10px] sm:-right-[20px] top-1/2 -translate-y-1/2 z-30 w-[44px] h-[44px] rounded-full bg-white text-[#333333] shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-[#F5F5F5] flex items-center justify-center transition-colors cursor-pointer outline-none border border-gray-100"
            aria-label="Scroll Gallery Right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {activeImageIndex !== null && activeImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000] select-none"
          onClick={() => setActiveImageIndex(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-[40px] right-[40px] text-white hover:text-gray-300 transition-colors cursor-pointer outline-none border-none p-1"
            onClick={() => setActiveImageIndex(null)}
            aria-label="Close Lightbox"
          >
            <X className="w-[28px] h-[28px]" />
          </button>

          {/* Left Navigation Arrow */}
          <button
            type="button"
            onClick={handlePrevImage}
            className="absolute left-[20px] top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer outline-none border-none"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>

          {/* Centered Image / Placeholder Box */}
          <div 
            className="relative max-w-[80vw] max-h-[80vh] flex items-center justify-center pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {hasLightboxImage ? (
              <img 
                src={lightboxSrc} 
                alt={activeImage.caption} 
                className="max-w-[80vw] max-h-[80vh] object-contain rounded-[4px] shadow-2xl"
              />
            ) : (
              <div className="w-full max-w-[600px] h-[400px] bg-[#D9D9D9] flex items-center justify-center rounded-[4px] shadow-2xl">
                <span className="text-[16px] font-bold text-[#888888] tracking-wider uppercase">
                  IMAGE
                </span>
              </div>
            )}
          </div>

          {/* Right Navigation Arrow */}
          <button
            type="button"
            onClick={handleNextImage}
            className="absolute right-[20px] top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer outline-none border-none"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </section>
  );
}
