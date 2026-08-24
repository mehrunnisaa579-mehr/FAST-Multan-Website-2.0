import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { homepageContent } from '../../data/homepage';
import { useVisibilityObserver } from '../ui/ViewportObserver';

interface HeroProps {
  data?: any;
}

export default function Hero({ data }: HeroProps) {
  const [slides, setSlides] = useState<any[]>(homepageContent.heroSlides);
  const [displayIndex, setDisplayIndex] = useState(1);
  const [isAnimated, setIsAnimated] = useState(true);

  const { ref, isVisible } = useVisibilityObserver('100px');

  useEffect(() => {
    if (data && data.heroSlides && data.heroSlides.length > 0) {
      const visibleSlides = data.heroSlides.filter((s: any) => s.visible !== false);
      if (visibleSlides.length > 0) {
        setSlides(visibleSlides);
        setDisplayIndex(1);
      }
    }
  }, [data]);

  useEffect(() => {
    if (slides.length <= 1 || !isVisible) return;
    const timer = setInterval(() => {
      setIsAnimated(true);
      setDisplayIndex((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isVisible]);

  const handleNext = () => {
    if (slides.length <= 1) return;
    setIsAnimated(true);
    setDisplayIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (slides.length <= 1) return;
    setIsAnimated(true);
    setDisplayIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;

    if (displayIndex === slides.length + 1) {
      setIsAnimated(false);
      setDisplayIndex(1);
    } else if (displayIndex === 0) {
      setIsAnimated(false);
      setDisplayIndex(slides.length);
    }
  };

  // Build cloned array for seamless infinite looping: [last, ...slides, first]
  const extendedSlides = slides.length > 1
    ? [slides[slides.length - 1], ...slides, slides[0]]
    : slides;

  // Real slide index (0 to slides.length - 1) for dot indicators
  const activeRealIndex = slides.length > 1
    ? (displayIndex - 1 + slides.length) % slides.length
    : 0;

  const trackTransformIndex = slides.length > 1 ? displayIndex : 0;

  return (
    <section ref={ref} className="relative w-full h-[320px] sm:h-[500px] overflow-hidden bg-black">
      {/* Smooth Infinite Horizontal Sliding Track */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex w-full h-full ${
          isAnimated ? 'transition-transform duration-500 ease-in-out motion-reduce:transition-none' : ''
        }`}
        style={{ transform: `translate3d(-${trackTransformIndex * 100}%, 0, 0)` }}
      >
        {extendedSlides.map((slide, index) => {
          const mediaUrl = slide.mediaUrl || slide.backgroundImage || '';
          const isVideo = slide.mediaType === 'video' && !!mediaUrl;
          const isImage = slide.mediaType !== 'video' && !!mediaUrl;

          const realIndex = slides.length > 1
            ? (index - 1 + slides.length) % slides.length
            : index;

          return (
            <div
              key={index}
              className="relative w-full h-full flex-shrink-0 bg-white overflow-hidden"
            >
              {/* Background Image if Media Type is Image */}
              {isImage && (
                <img
                  src={mediaUrl}
                  alt={slide.heading || 'Hero Image'}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  loading={realIndex === 0 ? 'eager' : 'lazy'}
                  fetchPriority={realIndex === 0 ? 'high' : 'auto'}
                />
              )}

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
                  <div className="flex items-center gap-[8px] mt-[16px]">
                    {slides.map((_, dotIndex) => (
                      <button
                        key={dotIndex}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsAnimated(true);
                          setDisplayIndex(dotIndex + 1);
                        }}
                        className={`w-[8px] h-[8px] rounded-full transition-colors cursor-pointer outline-none border-none ${
                          dotIndex === activeRealIndex ? 'bg-white' : 'bg-[rgba(255,255,255,0.5)]'
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
      </div>

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
