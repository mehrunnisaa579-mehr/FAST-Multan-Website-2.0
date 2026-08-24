import React, { useEffect, useState } from 'react';
import AboutPageHero from '../components/about/AboutPageHero';
import { cmsService } from '../services/cmsService';
import {
  Code,
  Sparkles,
  Palette,
  Terminal,
  Cpu,
  Globe,
  Database,
  Shield,
  Zap,
  Award,
  Monitor,
  Layout,
  User,
} from 'lucide-react';
import {
  defaultWebTeamMembers,
  type WebTeamMember,
  type WebTeamSettings,
} from '../admin/pages/AdminWebTeamManager';

const ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  Palette,
  Terminal,
  Cpu,
  Globe,
  Database,
  Shield,
  Zap,
  Award,
  Monitor,
  Layout,
};

export default function WebTeamPage() {
  const [pageTitle, setPageTitle] = useState('DevQuad — Web Development Team');
  const [pageSubtitle, setPageSubtitle] = useState(
    'Meet the talented developers, designers, and engineers behind the FAST-NUCES Multan Campus digital experience.'
  );
  const [heroImage, setHeroImage] = useState('');
  const [teamMembers, setTeamMembers] = useState<WebTeamMember[]>(defaultWebTeamMembers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebTeamData = async () => {
      setLoading(true);
      const data = await cmsService.getSetting<WebTeamSettings>('webteam_content', null as any);
      if (data) {
        if (data.pageTitle) setPageTitle(data.pageTitle);
        if (data.pageSubtitle) setPageSubtitle(data.pageSubtitle);
        if (data.heroImageUrl) setHeroImage(data.heroImageUrl);
        if (Array.isArray(data.teamMembers) && data.teamMembers.length > 0) {
          const visible = data.teamMembers.filter((m) => m.is_visible !== false);
          if (visible.length > 0) setTeamMembers(visible);
        }
      }
      setLoading(false);
    };

    fetchWebTeamData();
  }, []);

  return (
    <div className="w-full bg-white select-none text-left min-h-[70vh]">
      {/* Hero Banner Header */}
      <AboutPageHero title={pageTitle} backgroundImage={heroImage} />

      {/* Main Web Team Container */}
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px] py-[50px] sm:py-[70px] min-[1100px]:pb-[90px]">
        {/* Intro Subtitle / Overview Heading */}
        <div className="text-center max-w-[850px] mx-auto mb-[40px] sm:mb-[60px] space-y-3">
          <h2 className="text-[24px] sm:text-[32px] font-bold text-[#0C71C3] uppercase tracking-tight">
            OUR TEAM
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[#4B5563] leading-relaxed font-normal">
            {pageSubtitle}
          </p>
        </div>

        {/* 6 Arched Pill Cards Grid (Staggered Skylined Heights) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-5 items-stretch justify-center">
          {teamMembers.map((member, idx) => {
            const IconComponent = ICON_MAP[member.iconName] || Code;
            // Alternating vertical offset for alternating arched skyline pattern matching reference
            const isStaggered = idx % 2 === 1;

            return (
              <div
                key={member.id || idx}
                className={`w-full flex flex-col rounded-t-[120px] rounded-b-[24px] overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[#E2E8F0] group ${
                  isStaggered ? 'lg:translate-y-5' : 'lg:translate-y-0'
                }`}
              >
                {/* 1. Portrait Photo Region (Fully Rounded Pill Top - Absolute Inset-0 Stretches Image 100% of Flex-1 Height) */}
                <div className="relative w-full min-h-[300px] sm:min-h-[340px] flex-1 bg-[#F1F5F9] rounded-t-[120px] overflow-hidden">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                      className="absolute inset-0 !w-full !h-full object-cover rounded-t-[120px] group-hover:scale-105 transition-transform duration-500"
                      loading={idx < 6 ? 'eager' : 'lazy'}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-[#9CA3AF] bg-gradient-to-b from-gray-100 to-gray-200">
                      <User className="w-12 h-12 mb-2 opacity-60" />
                      <span className="text-[11px] font-bold tracking-wider uppercase opacity-80">
                        DEVQUAD PHOTO
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. EXPLICIT PURE SOLID WHITE BACKGROUND BOTTOM LABEL AREA (Fixed Height Flex-Shrink-0) */}
                <div className="relative w-full bg-[#FFFFFF] px-3 sm:px-4 pt-7 pb-5 text-center rounded-b-[24px] flex flex-col items-center justify-center min-h-[72px] flex-shrink-0 z-10">
                  {/* Small Circular Icon Badge (Centered & Overlapping Bottom of Photo) */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#0093DD] text-white border-4 border-white shadow-md flex items-center justify-center z-20 group-hover:bg-[#0C71C3] group-hover:scale-110 transition-all duration-300">
                    {member.customIconUrl ? (
                      <img
                        src={member.customIconUrl}
                        alt="Badge Icon"
                        className="w-6 h-6 object-contain rounded-full"
                      />
                    ) : (
                      <IconComponent className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Member Name */}
                  <div className="w-full flex items-center justify-center pt-1">
                    <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1F2937] leading-snug group-hover:text-[#0093DD] transition-colors break-words text-center">
                      {member.name}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
