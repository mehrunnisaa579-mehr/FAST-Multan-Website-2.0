import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { aidsPrograms } from '../../data/departments';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function AIDSProgramsPage() {
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
  const heroImage = cmsContent?.heroImageUrl || '';
  const hodHeading = cmsContent?.hodHeading || "HOD'S MESSAGE";
  const hodName = cmsContent?.hodName || 'Dr. Head of Department';
  const hodDesignation = cmsContent?.hodDesignation || 'Head, Department of Artificial Intelligence & Data Science';
  const hodMessage =
    cmsContent?.hodMessage ||
    'Welcome to the Department of Artificial Intelligence & Data Science at FAST-NUCES Multan Campus. We offer cutting-edge degree programs focusing on machine learning, deep neural networks, computer vision, and big data analytics.';
  const hodPhoto = cmsContent?.hodPhotoUrl || '';

  const programsList =
    cmsContent?.programsList && Array.isArray(cmsContent.programsList) && cmsContent.programsList.length > 0
      ? cmsContent.programsList.filter((p: any) => p.is_visible !== false)
      : aidsPrograms;

  return (
    <div className="department-page-bg">
      {/* Shared Hero */}
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      {/* Main Content Area */}
      <div className="department-content-wrapper text-left">
        {/* HOD / INCHARGE Message Section */}
        <div className="mb-[40px]">
          <h2 className="text-[22px] min-[700px]:text-[24px] font-bold text-[#0C71C3] uppercase mb-[20px]">
            {hodHeading}
          </h2>

          <div className="flex flex-col md:flex-row gap-[24px] items-start bg-[#0093DD] text-white p-[24px] rounded-[4px] shadow-sm">
            {/* Profile Card */}
            <div className="w-full md:w-[200px] flex-shrink-0">
              <DepartmentCard
                title={hodName}
                role={hodDesignation}
                imageLabel="AI HOD PHOTO"
                imageUrl={hodPhoto}
                variant="profile"
              />
            </div>

            {/* Message Text */}
            <div className="flex-1 space-y-[12px] text-[15px] leading-[1.75] text-white">
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
                  imageLabel={prog.imageLabel || 'AI PROGRAM'}
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
