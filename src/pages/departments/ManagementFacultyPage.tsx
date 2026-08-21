import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { mgmtFaculty } from '../../data/departments';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function ManagementFacultyPage() {
  const [heroImage, setHeroImage] = useState('');
  const [facultyList, setFacultyList] = useState<any[]>(mgmtFaculty);

  useEffect(() => {
    const fetchFaculty = async () => {
      const savedData = await cmsService.getSetting<any>('school_of_management_content', null);
      if (savedData) {
        if (savedData.heroImageUrl || savedData.hero_image_url || savedData.heroImage) {
          setHeroImage(savedData.heroImageUrl || savedData.hero_image_url || savedData.heroImage);
        }
        if (savedData.facultyList && Array.isArray(savedData.facultyList)) {
          const visible = savedData.facultyList.filter((f: any) => f.is_visible !== false);
          if (visible.length > 0) {
            setFacultyList(visible);
            return;
          }
        }
      }

      // Fallback query if no CMS setting array exists
      const cmsFac = await cmsService.getFaculty();
      if (cmsFac && cmsFac.length > 0) {
        const mgmtFac = cmsFac.filter(
          (f: any) =>
            f.department_name?.toLowerCase().includes('management') ||
            f.department_code === 'MGMT'
        );

        if (mgmtFac.length > 0) {
          setFacultyList(
            mgmtFac.map((f: any) => ({
              id: f.id,
              name: f.name,
              designation: f.designation || 'Faculty Member',
              photoUrl: f.image_url,
              photoPlaceholder: 'MANAGEMENT FACULTY',
            }))
          );
        }
      }
    };

    fetchFaculty();
  }, []);

  return (
    <div className="dept-page-container">
      <AboutPageHero title="FAST School of Management — Faculty" backgroundImage={heroImage} />

      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[55px] min-[1100px]:pb-[85px]">
        <section className="w-full text-center">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
            DEPARTMENT FACULTY
          </h2>

          <div className="dept-card-row dept-faculty-grid">
            {facultyList.map((fac) => (
              <div key={fac.id} className="dept-faculty-wrapper">
                <DepartmentCard
                  key={fac.id}
                  variant="faculty"
                  title={fac.name}
                  role={fac.designation}
                  image={fac.photoUrl || fac.photo_url || fac.image}
                  imageLabel={fac.photoPlaceholder || 'MANAGEMENT FACULTY'}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
