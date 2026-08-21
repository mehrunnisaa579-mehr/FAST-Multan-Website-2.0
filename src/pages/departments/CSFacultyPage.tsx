import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { csFaculty } from '../../data/departments';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function CSFacultyPage() {
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
  const heroImage = cmsContent?.heroImageUrl || '';
  const facultyHeading = cmsContent?.facultyHeading || 'Department Faculty';
  const facultyList =
    cmsContent?.facultyList && Array.isArray(cmsContent.facultyList) && cmsContent.facultyList.length > 0
      ? cmsContent.facultyList.filter((f: any) => f.is_visible !== false)
      : csFaculty;

  return (
    <div className="w-full bg-white">
      {/* Shared Hero */}
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      {/* Main Content Area */}
      <div className="w-full max-w-[1320px] mx-auto px-[20px] sm:px-[36px] md:px-[48px] py-[56px] md:py-[72px] lg:py-[80px] text-left">
        {/* Department Faculty Section */}
        <div>
          <h2 className="text-[22px] min-[700px]:text-[26px] font-bold text-[#0C71C3] uppercase mb-[32px] md:mb-[40px] text-center">
            {facultyHeading}
          </h2>

          <div className="dept-card-row dept-faculty-grid">
            {facultyList.map((fac: any) => (
              <div key={fac.id} className="dept-faculty-wrapper">
                <DepartmentCard
                  title={fac.name}
                  role={fac.designation}
                  imageLabel={fac.photoPlaceholder || 'FACULTY MEMBER'}
                  imageUrl={fac.photoUrl || fac.photo_url || fac.image}
                  variant="faculty"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
