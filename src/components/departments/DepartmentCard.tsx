import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor } from 'lucide-react';
import CmsImage from '../ui/CmsImage';

interface DepartmentCardProps {
  title: string;
  href?: string;
  subtitle?: string;
  imageLabel?: string;
  imageUrl?: string;
  image?: string;
  variant?: 'standard' | 'banner' | 'program' | 'faculty' | 'profile';
  bgClass?: string;
  role?: string;
}

export default function DepartmentCard({
  title,
  href,
  subtitle,
  imageLabel = 'DEPARTMENT IMAGE',
  imageUrl,
  image,
  variant = 'standard',
  bgClass = 'bg-[#0C71C3]',
  role,
}: DepartmentCardProps) {
  const isExternal = href ? href.startsWith('http') : false;
  const isDummyLink = href === '#';
  const displayImage = imageUrl || image;

  const handleClick = (e: React.MouseEvent) => {
    if (isDummyLink) {
      e.preventDefault();
    }
  };

  const wrapWithLink = (content: React.ReactNode) => {
    if (!href) {
      return content;
    }
    if (isDummyLink) {
      return <div onClick={handleClick} className="h-full">{content}</div>;
    }
    if (isExternal) {
      return <a href={href} className="h-full">{content}</a>;
    }
    return <Link to={href} className="h-full">{content}</Link>;
  };

  if (variant === 'banner') {
    return wrapWithLink(
      <div className={`w-full ${bgClass} text-white p-[24px] min-[700px]:p-[32px] rounded-[4px] flex items-center justify-between shadow-sm card-hover-lift cursor-pointer`}>
        <div className="flex items-center gap-[16px]">
          <Monitor className="w-[32px] h-[32px] text-white flex-shrink-0" />
          <h3 className="text-[17px] min-[700px]:text-[20px] font-bold text-white uppercase tracking-[0.3px]">
            {title}
          </h3>
        </div>
        <span className="text-[13px] font-semibold tracking-wider text-white/80 uppercase">
          EXPLORE →
        </span>
      </div>
    );
  }

  if (variant === 'program') {
    return wrapWithLink(
      <div className="w-full h-[160px] bg-white border border-[#EAEAEA] rounded-[8px] overflow-hidden flex items-center justify-center text-center shadow-xs card-hover-lift">
        <div className="w-full h-full bg-white flex items-center justify-center overflow-hidden">
          <CmsImage
            src={displayImage}
            alt={title}
            fallbackLabel={imageLabel}
            fit="cover"
          />
        </div>
      </div>
    );
  }

  if (variant === 'faculty') {
    return wrapWithLink(
      <div className="w-full flex flex-col items-center text-center group cursor-pointer h-full">
        {/* 1. Bordered Photo Box ONLY */}
        <div className="w-full aspect-[13/15] bg-white border border-[#E5E7EB] rounded-[8px] overflow-hidden shadow-xs card-hover-lift person-photo-glow flex items-center justify-center flex-shrink-0 mb-[12px]">
          <CmsImage
            src={displayImage}
            alt={title}
            fallbackLabel={imageLabel}
            fit="contain"
          />
        </div>

        {/* 2. Text below photo box - floating freely with no border/background box */}
        {/* 2. Text below photo box - floating freely with no border/background box */}
        <div className="w-full text-center px-1" style={{ marginTop: '16px' }}>
          <h4 
            className="group-hover:text-[#0093DD] transition-colors text-center"
            style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: '#002855', 
              letterSpacing: '0.3px',
              lineHeight: '1.2',
              margin: '0 0 6px 0' 
            }}
          >
            {title}
          </h4>
          <p 
            className="text-center"
            style={{ 
              fontSize: '15px', 
              fontWeight: 500, 
              color: '#4B5563', 
              lineHeight: '1.3',
              margin: 0 
            }}
          >
            {role || subtitle || 'Faculty Member'}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'profile') {
    return wrapWithLink(
      <div className="w-full bg-white border border-[#EAEAEA] rounded-[4px] p-[20px] flex flex-col items-center text-center shadow-sm card-hover-lift">
        <div className="w-[140px] aspect-[13/15] rounded-[4px] overflow-hidden flex items-center justify-center mb-[14px] bg-white border border-[#E5E7EB] person-photo-glow">
          <CmsImage
            src={displayImage}
            alt={title}
            fallbackLabel={imageLabel}
            fit="contain"
          />
        </div>
        <h4 className="text-[15px] font-bold text-[#333333]">
          {title}
        </h4>
        <p className="text-[13px] text-[#666666] mt-[2px]">
          {role || subtitle}
        </p>
      </div>
    );
  }

  // Standard Card
  return wrapWithLink(
    <div className="w-full bg-white border border-[#EAEAEA] rounded-[4px] overflow-hidden flex flex-col items-center text-center shadow-sm card-hover-lift cursor-pointer h-full">
      <div className={`w-full aspect-[4/3] overflow-hidden flex items-center justify-center${displayImage ? '' : ' bg-white'}`}>
        <CmsImage
          src={displayImage}
          alt={title}
          fallbackLabel={imageLabel}
          fit="cover"
        />
      </div>
      <div className="p-[20px] flex items-center justify-center w-full flex-1">
        <h3 className="text-[16px] font-bold text-[#333333] leading-snug">
          {title}
        </h3>
      </div>
    </div>
  );
}
