import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import { footerContent } from '../../data/footer';
import { cmsService } from '../../services/cmsService';

export default function Footer() {
  const [footerLogoUrl, setFooterLogoUrl] = useState('');
  const [address, setAddress] = useState(footerContent.address);
  const [addressUrl, setAddressUrl] = useState(footerContent.addressUrl);
  const [phone, setPhone] = useState(footerContent.phone);
  const [email, setEmail] = useState(footerContent.email);
  const [copyrightText, setCopyrightText] = useState(footerContent.copyrightText);
  const [socials, setSocials] = useState(footerContent.socials);

  useEffect(() => {
    const fetchFooterData = async () => {
      const data = await cmsService.getSetting<any>('header_footer_content', null);

      if (data) {
        if (data.footerLogoUrl) setFooterLogoUrl(data.footerLogoUrl);
        if (data.address) setAddress(data.address);
        if (data.addressUrl) setAddressUrl(data.addressUrl);
        if (data.phone) setPhone(data.phone);
        if (data.email) setEmail(data.email);
        if (data.copyrightText) setCopyrightText(data.copyrightText);

        if (data.facebookUrl) socials[0].url = data.facebookUrl;
        if (data.instagramUrl) socials[1].url = data.instagramUrl;
        if (data.linkedInUrl) socials[2].url = data.linkedInUrl;
        if (data.youtubeUrl) socials[3].url = data.youtubeUrl;

        setSocials([...socials]);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer className="w-full bg-[#0093DD] text-white">

      {/* Main Footer Container */}
      <div className="w-full max-w-[1180px] mx-auto px-[20px] sm:px-[24px] pt-[48px] min-[700px]:pt-[58px] pb-[40px] min-[700px]:pb-[48px]">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.15fr] gap-[40px] min-[1000px]:gap-[50px] items-start text-left">

          {/* Column 1: White Oval Logo Area & Social Icons */}
          <div className="flex flex-col items-center text-center w-full">

            {/* White Oval Container */}
            <div className="w-full max-w-[310px] bg-white rounded-[999px] py-[12px] px-[20px] flex items-center justify-center shadow-sm mx-auto">

              {footerLogoUrl ? (
                <img
                  src={footerLogoUrl}
                  alt="FAST-NUCES Multan Footer Logo"
                  className="h-[42px] max-w-[270px] object-contain"
                />
              ) : (
                <div className="flex items-center gap-[10px] text-left">

                  <div className="w-[38px] h-[38px] bg-[#0093DD] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[8px] font-bold text-white tracking-wider select-none">
                      SEAL
                    </span>
                  </div>

                  <div className="flex flex-col leading-none">
                    <span className="text-[12px] font-bold text-[#0C71C3] tracking-[0.2px] uppercase">
                      NATIONAL UNIVERSITY
                    </span>

                    <span className="text-[7px] font-medium text-[#666666] tracking-[0.1px] uppercase mt-[2px]">
                      OF COMPUTER AND EMERGING SCIENCES
                    </span>

                    <span className="text-[8px] font-bold text-[#0093DD] tracking-[0.4px] uppercase mt-[2px]">
                      MULTAN CAMPUS
                    </span>
                  </div>

                </div>
              )}

            </div>

            {/* Social Icons Centered Below Oval */}
            {/* CHANGED: Extra vertical space added between logo and icons */}
            <div
              className="flex items-center justify-center gap-[20px]"
              style={{ marginTop: '30px' }}
            >

              {/* Facebook */}
              <a
                href={socials[0].url}
                aria-label="Facebook"
                className="w-[36px] h-[36px] rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-[16px] h-[16px] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={socials[1].url}
                aria-label="Instagram"
                className="w-[36px] h-[36px] rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-[16px] h-[16px] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.79 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href={socials[2].url}
                aria-label="LinkedIn"
                className="w-[36px] h-[36px] rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-[16px] h-[16px] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={socials[3].url}
                aria-label="YouTube"
                className="w-[36px] h-[36px] rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-[16px] h-[16px] fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

            </div>
          </div>

          {/* Column 2: ADMISSIONS */}
          <div className="flex flex-col items-start text-left w-full">

            <h4 className="text-[17px] min-[700px]:text-[18px] font-bold text-white uppercase leading-[1.3] mb-[18px] text-left border-b border-white/20 pb-[6px] w-full">
              ADMISSIONS
            </h4>

            <div className="flex flex-col gap-[12px] text-left w-full">
              {footerContent.admissionsLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  className="text-[14px] min-[700px]:text-[15px] font-normal text-white/90 hover:text-white hover:underline transition-colors text-left"
                >
                  {item.label}
                </a>
              ))}
            </div>

          </div>

          {/* Column 3: INFORMATION */}
          <div className="flex flex-col items-start text-left w-full">

            <h4 className="text-[17px] min-[700px]:text-[18px] font-bold text-white uppercase leading-[1.3] mb-[18px] text-left border-b border-white/20 pb-[6px] w-full">
              INFORMATION
            </h4>

            <div className="flex flex-col gap-[12px] text-left w-full">
              {footerContent.informationLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.url}
                  className="text-[14px] min-[700px]:text-[15px] font-normal text-white/90 hover:text-white hover:underline transition-colors text-left"
                >
                  {item.label}
                </Link>
              ))}
            </div>

          </div>

          {/* Column 4: CONTACT US */}
          <div className="flex flex-col items-start text-left w-full">

            <h4 className="text-[17px] min-[700px]:text-[18px] font-bold text-white uppercase leading-[1.3] mb-[18px] text-left border-b border-white/20 pb-[6px] w-full">
              CONTACT US
            </h4>

            <div className="flex flex-col gap-[16px] text-left w-full">

              <a
                href={addressUrl}
                className="flex items-start gap-[12px] text-left text-white/95 hover:text-white hover:underline transition-colors"
              >
                <MapPin className="w-[18px] h-[18px] text-white flex-shrink-0 mt-[2px]" />

                <span className="text-[14px] min-[700px]:text-[15px] leading-[1.55]">
                  {address}
                </span>
              </a>

              <a
                href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-[12px] text-left text-white/95 hover:text-white hover:underline transition-colors"
              >
                <Phone className="w-[17px] h-[17px] text-white flex-shrink-0" />

                <span className="text-[14px] min-[700px]:text-[15px] font-medium">
                  Phone: {phone}
                </span>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center gap-[12px] text-left text-white/95 hover:text-white hover:underline transition-colors"
              >
                <Mail className="w-[17px] h-[17px] text-white flex-shrink-0" />

                <span className="text-[14px] min-[700px]:text-[15px] font-medium">
                  Email: {email}
                </span>
              </a>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="w-full bg-[#0093DD] border-t border-white/20 py-[18px] px-[20px]">
        <div className="max-w-[1180px] mx-auto text-[14px] font-normal text-white/90 text-center">
          {copyrightText}
        </div>
      </div>

    </footer>
  );
}