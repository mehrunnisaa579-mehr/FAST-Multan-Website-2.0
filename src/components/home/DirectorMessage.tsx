import { homepageContent } from '../../data/homepage';

export default function DirectorMessage() {
  const { photo, name, title, message } = homepageContent.directorMessage;
  const hasPhoto = !!photo;

  return (
    <section className="py-[60px] w-full bg-white select-none">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        {/* Section Heading */}
        <h2 className="text-[28px] font-bold text-[#16498C] text-center mb-[40px]">
          Director's Message
        </h2>

        {/* Column Layout */}
        <div className="flex flex-col md:flex-row gap-[40px] items-center md:items-start">
          {/* Left Column: Photo / Placeholder */}
          <div className="flex-shrink-0">
            {hasPhoto ? (
              <img
                src={photo}
                alt={name}
                className="w-[200px] h-[240px] md:w-[280px] md:h-[320px] object-cover rounded-[6px] shadow-sm"
              />
            ) : (
              <div className="w-[200px] h-[240px] md:w-[280px] md:h-[320px] bg-[#D9D9D9] rounded-[6px] flex items-center justify-center">
                <span className="text-[14px] font-semibold text-[#888888] tracking-wide">
                  PHOTO PLACEHOLDER
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Title and Message */}
          <div className="flex-1 text-left w-full">
            <h3 className="text-[18px] font-bold text-[#333333] leading-snug">{name}</h3>
            <p className="text-[14px] text-[#666666] mt-1 mb-[16px] font-medium">{title}</p>
            <p className="text-[15px] leading-[1.7] text-[#444444] whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
