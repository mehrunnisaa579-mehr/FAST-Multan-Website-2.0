import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import { Download } from 'lucide-react';
import PdfViewer from '../../components/ui/PdfViewer';
import '../../styles/about-pages.css';

export default function UniversityCharterPage() {
  const [title, setTitle] = useState('University Charter');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [heading, setHeading] = useState('UNIVERSITY CHARTER');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [buttonLabel, setButtonLabel] = useState('Download University Charter');

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

        {/* PDF Preview Box (Shared Responsive PDF Viewer) */}
        <div className="pdf-preview-box max-w-[900px] mx-auto mb-6">
          {pdfUrl ? (
            <PdfViewer
              pdfUrl={pdfUrl}
              fileName={pdfFileName || 'FAST-NUCES University Charter.pdf'}
              title="University Charter PDF"
              defaultHeight="h-[480px] md:h-[550px]"
            />
          ) : (
            <div className="min-h-[200px] flex items-center justify-center py-10">
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
    </div>
  );
}
