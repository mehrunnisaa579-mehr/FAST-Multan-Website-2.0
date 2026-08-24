import React from 'react';
import { Link } from 'react-router-dom';
import AboutPageHero from '../about/AboutPageHero';
import DepartmentCard from './DepartmentCard';
import DecorativeProfileImageFrame from '../ui/DecorativeProfileImageFrame';

export interface DepartmentProgramItem {
  id: string | number;
  title: string;
  subtitle?: string;
  image?: string;
  imageLabel?: string;
  targetUrl?: string;
}

export interface DepartmentFacultyItem {
  id: string | number;
  name: string;
  designation?: string;
  photoUrl?: string;
  photo_url?: string;
  image?: string;
  photoPlaceholder?: string;
  slug?: string;
}

export interface DepartmentPageTemplateProps {
  heroTitle: string;
  heroImage?: string;
  hodHeading?: string;
  hodName: string;
  hodDesignation?: string;
  hodMessage: string;
  hodPhoto?: string;
  hodProfileLink?: string;
  programsHeading?: string;
  programsList?: DepartmentProgramItem[];
  facultyHeading?: string;
  facultyList?: DepartmentFacultyItem[];
  showAlliedFacultySection?: boolean;
  alliedFacultyHeading?: string;
  alliedFacultyList?: DepartmentFacultyItem[];
}

