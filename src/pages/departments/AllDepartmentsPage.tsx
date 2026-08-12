import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function AllDepartmentsPage() {
  const [heroTitle, setHeroTitle] = useState('All Departments');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [directorName, setDirectorName] = useState('Dr. Director Name');
  const [directorDesignation, setDirectorDesignation] = useState('Director, FAST-NUCES Multan');
  const [directorMessage, setDirectorMessage] = useState('');
  const [directorPhoto, setDirectorPhoto] = useState('');
  const [deptSectionTitle, setDeptSectionTitle] = useState('Our Departments');

  const [deptList, setDeptList] = useState<any[]>([
    { title: 'Department Of Computer Science', href: '/departments/computing/computer-science', imageLabel: 'COMPUTER SCIENCE' },
    { title: 'Department Of Software Engineering', href: '/departments/computing/software-engineering', imageLabel: 'SOFTWARE ENGINEERING' },
    { title: 'Department Of AI & Data Science', href: '/departments/computing/ai-data-science', imageLabel: 'AI & DATA SCIENCE' },
    { title: 'Department Of Management Sciences', href: '/departments/management', imageLabel: 'MANAGEMENT' },
  ]);

  useEffect(() => {
    const fetchPageData = async () => {
      // 1. Try fetching primary All Departments CMS setting
      const savedData = await cmsService.getSetting<any>('all_departments_content', null);
      const homeData = await cmsService.getSetting<any>('homepage_full_content', null);

      if (savedData) {
        if (savedData.heroTitle) setHeroTitle(savedData.heroTitle);
        if (savedData.heroImageUrl) setHeroImageUrl(savedData.heroImageUrl);
        if (savedData.directorName) setDirectorName(savedData.directorName);
        if (savedData.directorDesignation) setDirectorDesignation(savedData.directorDesignation);
        if (savedData.directorMessage) setDirectorMessage(savedData.directorMessage);
        if (savedData.directorPhotoUrl) setDirectorPhoto(savedData.directorPhotoUrl);
        if (savedData.deptSectionTitle) setDeptSectionTitle(savedData.deptSectionTitle);

        if (Array.isArray(savedData.deptCards) && savedData.deptCards.length > 0) {
          const visibleCards = savedData.deptCards
            .filter((c: any) => c.is_visible ?? true)
            .map((c: any) => ({
              title: c.title,
              href: c.href || '/departments',
              imageLabel: c.imageLabel || c.title,
              image: c.image || '',
            }));
          if (visibleCards.length > 0) {
            setDeptList(visibleCards);
            return;
          }
        }
      } else if (homeData) {
        if (homeData.directorName) setDirectorName(homeData.directorName);
        if (homeData.directorMessage) setDirectorMessage(homeData.directorMessage);
        if (homeData.directorPhotoUrl) setDirectorPhoto(homeData.directorPhotoUrl);
      }

      // 2. Fallback to Supabase departments table if no custom cards saved
      const cmsDepts = await cmsService.getDepartments();
      if (cmsDepts && cmsDepts.length > 0) {
        setDeptList(
          cmsDepts.map((d: any) => ({
            title: d.name,
            href:
              d.code === 'CS'
                ? '/departments/computing/computer-science'
                : d.code === 'SE'
                ? '/departments/computing/software-engineering'
                : d.code === 'AIDS'
                ? '/departments/computing/ai-data-science'
                : '/departments/management',
            imageLabel: d.short_name || d.name,
            image: d.icon_url || d.hero_image_url,
          }))
        );
      }
    };

    fetchPageData();
  }, []);

  return (
    <div className="dept-page-container">
      <AboutPageHero title={heroTitle} backgroundImage={heroImageUrl} />

      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[55px] min-[1100px]:pb-[80px]">
        {/* DIRECTOR'S MESSAGE SECTION */}
        <section className="w-full text-center">
          <h2 className="text-[26px] min-[700px]:text-[30px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
            DIRECTOR'S MESSAGE
          </h2>

          <div className="flex flex-col md:flex-row gap-[32px] md:gap-[40px] items-center md:items-start text-left">
            {/* Left Column: Director Photo */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-[190px] h-[235px] rounded-[4px] overflow-hidden flex items-center justify-center mb-[12px] shadow-sm${directorPhoto ? '' : ' bg-[#D9D9D9] p-[8px]'}`}>
                {directorPhoto ? (
                  <img src={directorPhoto} alt={directorName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase text-center">
                    DIRECTOR PHOTO
                  </span>
                )}
              </div>
              <h3 className="text-[16px] font-bold text-[#333333]">{directorName}</h3>
              <p className="text-[13px] font-medium text-[#666666]">{directorDesignation}</p>
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
            {deptSectionTitle}
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
