import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { homepageContent } from '../../data/homepage';
import DecorativeProfileImageFrame from '../ui/DecorativeProfileImageFrame';

interface DirectorMessageProps {
  data?: any;
}

export default function DirectorMessage({ data }: DirectorMessageProps) {
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
    if (data) {
      if (data.directorName) setDirectorName(data.directorName);
      if (data.directorTitle) setDirectorTitle(data.directorTitle);
      if (data.directorMessage) setDirectorMessage(data.directorMessage);
      if (data.directorPhoto) setDirectorPhoto(data.directorPhoto);
    }
  }, [data]);

  const messageParagraphs = directorMessage
    ? directorMessage.split('\n\n').filter(Boolean)
    : [homepageContent.directorMessage.message];

  return (
    <section className="w-full bg-white py-[60px] sm:py-[76px]">
      {/* ── Balanced Container (max-w-[1300px], clean centered margins) ── */}
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[32px] md:px-[40px]">

        {/* ── Two-Column Centered Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-[32px] lg:gap-[48px] items-center justify-center max-w-[1240px] mx-auto w-full">

          {/* ════ LEFT COLUMN — PHOTO & NAME (CLICKABLE TO PROFILE) ═════════ */}
          <div className="w-full max-w-[320px] mx-auto flex flex-col items-center pt-0">
            <Link to="/people/director" className="no-underline block group cursor-pointer w-full text-center">
              {/* Decorative Architectural Photo Frame */}
              <DecorativeProfileImageFrame
                src={directorPhoto}
                alt={directorName}
                showBadge={true}
                fallbackLabel="DIRECTOR PHOTO"
                className="mb-[10px] mx-auto"
                disableHoverEffect={true}
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
          <div className="w-full flex flex-col items-center lg:items-start pt-0 gap-[24px] sm:gap-[32px] max-w-[850px] mx-auto lg:mx-0">

            <h2 className="text-[32px] sm:text-[38px] md:text-[40px] lg:text-[46px] leading-[1.1] font-bold text-[#0C71C3] uppercase tracking-tight md:tracking-[-1px] text-center lg:text-left w-full">
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