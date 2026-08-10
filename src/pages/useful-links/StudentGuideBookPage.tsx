import AboutPageHero from '../../components/about/AboutPageHero';
import '../../styles/useful-links-pages.css';

export default function StudentGuideBookPage() {
  return (
    <div className="useful-links-bg">
      {/* Shared Hero */}
      <AboutPageHero title="Student Guide Book" />

      {/* Main Content Area */}
      <div className="useful-links-wrapper text-center">
        {/* Centered Heading */}
        <h1 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
          STUDENT GUIDE BOOK
        </h1>

        {/* Centered Document / PDF Preview Placeholder */}
        <div className="pdf-preview-box">
          <span className="text-[13px] font-semibold text-[#666666] tracking-wide uppercase">
            PLACEHOLDER: STUDENT GUIDE BOOK PDF PREVIEW
          </span>
        </div>

        {/* Divider Line */}
        <div className="w-[100px] h-[2px] bg-[#0C71C3] mx-auto my-[24px]" />

        {/* Download Button */}
        <div>
          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="inline-block bg-[#0093DD] hover:bg-[#0C71C3] text-white text-[15px] font-semibold py-[12px] px-[24px] rounded-[4px] transition-colors cursor-pointer border-none outline-none"
          >
            Download Guide Book
          </button>
        </div>
      </div>
    </div>
  );
}
