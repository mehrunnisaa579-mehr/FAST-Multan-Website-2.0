import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { csPrograms, csFaculty, csResearchAreas } from '../../data/departments';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function CSDepartmentPage() {
  const [cmsContent, setCmsContent] = useState<any>(null);

  useEffect(() => {
    const fetchCmsData = async () => {
      const data = await cmsService.getSetting<any>('department_cs_content', null);
      if (data) {
        setCmsContent(data);
      }
    };
    fetchCmsData();
  }, []);

  const heroTitle = cmsContent?.heroTitle || 'Department Of Computer Science';
  const heroImage = cmsContent?.heroImageUrl || cmsContent?.hero_image_url || cmsContent?.heroImage || cmsContent?.hero_image || '';
  const hodHeading = cmsContent?.hodHeading || "HOD'S MESSAGE";
  const hodName = cmsContent?.hodName || 'Dr. Head of Department';
  const hodDesignation = cmsContent?.hodDesignation || 'Head, Department of Computer Science';
  const hodMessage =
    cmsContent?.hodMessage ||
    'Welcome to the Department of Computer Science at FAST-NUCES Multan Campus. Our department offers world-class degree programs in computing, software development, artificial intelligence, and cutting-edge research.';
  const hodPhoto = cmsContent?.hodPhotoUrl || '';

  const programsHeading = cmsContent?.programsHeading || 'OUR PROGRAMS';
  const viewAllProgramsText = cmsContent?.viewAllProgramsText || 'VIEW ALL PROGRAMS →';
  const viewAllProgramsUrl = cmsContent?.viewAllProgramsUrl || '/departments/computing/computer-science/programs';
  const programsList =
    cmsContent?.programsList && Array.isArray(cmsContent.programsList) && cmsContent.programsList.length > 0
      ? cmsContent.programsList.filter((p: any) => p.is_visible !== false)
      : csPrograms.map((p, idx) => ({ ...p, url: '/departments/computing/computer-science/programs', display_order: idx + 1 }));

  const facultyHeading = cmsContent?.facultyHeading || 'DEPARTMENT FACULTY';
  const viewAllFacultyText = cmsContent?.viewAllFacultyText || 'VIEW ALL FACULTY →';
  const viewAllFacultyUrl = cmsContent?.viewAllFacultyUrl || '/departments/computing/computer-science/faculty';
  const facultyList =
    cmsContent?.facultyList && Array.isArray(cmsContent.facultyList) && cmsContent.facultyList.length > 0
      ? cmsContent.facultyList.filter((f: any) => f.is_visible !== false)
      : csFaculty.map((f, idx) => ({ ...f, display_order: idx + 1 }));

  const researchHeading = cmsContent?.researchHeading || 'RESEARCH GROUPS & AREAS';
  const exploreResearchText = cmsContent?.exploreResearchText || 'EXPLORE RESEARCH GROUPS →';
  const exploreResearchUrl = cmsContent?.exploreResearchUrl || '/departments/computing/computer-science/research-groups';
  const researchList =
    cmsContent?.researchList && Array.isArray(cmsContent.researchList) && cmsContent.researchList.length > 0
      ? cmsContent.researchList.filter((r: any) => r.is_visible !== false)
      : csResearchAreas.map((r, idx) => ({ ...r, id: `res-${idx + 1}` }));

  return (
    <div className="dept-page-container">
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      <div className="w-full max-w-[1050px] mx-auto px-[20px] sm:px-[28px] py-[48px] sm:py-[64px] space-y-[48px] sm:space-y-[56px] flex flex-col items-center">
        {/* HOD MESSAGE SECTION */}
        <section className="w-full max-w-[950px] mx-auto flex flex-col items-center text-center space-y-[24px]">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase tracking-tight text-center w-full">
            {hodHeading}
          </h2>

          <div className="flex flex-col md:flex-row gap-[28px] md:gap-[36px] items-center text-center md:text-left bg-[#F8FAFC] p-[28px] sm:p-[36px] border border-[#E2E8F0] rounded-[10px] shadow-xs w-full">
            {/* HOD Photo */}
            <div className="flex flex-col items-center flex-shrink-0 mx-auto md:mx-0">
              <div className={`w-[190px] h-[235px] rounded-[6px] overflow-hidden flex items-center justify-center mb-[12px] shadow-sm${hodPhoto ? '' : ' bg-[#E2E8F0] p-[8px]'}`}>
                {hodPhoto ? (
                  <img src={hodPhoto} alt={hodName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[12px] font-semibold text-[#64748B] tracking-wide uppercase text-center">
                    PLACEHOLDER: CS HOD PHOTO
                  </span>
                )}
              </div>
              <h3 className="text-[17px] font-bold text-[#1F2937] text-center">{hodName}</h3>
              <p className="text-[13px] font-semibold text-[#0093DD] text-center mt-0.5">{hodDesignation}</p>
            </div>

            {/* HOD Message Paragraphs */}
            <div className="flex-1 text-[15px] min-[700px]:text-[16px] leading-[1.8] text-[#444444] space-y-[16px] text-center md:text-left">
              <p>{hodMessage}</p>
            </div>
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="dept-divider w-full max-w-[600px] mx-auto">
          <div className="dept-divider-line" />
          <div className="dept-divider-dot" />
        </div>

        {/* OUR DEGREE PROGRAMS */}
        <section className="w-full max-w-[1050px] mx-auto space-y-[24px]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left pb-[6px] border-b border-[#E2E8F0]">
            <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase tracking-tight text-center sm:text-left">
              {programsHeading}
            </h2>
            <Link
              to={viewAllProgramsUrl}
              className="text-[13px] font-bold text-[#0093DD] hover:text-[#0C71C3] uppercase tracking-wider no-underline text-center sm:text-right"
            >
              {viewAllProgramsText}
            </Link>
          </div>

          <div className="dept-card-row flex flex-wrap justify-center gap-[24px]">
            {programsList.map((prog: any) => (
              <Link key={prog.id} to={prog.url || viewAllProgramsUrl} className="no-underline block w-full max-w-[340px]">
                <DepartmentCard
                  variant="program"
                  title={prog.title}
                  subtitle={prog.subtitle}
                  imageUrl={prog.image}
                  imageLabel={prog.imageLabel || 'CS PROGRAM'}
                />
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="dept-divider w-full max-w-[600px] mx-auto">
          <div className="dept-divider-line" />
          <div className="dept-divider-dot" />
        </div>

        {/* DEPARTMENT FACULTY */}
        <section className="w-full max-w-[1050px] mx-auto space-y-[24px]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left pb-[6px] border-b border-[#E2E8F0]">
            <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase tracking-tight text-center sm:text-left">
              {facultyHeading}
            </h2>
            <Link
              to={viewAllFacultyUrl}
              className="text-[13px] font-bold text-[#0093DD] hover:text-[#0C71C3] uppercase tracking-wider no-underline text-center sm:text-right"
            >
              {viewAllFacultyText}
            </Link>
          </div>

          <div className="dept-card-row flex flex-wrap justify-center gap-[24px]">
            {facultyList.slice(0, 4).map((fac: any) => (
              <div key={fac.id} className="w-full max-w-[240px] sm:w-[230px]">
                <DepartmentCard
                  variant="faculty"
                  title={fac.name}
                  role={fac.designation}
                  imageUrl={fac.photoUrl}
                  imageLabel={fac.photoPlaceholder || 'FACULTY MEMBER'}
                />
              </div>
            ))}
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="dept-divider w-full max-w-[600px] mx-auto">
          <div className="dept-divider-line" />
          <div className="dept-divider-dot" />
        </div>

        {/* RESEARCH GROUPS (CS ONLY) */}
        <section className="w-full max-w-[1050px] mx-auto space-y-[24px]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left pb-[6px] border-b border-[#E2E8F0]">
            <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase tracking-tight text-center sm:text-left">
              {researchHeading}
            </h2>
            <Link
              to={exploreResearchUrl}
              className="text-[13px] font-bold text-[#0093DD] hover:text-[#0C71C3] uppercase tracking-wider no-underline text-center sm:text-right"
            >
              {exploreResearchText}
            </Link>
          </div>

          <div className="dept-card-row flex flex-wrap justify-center gap-[24px]">
            {researchList.slice(0, 4).map((area: any, idx: number) => (
              <div
                key={area.id || idx}
                className="w-full max-w-[480px] p-[24px] bg-white border border-[#E2E8F0] rounded-[8px] shadow-xs card-hover-lift text-center flex flex-col items-center"
              >
                <h3 className="text-[17px] font-bold text-[#0C71C3] mb-[8px] text-center">{area.title}</h3>
                <p className="text-[14px] text-[#555555] leading-[1.65] text-center">{area.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
