import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import '../../styles/department-pages.css';

export default function SchoolOfManagementPage() {
  return (
    <div className="dept-page-container">
      {/* Shared Hero */}
      <AboutPageHero title="FAST School Of Management" />

      {/* Main Content Area */}
      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[55px] min-[1100px]:pb-[85px]">
        {/* HOD'S MESSAGE */}
        <section className="w-full text-center">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
            HOD'S MESSAGE
          </h2>

          <div className="flex flex-col md:flex-row gap-[32px] md:gap-[40px] items-center md:items-start text-left">
            {/* Left Column: Photo Placeholder */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-[190px] h-[235px] bg-[#D9D9D9] rounded-[4px] flex items-center justify-center p-[16px] text-center mb-[12px] shadow-sm">
                <span className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase">
                  PLACEHOLDER: HOD PHOTO
                </span>
              </div>
              <h3 className="text-[16px] font-bold text-[#333333]">Dr. [HOD Name]</h3>
              <p className="text-[13px] font-medium text-[#666666]">Head, FAST School of Management</p>
            </div>

            {/* Right Column: Message Paragraphs */}
            <div className="flex-1 text-[15px] min-[700px]:text-[16px] leading-[1.7] text-[#444444] space-y-[16px]">
              <p>
                PLACEHOLDER: Welcome to the FAST School of Management Sciences at Multan Campus. We offer comprehensive business administration and management degrees focused on strategic decision-making, financial analytics, and entrepreneurial leadership.
              </p>
              <p>
                PLACEHOLDER: Our programs equip students with modern managerial frameworks, digital business skills, and analytical capabilities required to lead contemporary corporate and financial institutions.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="dept-divider">
          <div className="dept-divider-line" />
          <div className="dept-divider-dot" />
        </div>

        {/* OUR PROGRAMS */}
        <section className="w-full text-center">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] mb-[28px] text-center">
            Our Programs
          </h2>

          <div className="flex flex-wrap justify-center gap-[24px] max-w-[1050px] mx-auto">
            <div className="w-full max-w-[320px]">
              <DepartmentCard
                variant="program"
                title="BBA"
                subtitle="Bachelor of Business Administration"
                imageLabel="PLACEHOLDER: BBA PROGRAM"
              />
            </div>
            <div className="w-full max-w-[320px]">
              <DepartmentCard
                variant="program"
                title="BS (Business Analytics)"
                subtitle="BS Business Analytics"
                imageLabel="PLACEHOLDER: BS ANALYTICS"
              />
            </div>
            <div className="w-full max-w-[320px]">
              <DepartmentCard
                variant="program"
                title="BS (Financial Technology)"
                subtitle="BS FinTech"
                imageLabel="PLACEHOLDER: BS FINTECH"
              />
            </div>
            <div className="w-full max-w-[320px]">
              <DepartmentCard
                variant="program"
                title="MBA"
                subtitle="Master of Business Administration"
                imageLabel="PLACEHOLDER: MBA PROGRAM"
              />
            </div>
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="dept-divider">
          <div className="dept-divider-line" />
          <div className="dept-divider-dot" />
        </div>

        {/* IMPORTANT LINKS */}
        <section className="w-full text-center">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] mb-[20px] text-center">
            Important Links
          </h2>

          <div className="text-center">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[16px] text-[#0C71C3] font-semibold hover:underline cursor-pointer"
            >
              PLACEHOLDER: Department Important Link
            </a>
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="dept-divider">
          <div className="dept-divider-line" />
          <div className="dept-divider-dot" />
        </div>

        {/* DEPARTMENT FACULTY */}
        <section className="w-full text-center">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] mb-[28px] text-center">
            Department Faculty
          </h2>

          <div className="flex flex-wrap justify-center gap-[24px]">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="w-full max-w-[240px] sm:w-[230px]">
                <DepartmentCard
                  variant="faculty"
                  title={`Dr. [Faculty ${idx + 1}]`}
                  role={idx % 2 === 0 ? 'Assistant Professor' : 'Lecturer'}
                  imageLabel={`FACULTY MEMBER ${idx + 1}`}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
