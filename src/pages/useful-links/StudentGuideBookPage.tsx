import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import { Download } from 'lucide-react';
import PdfViewer from '../../components/ui/PdfViewer';
import '../../styles/useful-links-pages.css';

export default function StudentGuideBookPage() {
  const [heroTitle, setHeroTitle] = useState('Student Guide Book');
  const [heroImage, setHeroImage] = useState('');
  const [heading, setHeading] = useState('STUDENT GUIDE BOOK');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [buttonLabel, setButtonLabel] = useState('Download Guide Book');

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

  return (
    <div className="w-full bg-white text-left">
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      <div className="useful-links-wrapper text-center">
        <h1 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
          {heading}
        </h1>

        {/* PDF Preview Box (Shared Responsive PDF Viewer) */}
        <div className="pdf-preview-box mb-6">
          {pdfUrl ? (
            <PdfViewer
              pdfUrl={pdfUrl}
              fileName={pdfFileName || 'FAST-NUCES Student Guide Book.pdf'}
              title="Student Guide Book PDF"
              defaultHeight="h-[450px] md:h-[520px]"
            />
          ) : (
            <span className="text-[13px] font-semibold text-[#666666] tracking-wide uppercase py-10">
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
    </div>
  );
}
