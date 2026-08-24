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

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

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
  const [teamMembers, setTeamMembers] = useState<WebTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebTeamData = async () => {
      setLoading(true);
      const data = await cmsService.getSetting<WebTeamSettings>('webteam_content', null as any);

      if (data) {
        if (data.pageTitle) setPageTitle(data.pageTitle);
        if (data.pageSubtitle) setPageSubtitle(data.pageSubtitle);
        if (data.heroImageUrl) setHeroImage(data.heroImageUrl);
        if (data.teamMembers && Array.isArray(data.teamMembers) && data.teamMembers.length > 0) {
          const visible = data.teamMembers
            .filter((m) => m.is_visible !== false)
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
          setTeamMembers(visible);
        } else {
          setTeamMembers(defaultWebTeamMembers);
        }
      } else {
        setTeamMembers(defaultWebTeamMembers);
      }
      setLoading(false);
    };

    fetchWebTeamData();
  }, []);

  return (
    <div className="w-full bg-white text-left">
      <AboutPageHero title={pageTitle} backgroundImage={heroImage} />

      <div className="w-full max-w-[1400px] mx-auto px-[16px] sm:px-[32px] md:px-[48px] py-[60px] sm:py-[76px]">
        {pageSubtitle && (
          <div className="text-center max-w-[800px] mx-auto mb-[48px] sm:mb-[60px]">
            <h2 className="text-[28px] sm:text-[36px] font-bold text-[#0C71C3] uppercase mb-3 tracking-tight">
              OUR TEAM
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#4B5563] leading-relaxed">
              {pageSubtitle}
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-5 items-stretch justify-center">
            {Array.from({ length: 6 }).map((_, idx) => {
              const isStaggered = idx % 2 === 1;
              return (
                <div
                  key={idx}
                  className={`w-full flex flex-col rounded-t-[120px] rounded-b-[24px] overflow-hidden bg-white shadow-md border border-[#E2E8F0] ${
                    isStaggered ? 'lg:translate-y-5' : 'lg:translate-y-0'
                  }`}
                >
                  <div className="relative w-full min-h-[300px] sm:min-h-[340px] flex-1 bg-gradient-to-b from-[#E2E8F0] to-[#F1F5F9] rounded-t-[120px] overflow-hidden animate-pulse" />
                  <div className="relative w-full bg-[#FFFFFF] px-3 sm:px-4 pt-7 pb-5 text-center rounded-b-[24px] flex flex-col items-center justify-center min-h-[72px] flex-shrink-0">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#CBD5E1] border-4 border-white shadow-md animate-pulse" />
                    <div className="w-24 h-4 bg-[#CBD5E1] rounded animate-pulse mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-5 items-start justify-center">
            {teamMembers.map((member, idx) => {
              const IconComponent = ICON_MAP[member.iconName] || Code;
              const isStaggered = idx % 2 === 1;
              const hasLinkedin = Boolean(member.linkedinUrl?.trim());
              const hasInstagram = Boolean(member.instagramUrl?.trim());
              const hasSocials = hasLinkedin || hasInstagram;

              return (
                <div
                  key={member.id || idx}
                  className={`w-full flex flex-col items-center ${
                    isStaggered ? 'lg:translate-y-5' : 'lg:translate-y-0'
                  }`}
                >
                  {/* 1. TEAM MEMBER CARD */}
                  <div className="w-full flex flex-col rounded-t-[120px] rounded-b-[24px] overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[#E2E8F0] group">
                    {/* Portrait Photo Region */}
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

                    {/* Label Area */}
                    <div className="relative w-full bg-[#FFFFFF] px-3 sm:px-4 pt-7 pb-5 text-center rounded-b-[24px] flex flex-col items-center justify-center min-h-[72px] flex-shrink-0 z-10">
                      {member.customIconUrl ? (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-white shadow-md flex items-center justify-center z-20 transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                          <img
                            src={member.customIconUrl}
                            alt={`${member.name} logo`}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white text-[#0093DD] border-2 border-[#E2E8F0] shadow-md flex items-center justify-center z-20 group-hover:border-[#0093DD] group-hover:scale-110 transition-all duration-300">
                          <IconComponent className="w-5 h-5 text-[#0093DD]" />
                        </div>
                      )}

                      <div className="w-full flex items-center justify-center pt-1">
                        <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1F2937] leading-snug group-hover:text-[#0093DD] transition-colors break-words text-center">
                          {member.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* 2. SOCIAL MEDIA ICONS ROW (BELOW CARD ONLY) */}
                  {hasSocials && (
                    <div className="flex items-center justify-center gap-2.5 mt-3.5 z-20">
                      {hasLinkedin && (
                        <a
                          href={member.linkedinUrl!.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-[#0077B5] hover:bg-[#005582] text-white flex items-center justify-center shadow-xs hover:scale-110 transition-all cursor-pointer outline-none"
                          title={`${member.name}'s LinkedIn`}
                          aria-label={`${member.name}'s LinkedIn`}
                        >
                          <LinkedInIcon className="w-4 h-4 text-white fill-current" />
                        </a>
                      )}

                      {hasInstagram && (
                        <a
                          href={member.instagramUrl!.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#833AB4] hover:opacity-90 text-white flex items-center justify-center shadow-xs hover:scale-110 transition-all cursor-pointer outline-none"
                          title={`${member.name}'s Instagram`}
                          aria-label={`${member.name}'s Instagram`}
                        >
                          <InstagramIcon className="w-4 h-4 text-white" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
