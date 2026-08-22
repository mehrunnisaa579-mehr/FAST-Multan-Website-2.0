import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { homepageContent } from '../../data/homepage';
import { cmsService } from '../../services/cmsService';
import DecorativeProfileImageFrame from '../ui/DecorativeProfileImageFrame';

export default function DirectorMessage() {
  const [directorName, setDirectorName] = useState(
    homepageContent.directorMessage.name
  );

  const [directorTitle, setDirectorTitle] = useState(
    homepageContent.directorMessage.title
  );

  const [directorMessage, setDirectorMessage] = useState(
    homepageContent.directorMessage.message
  );

  const [directorPhoto, setDirectorPhoto] = useState(
    homepageContent.directorMessage.photo || ''
  );

  useEffect(() => {
    const fetchDirectorData = async () => {
      const data = await cmsService.getSetting<any>(
        'homepage_full_content',
        null
      );

      if (data) {
        if (data.directorName) setDirectorName(data.directorName);
        if (data.directorTitle) setDirectorTitle(data.directorTitle);
        if (data.directorMessage) setDirectorMessage(data.directorMessage);
        if (data.directorPhoto) setDirectorPhoto(data.directorPhoto);
      }
    };

    fetchDirectorData();
  }, []);

  const messageParagraphs = directorMessage
    ? directorMessage.split('\n\n').filter(Boolean)
    : [homepageContent.directorMessage.message];

  return (
    <section className="w-full bg-white py-[60px] sm:py-[76px]">
      {/* ── Balanced Container (max-w-[1240px], clean margins) ── */}
      <div className="w-full max-w-[1240px] mx-auto px-[20px] sm:px-[36px] md:px-[48px]">

        {/* ── Two-Column Layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-[290px_1fr] lg:grid-cols-[320px_1fr] gap-[32px] md:gap-[40px] lg:gap-[48px] items-start w-full">

          {/* ════ LEFT COLUMN — PHOTO & NAME (CLICKABLE TO PROFILE) ═════════ */}
          <div className="w-full max-w-[320px] mx-auto md:mx-0 flex flex-col items-center pt-0 md:pt-[45px]">
            <Link to="/people/director" className="no-underline block group cursor-pointer w-full text-center">
              {/* Decorative Architectural Photo Frame */}
              <DecorativeProfileImageFrame
                src={directorPhoto}
                alt={directorName}
                showBadge={false}
                fallbackLabel="DIRECTOR PHOTO"
                className="mb-[10px]"
              />

              {/* Director Name */}
              <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors text-center leading-snug">
                {directorName}
              </h3>
              {/* Subtle Designation */}
              {directorTitle && (
                <p className="text-[12px] font-semibold text-[#0093DD] text-center mt-[2px]">
                  {directorTitle}
                </p>
              )}
            </Link>
          </div>

          {/* ════ RIGHT COLUMN — HEADING + PARAGRAPH ═══════════════════════ */}
          <div className="w-full flex flex-col items-start pt-0 gap-[40px]">

            {/* Heading */}
            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-bold text-[#0C71C3] uppercase tracking-tight text-left leading-tight">
              Director's Message
            </h2>

            {/* Paragraph Text */}
            <div className="w-full text-[14px] leading-[1.7] text-[#4B5563] space-y-[16px] text-justify">
              {messageParagraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="text-justify [text-justify:inter-word]"
                >
                  {para}
                </p>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}