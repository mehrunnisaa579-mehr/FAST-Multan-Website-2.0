import React, { useState } from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import AboutPageHero from '../components/about/AboutPageHero';
import { footerContent } from '../data/footer';
import '../styles/legal-contact-pages.css';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="legal-contact-bg">
      {/* Shared Hero */}
      <AboutPageHero title="Contact Us" />

      {/* Main Content Area */}
      <div className="legal-contact-wrapper text-left">
        {/* Top Map Placeholder */}
        <div className="map-placeholder-box">
          <span className="text-[13px] sm:text-[14px] font-semibold text-[#666666] tracking-wide uppercase text-center px-[16px]">
            PLACEHOLDER: FAST-NUCES MULTAN CAMPUS MAP
          </span>
        </div>

        {/* Lower Two-Column Layout */}
        <div className="flex flex-col min-[850px]:flex-row gap-[36px] items-start">
          {/* Left Column — Contact Information (~34%) */}
          <div className="w-full min-[850px]:w-[34%] flex flex-col items-start flex-shrink-0">
            <h2 className="text-[22px] font-bold text-[#333333] uppercase mb-[24px]">
              Contact Information
            </h2>

            <div className="flex flex-col gap-[20px] w-full">
              {/* Phone Row */}
              <div className="flex items-start gap-[16px]">
                <div className="w-[42px] h-[42px] rounded-[4px] bg-[#F5F5F5] border border-[#E0E0E0] flex items-center justify-center text-[#0093DD] flex-shrink-0">
                  <Phone className="w-[21px] h-[21px]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-bold text-[#333333] uppercase">Phone</span>
                  <span className="text-[15px] leading-[1.6] text-[#444444] mt-[2px]">
                    {footerContent.phone}
                  </span>
                </div>
              </div>

              {/* Email Row */}
              <div className="flex items-start gap-[16px]">
                <div className="w-[42px] h-[42px] rounded-[4px] bg-[#F5F5F5] border border-[#E0E0E0] flex items-center justify-center text-[#0093DD] flex-shrink-0">
                  <Mail className="w-[21px] h-[21px]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-bold text-[#333333] uppercase">Email</span>
                  <span className="text-[15px] leading-[1.6] text-[#444444] mt-[2px]">
                    {footerContent.email}
                  </span>
                </div>
              </div>

              {/* Address Row */}
              <div className="flex items-start gap-[16px]">
                <div className="w-[42px] h-[42px] rounded-[4px] bg-[#F5F5F5] border border-[#E0E0E0] flex items-center justify-center text-[#0093DD] flex-shrink-0">
                  <MapPin className="w-[21px] h-[21px]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-bold text-[#333333] uppercase">Address</span>
                  <span className="text-[15px] leading-[1.6] text-[#444444] mt-[2px]">
                    {footerContent.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Follow Us Section */}
            <h3 className="text-[18px] font-bold text-[#333333] uppercase mt-[36px] mb-[16px]">
              FOLLOW US
            </h3>
            <div className="flex items-center gap-[16px]">
              {/* Facebook */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Facebook"
                className="w-[40px] h-[40px] rounded-[4px] bg-[#F5F5F5] border border-[#E0E0E0] text-[#333333] hover:text-[#0093DD] hover:border-[#0093DD] flex items-center justify-center transition-colors"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="Instagram"
                className="w-[40px] h-[40px] rounded-[4px] bg-[#F5F5F5] border border-[#E0E0E0] text-[#333333] hover:text-[#0093DD] hover:border-[#0093DD] flex items-center justify-center transition-colors"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label="YouTube"
                className="w-[40px] h-[40px] rounded-[4px] bg-[#F5F5F5] border border-[#E0E0E0] text-[#333333] hover:text-[#0093DD] hover:border-[#0093DD] flex items-center justify-center transition-colors"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Column — Get In Touch Form (~66%) */}
          <div className="w-full min-[850px]:w-[66%] flex flex-col items-start">
            <h2 className="text-[22px] font-bold text-[#333333] uppercase mb-[20px]">
              GET IN TOUCH
            </h2>

            <form onSubmit={handleSubmit} className="w-full flex flex-col text-left">
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mb-[16px] w-full">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input-field"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input-field"
                />
              </div>

              {/* Row 2: Subject */}
              <div className="mb-[16px] w-full">
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="form-input-field"
                />
              </div>

              {/* Row 3: Message Textarea */}
              <div className="mb-[20px] w-full">
                <textarea
                  placeholder="Your Message"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-input-field min-h-[150px] resize-y"
                />
              </div>

              {/* CAPTCHA Placeholder Box */}
              <div className="w-[260px] h-[60px] bg-white border border-[#D5D5D5] rounded-[4px] flex items-center justify-center text-[13px] font-semibold text-[#666666] uppercase mb-[20px] select-none">
                PLACEHOLDER: CAPTCHA
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="bg-[#0093DD] hover:bg-[#0C71C3] text-white text-[15px] font-semibold py-[12px] px-[22px] rounded-[4px] transition-colors cursor-pointer border-none outline-none uppercase"
                >
                  SEND MESSAGE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
