import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import MissionPage from './pages/about/MissionPage';
import CampusIntroductionPage from './pages/about/CampusIntroductionPage';
import UniversityCharterPage from './pages/about/UniversityCharterPage';
import CSDepartmentPage from './pages/departments/CSDepartmentPage';
import SchoolOfManagementPage from './pages/departments/SchoolOfManagementPage';
import ManagementProgramsPage from './pages/departments/ManagementProgramsPage';
import ManagementFacultyPage from './pages/departments/ManagementFacultyPage';
import AdministrationStaffPage from './pages/departments/AdministrationStaffPage';
import PersonProfilePage from './pages/departments/PersonProfilePage';
import CSProgramsPage from './pages/departments/CSProgramsPage';
import CSFacultyPage from './pages/departments/CSFacultyPage';
import CSResearchGroupsPage from './pages/departments/CSResearchGroupsPage';
import NewsPage from './pages/news/NewsPage';
import NewsPageTwo from './pages/news/NewsPageTwo';
import NewsDetailPage from './pages/news/NewsDetailPage';
import GatepassApplicationPage from './pages/services/GatepassApplicationPage';
import CareerServicesPage from './pages/services/CareerServicesPage';
import ComplaintManagementPage from './pages/services/ComplaintManagementPage';
import GalleryPage from './pages/campus/GalleryPage';
import DisabilityAccessibilityPage from './pages/useful-links/DisabilityAccessibilityPage';
import GEIAHPage from './pages/useful-links/GEIAHPage';
import StudentGuideBookPage from './pages/useful-links/StudentGuideBookPage';
import BrandIdentityGuidelinePage from './pages/useful-links/BrandIdentityGuidelinePage';
import AboutEDCPage from './pages/edc/AboutEDCPage';
import ConferencesPage from './pages/edc/ConferencesPage';
import ConferenceSpeakersPage from './pages/edc/ConferenceSpeakersPage';
import SummerBootcamp2026Page from './pages/edc/SummerBootcamp2026Page';
import WorkshopDetailPage from './pages/edc/WorkshopDetailPage';
import HighlightsPage from './pages/edc/HighlightsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import SocietyDetailPage from './pages/societies/SocietyDetailPage';
import TechSocPage from './pages/societies/TechSocPage';
import FMMPage from './pages/societies/FMMPage';
import FIGSPage from './pages/societies/FIGSPage';
import DhanakPage from './pages/societies/DhanakPage';
import BayaanPage from './pages/societies/BayaanPage';

