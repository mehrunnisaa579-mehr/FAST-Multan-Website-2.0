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
  // Render ONLY 3 roles: Mentor, Co-Mentor, President
  const displayMembers = leadership.slice(0, 3);

  return (
    <div className="w-full max-w-[950px] mx-auto flex flex-col items-center">
      {/* Section Heading */}
      <h2 className="text-[22px] sm:text-[26px] font-bold text-[#0C71C3] uppercase tracking-wider text-center mb-[36px]">
        OUR TEAM
      </h2>

      {/* Balanced Desktop Row (Flex-wrap centered for 2 or 3 cards cleanly) */}
      <div className="flex flex-wrap justify-center gap-[28px] sm:gap-[36px] w-full">
        {displayMembers.map((member, idx) => (
          <div
            key={idx}
            className="w-full max-w-[260px] text-center flex flex-col items-center bg-white border border-[#E5E7EB] rounded-[10px] p-[18px] transition-all hover:border-[#0093DD] hover:shadow-xs"
          >
            {/* Portrait Image or Placeholder */}
            <div className="w-full h-[220px] rounded-[6px] overflow-hidden flex items-center justify-center mb-[14px] bg-[#F8FAFC] border border-[#E5E7EB] person-photo-glow">
              <CmsImage
                src={member.photoUrl}
                alt={member.name}
                fallbackLabel={member.photoPlaceholder || `${member.role.toUpperCase()} PHOTO`}
                fit="cover"
              />
            </div>

            {/* Name */}
            <h3 className="text-[16px] font-bold text-[#1F2937] leading-snug text-center w-full m-0">
              {member.name}
            </h3>

            {/* Role */}
            <p className="text-[13.5px] font-semibold text-[#0093DD] mt-[4px] text-center w-full m-0">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
