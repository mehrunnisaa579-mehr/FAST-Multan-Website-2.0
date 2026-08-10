import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function AllDepartmentsPage() {
  const [directorName, setDirectorName] = useState('Dr. Director Name');
  const [directorMessage, setDirectorMessage] = useState('');
  const [directorPhoto, setDirectorPhoto] = useState('');
  const [deptList, setDeptList] = useState<any[]>([
    { title: 'Department Of Computer Science', href: '/departments/computing/computer-science/programs', imageLabel: 'COMPUTER SCIENCE' },
    { title: 'Department Of Software Engineering', href: '/departments/computing/software-engineering/programs', imageLabel: 'SOFTWARE ENGINEERING' },
    { title: 'Department Of AI & Data Science', href: '/departments/computing/ai-data-science/programs', imageLabel: 'AI & DATA SCIENCE' },
    { title: 'Department Of Management Sciences', href: '/departments/management', imageLabel: 'MANAGEMENT' },
  ]);

  useEffect(() => {
    const fetchPageData = async () => {
      const homeData = await cmsService.getSetting<any>('homepage_full_content', null);
      if (homeData) {
        if (homeData.directorName) setDirectorName(homeData.directorName);
        if (homeData.directorMessage) setDirectorMessage(homeData.directorMessage);
        if (homeData.directorPhotoUrl) setDirectorPhoto(homeData.directorPhotoUrl);
      }

      const cmsDepts = await cmsService.getDepartments();
      if (cmsDepts && cmsDepts.length > 0) {
        setDeptList(
          cmsDepts.map((d: any) => ({
            title: d.name,
            href: d.code === 'CS' ? '/departments/computing/computer-science/programs' : d.code === 'SE' ? '/departments/computing/software-engineering/programs' : d.code === 'AIDS' ? '/departments/computing/ai-data-science/programs' : '/departments/management',
            imageLabel: d.short_name || d.name,
            image: d.icon_url || d.hero_image_url,
          }))
        );
      }
    };
    fetchPageData();
  }, []);

  return (
    <div className="dept-page-container select-none">
      <AboutPageHero title="All Departments" />

      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[55px] min-[1100px]:pb-[80px]">
        {/* DIRECTOR'S MESSAGE SECTION */}
        <section className="w-full text-center">
          <h2 className="text-[26px] min-[700px]:text-[30px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
            DIRECTOR'S MESSAGE
          </h2>

          <div className="flex flex-col md:flex-row gap-[32px] md:gap-[40px] items-center md:items-start text-left">
            {/* Left Column: Director Photo */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-[190px] h-[235px] bg-[#D9D9D9] rounded-[4px] overflow-hidden flex items-center justify-center p-[16px] text-center mb-[12px] shadow-sm">
                {directorPhoto ? (
                  <img src={directorPhoto} alt={directorName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase">
                    DIRECTOR PHOTO
                  </span>
                )}
              </div>
              <h3 className="text-[16px] font-bold text-[#333333]">{directorName}</h3>
              <p className="text-[13px] font-medium text-[#666666]">Director, FAST-NUCES Multan</p>
            </div>

            {/* Right Column: Message Paragraphs */}
            <div className="flex-1 text-[15px] min-[700px]:text-[16px] leading-[1.7] text-[#444444] space-y-[16px]">
              {directorMessage ? (
                directorMessage.split('\n\n').map((para, idx) => <p key={idx}>{para}</p>)
              ) : (
                <>
                  <p>
                    Welcome to FAST-NUCES Multan Campus. Our mission is to deliver contemporary education, advanced computing facilities, and state-of-the-art research opportunities to nurture competent professionals.
                  </p>
                  <p>
                    Through continuous innovation, active industry partnerships, and high academic standards, our campus prepares graduates for leadership roles in global technology and business sectors.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="dept-divider">
          <div className="dept-divider-line" />
          <div className="dept-divider-dot" />
        </div>

        {/* OUR DEPARTMENTS SECTION */}
        <section className="w-full text-center">
          <h2 className="text-[26px] min-[700px]:text-[30px] font-bold text-[#0C71C3] mb-[32px] text-center">
            Our Departments
          </h2>

          <div className="flex flex-wrap justify-center gap-[24px]">
            {deptList.map((dept, idx) => (
              <div key={idx} className="w-full max-w-[260px]">
                <DepartmentCard
                  title={dept.title}
                  href={dept.href}
                  imageLabel={dept.imageLabel}
                  image={dept.image}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
