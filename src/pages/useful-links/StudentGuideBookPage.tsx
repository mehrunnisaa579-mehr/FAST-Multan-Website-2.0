import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import { FileText, Download, Maximize, Minimize } from 'lucide-react';
import '../../styles/useful-links-pages.css';

export default function StudentGuideBookPage() {
  const [heroTitle, setHeroTitle] = useState('Student Guide Book');
  const [heroImage, setHeroImage] = useState('');
  const [heading, setHeading] = useState('STUDENT GUIDE BOOK');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [buttonLabel, setButtonLabel] = useState('Download Guide Book');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await cmsService.getSetting<any>('useful_links_content', null);
      if (data) {
        if (data.guidebookHeroTitle) setHeroTitle(data.guidebookHeroTitle);
        if (data.guidebookHeroImage) setHeroImage(data.guidebookHeroImage);
        if (data.guidebookHeading) setHeading(data.guidebookHeading);
        if (data.guidebookPdfUrl) setPdfUrl(data.guidebookPdfUrl);
        if (data.guidebookPdfFileName) setPdfFileName(data.guidebookPdfFileName);
        if (data.guidebookButtonLabel) setButtonLabel(data.guidebookButtonLabel);
      }
    };
    fetchData();
  }, []);

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      alert('Student Guide Book PDF document will be uploaded by the campus administrator.');
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
    <div className="w-full bg-white text-left">
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      <div className="useful-links-wrapper text-center">
        <h1 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
          {heading}
        </h1>

        {/* PDF Preview Box (Collapsed State) */}
        <div className="pdf-preview-box flex flex-col items-center justify-center p-6 bg-white border border-[#E5E7EB] rounded-md shadow-xs">
          {pdfUrl ? (
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between text-[#0093DD]">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8" />
                  <span className="text-base font-bold text-[#1F2937]">{pdfFileName || 'FAST-NUCES Student Guide Book.pdf'}</span>
                </div>
                <button
                  onClick={toggleExpand}
                  className="p-2 text-[#6B7280] hover:text-[#0093DD] hover:bg-[#F3F4F6] rounded-md transition-colors cursor-pointer outline-none flex items-center justify-center group"
                  title="Expand PDF"
                >
                  <Maximize className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <iframe src={pdfUrl} title="Student Guide Book PDF" className="w-full h-[450px] border border-[#E5E7EB] rounded-md" />
            </div>
          ) : (
            <span className="text-[13px] font-semibold text-[#666666] tracking-wide uppercase">
              PLACEHOLDER: STUDENT GUIDE BOOK PDF PREVIEW
            </span>
          )}
        </div>

        <div>
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
              <span className="text-base sm:text-lg font-bold">{pdfFileName || 'FAST-NUCES Student Guide Book.pdf'}</span>
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
            <iframe src={pdfUrl} title="Student Guide Book PDF Expanded" className="absolute inset-0 w-full h-full border-none" />
          </div>
        </div>
      )}
    </div>
  );
}
