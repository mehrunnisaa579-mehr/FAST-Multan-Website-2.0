import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { csPrograms } from '../../data/departments';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function CSProgramsPage() {
  const [programsList, setProgramsList] = useState<any[]>(csPrograms);
  const [cmsContent, setCmsContent] = useState<any>(null);

  useEffect(() => {
    const fetchCsPrograms = async () => {
      const data = await cmsService.getSetting<any>('department_cs_content', null);
      if (data) {
        setCmsContent(data);
        if (data.programsList && Array.isArray(data.programsList) && data.programsList.length > 0) {
          setProgramsList(data.programsList.filter((p: any) => p.is_visible !== false));
          return;
        }
      }

      const cmsPrograms = await cmsService.getPrograms();
      if (cmsPrograms && cmsPrograms.length > 0) {
        const csOnly = cmsPrograms.filter((p: any) => p.department === 'cs' || !p.department);
        if (csOnly.length > 0) {
          setProgramsList(
            csOnly.map((p: any) => ({
              id: p.id,
              title: p.name,
              subtitle: p.duration || '4 Years',
              imageLabel: p.image_url ? '' : 'PROGRAM IMAGE',
              image: p.image_url,
            }))
          );
        }
      }
    };
    fetchCsPrograms();
  }, []);

  const heroTitle = cmsContent?.heroTitle || 'Department Of Computer Science';
  const heroImage = cmsContent?.heroImageUrl || '';
  const hodName = cmsContent?.hodName || 'Dr. HOD Computer Science';
  const hodDesignation = cmsContent?.hodDesignation || 'Head of Department';
  const hodMessage =
    cmsContent?.hodMessage ||
    'Welcome to the Department of Computer Science at FAST-NUCES Multan Campus. Our department is committed to delivering world-class computing education, fostering innovative research, and preparing students for successful careers in software and technology industries.';
  const hodPhoto = cmsContent?.hodPhotoUrl || '';

  return (
    <div className="department-page-bg">
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      <div className="department-content-wrapper text-left">
        {/* HOD's Message Section */}
        <div className="mb-[40px]">
          <h2 className="text-[22px] min-[700px]:text-[24px] font-bold text-[#0C71C3] uppercase mb-[20px]">
            Head Of Department's Message
          </h2>

          <div className="flex flex-col md:flex-row gap-[24px] items-start bg-white p-[24px] border border-[#EAEAEA] rounded-[4px] shadow-sm">
            <div className="w-full md:w-[200px] flex-shrink-0">
              <DepartmentCard
                title={hodName}
                role={hodDesignation}
                imageLabel="HOD PHOTO"
                imageUrl={hodPhoto}
                variant="profile"
              />
            </div>

            <div className="flex-1 space-y-[12px] text-[15px] leading-[1.75] text-[#444444]">
              <p>{hodMessage}</p>
            </div>
          </div>
        </div>

        <div className="dept-divider my-[40px]">
          <div className="dept-divider-dot" />
        </div>

        {/* Our Programs Section */}
        <div className="mb-[45px]">
          <h2 className="text-[22px] min-[700px]:text-[24px] font-bold text-[#0C71C3] uppercase mb-[24px]">
            Our Programs
          </h2>

          <div className="flex flex-wrap justify-center gap-[24px]">
            {programsList.map((prog) => (
              <div key={prog.id} className="w-full max-w-[340px]">
                <DepartmentCard
                  title={prog.title}
                  subtitle={prog.subtitle}
                  imageLabel={prog.imageLabel || 'PROGRAM IMAGE'}
                  imageUrl={prog.image}
                  variant="program"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Important Links Section */}
        <div className="bg-[#F9FAFB] p-[24px] border border-[#EAEAEA] rounded-[4px]">
          <h3 className="text-[18px] font-bold text-[#333333] uppercase mb-[14px]">
            Important Links
          </h3>
          <div className="flex flex-wrap gap-[16px] text-[14px] font-semibold text-[#0093DD]">
            <a href="https://www.nu.edu.pk/Student/Calender" className="hover:underline">
              Academic Calendar →
            </a>
            <a href="https://nu.edu.pk/Admissions/FeeStructure" className="hover:underline">
              Fee Structure →
            </a>
            <a href="https://nu.edu.pk/Admissions/EligibilityCriteria" className="hover:underline">
              Eligibility Criteria →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
