import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor } from 'lucide-react';

interface DepartmentCardProps {
  title: string;
  href?: string;
  subtitle?: string;
  imageLabel?: string;
  variant?: 'standard' | 'banner' | 'program' | 'faculty' | 'profile';
  bgClass?: string;
  role?: string;
}

export default function DepartmentCard({
  title,
  href = '#',
  subtitle,
  imageLabel = 'PLACEHOLDER: DEPARTMENT IMAGE',
  variant = 'standard',
  bgClass = 'bg-[#0C71C3]',
  role,
}: DepartmentCardProps) {
  const isExternal = href.startsWith('http');
  const isDummyLink = href === '#';

  const handleClick = (e: React.MouseEvent) => {
    if (isDummyLink) {
      e.preventDefault();
    }
  };

  if (variant === 'banner') {
    const cardContent = (
      <div className={`w-full ${bgClass} text-white p-[24px] min-[700px]:p-[32px] rounded-[4px] flex items-center justify-between shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer`}>
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
      <div className="w-full bg-white border border-[#EAEAEA] rounded-[4px] overflow-hidden flex flex-col items-center text-center shadow-sm">
        <div className="w-full aspect-[4/3] bg-[#D9D9D9] flex items-center justify-center p-[16px]">
          <span className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase">
            {imageLabel}
          </span>
        </div>
        <div className="p-[20px] flex flex-col items-center justify-center w-full">
          <h4 className="text-[18px] font-bold text-[#333333] uppercase">
            {title}
          </h4>
          {subtitle && (
            <p className="text-[13px] text-[#666666] mt-[4px]">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'faculty') {
    return (
      <div className="w-full bg-white border border-[#EAEAEA] rounded-[4px] overflow-hidden flex flex-col items-center text-center shadow-sm">
        <div className="w-full aspect-[3/4] max-h-[220px] bg-[#D9D9D9] flex items-center justify-center p-[16px]">
          <span className="text-[11px] font-semibold text-[#666666] tracking-wide uppercase text-center">
            {imageLabel}
          </span>
        </div>
        <div className="p-[16px] flex flex-col items-center w-full flex-1 justify-center">
          <h4 className="text-[15px] font-bold text-[#333333]">
            {title}
          </h4>
          <p className="text-[13px] text-[#666666] mt-[2px]">
            {role || subtitle || 'Faculty Member'}
          </p>
        </div>
        <div className="w-full bg-[#0093DD] text-white py-[8px] text-[12px] font-semibold uppercase tracking-wider">
          FAST FACULTY
        </div>
      </div>
    );
  }

  if (variant === 'profile') {
    return (
      <div className="w-full bg-white border border-[#EAEAEA] rounded-[4px] p-[20px] flex flex-col items-center text-center shadow-sm">
        <div className="w-[140px] h-[175px] bg-[#D9D9D9] rounded-[4px] flex items-center justify-center p-[12px] mb-[14px]">
          <span className="text-[10px] font-semibold text-[#666666] tracking-wide uppercase text-center">
            {imageLabel}
          </span>
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
    <div className="w-full bg-white border border-[#EAEAEA] rounded-[4px] overflow-hidden flex flex-col items-center text-center shadow-sm transition-transform hover:-translate-y-0.5 cursor-pointer h-full">
      <div className="w-full aspect-[4/3] bg-[#D9D9D9] flex items-center justify-center p-[16px]">
        <span className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase text-center">
          {imageLabel}
        </span>
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