export default function DepartmentPageTemplate({
  heroTitle,
  heroImage = '',
  hodHeading = "HOD'S MESSAGE",
  hodName,
  hodMessage,
  hodPhoto = '',
  hodProfileLink = '/people/cs-hod',
  programsHeading = 'OUR PROGRAMS',
  programsList = [],
  facultyHeading = 'DEPARTMENT FACULTY',
  facultyList = [],
  showAlliedFacultySection = true,
  alliedFacultyHeading = 'ALLIED FACULTY',
  alliedFacultyList = [],
}: DepartmentPageTemplateProps) {
  const messageParagraphs = hodMessage
    ? hodMessage.split('\n\n').filter(Boolean)
    : [];

  return (
    <div className="dept-page-container">
      {/* Shared Hero Banner */}
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      {/* Main Department Content */}
      <div className="w-full max-w-[1480px] mx-auto px-[28px] sm:px-[40px] md:px-[56px] py-[64px] sm:py-[72px] space-y-[48px] sm:space-y-[56px]">

        {/* =====================================================
            HOD'S MESSAGE SECTION
            ===================================================== */}
        <section className="w-full">
          {/* Desktop Heading */}
          <div className="hidden md:grid grid-cols-[320px_minmax(0,1fr)] gap-[30px] lg:gap-[38px] mb-[40px]">
            <div />
            <h2 className="m-0 text-[40px] lg:text-[46px] leading-[1.1] font-bold text-[#0C71C3] uppercase tracking-[-1px] text-left relative -top-[30px]">
              {hodHeading}
            </h2>
          </div>

          {/* Mobile Heading */}
          <h2 className="md:hidden text-[32px] sm:text-[38px] leading-[1.1] font-bold text-[#0C71C3] uppercase tracking-tight text-center mb-[34px]">
            {hodHeading}
          </h2>

          {/* Photo + Message Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] gap-[30px] md:gap-[38px] lg:gap-[40px] items-start">
            {/* LEFT — HOD IMAGE + NAME */}
            <div className="w-full max-w-[315px] mx-auto md:mx-0">
              <Link to={hodProfileLink} className="no-underline block group cursor-pointer w-full text-center">
                <DecorativeProfileImageFrame
                  src={hodPhoto}
                  alt={hodName}
                  showBadge={true}
                  fallbackLabel="HOD PHOTO"
                  disableHoverEffect={true}
                />

                <h3 className="m-0 mt-[6px] text-[18px] sm:text-[19px] leading-[1.3] font-bold text-black group-hover:text-[#0093DD] transition-colors text-center">
                  {hodName}
                </h3>
              </Link>
            </div>

            {/* RIGHT — MESSAGE */}
            <div className="w-full text-[14px] lg:text-[14.5px] leading-[1.7] text-[#26384A] text-left">
              {messageParagraphs.length > 0 ? (
                messageParagraphs.map((para, idx) => (
                  <p key={idx} className="m-0 text-justify mb-[12px] last:mb-0">
                    {para}
                  </p>
                ))
              ) : (
                <p className="m-0 text-justify">{hodMessage}</p>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            OUR DEGREE PROGRAMS
            ===================================================== */}
        {programsList && programsList.length > 0 && (
          <section className="w-full space-y-[24px] pt-[50px]">
            <div className="relative w-full flex items-center justify-center pb-[0px]" style={{ marginBottom: '10px' }}>
              <h2 className="text-[32px] sm:text-[38px] md:text-[40px] lg:text-[46px] leading-[1.1] font-bold text-[#0C71C3] uppercase tracking-tight md:tracking-[-1px] text-center" style={{ marginBottom: '40px' }}>
                {programsHeading}
              </h2>
            </div>

            <div className="dept-card-row">
              {programsList.map((prog) => {
                const targetUrl = prog.targetUrl;
                const card = (
                  <DepartmentCard
                    variant="program"
                    title={prog.title}
                    subtitle={prog.subtitle}
                    imageUrl={prog.image}
                    imageLabel={prog.imageLabel || 'PROGRAM'}
                  />
                );

                if (targetUrl) {
                  const isExternal = targetUrl.startsWith('http');
                  if (isExternal) {
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
                        {card}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={prog.id}
                      to={targetUrl}
                      className="no-underline block dept-program-wrapper cursor-pointer"
                    >
                      {card}
                    </Link>
                  );
                }

                return (
                  <div key={prog.id} className="dept-program-wrapper">
                    {card}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =====================================================
            DEPARTMENT FACULTY
            ===================================================== */}
        {facultyList && facultyList.length > 0 && (
          <section className="w-full space-y-[24px] pt-[50px]">
            <div className="relative w-full flex flex-col sm:flex-row items-center justify-center pb-[6px] gap-2 sm:gap-0" style={{ marginBottom: '50px' }}>
              <h2 className="text-[32px] sm:text-[38px] md:text-[40px] lg:text-[46px] leading-[1.1] font-bold text-[#0C71C3] uppercase tracking-tight md:tracking-[-1px] text-center">
                {facultyHeading}
              </h2>
            </div>

            <div className="dept-card-row dept-faculty-grid flex flex-wrap justify-center items-start gap-[40px] md:gap-[60px] w-full">
              {facultyList.map((fac) => (
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
        )}

        {/* =====================================================
            ALLIED FACULTY
            ===================================================== */}
        {showAlliedFacultySection && alliedFacultyList && alliedFacultyList.length > 0 && (
          <section className="w-full space-y-[24px] pt-[50px]">
            <div className="relative w-full flex flex-col sm:flex-row items-center justify-center pb-[6px] gap-2 sm:gap-0" style={{ marginBottom: '36px' }}>
              <h2 className="text-[32px] sm:text-[38px] md:text-[40px] lg:text-[46px] leading-[1.1] font-bold text-[#0C71C3] uppercase tracking-tight md:tracking-[-1px] text-center">
                {alliedFacultyHeading}
              </h2>
            </div>

            <div className="dept-card-row dept-faculty-grid flex flex-wrap justify-center items-start gap-[40px] md:gap-[60px] w-full">
              {alliedFacultyList.map((fac) => (
                <div key={fac.id} className="dept-faculty-wrapper">
                  <Link to={`/people/${fac.slug || fac.id}`} className="no-underline block cursor-pointer">
                    <DepartmentCard
                      variant="faculty"
                      title={fac.name}
                      role={fac.designation}
                      imageUrl={fac.photoUrl || fac.photo_url || fac.image}
                      imageLabel={fac.photoPlaceholder || 'ALLIED FACULTY MEMBER'}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
