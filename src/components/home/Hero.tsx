import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { homepageContent } from '../../data/homepage';
import { cmsService } from '../../services/cmsService';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>(homepageContent.heroSlides);

  useEffect(() => {
    const fetchHeroData = async () => {
      const data = await cmsService.getSetting<any>('homepage_full_content', null);
      if (data && data.heroSlides && data.heroSlides.length > 0) {
        const visibleSlides = data.heroSlides.filter((s: any) => s.visible !== false);
        if (visibleSlides.length > 0) {
          setSlides(visibleSlides);
        }
      }
    };
    fetchHeroData();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-[320px] sm:h-[500px] overflow-hidden bg-black">
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        const mediaUrl = slide.mediaUrl || slide.backgroundImage || '';
        const isVideo = slide.mediaType === 'video' && !!mediaUrl;
        const isImage = slide.mediaType !== 'video' && !!mediaUrl;

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-400 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            } ${isImage ? 'bg-cover bg-center bg-no-repeat' : 'bg-[#D9D9D9]'}`}
            style={isImage ? { backgroundImage: `url(${mediaUrl})` } : undefined}
          >
            {/* Background Video if Media Type is Video */}
            {isVideo && (
              <video
                src={mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
            )}

            {/* Dark semi-transparent overlay */}
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.35)] z-10" />

            {/* Placeholder Text if no media */}
            {!mediaUrl && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <span className="text-[16px] font-medium text-[#888888] tracking-wider uppercase">
                  SLIDE MEDIA PLACEHOLDER
                </span>
              </div>
            )}

            {/* Slide Content */}
            <div className="relative z-20 w-full max-w-[1300px] mx-auto px-[20px] sm:px-[40px] text-center flex flex-col items-center justify-center h-full">
              <h1 className="text-[26px] sm:text-[42px] font-extrabold text-white leading-tight max-w-[700px] w-full mx-auto uppercase">
                {slide.heading}
              </h1>
              <p className="text-[14px] sm:text-[18px] font-normal text-white mt-[16px] max-w-[600px] w-full mx-auto">
                {slide.subheading}
              </p>

              {/* Dot Indicators */}
              {slides.length > 1 && (
                <div className="flex items-center gap-[8px] mt-[10px]">
                  {slides.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentSlide(dotIndex);
                      }}
                      className={`w-[8px] h-[8px] rounded-full transition-colors cursor-pointer outline-none border-none ${
                        dotIndex === currentSlide ? 'bg-white' : 'bg-[rgba(255,255,255,0.5)]'
                      }`}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-[20px] top-1/2 -translate-y-1/2 z-30 w-[44px] h-[44px] rounded-full bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.4)] text-white flex items-center justify-center transition-colors cursor-pointer outline-none border-none"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-[20px] top-1/2 -translate-y-1/2 z-30 w-[44px] h-[44px] rounded-full bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.4)] text-white flex items-center justify-center transition-colors cursor-pointer outline-none border-none"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </section>
  );
}
