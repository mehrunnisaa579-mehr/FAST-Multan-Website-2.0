import { homepageContent } from '../../data/homepage';

export default function CampusHighlights() {
  const highlights = homepageContent.campusHighlights;

  return (
    <section className="py-[60px] w-full bg-white select-none">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        {/* Section Heading & Subheading */}
        <h2 className="text-[28px] font-bold text-[#16498C] text-center mb-2">
          Campus Highlights
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[40px] font-medium">
          A glimpse into life at FAST-NUCES Multan Campus
        </p>

        {/* 2 cards side by side */}
        <div className="flex flex-col md:flex-row gap-[24px] justify-center items-center max-w-[1000px] mx-auto w-full">
          {highlights.map((item, index) => {
            const hasThumb = !!item.thumbnail;
            return (
              <div 
                key={index}
                className="flex-1 w-full aspect-[16/9] rounded-[8px] overflow-hidden relative cursor-pointer select-none group bg-[#D9D9D9] shadow-sm"
              >
                {/* Thumbnail Image / Placeholder */}
                {hasThumb ? (
                  <img 
                    src={item.thumbnail} 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-[#D9D9D9] flex items-center justify-center">
                    <span className="text-[14px] font-semibold text-[#888888] tracking-wide">
                      VIDEO THUMBNAIL
                    </span>
                  </div>
                )}

                {/* Bottom 50% gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent z-10" />

                {/* Centered red circular Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-[60px] h-[60px] rounded-full bg-[#FF0000] flex items-center justify-center transition-transform duration-200 group-hover:scale-1.1 shadow-lg">
                    {/* SVG Triangle Play Icon */}
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
    </section>
  );
}
