import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { mgmtPrograms } from '../../data/departments';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function ManagementProgramsPage() {
  const [heroImage, setHeroImage] = useState('');
  const [programsList, setProgramsList] = useState<any[]>(mgmtPrograms);

  useEffect(() => {
    const fetchPrograms = async () => {
      const savedData = await cmsService.getSetting<any>('school_of_management_content', null);
      if (savedData) {
        if (savedData.heroImageUrl || savedData.hero_image_url || savedData.heroImage) {
          setHeroImage(savedData.heroImageUrl || savedData.hero_image_url || savedData.heroImage);
        }
        if (savedData.programsList && Array.isArray(savedData.programsList)) {
          const visible = savedData.programsList.filter((p: any) => p.is_visible !== false);
          if (visible.length > 0) {
            setProgramsList(visible);
            return;
          }
        }
      }

      // Fallback query if no CMS setting array exists
      const cmsProgs = await cmsService.getPrograms();
      if (cmsProgs && cmsProgs.length > 0) {
        const mgmtProgs = cmsProgs.filter(
          (p: any) =>
            p.level === 'management' ||
            p.department_name?.toLowerCase().includes('management') ||
            p.name?.toLowerCase().includes('bba') ||
            p.name?.toLowerCase().includes('mba')
        );

        if (mgmtProgs.length > 0) {
          setProgramsList(
            mgmtProgs.map((p: any) => ({
              id: p.id,
              title: p.name,
              subtitle: p.duration || p.level || 'Degree Program',
              image: p.image_url,
              imageLabel: 'MANAGEMENT PROGRAM',
            }))
          );
        }
      }
    };

    fetchPrograms();
  }, []);

  return (
    <div className="dept-page-container">
      <AboutPageHero title="FAST School of Management — Programs" backgroundImage={heroImage} />

      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[55px] min-[1100px]:pb-[85px]">
        <section className="w-full text-center">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
            OUR PROGRAMS
          </h2>

          <div className="dept-card-row flex flex-wrap justify-center gap-[24px]">
            {programsList.map((prog) => (
              <div key={prog.id} className="w-full max-w-[340px]">
                <DepartmentCard
                  variant="program"
                  title={prog.title}
                  subtitle={prog.subtitle}
                  image={prog.image}
                  imageLabel={prog.imageLabel || 'MANAGEMENT PROGRAM'}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
