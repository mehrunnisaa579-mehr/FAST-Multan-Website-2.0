import React from 'react';

interface SocietyInstagramCTAProps {
  instagramUrl: string;
}

export default function SocietyInstagramCTA({ instagramUrl }: SocietyInstagramCTAProps) {
  return (
    <div className="w-full text-center mt-[55px] pt-[35px] border-t border-[#EAEAEA]">
      <p className="text-[17px] sm:text-[18px] text-[#444444] mb-[20px] font-medium leading-relaxed max-w-[700px] mx-auto">
        Stay connected with us for the latest society updates, activities, and announcements.
      </p>

      <div>
        <a
          href={instagramUrl}
          className="inline-block bg-[#0093DD] hover:bg-[#0C71C3] text-white text-[16px] font-semibold py-[12px] px-[24px] rounded-[4px] transition-colors outline-none border-none cursor-pointer"
        >
          Visit Instagram
        </a>
      </div>
    </div>
  );
}
