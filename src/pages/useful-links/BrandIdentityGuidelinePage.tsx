import AboutPageHero from '../../components/about/AboutPageHero';
import '../../styles/useful-links-pages.css';

export default function BrandIdentityGuidelinePage() {
  return (
    <div className="useful-links-bg">
      {/* Shared Hero */}
      <AboutPageHero title="NUCES Brand Identity Guideline" />

      {/* Main Content Area */}
      <div className="useful-links-wrapper text-center">
        {/* Centered Heading */}
        <h1 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] mb-[28px] text-center">
          NUCES Brand Identity Guideline
        </h1>

        {/* Centered Document / PDF Preview Placeholder */}
        <div className="pdf-preview-box">
          <span className="text-[13px] font-semibold text-[#666666] tracking-wide uppercase">
            PLACEHOLDER: NUCES BRAND IDENTITY GUIDELINE PDF PREVIEW
          </span>
        </div>

        {/* Two Buttons (Side-by-side on desktop, stacked on mobile) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px] mt-[24px]">
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="w-full sm:w-auto bg-[#0093DD] hover:bg-[#0C71C3] text-white text-[15px] font-semibold py-[12px] px-[24px] rounded-[4px] transition-colors cursor-pointer border-none outline-none"
          >
            Download Logo Variations
          </button>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="w-full sm:w-auto bg-[#0093DD] hover:bg-[#0C71C3] text-white text-[15px] font-semibold py-[12px] px-[24px] rounded-[4px] transition-colors cursor-pointer border-none outline-none"
          >
            Download Guide Book
          </button>
        </div>
      </div>
    </div>
  );
}
