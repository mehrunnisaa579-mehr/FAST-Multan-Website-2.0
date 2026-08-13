import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { aidsPrograms, aidsFaculty } from '../../data/departments';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function AIDSDepartmentPage() {
  const [cmsContent, setCmsContent] = useState<any>(null);

  useEffect(() => {
    const fetchCmsData = async () => {
      const data = await cmsService.getSetting<any>('department_ai_content', null);
      if (data) {
        setCmsContent(data);
      }
    };
    fetchCmsData();
  }, []);

  const heroTitle = cmsContent?.heroTitle || 'Department of AI';
  const heroImage = cmsContent?.heroImageUrl || cmsContent?.hero_image_url || cmsContent?.heroImage || cmsContent?.hero_image || '';
  const hodHeading = cmsContent?.hodHeading || "HOD'S MESSAGE";
  const hodName = cmsContent?.hodName || 'Dr. Head of Department';
  const hodDesignation = cmsContent?.hodDesignation || 'Head, Department of Artificial Intelligence & Data Science';
  const hodMessage =
    cmsContent?.hodMessage ||
    'Welcome to the Department of Artificial Intelligence & Data Science at FAST-NUCES Multan Campus. We offer cutting-edge degree programs focusing on machine learning, deep neural networks, computer vision, and big data analytics.';
  const hodPhoto = cmsContent?.hodPhotoUrl || '';

  const programsHeading = cmsContent?.programsHeading || 'OUR PROGRAMS';
  const viewAllProgramsText = cmsContent?.viewAllProgramsText || 'VIEW ALL PROGRAMS →';
  const viewAllProgramsUrl = cmsContent?.viewAllProgramsUrl || '/departments/computing/ai-data-science/programs';
  const programsList =
    cmsContent?.programsList && Array.isArray(cmsContent.programsList) && cmsContent.programsList.length > 0
      ? cmsContent.programsList.filter((p: any) => p.is_visible !== false)
      : aidsPrograms.map((p, idx) => ({ ...p, url: '/departments/computing/ai-data-science/programs', display_order: idx + 1 }));

  const facultyHeading = cmsContent?.facultyHeading || 'DEPARTMENT FACULTY';
  const viewAllFacultyText = cmsContent?.viewAllFacultyText || 'VIEW ALL FACULTY →';
  const viewAllFacultyUrl = cmsContent?.viewAllFacultyUrl || '/departments/computing/ai-data-science/faculty';
  const facultyList =
    cmsContent?.facultyList && Array.isArray(cmsContent.facultyList) && cmsContent.facultyList.length > 0
      ? cmsContent.facultyList.filter((f: any) => f.is_visible !== false)
      : aidsFaculty.map((f, idx) => ({ ...f, display_order: idx + 1 }));

  return (
    <div className="dept-page-container text-left">
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      <div className="dept-main-wrapper py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[55px] min-[1100px]:pb-[85px]">
        {/* HOD / INCHARGE MESSAGE SECTION */}
        <section className="w-full">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
            {hodHeading}
          </h2>

          <div className="flex flex-col md:flex-row gap-[32px] md:gap-[40px] items-center md:items-start text-left bg-[#F8FAFC] p-[28px] sm:p-[36px] border border-[#E2E8F0] rounded-[10px] shadow-xs w-full">
            {/* HOD / Incharge Photo */}
            <div className="flex flex-col items-center flex-shrink-0 mx-auto md:mx-0">
              <div className={`w-[190px] h-[235px] rounded-[4px] overflow-hidden flex items-center justify-center mb-[12px] shadow-sm${hodPhoto ? '' : ' bg-white p-[8px]'}`}>
                {hodPhoto ? (
                  <img src={hodPhoto} alt={hodName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase text-center font-bold">
                    PLACEHOLDER: AI HOD PHOTO
                  </span>
                )}
              </div>
              <h3 className="text-[16px] font-bold text-[#333333] text-center">{hodName}</h3>
              <p className="text-[13px] font-medium text-[#666666] text-center">{hodDesignation}</p>
            </div>

            {/* Message Paragraphs */}
            <div className="flex-1 text-[15px] min-[700px]:text-[16px] leading-[1.75] text-[#444444] space-y-[16px]">
              <p>{hodMessage}</p>
            </div>
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="dept-divider">
          <div className="dept-divider-line" />
          <div className="dept-divider-dot" />
        </div>

        {/* OUR DEGREE PROGRAMS */}
        <section className="w-full text-center space-y-[24px]">
          <div className="relative w-full flex flex-col sm:flex-row items-center justify-center pb-[6px] border-b border-[#E2E8F0] gap-2 sm:gap-0">
            <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase tracking-tight text-center">
              {programsHeading}
            </h2>
            <div className="sm:absolute sm:right-0 sm:bottom-[6px]">
              <Link
                to={viewAllProgramsUrl}
                className="text-[13px] font-bold text-[#0093DD] hover:text-[#0C71C3] uppercase tracking-wider no-underline text-center sm:text-right"
              >
                {viewAllProgramsText}
              </Link>
            </div>
          </div>

          <div className="dept-card-row">
            {programsList.map((prog: any) => (
              <Link key={prog.id} to={prog.url || viewAllProgramsUrl} className="no-underline block dept-program-wrapper">
                <DepartmentCard
                  variant="program"
                  title={prog.title}
                  subtitle={prog.subtitle}
                  imageUrl={prog.image}
                  imageLabel={prog.imageLabel || 'AI PROGRAM'}
                />
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="dept-divider">
          <div className="dept-divider-line" />
          <div className="dept-divider-dot" />
        </div>

        {/* DEPARTMENT FACULTY */}
        <section className="w-full text-center space-y-[24px]">
          <div className="relative w-full flex flex-col sm:flex-row items-center justify-center pb-[6px] border-b border-[#E2E8F0] gap-2 sm:gap-0">
            <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase tracking-tight text-center">
              {facultyHeading}
            </h2>
            <div className="sm:absolute sm:right-0 sm:bottom-[6px]">
              <Link
                to={viewAllFacultyUrl}
                className="text-[13px] font-bold text-[#0093DD] hover:text-[#0C71C3] uppercase tracking-wider no-underline text-center sm:text-right"
              >
                {viewAllFacultyText}
              </Link>
            </div>
          </div>

          <div className="dept-card-row">
            {facultyList.slice(0, 4).map((fac: any) => (
              <div key={fac.id} className="dept-faculty-wrapper">
                <DepartmentCard
                  key={fac.id}
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
      </div>
    </div>
  );
}
