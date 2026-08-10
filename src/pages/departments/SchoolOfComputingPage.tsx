import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import '../../styles/department-pages.css';

export default function SchoolOfComputingPage() {
  return (
    <div className="dept-page-container">
      {/* Shared Hero */}
      <AboutPageHero title="FAST School Of Computing" />

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
              <div className="w-[190px] h-[235px] bg-[#D9D9D9] rounded-[4px] flex items-center justify-center p-[16px] text-center mb-[12px] shadow-sm">
                <span className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase">
                  PLACEHOLDER: HEAD OF SCHOOL PHOTO
                </span>
              </div>
              <h3 className="text-[16px] font-bold text-[#333333]">Dr. [Head Name]</h3>
              <p className="text-[13px] font-medium text-[#666666]">Head, School of Computing</p>
            </div>

            {/* Right Column: Message Paragraphs */}
            <div className="flex-1 text-[15px] min-[700px]:text-[16px] leading-[1.7] text-[#444444] space-y-[16px]">
              <p>
                PLACEHOLDER: Welcome to the FAST School of Computing at Multan Campus. Our school offers top-tier academic degree programs in Computer Science, Software Engineering, and Artificial Intelligence & Data Science.
              </p>
              <p>
                PLACEHOLDER: We are committed to fostering research excellence, practical software development competencies, problem-solving capabilities, and technological leadership to empower students for the global software industry.
              </p>
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

          <div className="grid grid-cols-1 min-[700px]:grid-cols-3 gap-[24px]">
            <DepartmentCard
              variant="profile"
              title="Dr. [CS Head Name]"
              subtitle="Head, Department of Computer Science"
              imageLabel="PLACEHOLDER: CS HEAD PHOTO"
            />
            <DepartmentCard
              variant="profile"
              title="Dr. [SE Head Name]"
              subtitle="Head, Department of Software Engineering"
              imageLabel="PLACEHOLDER: SE HEAD PHOTO"
            />
            <DepartmentCard
              variant="profile"
              title="Dr. [AI Head Name]"
              subtitle="Incharge, Department of AI"
              imageLabel="PLACEHOLDER: AI HEAD PHOTO"
            />
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
