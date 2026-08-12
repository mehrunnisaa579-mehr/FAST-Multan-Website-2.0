import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DesktopNavbar, MobileNavbar } from './Navbar';
import { cmsService } from '../../services/cmsService';

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [headerLogoUrl, setHeaderLogoUrl] = useState('');

  useEffect(() => {
    const fetchHeaderData = async () => {
      const data = await cmsService.getSetting<any>('header_footer_content', null);
      if (data && data.headerLogoUrl) {
        setHeaderLogoUrl(data.headerLogoUrl);
      }
    };
    fetchHeaderData();
  }, []);

  return (
    <header className="w-full bg-white border-b border-[#EAEAEA] relative z-40 select-none">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px] flex justify-between items-center h-[64px] sm:h-[92px]">
        {/* Swappable Logo Lockup structure */}
        <Link to="/" className="flex items-center gap-[10px] select-none outline-none cursor-pointer flex-shrink-0">
          {headerLogoUrl ? (
            /* Fixed-size wrapper matching default seal dimensions — image never inflates header */
            <div className="h-[40px] sm:h-[55px] w-auto max-w-[220px] sm:max-w-[260px] flex items-center flex-shrink-0 overflow-hidden">
              <img
                src={headerLogoUrl}
                alt="FAST-NUCES Multan Logo"
                className="h-full w-auto max-w-full object-contain object-left"
              />
            </div>
          ) : (
            <>
              {/* Circular Placeholder Seal */}
              <div className="w-[40px] h-[40px] sm:w-[55px] sm:h-[55px] bg-[#E5E5E5] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[8px] font-bold text-[#999999] tracking-wider">SEAL</span>
              </div>

              {/* Text block */}
              <div className="flex flex-col gap-[2px] text-left">
                <span className="text-[11px] sm:text-[15px] font-bold text-[#0C71C3] tracking-[0.3px] uppercase leading-none">
                  NATIONAL UNIVERSITY
                </span>
                <span className="text-[7px] sm:text-[9px] font-medium text-[#666666] tracking-[0.2px] uppercase leading-none">
                  OF COMPUTER AND EMERGING SCIENCES
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold text-[#0093DD] tracking-[0.5px] uppercase leading-none">
                  MULTAN CAMPUS
                </span>
              </div>
            </>
          )}
        </Link>

        {/* Desktop Navigation */}
        <DesktopNavbar />

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="min-[1050px]:hidden p-1.5 text-[#333333] hover:text-[#0093DD] focus:text-[#0093DD] outline-none cursor-pointer"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label={isMobileOpen ? 'Close Main Menu' : 'Open Main Menu'}
          aria-expanded={isMobileOpen}
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavbar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </header>
  );
}
