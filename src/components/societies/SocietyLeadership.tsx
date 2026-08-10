import React from 'react';
import type { LeadershipMember } from '../../data/societies';

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
    const hasPhoto = !!member.photoUrl;

    return (
      <div key={idx} className="society-profile-card w-full max-w-[250px]">
        {/* Portrait Image or Placeholder */}
        <div className="society-portrait-placeholder overflow-hidden flex items-center justify-center">
          {hasPhoto ? (
            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover rounded-[4px]" />
          ) : (
            <span className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase text-center">
              {member.photoPlaceholder}
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-[17px] font-semibold text-[#333333] leading-snug">
          {member.name}
        </h3>

        {/* Role */}
        <p className="text-[14px] font-semibold text-[#0C71C3] mt-[4px]">
          {member.role}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full my-[45px] flex flex-col items-center">
      {/* Section Heading */}
      <h2 className="text-[24px] font-bold text-[#0C71C3] uppercase text-center mb-[32px]">
        Leadership
      </h2>

      {/* 2 + 2 Centered Rows Layout */}
      <div className="flex flex-col items-center gap-[30px] w-full max-w-[560px] mx-auto">
        {/* Top Row: Mentor & President */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[30px] w-full justify-items-center">
          {topRow.map((member, idx) => renderCard(member, idx))}
        </div>

        {/* Bottom Row: Vice President 1 & Vice President 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[30px] w-full justify-items-center">
          {bottomRow.map((member, idx) => renderCard(member, idx + 2))}
        </div>
      </div>
    </div>
  );
}
