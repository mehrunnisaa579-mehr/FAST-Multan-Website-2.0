import { useEffect, useState } from 'react';
import { homepageContent } from '../../data/homepage';
import { cmsService } from '../../services/cmsService';

export default function DirectorMessage() {
  const [directorName, setDirectorName] = useState(homepageContent.directorMessage.name);
  const [directorTitle, setDirectorTitle] = useState(homepageContent.directorMessage.title);
  const [directorMessage, setDirectorMessage] = useState(homepageContent.directorMessage.message);
  const [directorPhoto, setDirectorPhoto] = useState(homepageContent.directorMessage.photo || '');

  useEffect(() => {
    const fetchDirectorData = async () => {
      const data = await cmsService.getSetting<any>('homepage_full_content', null);
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
    <section className="w-full bg-white py-[60px] min-[700px]:py-[80px]">
      <div className="w-full max-w-[1040px] mx-auto px-[20px] sm:px-[24px]">
        {/* Heading */}
        <h2 className="text-[26px] min-[700px]:text-[30px] font-bold text-[#0C71C3] uppercase mb-[36px] text-center">
          Director's Message
        </h2>

        {/* Centered Content Container */}
        <div className="grid grid-cols-1 min-[700px]:grid-cols-[290px_1fr] gap-[34px] min-[900px]:gap-[40px] items-start">
          {/* Left Column: Photo Card */}
          <div className="flex flex-col items-center justify-self-center min-[700px]:justify-self-start w-full max-w-[290px] card-hover-lift rounded-[8px] p-[12px]">
            <div className={`w-[210px] h-[260px] min-[700px]:w-[240px] min-[700px]:h-[295px] rounded-[4px] mb-[14px] shadow-sm overflow-hidden border border-[#E5E7EB] flex items-center justify-center${directorPhoto ? '' : ' bg-white p-[16px] text-center'}`}>
              {directorPhoto ? (
                <img src={directorPhoto} alt={directorName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase">
                  DIRECTOR PHOTO
                </span>
              )}
            </div>
            <h3 className="text-[17px] font-bold text-[#333333] text-center">{directorName}</h3>
            <p className="text-[13px] font-medium text-[#666666] text-center mt-[2px]">{directorTitle}</p>
          </div>

          {/* Right Column: Message Paragraphs */}
          <div className="flex-1 text-[15px] min-[700px]:text-[16px] leading-[1.75] text-[#444444] space-y-[18px] text-left pt-[4px]">
            {messageParagraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
