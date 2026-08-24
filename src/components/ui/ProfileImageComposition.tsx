import React from 'react';
import CmsImage from './CmsImage';

interface ProfileImageCompositionProps {
  mainImage?: string;
  badgeImage?: string;
  alt?: string;
  className?: string;
}

export default function ProfileImageComposition({
  mainImage,
  badgeImage,
  alt = 'Profile Photo',
  className = '',
}: ProfileImageCompositionProps) {
  const displayBadge = badgeImage || mainImage;

  return (
    <div className={`relative inline-block text-left pt-[14px] pl-[14px] ${className}`}>
      {/* ── 1. BOLD ARCHITECTURAL NAVY TOP HORIZONTAL BAR (L-SHAPE TOP) ── */}
      <div
        className="absolute top-[18px] left-[4px] h-[44px] sm:h-[50px] bg-[#0B326B] rounded-r-md z-0 shadow-xs"
        style={{ width: '75%' }}
      />

      {/* ── 2. BOLD ARCHITECTURAL NAVY LEFT VERTICAL BAR (L-SHAPE LEFT) ── */}
      <div
        className="absolute top-[18px] left-[4px] w-[44px] sm:w-[50px] bg-[#0B326B] rounded-b-md z-0 shadow-xs"
        style={{ height: '60%' }}
      />

      {/* ── 3. CIRCULAR LOGO / BADGE (UNTOUCHED POSITION & DIMENSIONS) ── */}
      <div className="absolute top-[0px] left-[0px] z-20 w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full border-[3px] border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
        <CmsImage
          src={displayBadge}
          alt={`${alt} Badge`}
          fallbackLabel="LOGO"
          fit="cover"
        />
      </div>

      {/* ── 4. MAIN RECTANGULAR PROFILE IMAGE AREA (UNTOUCHED POSITION & DIMENSIONS) ── */}
      <div className="relative z-10 ml-[22px] sm:ml-[26px] mt-[22px] sm:mt-[26px] w-[200px] sm:w-[240px] rounded-[6px] border-[3px] border-white bg-white shadow-md overflow-hidden flex flex-col items-center justify-center person-photo-glow">
        <CmsImage
          src={mainImage}
          alt={alt}
          fallbackLabel="PROFILE PHOTO"
          fit="cover"
          className="w-full h-auto max-h-[310px] object-cover block"
          containerClassName="w-full aspect-[4/5] min-h-[220px]"
        />
      </div>
    </div>
  );
}
