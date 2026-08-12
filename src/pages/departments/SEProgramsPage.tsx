import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { sePrograms } from '../../data/departments';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function SEProgramsPage() {
  const [cmsContent, setCmsContent] = useState<any>(null);

  useEffect(() => {
    const fetchCmsData = async () => {
      const data = await cmsService.getSetting<any>('department_se_content', null);
      if (data) {
        setCmsContent(data);
      }
    };
    fetchCmsData();
  }, []);

  const heroTitle = cmsContent?.heroTitle || 'Department Of Software Engineering';
  const heroImage = cmsContent?.heroImageUrl || '';
  const hodName = cmsContent?.hodName || 'Dr. Head of Department';
  const hodDesignation = cmsContent?.hodDesignation || 'Head of Department';
  const hodMessage =
    cmsContent?.hodMessage ||
    'Welcome to the Department of Software Engineering at FAST-NUCES Multan Campus. Our department focuses on software design methodologies, quality assurance, system architecture, and agile software development principles.';
  const hodPhoto = cmsContent?.hodPhotoUrl || '';

  const programsList =
    cmsContent?.programsList && Array.isArray(cmsContent.programsList) && cmsContent.programsList.length > 0
      ? cmsContent.programsList.filter((p: any) => p.is_visible !== false)
      : sePrograms;

  return (
    <div className="department-page-bg">
      {/* Shared Hero */}
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      {/* Main Content Area */}
      <div className="department-content-wrapper text-left">
        {/* HOD's Message Section */}
        <div className="mb-[40px]">
          <h2 className="text-[22px] min-[700px]:text-[24px] font-bold text-[#0C71C3] uppercase mb-[20px]">
            Head Of Department's Message
          </h2>

          <div className="flex flex-col md:flex-row gap-[24px] items-start bg-white p-[24px] border border-[#EAEAEA] rounded-[4px] shadow-sm">
            {/* HOD Profile Card */}
            <div className="w-full md:w-[200px] flex-shrink-0">
              <DepartmentCard
                title={hodName}
                role={hodDesignation}
                imageLabel="SE HOD PHOTO"
                imageUrl={hodPhoto}
                variant="profile"
              />
            </div>

            {/* Message Text */}
            <div className="flex-1 space-y-[12px] text-[15px] leading-[1.75] text-[#444444]">
              <p>{hodMessage}</p>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="dept-divider my-[40px]">
          <div className="dept-divider-dot" />
        </div>

        {/* Our Programs Section */}
        <div>
          <h2 className="text-[22px] min-[700px]:text-[24px] font-bold text-[#0C71C3] uppercase mb-[24px]">
            Our Programs
          </h2>

          <div className="flex flex-wrap justify-center gap-[24px]">
            {programsList.map((prog: any) => (
              <div key={prog.id} className="w-full max-w-[340px]">
                <DepartmentCard
                  title={prog.title}
                  subtitle={prog.subtitle}
                  imageLabel={prog.imageLabel || 'SE PROGRAM'}
                  imageUrl={prog.image}
                  variant="program"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
