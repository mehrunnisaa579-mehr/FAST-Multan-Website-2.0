import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

interface DeptHead {
  id: string;
  department: string;
  headName: string;
  designation: string;
  photoUrl?: string;
  display_order: number;
  is_visible: boolean;
}

export default function SchoolOfComputingPage() {
  const [heroTitle, setHeroTitle] = useState('FAST School Of Computing');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [headName, setHeadName] = useState('');
  const [headDesignation, setHeadDesignation] = useState('');
  const [headPhotoUrl, setHeadPhotoUrl] = useState('');
  const [headMessage, setHeadMessage] = useState('');
  const [departmentHeads, setDepartmentHeads] = useState<DeptHead[] | null>(null);

  useEffect(() => {
    const fetchCmsData = async () => {
      const savedData = await cmsService.getSetting<any>('school_of_computing_content', null);
      if (savedData) {
        if (savedData.heroTitle) setHeroTitle(savedData.heroTitle);
        const heroImg = savedData.heroImageUrl || savedData.hero_image_url || savedData.heroImage || savedData.hero_image || '';
        if (heroImg) setHeroImageUrl(heroImg);

        if (savedData.headName) setHeadName(savedData.headName);
        if (savedData.headDesignation) setHeadDesignation(savedData.headDesignation);
        if (savedData.headPhotoUrl) setHeadPhotoUrl(savedData.headPhotoUrl);
        if (savedData.headMessage) setHeadMessage(savedData.headMessage);
        if (savedData.departmentHeads && Array.isArray(savedData.departmentHeads)) {
          setDepartmentHeads(savedData.departmentHeads);
        }
      }
    };
    fetchCmsData();
  }, []);

  const visibleHeads = departmentHeads ? departmentHeads.filter((h) => h.is_visible !== false) : null;

  return (
    <div className="dept-page-container">
      {/* Shared Hero */}
      <AboutPageHero title={heroTitle} backgroundImage={heroImageUrl} />

      {/* Main Content Area */}
      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[55px] min-[1100px]:pb-[85px]">
        {/* HEAD SCHOOL OF COMPUTING */}
        <section className="w-full text-center">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
            HEAD SCHOOL OF COMPUTING
          </h2>

          <div className="flex flex-col md:flex-row gap-[32px] md:gap-[40px] items-center md:items-start text-left">
            {/* Left Column: Photo Placeholder */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-[190px] h-[235px] rounded-[4px] overflow-hidden flex items-center justify-center mb-[12px] shadow-sm${headPhotoUrl ? '' : ' bg-[#D9D9D9] p-[16px] text-center'}`}>
                {headPhotoUrl ? (
                  <img src={headPhotoUrl} alt={headName || 'Head of School'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase">
                    PLACEHOLDER: HEAD OF SCHOOL PHOTO
                  </span>
                )}
              </div>
              <h3 className="text-[16px] font-bold text-[#333333]">{headName || 'Dr. [Head Name]'}</h3>
              <p className="text-[13px] font-medium text-[#666666]">{headDesignation || 'Head, School of Computing'}</p>
            </div>

            {/* Right Column: Message Paragraphs */}
            <div className="flex-1 text-[15px] min-[700px]:text-[16px] leading-[1.7] text-[#444444] space-y-[16px]">
              {headMessage ? (
                <p>{headMessage}</p>
              ) : (
                <>
                  <p>
                    PLACEHOLDER: Welcome to the FAST School of Computing at Multan Campus. Our school offers top-tier academic degree programs in Computer Science, Software Engineering, and Artificial Intelligence & Data Science.
                  </p>
                  <p>
                    PLACEHOLDER: We are committed to fostering research excellence, practical software development competencies, problem-solving capabilities, and technological leadership to empower students for the global software industry.
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

        {/* DEPARTMENT HEADS */}
        <section className="w-full text-center">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
            DEPARTMENT HEADS
          </h2>

          <div className="dept-card-row flex flex-wrap justify-center gap-[24px]">
            {visibleHeads && visibleHeads.length > 0 ? (
              visibleHeads.map((head) => (
                <div key={head.id} className="w-full max-w-[260px]">
                  <DepartmentCard
                    variant="profile"
                    title={head.headName}
                    subtitle={head.designation || `Head, ${head.department}`}
                    imageUrl={head.photoUrl}
                    imageLabel={`PLACEHOLDER: ${head.department.toUpperCase()} HEAD PHOTO`}
                  />
                </div>
              ))
            ) : (
              <>
                <div className="w-full max-w-[260px]">
                  <DepartmentCard
                    variant="profile"
                    title="Dr. [CS Head Name]"
                    subtitle="Head, Department of Computer Science"
                    imageLabel="PLACEHOLDER: CS HEAD PHOTO"
                  />
                </div>
                <div className="w-full max-w-[260px]">
                  <DepartmentCard
                    variant="profile"
                    title="Dr. [SE Head Name]"
                    subtitle="Head, Department of Software Engineering"
                    imageLabel="PLACEHOLDER: SE HEAD PHOTO"
                  />
                </div>
                <div className="w-full max-w-[260px]">
                  <DepartmentCard
                    variant="profile"
                    title="Dr. [AI Head Name]"
                    subtitle="Incharge, Department of AI"
                    imageLabel="PLACEHOLDER: AI HEAD PHOTO"
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="dept-divider">
          <div className="dept-divider-line" />
          <div className="dept-divider-dot" />
        </div>

        {/* DEPARTMENTS */}
        <section className="w-full text-center">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
            DEPARTMENTS
          </h2>

          <div className="flex flex-col gap-[20px] w-full">
            <DepartmentCard
              variant="banner"
              title="DEPARTMENT OF COMPUTER SCIENCE"
              bgClass="bg-[#0C71C3]"
              href="/departments/computing/computer-science/programs"
            />
            <DepartmentCard
              variant="banner"
              title="DEPARTMENT OF SOFTWARE ENGINEERING"
              bgClass="bg-[#0093DD]"
              href="/departments/computing/software-engineering/programs"
            />
            <DepartmentCard
              variant="banner"
              title="DEPARTMENT OF AI"
              bgClass="bg-[#0C71C3]"
              href="/departments/computing/ai-data-science/programs"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