/* Admin CMS Imports */
import { AdminAuthProvider } from './admin/auth/AdminAuthProvider';
import RequireAdmin from './admin/auth/RequireAdmin';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminLayout from './admin/layout/AdminLayout';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import AdminHomePageEditor from './admin/pages/AdminHomePageEditor';
import AdminNewsManager from './admin/pages/AdminNewsManager';
import AdminCampusNewsManager from './admin/pages/AdminCampusNewsManager';
import AdminCareerServicesManager from './admin/pages/AdminCareerServicesManager';
import AdminEventsManager from './admin/pages/AdminEventsManager';
import AdminFacultyManager from './admin/pages/AdminFacultyManager';
import AdminCampusManager from './admin/pages/AdminCampusManager';
import AdminServicesOverview from './admin/pages/AdminServicesOverview';
import AdminComplaintManager from './admin/pages/AdminComplaintManager';
import AdminGatepassManager from './admin/pages/AdminGatepassManager';
import AdminEDCOverview from './admin/pages/AdminEDCOverview';
import AdminEDCAboutEditor from './admin/pages/AdminEDCAboutEditor';
import AdminEDCConferencesHub from './admin/pages/AdminEDCConferencesHub';
import AdminEDCConferencesManager from './admin/pages/AdminEDCConferencesManager';
import AdminEDCSpeakersManager from './admin/pages/AdminEDCSpeakersManager';
import AdminEDCWorkshopsHub from './admin/pages/AdminEDCWorkshopsHub';
import AdminEDCSummerBootcampEditor from './admin/pages/AdminEDCSummerBootcampEditor';
import AdminWorkshopEditor from './admin/pages/AdminWorkshopEditor';
import AdminEDCHighlightsManager from './admin/pages/AdminEDCHighlightsManager';
import AdminUsefulLinksOverview from './admin/pages/AdminUsefulLinksOverview';
import AdminDisabilityEditor from './admin/pages/AdminDisabilityEditor';
import AdminGEIAHEditor from './admin/pages/AdminGEIAHEditor';
import AdminStudentGuideBookEditor from './admin/pages/AdminStudentGuideBookEditor';
import AdminBrandGuidelineEditor from './admin/pages/AdminBrandGuidelineEditor';
import AdminSocietiesManager from './admin/pages/AdminSocietiesManager';
import AdminGalleryManager from './admin/pages/AdminGalleryManager';
import AdminHeaderFooterEditor from './admin/pages/AdminHeaderFooterEditor';
import AdminMediaLibrary from './admin/pages/AdminMediaLibrary';
import AdminAboutOverview from './admin/pages/AdminAboutOverview';
import AdminMissionEditor from './admin/pages/AdminMissionEditor';
import AdminCampusIntroductionEditor from './admin/pages/AdminCampusIntroductionEditor';
import AdminUniversityCharterEditor from './admin/pages/AdminUniversityCharterEditor';
import AdminAboutManager from './admin/pages/AdminAboutManager';
import AdminAllDepartmentsManager from './admin/pages/AdminAllDepartmentsManager';
import AdminDepartmentsManager from './admin/pages/AdminDepartmentsManager';
import AdminManageDepartmentsHub from './admin/pages/AdminManageDepartmentsHub';
import AdminCSDepartmentEditor from './admin/pages/AdminCSDepartmentEditor';
import AdminSEDepartmentEditor from './admin/pages/AdminSEDepartmentEditor';
import AdminAIDepartmentEditor from './admin/pages/AdminAIDepartmentEditor';
import AdminSchoolOfComputingManager from './admin/pages/AdminSchoolOfComputingManager';
import AdminSchoolOfManagementManager from './admin/pages/AdminSchoolOfManagementManager';
import AdminAdministrationStaffManager from './admin/pages/AdminAdministrationStaffManager';
import AdminSchoolsManager from './admin/pages/AdminSchoolsManager';
import AdminProgramsManager from './admin/pages/AdminProgramsManager';
import AdminResearchGroupsManager from './admin/pages/AdminResearchGroupsManager';
import AdminServicesManager from './admin/pages/AdminServicesManager';
import AdminEdcManager from './admin/pages/AdminEdcManager';
import AdminUsefulLinksManager from './admin/pages/AdminUsefulLinksManager';
import AdminSettingsManager from './admin/pages/AdminSettingsManager';
import AdminArchiveManager from './admin/pages/AdminArchiveManager';

