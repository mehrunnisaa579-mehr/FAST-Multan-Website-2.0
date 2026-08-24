import React, { useState, useEffect } from 'react';
import { FileText, Maximize, Minimize, ExternalLink } from 'lucide-react';

interface PdfViewerProps {
  pdfUrl: string;
  title?: string;
  fileName?: string;
  className?: string;
  containerClassName?: string;
  defaultHeight?: string;
  showExpandButton?: boolean;
}

export default function PdfViewer({
  pdfUrl,
  title = 'PDF Document',
  fileName,
  containerClassName = '',
  defaultHeight = 'h-[450px] md:h-[500px]',
  showExpandButton = true,
}: PdfViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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

  // Construct PDF URLs:
  // Direct PDF URL for desktop native viewer
  // For mobile browsers (where native PDF iframes block touch scrolling), use Google Docs Viewer embed URL as high-compatibility mobile viewer if web URL.
  const isWebUrl = pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://');
  const mobileEmbedUrl = isWebUrl
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`
    : pdfUrl;

  const displayFileName = fileName || pdfUrl.split('/').pop() || 'Document.pdf';

  return (
    <div className={`w-full ${containerClassName}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between text-[#0093DD] mb-3 px-1">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <FileText className="w-6 h-6 flex-shrink-0 text-[#0093DD]" />
          <span className="text-sm sm:text-base font-bold text-[#1F2937] truncate">
            {displayFileName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[#6B7280] hover:text-[#0093DD] hover:bg-[#F3F4F6] rounded-md transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Open PDF in new tab"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Open</span>
          </a>

          {showExpandButton && (
            <button
              onClick={toggleExpand}
              className="p-1.5 text-[#6B7280] hover:text-[#0093DD] hover:bg-[#F3F4F6] rounded-md transition-colors cursor-pointer outline-none flex items-center gap-1 text-xs font-semibold group"
              title="Expand PDF"
            >
              <Maximize className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Fullscreen</span>
            </button>
          )}
        </div>
      </div>

      {/* PDF Iframe Wrapper */}
      <div
        className="w-full relative bg-[#F9FAFB] border border-[#E5E7EB] rounded-md overflow-hidden shadow-xs"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        }}
      >
        {/* Desktop Iframe (exact direct pdfUrl as before) */}
        <iframe
          src={pdfUrl}
          title={title}
          className={`hidden md:block w-full ${defaultHeight} border-none`}
        />

        {/* Mobile Iframe (scrollable embed for mobile touch devices) */}
        <iframe
          src={mobileEmbedUrl}
          title={`${title} Mobile`}
          className="block md:hidden w-full h-[60vh] min-h-[420px] max-h-[600px] border-none"
          style={{
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
          }}
        />
      </div>

      {/* Expanded PDF Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-black/90 p-3 sm:p-6 md:p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto mb-3">
            <div className="flex items-center gap-3 text-white truncate pr-4">
              <FileText className="w-6 h-6 text-[#0093DD] flex-shrink-0" />
              <span className="text-base sm:text-lg font-bold truncate">{displayFileName}</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors text-xs sm:text-sm font-medium flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Open Original</span>
              </a>
              <button
                onClick={toggleExpand}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer outline-none flex items-center gap-1.5 group"
                title="Collapse PDF"
              >
                <span className="text-xs sm:text-sm font-semibold">Close</span>
                <Minimize className="w-5 h-5 group-hover:scale-90 transition-transform" />
              </button>
            </div>
          </div>
          <div
            className="w-full max-w-[1400px] mx-auto flex-1 bg-white rounded-md overflow-hidden shadow-2xl relative"
            style={{
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
            }}
          >
            {/* Desktop Expanded */}
            <iframe
              src={pdfUrl}
              title={`${title} Expanded`}
              className="hidden md:block absolute inset-0 w-full h-full border-none"
            />
            {/* Mobile Expanded */}
            <iframe
              src={mobileEmbedUrl}
              title={`${title} Mobile Expanded`}
              className="block md:hidden absolute inset-0 w-full h-full border-none"
              style={{
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
