import React from 'react';
import CmsImage from './CmsImage';

interface DecorativeProfileImageFrameProps {
  src?: string;
  alt: string;
  badgeSrc?: string;
  showBadge?: boolean;
  className?: string;
  fallbackLabel?: string;
}

export default function DecorativeProfileImageFrame({
  src,
  alt,
  showBadge = false,
  className = '',
  fallbackLabel = 'PHOTO',
}: DecorativeProfileImageFrameProps) {
  return (
    <div className={`relative w-full max-w-[320px] h-[320px] mx-auto md:mx-0 ${className}`}>
      {/* Navy architectural strips — top + downward left strip (#0B2E59) */}
      <div className="absolute top-0 left-0 w-[255px] h-[50px] bg-[#0B2E59] z-0" />
      <div className="absolute top-0 left-0 w-[50px] h-[250px] bg-[#0B2E59] z-0" />

      {/* Main profile image */}
      <div className="absolute top-[28px] left-[28px] w-[280px] h-[280px] bg-[#F7F7F7] border border-[#E5E7EB] overflow-hidden z-10">
        <CmsImage
          src={src}
          alt={alt}
          fallbackLabel={fallbackLabel}
          fit="cover"
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Optional Circular Badge Image — Always shows FAST Round Logo */}
      {showBadge && (
        <div className="absolute top-[7px] left-[7px] w-[80px] h-[80px] rounded-full bg-white border-[4px] border-white shadow-md overflow-hidden z-20 flex items-center justify-center p-[2px]">
          <img
            src="/round-logo.png"
            alt="FAST NUCES Logo"
            className="w-full h-full object-contain scale-[1.5]"
          />
        </div>
      )}
    </div>
  );
}
