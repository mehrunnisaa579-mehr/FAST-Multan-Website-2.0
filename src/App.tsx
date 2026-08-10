import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import MissionPage from './pages/about/MissionPage';
import CampusIntroductionPage from './pages/about/CampusIntroductionPage';
import UniversityCharterPage from './pages/about/UniversityCharterPage';
import AllDepartmentsPage from './pages/departments/AllDepartmentsPage';
import SchoolOfComputingPage from './pages/departments/SchoolOfComputingPage';
import SchoolOfManagementPage from './pages/departments/SchoolOfManagementPage';
import AdministrationStaffPage from './pages/departments/AdministrationStaffPage';
import CSProgramsPage from './pages/departments/CSProgramsPage';
import CSFacultyPage from './pages/departments/CSFacultyPage';
import CSResearchGroupsPage from './pages/departments/CSResearchGroupsPage';
import SEProgramsPage from './pages/departments/SEProgramsPage';
import SEFacultyPage from './pages/departments/SEFacultyPage';
import AIDSProgramsPage from './pages/departments/AIDSProgramsPage';
import AIDSFacultyPage from './pages/departments/AIDSFacultyPage';
import NewsPage from './pages/news/NewsPage';
import NewsPageTwo from './pages/news/NewsPageTwo';
import GatepassApplicationPage from './pages/services/GatepassApplicationPage';
import CareerServicesPage from './pages/services/CareerServicesPage';
import GalleryPage from './pages/campus/GalleryPage';
import DisabilityAccessibilityPage from './pages/useful-links/DisabilityAccessibilityPage';
import GEIAHPage from './pages/useful-links/GEIAHPage';
import StudentGuideBookPage from './pages/useful-links/StudentGuideBookPage';
import BrandIdentityGuidelinePage from './pages/useful-links/BrandIdentityGuidelinePage';
import AboutEDCPage from './pages/edc/AboutEDCPage';
import ConferencesPage from './pages/edc/ConferencesPage';
import ConferenceSpeakersPage from './pages/edc/ConferenceSpeakersPage';
import SummerBootcamp2026Page from './pages/edc/SummerBootcamp2026Page';
import HighlightsPage from './pages/edc/HighlightsPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
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
import AdminSocietiesManager from './admin/pages/AdminSocietiesManager';
import AdminGalleryManager from './admin/pages/AdminGalleryManager';
import AdminHeaderFooterEditor from './admin/pages/AdminHeaderFooterEditor';
import AdminMediaLibrary from './admin/pages/AdminMediaLibrary';
import AdminAboutManager from './admin/pages/AdminAboutManager';
import AdminDepartmentsManager from './admin/pages/AdminDepartmentsManager';
import AdminSchoolsManager from './admin/pages/AdminSchoolsManager';
import AdminProgramsManager from './admin/pages/AdminProgramsManager';
import AdminResearchGroupsManager from './admin/pages/AdminResearchGroupsManager';
import AdminServicesManager from './admin/pages/AdminServicesManager';
import AdminEdcManager from './admin/pages/AdminEdcManager';
import AdminUsefulLinksManager from './admin/pages/AdminUsefulLinksManager';
import AdminSettingsManager from './admin/pages/AdminSettingsManager';

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
            <Route path="departments" element={<AllDepartmentsPage />} />
            <Route path="departments/computing" element={<SchoolOfComputingPage />} />
            <Route path="departments/computing/computer-science/programs" element={<CSProgramsPage />} />
            <Route path="departments/computing/computer-science/faculty" element={<CSFacultyPage />} />
            <Route path="departments/computing/computer-science/research-groups" element={<CSResearchGroupsPage />} />
            <Route path="departments/computing/software-engineering/programs" element={<SEProgramsPage />} />
            <Route path="departments/computing/software-engineering/faculty" element={<SEFacultyPage />} />
            <Route path="departments/computing/ai-data-science/programs" element={<AIDSProgramsPage />} />
            <Route path="departments/computing/ai-data-science/faculty" element={<AIDSFacultyPage />} />
            <Route path="departments/management" element={<SchoolOfManagementPage />} />
            <Route path="departments/administration-staff" element={<AdministrationStaffPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news/page/2" element={<NewsPageTwo />} />
            <Route path="services/gatepass-application" element={<GatepassApplicationPage />} />
            <Route path="services/career-services-office" element={<CareerServicesPage />} />
            <Route path="campus/gallery" element={<GalleryPage />} />
            <Route path="campus/societies/techsoc" element={<TechSocPage />} />
            <Route path="campus/societies/fmm" element={<FMMPage />} />
            <Route path="campus/societies/figs" element={<FIGSPage />} />
            <Route path="campus/societies/dhanak" element={<DhanakPage />} />
            <Route path="campus/societies/bayaan" element={<BayaanPage />} />
            <Route path="useful-links/disability-accessibility" element={<DisabilityAccessibilityPage />} />
            <Route path="useful-links/geiah" element={<GEIAHPage />} />
            <Route path="useful-links/student-guide-book" element={<StudentGuideBookPage />} />
            <Route path="useful-links/brand-identity-guideline" element={<BrandIdentityGuidelinePage />} />
            <Route path="edc/about" element={<AboutEDCPage />} />
            <Route path="edc/conferences" element={<ConferencesPage />} />
            <Route path="edc/conferences/speakers" element={<ConferenceSpeakersPage />} />
            <Route path="edc/workshops/summer-bootcamp-2026" element={<SummerBootcamp2026Page />} />
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
              <Route path="departments" element={<AdminDepartmentsManager />} />
              <Route path="schools" element={<AdminSchoolsManager />} />
              <Route path="programs" element={<AdminProgramsManager />} />
              <Route path="faculty" element={<AdminFacultyManager />} />
              <Route path="research-groups" element={<AdminResearchGroupsManager />} />
              <Route path="news" element={<AdminNewsManager />} />
              <Route path="campus-news" element={<AdminCampusNewsManager />} />
              <Route path="career-services" element={<AdminCareerServicesManager />} />
              <Route path="events" element={<AdminEventsManager />} />
              <Route path="societies" element={<AdminSocietiesManager />} />
              <Route path="gallery" element={<AdminGalleryManager />} />
              <Route path="services" element={<AdminServicesManager />} />
              <Route path="edc" element={<AdminEdcManager />} />
              <Route path="useful-links" element={<AdminUsefulLinksManager />} />
              <Route path="header-footer" element={<AdminHeaderFooterEditor />} />
              <Route path="media" element={<AdminMediaLibrary />} />
              <Route path="settings" element={<AdminSettingsManager />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
