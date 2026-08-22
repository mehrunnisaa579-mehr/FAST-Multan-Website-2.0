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
  href = '#',
  subtitle,
  imageLabel = 'DEPARTMENT IMAGE',
  imageUrl,
  image,
  variant = 'standard',
  bgClass = 'bg-[#0C71C3]',
  role,
}: DepartmentCardProps) {
  const isExternal = href.startsWith('http');
  const isDummyLink = href === '#';
  const displayImage = imageUrl || image;

  const handleClick = (e: React.MouseEvent) => {
    if (isDummyLink) {
      e.preventDefault();
    }
  };

  if (variant === 'banner') {
    const cardContent = (
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

    if (isDummyLink) {
      return <div onClick={handleClick}>{cardContent}</div>;
    }
    if (isExternal) {
      return <a href={href}>{cardContent}</a>;
    }
    return <Link to={href}>{cardContent}</Link>;
  }

  if (variant === 'program') {
    return (
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
    const cardContent = (
      <div className="w-full flex flex-col items-center text-center group cursor-pointer h-full">
        {/* 1. Bordered Photo Box ONLY */}
        <div className="w-full aspect-square bg-[#F3F4F6] border border-[#E5E7EB] rounded-[8px] overflow-hidden shadow-xs card-hover-lift flex items-center justify-center flex-shrink-0 mb-[12px]">
          <CmsImage
            src={displayImage}
            alt={title}
            fallbackLabel={imageLabel}
            fit="cover"
          />
        </div>

        {/* 2. Text below photo box - floating freely with no border/background box */}
        <div className="w-full text-center px-1">
          <h4 className="text-[15px] min-[700px]:text-[16px] font-bold text-[#1F2937] leading-snug group-hover:text-[#0093DD] transition-colors m-0 text-center">
            {title}
          </h4>
          <p className="text-[12.5px] min-[700px]:text-[13px] font-medium text-[#6B7280] leading-snug mt-[4px] m-0 text-center">
            {role || subtitle || 'Faculty Member'}
          </p>
        </div>
      </div>
    );

    if (isDummyLink) {
      return <div onClick={handleClick} className="h-full">{cardContent}</div>;
    }
    if (isExternal) {
      return <a href={href} className="h-full">{cardContent}</a>;
    }
    return <Link to={href} className="h-full">{cardContent}</Link>;
  }

  if (variant === 'profile') {
    return (
      <div className="w-full bg-white border border-[#EAEAEA] rounded-[4px] p-[20px] flex flex-col items-center text-center shadow-sm card-hover-lift">
        <div className="w-[140px] h-[175px] rounded-[4px] overflow-hidden flex items-center justify-center mb-[14px] bg-white border border-[#E5E7EB]">
          <CmsImage
            src={displayImage}
            alt={title}
            fallbackLabel={imageLabel}
            fit="cover"
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
  const standardContent = (
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

  if (isDummyLink) {
    return <div onClick={handleClick} className="h-full">{standardContent}</div>;
  }
  if (isExternal) {
    return <a href={href} className="h-full">{standardContent}</a>;
  }
  return <Link to={href} className="h-full">{standardContent}</Link>;
}
