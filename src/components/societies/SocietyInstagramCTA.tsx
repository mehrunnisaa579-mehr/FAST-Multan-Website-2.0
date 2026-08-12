import React from 'react';

interface SocietyInstagramCTAProps {
  instagramUrl: string;
}

export default function SocietyInstagramCTA({ instagramUrl }: SocietyInstagramCTAProps) {
  return (
    <div className="w-full max-w-[850px] mx-auto text-center mt-[56px] sm:mt-[64px] pt-[40px] border-t border-[#EAEAEA] flex flex-col items-center">
      <p className="text-[16px] sm:text-[18px] text-[#444444] mb-[24px] font-medium leading-relaxed max-w-[650px] mx-auto text-center">
        Stay connected with us for the latest society updates, activities, and announcements.
      </p>

      <div className="flex justify-center">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#0093DD] hover:bg-[#0C71C3] text-white text-[15px] sm:text-[16px] font-semibold py-[12px] px-[28px] rounded-[4px] transition-colors outline-none border-none cursor-pointer no-underline shadow-xs"
        >
          Visit Instagram
        </a>
      </div>
    </div>
  );
}
