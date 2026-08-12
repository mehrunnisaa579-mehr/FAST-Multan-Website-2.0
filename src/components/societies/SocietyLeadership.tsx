import React from 'react';
import type { LeadershipMember } from '../../data/societies';
import CmsImage from '../ui/CmsImage';

interface ExtendedLeadershipMember extends LeadershipMember {
  photoUrl?: string;
}

interface SocietyLeadershipProps {
  leadership: ExtendedLeadershipMember[];
}

export default function SocietyLeadership({ leadership }: SocietyLeadershipProps) {
  const topRow = leadership.slice(0, 2);
  const bottomRow = leadership.slice(2, 4);

  const renderCard = (member: ExtendedLeadershipMember, idx: number) => {
    return (
      <div key={idx} className="society-profile-card w-full max-w-[250px] mx-auto text-center flex flex-col items-center card-hover-lift rounded-[8px] p-[12px]">
        {/* Portrait Image or Placeholder */}
        <div className={
          member.photoUrl
            ? 'w-full h-[220px] rounded-[4px] overflow-hidden flex items-center justify-center mb-[16px] bg-[#F3F4F6] border border-[#E5E7EB]'
            : 'society-portrait-placeholder'
        }>
          <CmsImage
            src={member.photoUrl}
            alt={member.name}
            fallbackLabel={member.photoPlaceholder || 'LEADERSHIP PHOTO'}
            fit="cover"
          />
        </div>

        {/* Name */}
        <h3 className="text-[17px] font-semibold text-[#333333] leading-snug text-center w-full">
          {member.name}
        </h3>

        {/* Role */}
        <p className="text-[14px] font-semibold text-[#0C71C3] mt-[4px] text-center w-full">
          {member.role}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[850px] mx-auto my-[48px] sm:my-[56px] flex flex-col items-center">
      {/* Section Heading */}
      <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0C71C3] uppercase text-center mb-[36px] tracking-wide">
        Leadership
      </h2>

      {/* 2 + 2 Centered Rows Layout */}
      <div className="flex flex-col items-center gap-[32px] w-full max-w-[580px] mx-auto">
        {/* Top Row: Mentor & President */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[28px] sm:gap-[36px] w-full justify-items-center">
          {topRow.map((member, idx) => renderCard(member, idx))}
        </div>

        {/* Bottom Row: Vice President 1 & Vice President 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[28px] sm:gap-[36px] w-full justify-items-center">
          {bottomRow.map((member, idx) => renderCard(member, idx + 2))}
        </div>
      </div>
    </div>
  );
}
