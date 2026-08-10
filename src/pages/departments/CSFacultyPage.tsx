import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { csFaculty } from '../../data/departments';
import '../../styles/department-pages.css';

export default function CSFacultyPage() {
  return (
    <div className="department-page-bg">
      {/* Shared Hero */}
      <AboutPageHero title="Department Of Computer Science" />

      {/* Main Content Area */}
      <div className="department-content-wrapper text-left">
        {/* Department Faculty Section */}
        <div>
          <h2 className="text-[22px] min-[700px]:text-[24px] font-bold text-[#0C71C3] uppercase mb-[28px]">
            Department Faculty
          </h2>

          <div className="flex flex-wrap justify-center gap-[24px]">
            {csFaculty.map((fac) => (
              <div key={fac.id} className="w-full max-w-[240px] sm:w-[230px]">
                <DepartmentCard
                  title={fac.name}
                  role={fac.designation}
                  imageLabel={fac.photoPlaceholder}
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
