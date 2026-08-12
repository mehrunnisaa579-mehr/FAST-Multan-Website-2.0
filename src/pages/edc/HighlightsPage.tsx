import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { edcHighlightsData as defaultHighlights } from '../../data/edc';
import { cmsService } from '../../services/cmsService';
import '../../styles/edc-pages.css';

export default function HighlightsPage() {
  const [heroTitle, setHeroTitle] = useState('Highlights');
  const [heroImage, setHeroImage] = useState('');
  const [highlights, setHighlights] = useState<any[]>(defaultHighlights);

  useEffect(() => {
    const fetchHighlights = async () => {
      const data = await cmsService.getSetting<any>('edc_highlights_list', null);
      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.highlights && Array.isArray(data.highlights) && data.highlights.length > 0) {
          setHighlights(data.highlights.filter((h: any) => h.is_visible ?? true));
        }
      }
    };
    fetchHighlights();
  }, []);

  return (
    <div className="edc-page-bg">
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      <div className="w-full max-w-[1050px] mx-auto px-[20px] sm:px-[32px] py-[60px] sm:py-[80px] flex flex-col items-center text-center">
        {highlights.map((item, index) => {
          const descParagraphs = Array.isArray(item.description)
            ? item.description
            : (item.description || '').split('\n\n');

          const imagesList: string[] = Array.isArray(item.images)
            ? item.images
            : Array.from({ length: item.imageCount || 4 }).map(() => '');

          return (
            <div
              key={item.id || index}
              className={`w-full max-w-[950px] mx-auto flex flex-col items-center text-center ${
                index > 0 ? 'mt-[90px] sm:mt-[115px] pt-[45px] sm:pt-[55px] border-t border-[#EAEAEA]' : ''
              }`}
            >
              {/* Highlight Header */}
              <div className="text-center mb-[20px] sm:mb-[24px] max-w-[800px] mx-auto w-full flex flex-col items-center">
                <h2 className="text-[25px] min-[700px]:text-[30px] font-bold text-[#0C71C3] tracking-tight leading-tight text-center w-full">
                  {item.title}
                </h2>
                {(item.subtext || item.date) && (
                  <div className="flex justify-center w-full mt-3">
                    <span className="text-[12px] sm:text-[13px] font-bold text-[#0093DD] bg-[#F0F9FF] border border-[#B9E6FE] px-4 py-1.5 rounded-full uppercase tracking-wider text-center">
                      {item.subtext || item.date}
                    </span>
                  </div>
                )}
              </div>

              {/* Event Description Paragraphs */}
              {descParagraphs.length > 0 && descParagraphs[0] && (
                <div className="space-y-[16px] text-[15px] sm:text-[16px] leading-[1.85] text-[#444444] mb-[32px] sm:mb-[40px] max-w-[800px] w-full mx-auto text-center flex flex-col items-center">
                  {descParagraphs.map((paragraph: string, idx: number) => (
                    <p key={idx} className="text-center w-full max-w-[800px] mx-auto block leading-[1.85]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Responsive Centered Media Grid */}
              {imagesList.length > 0 && (
                <div className="w-full max-w-[950px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[22px] sm:gap-[26px] justify-center justify-items-center items-center">
                  {imagesList.map((imgUrl: string, imgIdx: number) => (
                    <div
                      key={imgIdx}
                      className={`w-full aspect-[4/3] rounded-[8px] overflow-hidden flex items-center justify-center border border-[#E2E8F0] shadow-xs card-hover-lift mx-auto${
                        imgUrl ? ' bg-white' : ' bg-[#F8FAFC] p-4 text-center'
                      }`}
                    >
                      {imgUrl ? (
                        <img src={imgUrl} alt={`Highlight ${imgIdx + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[12px] font-semibold text-[#64748B] tracking-wide uppercase text-center block w-full">
                          PLACEHOLDER: EVENT IMAGE
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
