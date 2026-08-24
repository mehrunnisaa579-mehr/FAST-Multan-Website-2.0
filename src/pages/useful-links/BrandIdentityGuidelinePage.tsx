import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import { Download } from 'lucide-react';
import PdfViewer from '../../components/ui/PdfViewer';
import '../../styles/useful-links-pages.css';

export default function BrandIdentityGuidelinePage() {
  const [heroTitle, setHeroTitle] = useState('NUCES Brand Identity Guideline');
  const [heroImage, setHeroImage] = useState('');
  const [heading, setHeading] = useState('NUCES Brand Identity Guideline');
  const [brandPdfUrl, setBrandPdfUrl] = useState('');
  const [brandPdfFileName, setBrandPdfFileName] = useState('');
  const [logoResourceUrl, setLogoResourceUrl] = useState('');
  const [logoBtnLabel, setLogoBtnLabel] = useState('Download Logo Variations');
  const [guidebookBtnLabel, setGuidebookBtnLabel] = useState('Download Guide Book');

  useEffect(() => {
    const fetchData = async () => {
      const data = await cmsService.getSetting<any>('useful_links_content', null);
      if (data) {
        if (data.brandHeroTitle) setHeroTitle(data.brandHeroTitle);
        if (data.brandHeroImage) setHeroImage(data.brandHeroImage);
        if (data.brandHeading) setHeading(data.brandHeading);
        if (data.brandPdfUrl) setBrandPdfUrl(data.brandPdfUrl);
        if (data.brandPdfFileName) setBrandPdfFileName(data.brandPdfFileName);
        if (data.logoResourceUrl) setLogoResourceUrl(data.logoResourceUrl);
        if (data.logoBtnLabel) setLogoBtnLabel(data.logoBtnLabel);
        if (data.guidebookBtnLabel2) setGuidebookBtnLabel(data.guidebookBtnLabel2);
      }
    };
    fetchData();
  }, []);

  const handleDownloadLogos = () => {
    if (logoResourceUrl) {
      window.open(logoResourceUrl, '_blank');
    } else {
      alert('Logo variations package (ZIP/PDF) will be uploaded by the campus administrator.');
    }
  };

  const handleDownloadBrandPdf = () => {
    if (brandPdfUrl) {
      window.open(brandPdfUrl, '_blank');
    } else {
      alert('NUCES Brand Identity Guideline PDF document will be uploaded by the campus administrator.');
    }
  };

  return (
    <div className="w-full bg-white text-left">
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      <div className="useful-links-wrapper text-center">
        <h1 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] mb-[28px] text-center">
          {heading}
        </h1>

        {/* PDF Preview Box (Shared Responsive PDF Viewer) */}
        <div className="pdf-preview-box mb-6">
          {brandPdfUrl ? (
            <PdfViewer
              pdfUrl={brandPdfUrl}
              fileName={brandPdfFileName || 'NUCES Brand Identity Guideline.pdf'}
              title="NUCES Brand Identity Guideline PDF"
              defaultHeight="h-[450px] md:h-[520px]"
            />
          ) : (
            <span className="text-[13px] font-semibold text-[#666666] tracking-wide uppercase py-10">
              PLACEHOLDER: NUCES BRAND IDENTITY GUIDELINE PDF PREVIEW
            </span>
          )}
        </div>

        {/* Two Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px] mt-[24px]">
          <button
            type="button"
            onClick={handleDownloadLogos}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 download-doc-btn text-white text-[15px] font-semibold py-[12px] px-[24px] rounded-[4px] cursor-pointer border-none outline-none shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{logoBtnLabel}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadBrandPdf}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 download-doc-btn text-white text-[15px] font-semibold py-[12px] px-[24px] rounded-[4px] cursor-pointer border-none outline-none shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>{guidebookBtnLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
