import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import { FileText, Download, Maximize, Minimize } from 'lucide-react';
import '../../styles/about-pages.css';

export default function UniversityCharterPage() {
  const [title, setTitle] = useState('University Charter');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heading, setHeading] = useState('UNIVERSITY CHARTER');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [buttonLabel, setButtonLabel] = useState('Download University Charter');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchCharterData = async () => {
      const data = await cmsService.getSetting<any>('about_charter_content', null);
      const legacyData = await cmsService.getSetting<any>('about_pages_content', null);

      if (data) {
        if (data.heroTitle) setTitle(data.heroTitle);
        if (data.heroImageUrl) setHeroImageUrl(data.heroImageUrl);
        if (data.charterHeading) setHeading(data.charterHeading);
        if (data.charterPdfUrl) setPdfUrl(data.charterPdfUrl);
        if (data.charterPdfFileName) setPdfFileName(data.charterPdfFileName);
        if (data.buttonLabel) setButtonLabel(data.buttonLabel);
      } else if (legacyData) {
        if (legacyData.charterTitle) setTitle(legacyData.charterTitle);
      }
    };

    fetchCharterData();
  }, []);

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      alert('University Charter PDF document will be uploaded by the campus administrator.');
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Prevent background scrolling when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded]);

  return (
    <div className="w-full bg-white">
      {/* Hero */}
      <AboutPageHero title={title} backgroundImage={heroImageUrl} />

      {/* Centered Document Section */}
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[55px] min-[1100px]:pb-[85px] text-center">
        {/* Section Heading */}
        <h1 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
          {heading}
        </h1>

        {/* PDF Preview Box */}
        <div className="pdf-preview-box flex flex-col items-center justify-center p-6 bg-white border border-[#E5E7EB] rounded-md shadow-xs max-w-[900px] mx-auto">
          {pdfUrl ? (
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-[#0093DD]">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  <span className="text-base font-bold text-[#1F2937]">{pdfFileName || 'FAST-NUCES University Charter.pdf'}</span>
                </div>
                <button
                  onClick={toggleExpand}
                  className="p-2 text-[#6B7280] hover:text-[#0093DD] hover:bg-[#F3F4F6] rounded-md transition-colors cursor-pointer outline-none flex items-center justify-center group"
                  title="Expand PDF"
                >
                  <Maximize className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <iframe src={pdfUrl} title="University Charter PDF" className="w-full h-[480px] border border-[#E5E7EB] rounded-md" />
            </div>
          ) : (
            <div className="min-h-[200px] flex items-center justify-center">
              <span className="text-[13px] font-semibold text-[#666666] tracking-wide uppercase">
                PLACEHOLDER: UNIVERSITY CHARTER PDF PREVIEW
              </span>
            </div>
          )}
        </div>

        {/* Download Button */}
        <div className="mt-[28px]">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 download-doc-btn text-white text-[15px] font-semibold py-[12px] px-[24px] rounded-[4px] cursor-pointer border-none outline-none shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{buttonLabel}</span>
          </button>
        </div>
      </div>

      {/* Expanded PDF Overlay */}
      {isExpanded && pdfUrl && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-black/90 p-4 sm:p-6 md:p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto mb-4">
            <div className="flex items-center gap-3 text-white">
              <FileText className="w-6 h-6 text-[#0093DD]" />
              <span className="text-base sm:text-lg font-bold">{pdfFileName || 'FAST-NUCES University Charter.pdf'}</span>
            </div>
            <button
              onClick={toggleExpand}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer outline-none flex items-center justify-center gap-2 group"
              title="Collapse PDF"
            >
              <span className="text-sm font-semibold hidden sm:block">Collapse</span>
              <Minimize className="w-6 h-6 group-hover:scale-90 transition-transform" />
            </button>
          </div>
          <div className="w-full max-w-[1400px] mx-auto flex-1 bg-white rounded-md overflow-hidden shadow-2xl relative">
            <iframe src={pdfUrl} title="University Charter PDF Expanded" className="absolute inset-0 w-full h-full border-none" />
          </div>
        </div>
      )}
    </div>
  );
}
