import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import { footerContent } from '../../data/footer';

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--footer-bg)] text-white select-none">
      {/* Upper Grid Area */}
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px] pt-[60px] pb-[40px]">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-[40px] text-left">
          {/* Column 1: Logo, Description & Socials */}
          <div>
            {/* White Logo Lockup */}
            <div className="flex items-center gap-[10px]">
              <div className="w-[55px] h-[55px] bg-[#FFFFFF] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[8px] font-bold text-[var(--footer-bg)] tracking-wider">SEAL</span>
              </div>
              <div className="flex flex-col gap-[2px] text-left">
                <span className="text-[15px] font-bold text-[#FFFFFF] tracking-[0.3px] uppercase leading-none">
                  NATIONAL UNIVERSITY
                </span>
                <span className="text-[9px] font-medium text-[#D0D9E8] tracking-[0.2px] uppercase leading-none">
                  OF COMPUTER AND EMERGING SCIENCES
                </span>
                <span className="text-[10px] font-bold text-[#FFFFFF] tracking-[0.5px] uppercase leading-none">
                  MULTAN CAMPUS
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-[13px] text-[#D0D9E8] leading-[1.6] mt-[16px] max-w-[280px]">
              {footerContent.description}
            </p>

            {/* Social Icons - Facebook, YouTube */}
            <div className="flex items-center gap-[12px] mt-[16px]">
              <span className="w-[28px] h-[28px] rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/30 cursor-pointer transition-colors">
                <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </span>
              <span className="w-[28px] h-[28px] rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/30 cursor-pointer transition-colors">
                <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </span>
            </div>
          </div>

          {/* Column 2: Information */}
          <div>
            <h4 className="text-[15px] font-bold text-white tracking-[0.5px] mb-[20px] uppercase">
              INFORMATION
            </h4>
            <div className="flex flex-col">
              {footerContent.informationLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.url}
                  className="text-[13px] text-[#D0D9E8] leading-[2.2] hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Popular Post */}
          <div>
            <h4 className="text-[15px] font-bold text-white tracking-[0.5px] mb-[20px] uppercase">
              POPULAR POST
            </h4>
            <div className="flex flex-col gap-[16px]">
              {footerContent.popularPosts.map((post, idx) => (
                <div key={idx} className="flex flex-col text-left">
                  <span className="text-[13px] font-semibold text-white leading-[1.4]">
                    {post.title}
                  </span>
                  <span className="text-[11px] text-[#A8B8D8] mt-[2px]">
                    {post.date}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 className="text-[15px] font-bold text-white tracking-[0.5px] mb-[20px] uppercase">
              CONTACT US
            </h4>
            <div className="flex flex-col gap-[16px]">
              {/* Address */}
              <div className="flex gap-[12px] items-start">
                <div className="w-[24px] h-[24px] rounded-full bg-white/15 flex-shrink-0 flex items-center justify-center text-white">
                  <MapPin className="w-[13px] h-[13px]" />
                </div>
                <span className="text-[13px] text-[#D0D9E8] leading-[1.5]">
                  {footerContent.address}
                </span>
              </div>

              {/* Email */}
              <div className="flex gap-[12px] items-center">
                <div className="w-[24px] h-[24px] rounded-full bg-white/15 flex-shrink-0 flex items-center justify-center text-white">
                  <Mail className="w-[13px] h-[13px]" />
                </div>
                <span className="text-[13px] text-[#D0D9E8] leading-[1.5]">
                  {footerContent.email}
                </span>
              </div>

              {/* Phone */}
              <div className="flex gap-[12px] items-center">
                <div className="w-[24px] h-[24px] rounded-full bg-white/15 flex-shrink-0 flex items-center justify-center text-white">
                  <Phone className="w-[13px] h-[13px]" />
                </div>
                <span className="text-[13px] text-[#D0D9E8] leading-[1.5]">
                  {footerContent.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-white/15 my-[40px]" />
      </div>

      {/* Bottom Copyright Bar */}
      <div className="w-full bg-[var(--footer-bg)] text-center py-[20px]">
        <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px] text-[13px] text-[#D0D9E8]">
          {footerContent.copyrightText}
        </div>
      </div>
    </footer>
  );
}
