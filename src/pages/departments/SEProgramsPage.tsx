import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { sePrograms } from '../../data/departments';
import '../../styles/department-pages.css';

export default function SEProgramsPage() {
  return (
    <div className="department-page-bg">
      {/* Shared Hero */}
      <AboutPageHero title="Department Of Software Engineering" />

      {/* Main Content Area */}
      <div className="department-content-wrapper text-left">
        {/* HOD's Message Section */}
        <div className="mb-[40px]">
          <h2 className="text-[22px] min-[700px]:text-[24px] font-bold text-[#0C71C3] uppercase mb-[20px]">
            Head Of Department's Message
          </h2>

          <div className="flex flex-col md:flex-row gap-[24px] items-start bg-white p-[24px] border border-[#EAEAEA] rounded-[4px] shadow-sm">
            {/* HOD Profile Card */}
            <div className="w-full md:w-[200px] flex-shrink-0">
              <DepartmentCard
                title="Dr. PLACEHOLDER: HOD SE"
                role="Head of Department"
                imageLabel="PLACEHOLDER: HOD PHOTO"
                variant="profile"
              />
            </div>

            {/* Message Text */}
            <div className="flex-1 space-y-[12px] text-[15px] leading-[1.75] text-[#444444]">
              <p>
                PLACEHOLDER: Welcome to the Department of Software Engineering at FAST-NUCES Multan Campus. Our department focuses on software design methodologies, quality assurance, system architecture, and agile software development principles.
              </p>
              <p>
                PLACEHOLDER: Our hands-on project-oriented curriculum empowers students to build industrial-grade software applications and lead software development teams.
              </p>
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
            {sePrograms.map((prog) => (
              <div key={prog.id} className="w-full max-w-[340px]">
                <DepartmentCard
                  title={prog.title}
                  subtitle={prog.subtitle}
                  imageLabel={prog.imageLabel}
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
