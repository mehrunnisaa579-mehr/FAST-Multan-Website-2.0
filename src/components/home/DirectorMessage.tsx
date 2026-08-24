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
        {/* Desktop Heading (Matches HOD Message layout) */}
        <div className="hidden md:grid grid-cols-[320px_minmax(0,1fr)] gap-[30px] lg:gap-[38px] mb-[40px]">
          <div />
          <h2 className="m-0 text-[40px] lg:text-[46px] leading-[1.1] font-bold text-[#0C71C3] uppercase tracking-[-1px] text-left relative -top-[30px]">
            Director's Message
          </h2>
        </div>

        {/* Mobile Heading (Matches HOD Message mobile layout) */}
        <h2 className="md:hidden text-[32px] sm:text-[38px] leading-[1.1] font-bold text-[#0C71C3] uppercase tracking-tight text-center mb-[34px]">
          Director's Message
        </h2>

        {/* Photo + Message Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] gap-[30px] md:gap-[38px] lg:gap-[40px] items-start">
          {/* LEFT — DIRECTOR PHOTO & NAME */}
          <div className="w-full max-w-[315px] mx-auto md:mx-0">
            <Link to="/people/director" className="no-underline block group cursor-pointer w-full text-center">
              <DecorativeProfileImageFrame
                src={directorPhoto}
                alt={directorName}
                showBadge={true}
                fallbackLabel="DIRECTOR PHOTO"
                disableHoverEffect={true}
              />

              <h3 className="m-0 mt-[6px] text-[18px] sm:text-[19px] leading-[1.3] font-bold text-black group-hover:text-[#0093DD] transition-colors text-center">
                {directorName}
              </h3>
              {directorTitle && (
                <p className="text-[12px] font-semibold text-[#0093DD] text-center mt-[2px]">
                  {directorTitle}
                </p>
              )}
            </Link>
          </div>

          {/* RIGHT — DIRECTOR MESSAGE PARAGRAPHS */}
          <div className="w-full text-[14px] lg:text-[14.5px] leading-[1.7] text-[#26384A] text-left">
            {messageParagraphs.map((para, idx) => (
              <p key={idx} className="m-0 text-justify mb-[12px] last:mb-0">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}