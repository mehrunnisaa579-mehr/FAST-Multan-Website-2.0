import React, { useEffect, useState } from 'react';
import { societiesData } from '../../data/societies';
import { cmsService } from '../../services/cmsService';
import SocietyLeadership from './SocietyLeadership';
import SocietyInstagramCTA from './SocietyInstagramCTA';
import SocietyStatsBanner from './SocietyStatsBanner';
import type { StatConfig } from './SocietyStatsBanner';
import '../../styles/society-pages.css';

interface SocietyViewProps {
  slug?: string;
}

export default function SocietyView({ slug }: SocietyViewProps) {
  const currentSlug = (slug || '').toLowerCase();
  const defaultItem = societiesData[currentSlug];

  const [societyName, setSocietyName] = useState(
    defaultItem?.name || currentSlug.toUpperCase()
  );

  const [shortName, setShortName] = useState(
    defaultItem?.headingTitle || ''
  );

  const [intro, setIntro] = useState(
    defaultItem?.intro || ''
  );

  const [heroImage, setHeroImage] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const [instagramUrl, setInstagramUrl] = useState(
    defaultItem?.instagramUrl || 'https://www.instagram.com'
  );

  const [registrationUrl, setRegistrationUrl] = useState(
    defaultItem?.registrationUrl || ''
  );

  const [showRegistrationButton, setShowRegistrationButton] = useState(
    defaultItem?.showRegistrationButton ?? false
  );

  const [stats, setStats] = useState<StatConfig[]>(
    defaultItem?.stats || []
  );

  const [leadership, setLeadership] = useState<any[]>(
    defaultItem?.leadership || [
      {
        role: 'Mentor',
        name: 'Faculty Mentor',
        photoPlaceholder: 'MENTOR PHOTO',
      },
      {
        role: 'Co-Mentor',
        name: 'Co-Faculty Mentor',
        photoPlaceholder: 'CO-MENTOR PHOTO',
      },
      {
        role: 'President',
        name: 'Society President',
        photoPlaceholder: 'PRESIDENT PHOTO',
      },
    ]
  );

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!currentSlug) {
      setNotFound(true);
      return;
    }

    const fetchCmsData = async () => {
      setNotFound(false);

      const fullList = await cmsService.getSetting<any[]>(
        'student_societies_full_list',
        []
      );

      let currentCms = Array.isArray(fullList)
        ? fullList.find(
            (s: any) =>
              (s.slug || '').toLowerCase() === currentSlug
          )
        : null;

      if (!currentCms) {
        const dbSocieties = await cmsService.getSocieties();

        if (Array.isArray(dbSocieties)) {
          currentCms = dbSocieties.find(
            (s: any) =>
              (s.slug || '').toLowerCase() === currentSlug
          );
        }
      }

      const specificDefault = societiesData[currentSlug];

      if (currentCms) {
        const nameStr =
          currentCms.name ||
          specificDefault?.name ||
          currentSlug.toUpperCase();

        setSocietyName(nameStr);

        setShortName(
          currentCms.short_name ||
            specificDefault?.headingTitle ||
            nameStr
        );

        setIntro(
          currentCms.description ||
            specificDefault?.intro ||
            ''
        );

        setHeroImage(
          currentCms.hero_image_url ||
            currentCms.hero_image ||
            ''
        );

        setLogoUrl(
          currentCms.logo_url ||
            currentCms.logo ||
            ''
        );

        setInstagramUrl(
          currentCms.instagram_url ||
            specificDefault?.instagramUrl ||
            'https://www.instagram.com'
        );

        setRegistrationUrl(
          currentCms.registration_url ||
            currentCms.registrationUrl ||
            specificDefault?.registrationUrl ||
            ''
        );

        setShowRegistrationButton(
          currentCms.show_registration_button ??
            currentCms.showRegistrationButton ??
            specificDefault?.showRegistrationButton ??
            false
        );

        let parsedStats: StatConfig[] = [];

        if (
          currentCms.stat1_label ||
          currentCms.stat1_value !== undefined
        ) {
          parsedStats = [
            {
              label:
                currentCms.stat1_label ||
                'Active Members',
              value:
                Number(currentCms.stat1_value) || 0,
              suffix:
                currentCms.stat1_suffix !== undefined
                  ? currentCms.stat1_suffix
                  : '+',
            },
            {
              label:
                currentCms.stat2_label ||
                'Events Hosted',
              value:
                Number(currentCms.stat2_value) || 0,
              suffix:
                currentCms.stat2_suffix !== undefined
                  ? currentCms.stat2_suffix
                  : '+',
            },
            {
              label:
                currentCms.stat3_label ||
                'Achievements',
              value:
                Number(currentCms.stat3_value) || 0,
              suffix:
                currentCms.stat3_suffix !== undefined
                  ? currentCms.stat3_suffix
                  : '+',
            },
          ];
        } else if (Array.isArray(currentCms.stats)) {
          parsedStats = currentCms.stats.map(
            (st: any) => ({
              label: st.label || '',
              value: Number(st.value) || 0,
              suffix: st.suffix || '',
            })
          );
        } else if (specificDefault?.stats) {
          parsedStats = specificDefault.stats;
        }

        setStats(parsedStats);

        // Fetch global co-mentors toggle setting
        const settingVal = await cmsService.getSetting<boolean | null>('show_society_co_mentors', null);
        const coMentorsEnabled = settingVal !== null ? settingVal : await cmsService.getSetting<boolean>('society_co_mentors_enabled', true);

        const leadershipList = [
          {
            role: 'Mentor',
            name:
              currentCms.mentor_name ||
              'Faculty Mentor',
            photoPlaceholder: 'MENTOR PHOTO',
            photoUrl:
              currentCms.mentor_photo_url ||
              currentCms.mentor_photo ||
              '',
          },
        ];

        const perSocietyEnabled = (currentCms.co_mentor_enabled ?? currentCms.co_mentor_visible ?? true) !== false;

        if (coMentorsEnabled !== false && perSocietyEnabled) {
          leadershipList.push({
            role: 'Co-Mentor',
            name:
              currentCms.co_mentor_name ||
              currentCms.comentor_name ||
              'Co-Faculty Mentor',
            photoPlaceholder: 'CO-MENTOR PHOTO',
            photoUrl:
              currentCms.co_mentor_photo_url ||
              currentCms.comentor_photo_url ||
              currentCms.co_mentor_photo ||
              '',
          });
        }

        leadershipList.push({
          role: 'President',
          name:
            currentCms.president_name ||
            'Society President',
          photoPlaceholder: 'PRESIDENT PHOTO',
          photoUrl:
            currentCms.president_photo_url ||
            currentCms.president_photo ||
            '',
        });

        setLeadership(leadershipList);
      } else if (specificDefault) {
        setSocietyName(specificDefault.name);
        setShortName(specificDefault.headingTitle);
        setIntro(specificDefault.intro);

        setHeroImage('');
        setLogoUrl('');

        setInstagramUrl(
          specificDefault.instagramUrl
        );

        setRegistrationUrl(
          specificDefault.registrationUrl || ''
        );

        setShowRegistrationButton(
          specificDefault.showRegistrationButton ?? false
        );

        const settingVal = await cmsService.getSetting<boolean | null>('show_society_co_mentors', null);
        const coMentorsEnabled = settingVal !== null ? settingVal : await cmsService.getSetting<boolean>('society_co_mentors_enabled', true);
        const perSocietyEnabled = ((specificDefault as any).co_mentor_enabled ?? true) !== false;
        const defaultLeadership = (coMentorsEnabled === false || !perSocietyEnabled)
          ? specificDefault.leadership.filter((m: any) => m.role !== 'Co-Mentor')
          : specificDefault.leadership;

        setLeadership(defaultLeadership);

        if (specificDefault.stats) {
          setStats(specificDefault.stats);
        }
      } else {
        setNotFound(true);
      }
    };

    fetchCmsData();
  }, [currentSlug]);

  if (notFound) {
    return (
      <div className="w-full bg-white min-h-[60vh] flex items-center justify-center py-20 text-center">
        <div className="max-w-md mx-auto p-8 bg-white border border-[#E5E7EB] rounded-lg shadow-xs text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Society Not Found
          </h2>

          <p className="text-sm text-gray-600 mb-6">
            The society "
            <span className="font-semibold text-[#0093DD]">
              {currentSlug}
            </span>
            " could not be found or is not currently active.
          </p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 3)
      .toUpperCase();
  };

  return (
    <div className="w-full bg-white min-h-screen flex flex-col items-center overflow-x-hidden">

      {/* 1. HERO IMAGE */}
      <div className="w-full bg-[#F8FAFC] flex justify-center">
        {heroImage ? (
          <div className="w-full max-h-[360px] sm:max-h-[420px] overflow-hidden">
            <img
              src={heroImage}
              alt={`${societyName} Banner`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-[160px] sm:h-[200px] bg-gradient-to-r from-[#F0F9FF] to-[#E0F2FE] border-b border-[#E2E8F0]" />
        )}
      </div>

      {/* NEW GAP BETWEEN HERO IMAGE AND LOGO */}
      <div className="w-full h-[24px] sm:h-[32px] bg-white" />

      {/* MAIN CENTERED CONTENT */}
      <div className="w-full max-w-[1000px] mx-auto px-[24px] sm:px-[36px] pb-[80px] sm:pb-[110px] flex flex-col items-center justify-center text-center">

        {/* 2. SOCIETY INTRO / IDENTITY BLOCK */}
        <div className="flex flex-col items-center justify-center text-center mb-[64px] sm:mb-[84px] relative z-10 w-full mx-auto">

          {/* Logo / Avatar Badge */}
          <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] rounded-full bg-white border-[4px] border-white ring-[6px] ring-[#0B2E59] shadow-md flex items-center justify-center overflow-hidden mb-[16px] flex-shrink-0 mx-auto">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={societyName}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-[#0093DD] text-white flex items-center justify-center font-bold text-[24px] sm:text-[30px] uppercase">
                {getInitials(societyName)}
              </div>
            )}
          </div>

          {/* Society Title */}
          <h1 className="text-[32px] sm:text-[40px] font-bold text-[#1F2937] leading-tight mb-[6px] m-0 text-center">
            {societyName}
          </h1>

          {/* Tagline / Subtitle */}
          {shortName && (
            <p className="text-[15px] sm:text-[16px] font-semibold text-[#0093DD] m-0 text-center">
              {shortName}
            </p>
          )}

          <div className="h-[46px]" />
        </div>

        {/* 3. WHO WE ARE */}
        <div className="w-full max-w-[900px] mx-auto text-center flex flex-col items-center">

          <h2 className="text-[22px] sm:text-[26px] font-bold text-[#0C71C3] uppercase tracking-wider mb-[20px] text-center">
            WHO WE ARE
          </h2>

          <div className="w-full text-[15.5px] sm:text-[16px] leading-[1.85] text-[#475569] whitespace-pre-line text-justify">
            {intro ||
              'The official introduction, activities, and campus updates of this society will be displayed here.'}
          </div>
        </div>

        {/* Gap between description and OUR TEAM */}
        <div className="h-[20px] sm:h-[25px]" />

        {/* 4. OUR TEAM */}
        <div className="w-full max-w-[950px] mx-auto text-center mb-[74px] sm:mb-[94px] flex flex-col items-center">
          <SocietyLeadership
            leadership={leadership}
          />
        </div>

        {/* 5. SOCIAL / CTA AREA */}
        <div className="w-full max-w-[850px] mx-auto">
          <SocietyInstagramCTA
            instagramUrl={instagramUrl}
            registrationUrl={registrationUrl}
            showRegistrationButton={showRegistrationButton}
          />
        </div>

        {/* 6. STATISTICS BANNER WITH WHITE GAP ABOVE */}
        {stats && stats.length > 0 && (
          <div className="w-full pt-[40px] sm:pt-[50px]">
            <SocietyStatsBanner
              stats={stats}
            />
          </div>
        )}

      </div>
    </div>
  );
}