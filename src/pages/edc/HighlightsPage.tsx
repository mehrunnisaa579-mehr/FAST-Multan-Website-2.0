import AboutPageHero from '../../components/about/AboutPageHero';
import { edcHighlightsData } from '../../data/edc';
import '../../styles/edc-pages.css';

export default function HighlightsPage() {
  return (
    <div className="edc-page-bg">
      {/* Shared Hero */}
      <AboutPageHero title="Highlights" />

      {/* Main Content Area */}
      <div className="edc-content-wrapper text-left">
        {edcHighlightsData.map((item, index) => (
          <div key={item.id}>
            {/* Event Header */}
            <div className="text-center mb-[20px]">
              <h2 className="text-[22px] min-[700px]:text-[26px] font-bold text-[#0C71C3]">
                {item.title}
              </h2>
              <p className="text-[13px] font-semibold text-[#666666] mt-[4px] uppercase tracking-wide">
                {item.subtext}
              </p>
            </div>

            {/* Event Description */}
            <div className="space-y-[10px] text-[15px] leading-[1.75] text-[#444444] mb-[28px] max-w-[900px] mx-auto text-center">
              {item.description.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Responsive Image Grid (Centered Flex Container) */}
            <div className="flex flex-wrap justify-center gap-[18px]">
              {Array.from({ length: item.imageCount }).map((_, imgIdx) => (
                <div
                  key={imgIdx}
                  className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-12px)] aspect-[4/3] bg-[#D9D9D9] border border-[#CCCCCC] rounded-[4px] flex items-center justify-center p-[12px] shadow-sm"
                >
                  <span className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase text-center">
                    PLACEHOLDER: EVENT IMAGE
                  </span>
                </div>
              ))}
            </div>

            {/* Divider between sections */}
            {index < edcHighlightsData.length - 1 && (
              <div className="w-full h-[1px] bg-[#0093DD] my-[45px]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