export default function App() {
  useEffect(() => {
    document.title = 'FAST-NUCES Multan Campus';
  }, []);

  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about/mission" element={<MissionPage />} />
            <Route path="about/campus-introduction" element={<CampusIntroductionPage />} />
            <Route path="about/university-charter" element={<UniversityCharterPage />} />
            <Route path="departments/computer-science" element={<CSDepartmentPage />} />
            <Route path="departments/computing/computer-science" element={<Navigate to="/departments/computer-science" replace />} />
            <Route path="departments/computing/computer-science/programs" element={<CSProgramsPage />} />
            <Route path="departments/computing/computer-science/faculty" element={<CSFacultyPage />} />
            <Route path="departments/computing/computer-science/research-groups" element={<CSResearchGroupsPage />} />
            <Route path="departments/management" element={<SchoolOfManagementPage />} />
            <Route path="departments/management/programs" element={<ManagementProgramsPage />} />
            <Route path="departments/management/faculty" element={<ManagementFacultyPage />} />
            <Route path="departments/administration-staff" element={<AdministrationStaffPage />} />
            <Route path="staff/:slug" element={<PersonProfilePage />} />
            <Route path="people/:slug" element={<PersonProfilePage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news/page/2" element={<NewsPageTwo />} />
            <Route path="news/:slug" element={<NewsDetailPage />} />
            <Route path="services/complaint-management" element={<ComplaintManagementPage />} />
            <Route path="services/gatepass-application" element={<GatepassApplicationPage />} />
            <Route path="services/career-services-office" element={<CareerServicesPage />} />
            <Route path="campus/gallery" element={<GalleryPage />} />
            <Route path="campus/societies/:slug" element={<SocietyDetailPage />} />
            <Route path="useful-links/disability-accessibility" element={<DisabilityAccessibilityPage />} />
            <Route path="useful-links/geiah" element={<GEIAHPage />} />
            <Route path="useful-links/student-guide-book" element={<StudentGuideBookPage />} />
            <Route path="useful-links/brand-identity-guideline" element={<BrandIdentityGuidelinePage />} />
            <Route path="edc/about" element={<AboutEDCPage />} />
            <Route path="edc/conferences" element={<ConferencesPage />} />
            <Route path="edc/conferences/speakers" element={<ConferenceSpeakersPage />} />
            <Route path="edc/workshops/summer-bootcamp-2026" element={<SummerBootcamp2026Page />} />
            <Route path="edc/workshops/:slug" element={<WorkshopDetailPage />} />
            <Route path="edc/highlights" element={<HighlightsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms-of-use" element={<TermsOfUsePage />} />
          </Route>

          {/* Admin CMS Routes */}
          <Route path="/admin-panel5463/login" element={<AdminLoginPage />} />
          <Route path="/admin-panel5463" element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="homepage" element={<AdminHomePageEditor />} />
              <Route path="about" element={<AdminAboutManager />} />
              <Route path="all-departments" element={<AdminAllDepartmentsManager />} />
              <Route path="departments" element={<AdminDepartmentsManager />} />
              <Route path="manage-departments" element={<AdminManageDepartmentsHub />} />
              <Route path="departments/cs" element={<AdminCSDepartmentEditor />} />
              <Route path="departments/se" element={<AdminSEDepartmentEditor />} />
              <Route path="departments/ai" element={<AdminAIDepartmentEditor />} />
              <Route path="school-of-computing" element={<AdminSchoolOfComputingManager />} />
              <Route path="school-of-management" element={<AdminSchoolOfManagementManager />} />
              <Route path="administration-staff" element={<AdminAdministrationStaffManager />} />
              <Route path="schools" element={<AdminSchoolsManager />} />
              <Route path="programs" element={<AdminProgramsManager />} />
              <Route path="faculty" element={<AdminFacultyManager />} />
              <Route path="research-groups" element={<AdminResearchGroupsManager />} />
              <Route path="news" element={<AdminNewsManager />} />
              <Route path="campus-news" element={<AdminCampusNewsManager />} />
              <Route path="career-services" element={<AdminCareerServicesManager />} />
              <Route path="events" element={<AdminEventsManager />} />
              <Route path="campus" element={<AdminCampusManager />} />
              <Route path="societies" element={<AdminSocietiesManager />} />
              <Route path="about" element={<AdminAboutOverview />} />
              <Route path="about/mission" element={<AdminMissionEditor />} />
              <Route path="about/campus-introduction" element={<AdminCampusIntroductionEditor />} />
              <Route path="about/university-charter" element={<AdminUniversityCharterEditor />} />
              <Route path="gallery" element={<AdminGalleryManager />} />
              <Route path="services" element={<AdminServicesOverview />} />
              <Route path="complaint-management" element={<AdminComplaintManager />} />
              <Route path="gatepass-application" element={<AdminGatepassManager />} />
              <Route path="edc" element={<AdminEDCOverview />} />
              <Route path="edc/about" element={<AdminEDCAboutEditor />} />
              <Route path="edc/conferences-hub" element={<AdminEDCConferencesHub />} />
              <Route path="edc/conferences" element={<AdminEDCConferencesManager />} />
              <Route path="edc/conferences/speakers" element={<AdminEDCSpeakersManager />} />
              <Route path="edc/workshops-hub" element={<AdminEDCWorkshopsHub />} />
              <Route path="edc/workshops/summer-bootcamp-2026" element={<AdminEDCSummerBootcampEditor />} />
              <Route path="edc/workshops/:slug/edit" element={<AdminWorkshopEditor />} />
              <Route path="edc/highlights" element={<AdminEDCHighlightsManager />} />
              <Route path="useful-links" element={<AdminUsefulLinksOverview />} />
              <Route path="useful-links/disability-accessibility" element={<AdminDisabilityEditor />} />
              <Route path="useful-links/geiah" element={<AdminGEIAHEditor />} />
              <Route path="useful-links/student-guide-book" element={<AdminStudentGuideBookEditor />} />
              <Route path="useful-links/brand-identity-guideline" element={<AdminBrandGuidelineEditor />} />
              <Route path="header-footer" element={<AdminHeaderFooterEditor />} />
              <Route path="media" element={<AdminMediaLibrary />} />
              <Route path="archive" element={<AdminArchiveManager />} />
              <Route path="settings" element={<AdminSettingsManager />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
