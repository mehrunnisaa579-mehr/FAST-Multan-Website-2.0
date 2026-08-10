import { Play } from 'lucide-react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { galleryItems } from '../../data/gallery';
import '../../styles/campus-pages.css';

export default function GalleryPage() {
  return (
    <div className="campus-page-bg">
      {/* Hero */}
      <AboutPageHero title="Gallery" />

      {/* Main Content Area */}
      <div className="gallery-content-wrapper">
        <div className="grid grid-cols-1 min-[700px]:grid-cols-2 gap-[28px] min-[700px]:gap-[28px_32px]">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={(e) => e.preventDefault()}
              className="gallery-card group cursor-pointer relative shadow-sm transition-transform hover:-translate-y-0.5"
            >
              {/* Centered Placeholder Label */}
              <div className="absolute inset-0 flex items-center justify-center z-0 p-[20px]">
                <span className="text-[12px] sm:text-[13px] font-semibold text-[#666666] tracking-wide uppercase text-center">
                  {item.thumbnail}
                </span>
              </div>

              {/* Centered Red Play Button */}
              <div className="relative z-10 w-[56px] h-[56px] rounded-full bg-[#FF0000] flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-1.08">
                <Play className="w-[20px] h-[20px] text-white fill-white ml-[3px]" />
              </div>

              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-[36px] pb-[16px] px-[16px] flex flex-col text-left z-20">
                <h3 className="text-[15px] font-bold text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-[12px] font-medium text-white/85 mt-[3px]">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
