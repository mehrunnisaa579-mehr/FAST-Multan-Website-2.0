import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import DecorativeProfileImageFrame from '../../components/ui/DecorativeProfileImageFrame';
import { mgmtPrograms, mgmtFaculty } from '../../data/departments';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function SchoolOfManagementPage() {
  const [cmsContent, setCmsContent] = useState<any>(null);

  useEffect(() => {
    const fetchCmsData = async () => {
      const data = await cmsService.getSetting<any>(
        'school_of_management_content',
        null
      );

      if (data) {
        setCmsContent(data);
      }
    };

    fetchCmsData();
  }, []);

  // ── Hero ──────────────────────────────────────────────────────────────────
  const heroTitle =
    cmsContent?.heroTitle || 'Department Of Management Sciences';

  const heroImage =
    cmsContent?.heroImageUrl ||
    cmsContent?.hero_image_url ||
    cmsContent?.heroImage ||
    '';

  // ── HOD ──────────────────────────────────────────────────────────────────
  const hodHeading =
    cmsContent?.hodHeading || "HOD'S MESSAGE";

  const hodName =
    cmsContent?.headName ||
    cmsContent?.hodName ||
    'Dr. [Head of Department]';

  const hodDesignation =
    cmsContent?.headDesignation ||
    cmsContent?.hodDesignation ||
    'Head, Department of Management Sciences';

  const hodMessage =
    cmsContent?.headMessage ||
    cmsContent?.hodMessage ||
    'Welcome to the Department of Management Sciences at FAST-NUCES Multan Campus. Our programs are designed to develop strategic thinkers, financial analysts, and entrepreneurial leaders ready for a dynamic global economy.';

  const hodPhoto =
    cmsContent?.headPhotoUrl ||
    cmsContent?.hodPhotoUrl ||
    '';

  // ── Programs ──────────────────────────────────────────────────────────────
  const programsHeading =
    cmsContent?.programsHeading || 'OUR PROGRAMS';

  const viewAllProgramsText =
    cmsContent?.viewAllProgramsText || 'VIEW ALL PROGRAMS →';

  const viewAllProgramsUrl =
    cmsContent?.viewAllProgramsUrl ||
    '/departments/management/programs';

  const programsList =
    cmsContent?.programsList &&
    Array.isArray(cmsContent.programsList) &&
    cmsContent.programsList.length > 0
      ? cmsContent.programsList.filter(
          (p: any) => p.is_visible !== false
        )
      : mgmtPrograms
        ? mgmtPrograms.map((p: any, idx: number) => ({
            ...p,
            url: '/departments/management/programs',
            display_order: idx + 1,
          }))
        : [
            {
              id: 'bba',
              title: 'BBA',
              subtitle: 'Bachelor of Business Administration',
              display_order: 1,
            },
            {
              id: 'mba',
              title: 'MBA',
              subtitle: 'Master of Business Administration',
              display_order: 2,
            },
          ];

  // ── Department Faculty ────────────────────────────────────────────────────
  const facultyHeading =
    cmsContent?.facultyHeading || 'DEPARTMENT FACULTY';

  const facultyList =
    cmsContent?.facultyList &&
    Array.isArray(cmsContent.facultyList) &&
    cmsContent.facultyList.length > 0
      ? cmsContent.facultyList.filter(
          (f: any) => f.is_visible !== false
        )
      : mgmtFaculty
        ? mgmtFaculty.map((f: any, idx: number) => ({
            ...f,
            display_order: idx + 1,
          }))
        : [
            {
              id: 'fac-1',
              name: 'Dr. [Faculty 1]',
              designation: 'Professor & HOD',
              display_order: 1,
            },
            {
              id: 'fac-2',
              name: 'Dr. [Faculty 2]',
              designation: 'Associate Professor',
              display_order: 2,
            },
          ];

  // ── Allied Faculty ────────────────────────────────────────────────────────
  const alliedFacultyHeading =
    cmsContent?.alliedFacultyHeading || 'ALLIED FACULTY';

  const alliedFacultyList =
    cmsContent?.alliedFacultyList &&
    Array.isArray(cmsContent.alliedFacultyList) &&
    cmsContent.alliedFacultyList.length > 0
      ? cmsContent.alliedFacultyList.filter(
          (f: any) => f.is_visible !== false
        )
      : [
          {
            id: 'allied-mgmt-default-1',
            name: 'Dr. Allied Faculty Placeholder',
            designation: 'Associated Professor (Management)',
            photoUrl: '',
            photoPlaceholder: 'PLACEHOLDER: PHOTO',
          },
        ];

  return (
    <div className="dept-page-container">

      {/* ── Shared Hero ── */}
      <AboutPageHero
        title={heroTitle}
        backgroundImage={heroImage}
      />

      {/* ── Main Content Wrapper ── */}
      <div className="w-full max-w-[1320px] mx-auto px-[20px] sm:px-[36px] md:px-[48px] py-[56px] md:py-[72px] lg:py-[80px] space-y-[64px] md:space-y-[76px] lg:space-y-[88px]">

        {/* =====================================================
            HOD'S MESSAGE
            SAME LAYOUT AS COMPUTER SCIENCE
            ===================================================== */}

        <section className="w-full">

          {/* Desktop Heading */}
          <div className="hidden md:grid grid-cols-[320px_minmax(0,1fr)] gap-[30px] md:gap-[38px] lg:gap-[40px] mb-[36px]">

            <div />

            <h2 className="relative -top-[20px] m-0 text-[36px] lg:text-[42px] leading-[1.15] font-bold text-[#0C71C3] uppercase tracking-[-1px] text-left">
              {hodHeading}
            </h2>

          </div>

          {/* Mobile Heading */}
          <h2 className="md:hidden text-[28px] sm:text-[34px] leading-[1.2] font-bold text-[#0C71C3] uppercase tracking-tight text-center mb-[28px]">
            {hodHeading}
          </h2>

          {/* Photo + Message */}
          <div className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] gap-[30px] md:gap-[38px] lg:gap-[40px] items-start">

            {/* LEFT — HOD IMAGE + NAME */}
            <div className="w-full max-w-[315px] mx-auto md:mx-0">
              <Link to="/people/management-hod" className="no-underline block group cursor-pointer w-full text-center">
                <DecorativeProfileImageFrame
                  src={hodPhoto}
                  alt={hodName}
                  showBadge={false}
                  fallbackLabel="MANAGEMENT HOD PHOTO"
                />

                <h3 className="m-0 mt-[10px] text-[18px] sm:text-[19px] leading-[1.35] font-bold text-black group-hover:text-[#0093DD] transition-colors text-center">
                  {hodName}
                </h3>
              </Link>
            </div>

            {/* RIGHT — MESSAGE */}
            <div className="w-full text-[15px] lg:text-[16px] leading-[1.8] text-[#374151] text-left">

              <p className="m-0 text-justify">
                {hodMessage}
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            OUR PROGRAMS
            ===================================================== */}

        <section className="w-full space-y-[32px] md:space-y-[40px]">

          <div className="relative w-full flex items-center justify-center pb-[8px] border-b border-[#E2E8F0]">

            <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase tracking-tight text-center">
              {programsHeading}
            </h2>

          </div>

          <div className="dept-card-row">

            {programsList.map((prog: any) => {
              const targetUrl = 'https://nu.edu.pk/Program/BS(BA)';

              return (
                <a
                  key={prog.id}
                  href={targetUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.assign(targetUrl);
                  }}
                  className="no-underline block dept-program-wrapper cursor-pointer"
                >

                  <DepartmentCard
                    variant="program"
                    title={prog.title}
                    subtitle={prog.subtitle}
                    imageUrl={prog.image}
                    imageLabel={
                      prog.imageLabel || 'MANAGEMENT PROGRAM'
                    }
                  />

                </a>
              );
            })}

          </div>

        </section>

        {/* =====================================================
            DEPARTMENT FACULTY
            ===================================================== */}

        <section className="w-full space-y-[32px] md:space-y-[40px]">

          <div className="relative w-full flex flex-col sm:flex-row items-center justify-center pb-[8px] border-b border-[#E2E8F0] gap-2 sm:gap-0">

            <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase tracking-tight text-center">
              {facultyHeading}
            </h2>

          </div>

          <div className="dept-card-row dept-faculty-grid">
            {facultyList.map((fac: any) => (
              <div key={fac.id} className="dept-faculty-wrapper">
                <Link to={`/people/${fac.slug || fac.id}`} className="no-underline block cursor-pointer">
                  <DepartmentCard
                    variant="faculty"
                    title={fac.name}
                    role={fac.designation}
                    imageUrl={fac.photoUrl || fac.photo_url || fac.image}
                    imageLabel={fac.photoPlaceholder || 'FACULTY MEMBER'}
                  />
                </Link>
              </div>
            ))}
          </div>

        </section>

        {/* =====================================================
            ALLIED FACULTY
            ===================================================== */}

        <section className="w-full space-y-[32px] md:space-y-[40px]">

          <div className="relative w-full flex flex-col sm:flex-row items-center justify-center pb-[8px] border-b border-[#E2E8F0] gap-2 sm:gap-0">
            <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase tracking-tight text-center">
              {alliedFacultyHeading}
            </h2>
          </div>

          <div className="dept-card-row dept-faculty-grid">
            {alliedFacultyList.map((fac: any) => (
              <div key={fac.id} className="dept-faculty-wrapper">
                <Link to={`/people/${fac.slug || fac.id}`} className="no-underline block cursor-pointer">
                  <DepartmentCard
                    variant="faculty"
                    title={fac.name}
                    role={fac.designation}
                    imageUrl={fac.photoUrl || fac.photo_url || fac.image || ''}
                    imageLabel={fac.photoPlaceholder || 'ALLIED FACULTY MEMBER'}
                  />
                </Link>
              </div>
            ))}
          </div>

        </section>

      </div>

    </div>
  );
}