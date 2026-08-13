import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { homepageContent } from '../../data/homepage';
import { cmsService } from '../../services/cmsService';

interface GalleryRowProps {
  items: any[];
  rowLabel: string;
  onImageClick: (idx: number) => void;
}

function GalleryRow({ items, rowLabel, onImageClick }: GalleryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth > 640 ? 280 : scrollRef.current.clientWidth * 0.75;
      const offset = direction === 'left' ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full mb-[20px] last:mb-0">
      <div
        ref={scrollRef}
        className="flex gap-[16px] overflow-x-auto scroll-smooth no-scrollbar w-full py-3 select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, index) => {
          const imgSrc = item.image || item.image_url;
          const hasImage = !!imgSrc;
          return (
            <div
              key={index}
              onClick={() => onImageClick(item.originalIndex ?? index)}
              className="w-[70vw] sm:w-[260px] h-[175px] rounded-[6px] overflow-hidden flex-shrink-0 shadow-sm relative group bg-white card-hover-lift cursor-pointer"
            >
              {hasImage ? (
                <img
                  src={imgSrc}
                  alt={item.caption || 'Campus Photo'}
                  className="w-full h-full object-cover select-none"
                />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center">
                  <span className="text-[13px] font-semibold text-[#888888] tracking-wide uppercase">
                    IMAGE
                  </span>
                </div>
              )}
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                  <span className="text-white text-[12px] font-medium block text-left truncate">
                    {item.caption}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scroll('left')}
        className="absolute left-[6px] sm:-left-[18px] top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] rounded-full bg-white text-[#333333] shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-[#F5F5F5] hover:text-[#0093DD] flex items-center justify-center transition-colors cursor-pointer outline-none border border-gray-100"
        aria-label={`Scroll ${rowLabel} Left`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => scroll('right')}
        className="absolute right-[6px] sm:-right-[18px] top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] rounded-full bg-white text-[#333333] shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:bg-[#F5F5F5] hover:text-[#0093DD] flex items-center justify-center transition-colors cursor-pointer outline-none border border-gray-100"
        aria-label={`Scroll ${rowLabel} Right`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function PhotoGallery() {
  const [heading, setHeading] = useState('Photo Gallery');
  const [subtitle, setSubtitle] = useState('A glimpse into campus life');
  const [row1Cap, setRow1Cap] = useState(6);
  const [row2Cap, setRow2Cap] = useState(6);
  const [row3Cap, setRow3Cap] = useState(6);
  const [images, setImages] = useState<any[]>(homepageContent.galleryImages);

  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGalleryData = async () => {
      const data = await cmsService.getSetting<any>('homepage_full_content', null);
      if (data) {
        if (data.galleryHeading) setHeading(data.galleryHeading);
        if (data.gallerySubtitle) setSubtitle(data.gallerySubtitle);
        if (data.galleryRow1Count) setRow1Cap(data.galleryRow1Count);
        if (data.galleryRow2Count) setRow2Cap(data.galleryRow2Count);
        if (data.galleryRow3Count) setRow3Cap(data.galleryRow3Count);
      }

      // Read homepage photo gallery from its dedicated setting key
      const galleryList = await cmsService.getSetting<any[]>('homepage_photo_gallery_list', []);
      if (Array.isArray(galleryList) && galleryList.length > 0) {
        const visible = galleryList
          .filter((item: any) => item.is_visible !== false)
          .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));

        if (visible.length > 0) {
          setImages(
            visible.map((item: any) => ({
              image: item.image_url,
              caption: item.caption || 'Campus Photo',
            }))
          );
        }
      }
    };
    fetchGalleryData();
  }, []);

  const indexedImages = images.map((img, idx) => ({ ...img, originalIndex: idx }));

  const row1: any[] = indexedImages.slice(0, row1Cap);
  const row2: any[] = indexedImages.slice(row1Cap, row1Cap + row2Cap);
  const row3: any[] = indexedImages.slice(row1Cap + row2Cap, row1Cap + row2Cap + row3Cap);

  const remaining = indexedImages.slice(row1Cap + row2Cap + row3Cap);
  remaining.forEach((item, idx) => {
    if (idx % 3 === 0) row1.push(item);
    else if (idx % 3 === 1) row2.push(item);
    else row3.push(item);
  });

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
    <section className="py-[60px] w-full bg-[#F7F9FC]">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        {/* Section Heading & Subheading */}
        <h2 className="text-[28px] font-bold text-[#0C71C3] text-center mb-2">
          {heading}
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[36px] font-medium">
          {subtitle}
        </p>

        {/* 3-Row Gallery Layout */}
        <div className="w-full space-y-[20px]">
          <GalleryRow items={row1.length > 0 ? row1 : indexedImages} rowLabel="Row 1" onImageClick={(idx) => setActiveImageIndex(idx)} />
          <GalleryRow items={row2.length > 0 ? row2 : indexedImages} rowLabel="Row 2" onImageClick={(idx) => setActiveImageIndex(idx)} />
          <GalleryRow items={row3.length > 0 ? row3 : indexedImages} rowLabel="Row 3" onImageClick={(idx) => setActiveImageIndex(idx)} />
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
              <div className="w-full max-w-[600px] h-[400px] bg-white flex items-center justify-center rounded-[4px] shadow-2xl">
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
