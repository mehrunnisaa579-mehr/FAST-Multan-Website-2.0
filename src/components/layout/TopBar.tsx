import { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';
import { cmsService } from '../../services/cmsService';

export default function TopBar() {
  const [phoneNumber, setPhoneNumber] = useState('+92 61 111 128 128');

  useEffect(() => {
    const fetchTopBarData = async () => {
      const data = await cmsService.getSetting<any>('header_footer_content', null);
      if (data && data.phone) {
        setPhoneNumber(data.phone);
      }
    };
    fetchTopBarData();
  }, []);

  const telUrl = `tel:${phoneNumber.replace(/[^0-9+]/g, '')}`;

  return (
    <div className="w-full h-[34px] sm:h-[38px] bg-[#0093DD] text-white flex items-center select-none box-sizing-border">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px] flex justify-between items-center h-full box-border">
        {/* Left Side: Call Us info (Click to Call) */}
        <a
          href={telUrl}
          className="flex items-center gap-[6px] text-[11px] sm:text-[13px] font-semibold text-white hover:text-white/90 hover:underline transition-colors cursor-pointer no-underline"
          title="Click to call"
        >
          <Phone className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]" strokeWidth={2.5} />
          <span>Call Us {phoneNumber}</span>
        </a>

        {/* Right Side: Social Media Icons (Facebook, Instagram, LinkedIn, YouTube) */}
        <div className="flex items-center gap-[12px] sm:gap-[18px]">
          {/* Facebook */}
          <a
            href="https://www.facebook.com/share/1J96Ddjj97/"
            aria-label="Facebook"
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg 
              className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/fast.multan.official"
            aria-label="Instagram"
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg 
              className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/fast-nuces-multan-campus/"
            aria-label="LinkedIn"
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg 
              className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://youtube.com/@fast.multan.official"
            aria-label="YouTube"
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg 
              className="w-[12px] h-[12px] sm:w-[14px] sm:h-[14px]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}