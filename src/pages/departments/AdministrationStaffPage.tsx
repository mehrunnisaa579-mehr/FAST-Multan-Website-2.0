import AboutPageHero from '../../components/about/AboutPageHero';
import StaffAccordion from '../../components/departments/StaffAccordion';
import '../../styles/department-pages.css';

export default function AdministrationStaffPage() {
  return (
    <div className="dept-page-container">
      {/* Shared Hero */}
      <AboutPageHero title="Administration Staff" />

      {/* Main Content Area */}
      <div className="w-full max-w-[1380px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[45px] min-[1100px]:pb-[75px]">
        <StaffAccordion />
      </div>
    </div>
  );
}
