import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import CmsImage from '../ui/CmsImage';

export interface AboutGalleryItem {
  id: string;
  title: string;
  imageLabel: string;
  image?: string;
  row_number?: number;
}

export const aboutGalleryImages: AboutGalleryItem[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `about-img-${i + 1}`,
  title: [
    'Main Academic Block',
    'Computing Laboratory',
    'Central Digital Library',
    'Seminar & Conference Hall',
    'Student Activity Center',
    'Sports & Recreation Complex',
    'Orientation Ceremony 2026',
    'Annual Tech Exhibition',
    'Campus Quadrangle & Lawns',
    'AI & Robotics Research Lab',
    'Faculty Development Center',
    'Software Engineering Workshop',
    'Student Executive Lounge',
    'Campus Cafeteria & Courtyard',
    'University Auditorium',
    'Annual Hackathon Event',
    'Career Counseling Fair',
    'Graduation Convocation',
  ][i] || `Campus Highlight ${i + 1}`,
  imageLabel: `PLACEHOLDER: ABOUT IMAGE ${i + 1}`,
  row_number: i < 6 ? 1 : i < 12 ? 2 : 3,
}));

function GalleryRow({ items, rowLabel }: { items: AboutGalleryItem[]; rowLabel: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth > 640 ? scrollRef.current.clientWidth * 0.7 : scrollRef.current.clientWidth * 0.85;
      const offset = direction === 'left' ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full mb-[28px] last:mb-0">
      <div
        ref={scrollRef}
        className="flex gap-[20px] overflow-x-auto scroll-smooth no-scrollbar w-full py-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="w-[82vw] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] flex-shrink-0 bg-white border border-[#EAEAEA] rounded-[4px] overflow-hidden shadow-sm flex flex-col group cursor-pointer card-hover-lift"
          >
            <div className={`w-full aspect-[4/3] flex items-center justify-center relative overflow-hidden${item.image ? '' : ' bg-[#D9D9D9]'}`}>
              <CmsImage
                src={item.image}
                alt={item.title}
                fallbackLabel={item.imageLabel || 'CAMPUS PHOTO'}
                fit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="p-[12px] bg-white border-t border-[#F0F0F0] text-center">
              <h3 className="text-[14px] font-semibold text-[#333333] truncate">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll('left')}
        className="absolute left-[6px] sm:-left-[16px] top-1/2 -translate-y-1/2 z-20 w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] rounded-full bg-white text-[#333333] shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:bg-[#F5F5F5] hover:text-[#0093DD] flex items-center justify-center transition-colors cursor-pointer outline-none border border-[#EAEAEA]"
        aria-label={`Scroll ${rowLabel} Left`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => scroll('right')}
        className="absolute right-[6px] sm:-right-[16px] top-1/2 -translate-y-1/2 z-20 w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] rounded-full bg-white text-[#333333] shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:bg-[#F5F5F5] hover:text-[#0093DD] flex items-center justify-center transition-colors cursor-pointer outline-none border border-[#EAEAEA]"
        aria-label={`Scroll ${rowLabel} Right`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function AboutGallerySlider() {
  const [row1Items, setRow1Items] = useState<AboutGalleryItem[]>(aboutGalleryImages.slice(0, 9));
  const [row2Items, setRow2Items] = useState<AboutGalleryItem[]>(aboutGalleryImages.slice(9, 18));

  const [heading, setHeading] = useState('Campus Gallery');

  useEffect(() => {
    const fetchGallery = async () => {
      const introSetting = await cmsService.getSetting<any>('about_campus_intro_content', null);
      if (introSetting) {
        if (introSetting.galleryHeading) setHeading(introSetting.galleryHeading);

        const r1Cap = introSetting.galleryRow1Count || 6;
        const r2Cap = introSetting.galleryRow2Count || 6;

        if (Array.isArray(introSetting.galleryItems) && introSetting.galleryItems.length > 0) {
          const visibleItems = introSetting.galleryItems.filter((i: any) => i.is_visible !== false);
          if (visibleItems.length > 0) {
            const formatted: AboutGalleryItem[] = visibleItems.map((item: any) => ({
              id: item.id,
              title: item.title || 'Campus Photo',
              imageLabel: 'GALLERY IMAGE',
              image: item.image,
              row_number: item.row_number || 1,
            }));

            const r1: AboutGalleryItem[] = formatted.slice(0, r1Cap);
            const r2: AboutGalleryItem[] = formatted.slice(r1Cap, r1Cap + r2Cap);

            const remaining = formatted.slice(r1Cap + r2Cap);
            remaining.forEach((item, idx) => {
              if (idx % 2 === 0) r1.push(item);
              else r2.push(item);
            });

            setRow1Items(r1);
            setRow2Items(r2);
            return;
          }
        }
      }

      const cmsItems = await cmsService.getGalleryItems();
      if (cmsItems && cmsItems.length > 0) {
        const formatted: AboutGalleryItem[] = cmsItems.map((item: any) => ({
          id: item.id,
          title: item.caption || 'Campus Photo',
          imageLabel: 'GALLERY IMAGE',
          image: item.image_url,
          row_number: item.row_number || 1,
        }));

        const mid = Math.ceil(formatted.length / 2);
        setRow1Items(formatted.slice(0, mid));
        setRow2Items(formatted.slice(mid));
      }
    };
    fetchGallery();
  }, []);

  return (
    <section className="w-full my-[45px]">
      <h2 className="text-[22px] min-[700px]:text-[26px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
        {heading}
      </h2>

      <div className="w-full max-w-[1180px] mx-auto px-[16px] sm:px-[30px]">
        <GalleryRow items={row1Items} rowLabel="Gallery Row 1" />
        <GalleryRow items={row2Items} rowLabel="Gallery Row 2" />
      </div>
    </section>
  );
}
