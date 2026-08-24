import { useRef, useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../lib/supabase';

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

interface GalleryRowProps {
  items: any[];
  rowLabel: string;
  isInstagram?: boolean;
}

function GalleryRow({ items, rowLabel, isInstagram = true }: GalleryRowProps) {
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
          const rawImgSrc = item.thumbnail_url || item.media_url || item.image_url || item.image;
          const hasImage = !!rawImgSrc;
          const imgSrc = hasImage ? cmsService.getOptimizedMediaUrl(rawImgSrc, 360) : '';
          return (
            <a
              key={index}
              href={item.permalink || '#'}
              target={item.permalink ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="w-[70vw] sm:w-[260px] h-[175px] rounded-[6px] overflow-hidden flex-shrink-0 shadow-sm relative group bg-white card-hover-lift cursor-pointer block"
            >
              {hasImage ? (
                <img
                  src={imgSrc}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover select-none transition-transform duration-[350ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center" />
              )}
              {/* Instagram Icon overlay only for Instagram source */}
              {isInstagram && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md">
                  <InstagramIcon className="w-5 h-5 text-white" />
                </div>
              )}
            </a>
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

interface PhotoGalleryProps {
  data?: any;
}

export default function PhotoGallery({ data }: PhotoGalleryProps) {
  const [heading, setHeading] = useState('Instagram Feed');
  const [subtitle, setSubtitle] = useState('A glimpse into campus life');
  const [gallerySource, setGallerySource] = useState<'instagram' | 'local'>('instagram');
  const [row1Cap, setRow1Cap] = useState(6);
  const [row2Cap, setRow2Cap] = useState(6);
  const [row3Cap, setRow3Cap] = useState(6);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      if (data.galleryHeading) setHeading(data.galleryHeading);
      if (data.gallerySubtitle) setSubtitle(data.gallerySubtitle);
      if (data.galleryRow1Count) setRow1Cap(data.galleryRow1Count);
      if (data.galleryRow2Count) setRow2Cap(data.galleryRow2Count);
      if (data.galleryRow3Count) setRow3Cap(data.galleryRow3Count);
      if (data.gallerySource) setGallerySource(data.gallerySource);
    }
  }, [data]);

  useEffect(() => {
    const fetchGalleryData = async () => {
      let source = data?.gallerySource;
      let localImgs = data?.localGalleryImages;

      if (!source || localImgs === undefined) {
        const fullContent = await cmsService.getSetting<any>('homepage_full_content', null);
        if (fullContent) {
          source = source || fullContent.gallerySource || 'instagram';
          localImgs = localImgs || fullContent.localGalleryImages || [];
          if (!data?.galleryHeading && fullContent.galleryHeading) setHeading(fullContent.galleryHeading);
          if (!data?.gallerySubtitle && fullContent.gallerySubtitle) setSubtitle(fullContent.gallerySubtitle);
          if (!data?.galleryRow1Count && fullContent.galleryRow1Count) setRow1Cap(fullContent.galleryRow1Count);
          if (!data?.galleryRow2Count && fullContent.galleryRow2Count) setRow2Cap(fullContent.galleryRow2Count);
          if (!data?.galleryRow3Count && fullContent.galleryRow3Count) setRow3Cap(fullContent.galleryRow3Count);
        }
      }

      const activeSource = source || 'instagram';
      setGallerySource(activeSource);

      if (activeSource === 'local') {
        setImages(Array.isArray(localImgs) ? localImgs : []);
      } else {
        // Fetch from Instagram Integration
        const { data: posts, error } = await supabase
          .from('instagram_posts')
          .select('*')
          .eq('is_visible', true)
          .order('posted_at', { ascending: false })
          .limit(20);

        if (posts && !error) {
          setImages(posts);
        }
      }
    };
    fetchGalleryData();
  }, [data]);

  const { row1, row2, row3 } = useMemo(() => {
    const indexedImages = images.map((img, idx) => ({ ...img, originalIndex: idx }));

    const r1: any[] = indexedImages.slice(0, row1Cap);
    const r2: any[] = indexedImages.slice(row1Cap, row1Cap + row2Cap);
    const r3: any[] = indexedImages.slice(row1Cap + row2Cap, row1Cap + row2Cap + row3Cap);

    const remaining = indexedImages.slice(row1Cap + row2Cap + row3Cap);
    remaining.forEach((item, idx) => {
      if (idx % 3 === 0) r1.push(item);
      else if (idx % 3 === 1) r2.push(item);
      else r3.push(item);
    });
    
    return { row1: r1, row2: r2, row3: r3 };
  }, [images, row1Cap, row2Cap, row3Cap]);

  const isInstagram = gallerySource === 'instagram';

  return (
    <section className="py-[60px] w-full bg-[#F7F9FC]">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        <h2 className="text-[32px] sm:text-[38px] md:text-[40px] lg:text-[46px] leading-[1.1] font-bold text-[#0C71C3] uppercase tracking-tight md:tracking-[-1px] text-center mb-2 relative -top-[20px]">
          {heading}
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[36px] font-medium relative -top-[20px]">
          {subtitle}
        </p>

        {/* 3-Row Gallery Layout */}
        {images.length > 0 ? (
          <div className="w-full space-y-[20px]">
            {row1.length > 0 && <GalleryRow items={row1} rowLabel="Row 1" isInstagram={isInstagram} />}
            {row2.length > 0 && <GalleryRow items={row2} rowLabel="Row 2" isInstagram={isInstagram} />}
            {row3.length > 0 && <GalleryRow items={row3} rowLabel="Row 3" isInstagram={isInstagram} />}
          </div>
        ) : (
          <div className="w-full py-16 bg-white border border-gray-100 rounded-lg shadow-sm text-center">
            {isInstagram ? (
              <>
                <InstagramIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-500">Instagram feed is currently empty</h3>
                <p className="text-sm text-gray-400 mt-1">Check back later for new updates.</p>
              </>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-500">No local gallery images uploaded yet</h3>
                <p className="text-sm text-gray-400 mt-1">Upload images in CMS under Section 5 to display them here.</p>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
