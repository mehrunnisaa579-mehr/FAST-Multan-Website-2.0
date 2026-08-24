import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import SiteLayout from './components/layout/SiteLayout';
const HomePage = lazy(() => import('./pages/HomePage'));
const MissionPage = lazy(() => import('./pages/about/MissionPage'));
const CampusIntroductionPage = lazy(() => import('./pages/about/CampusIntroductionPage'));
const UniversityCharterPage = lazy(() => import('./pages/about/UniversityCharterPage'));
const CSDepartmentPage = lazy(() => import('./pages/departments/CSDepartmentPage'));
const SchoolOfManagementPage = lazy(() => import('./pages/departments/SchoolOfManagementPage'));
const ManagementProgramsPage = lazy(() => import('./pages/departments/ManagementProgramsPage'));
const ManagementFacultyPage = lazy(() => import('./pages/departments/ManagementFacultyPage'));
const AdministrationStaffPage = lazy(() => import('./pages/departments/AdministrationStaffPage'));
const PersonProfilePage = lazy(() => import('./pages/departments/PersonProfilePage'));
const CSProgramsPage = lazy(() => import('./pages/departments/CSProgramsPage'));
const CSFacultyPage = lazy(() => import('./pages/departments/CSFacultyPage'));
const CSResearchGroupsPage = lazy(() => import('./pages/departments/CSResearchGroupsPage'));
const NewsPage = lazy(() => import('./pages/news/NewsPage'));
const NewsPageTwo = lazy(() => import('./pages/news/NewsPageTwo'));
const NewsDetailPage = lazy(() => import('./pages/news/NewsDetailPage'));
const GatepassApplicationPage = lazy(() => import('./pages/services/GatepassApplicationPage'));
const ComplaintManagementPage = lazy(() => import('./pages/services/ComplaintManagementPage'));
const GalleryPage = lazy(() => import('./pages/campus/GalleryPage'));
const DisabilityAccessibilityPage = lazy(() => import('./pages/useful-links/DisabilityAccessibilityPage'));
const GEIAHPage = lazy(() => import('./pages/useful-links/GEIAHPage'));
const StudentGuideBookPage = lazy(() => import('./pages/useful-links/StudentGuideBookPage'));
const BrandIdentityGuidelinePage = lazy(() => import('./pages/useful-links/BrandIdentityGuidelinePage'));
const AcademicCalendarPage = lazy(() => import('./pages/useful-links/AcademicCalendarPage'));
const AboutEDCPage = lazy(() => import('./pages/edc/AboutEDCPage'));
const ConferencesPage = lazy(() => import('./pages/edc/ConferencesPage'));
const ConferenceSpeakersPage = lazy(() => import('./pages/edc/ConferenceSpeakersPage'));
const SummerBootcamp2026Page = lazy(() => import('./pages/edc/SummerBootcamp2026Page'));
const WorkshopDetailPage = lazy(() => import('./pages/edc/WorkshopDetailPage'));
const HighlightsPage = lazy(() => import('./pages/edc/HighlightsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'));
const SocietyDetailPage = lazy(() => import('./pages/societies/SocietyDetailPage'));
const TechSocPage = lazy(() => import('./pages/societies/TechSocPage'));
const FMMPage = lazy(() => import('./pages/societies/FMMPage'));
const FIGSPage = lazy(() => import('./pages/societies/FIGSPage'));
const DhanakPage = lazy(() => import('./pages/societies/DhanakPage'));
const BayaanPage = lazy(() => import('./pages/societies/BayaanPage'));
const WebTeamPage = lazy(() => import('./pages/WebTeamPage'));

/* Admin CMS Imports */
import { AdminAuthProvider } from './admin/auth/AdminAuthProvider';
import RequireAdmin from './admin/auth/RequireAdmin';
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage'));
const AdminLayout = lazy(() => import('./admin/layout/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./admin/pages/AdminDashboardPage'));
const AdminHomePageEditor = lazy(() => import('./admin/pages/AdminHomePageEditor'));
const AdminNewsManager = lazy(() => import('./admin/pages/AdminNewsManager'));
const AdminCampusNewsManager = lazy(() => import('./admin/pages/AdminCampusNewsManager'));
const AdminEventsManager = lazy(() => import('./admin/pages/AdminEventsManager'));
const AdminFacultyManager = lazy(() => import('./admin/pages/AdminFacultyManager'));
const AdminCampusManager = lazy(() => import('./admin/pages/AdminCampusManager'));
const AdminServicesOverview = lazy(() => import('./admin/pages/AdminServicesOverview'));
const AdminComplaintManager = lazy(() => import('./admin/pages/AdminComplaintManager'));
const AdminGatepassManager = lazy(() => import('./admin/pages/AdminGatepassManager'));
const AdminEDCOverview = lazy(() => import('./admin/pages/AdminEDCOverview'));
const AdminEDCAboutEditor = lazy(() => import('./admin/pages/AdminEDCAboutEditor'));
const AdminEDCConferencesHub = lazy(() => import('./admin/pages/AdminEDCConferencesHub'));
const AdminEDCConferencesManager = lazy(() => import('./admin/pages/AdminEDCConferencesManager'));
const AdminEDCSpeakersManager = lazy(() => import('./admin/pages/AdminEDCSpeakersManager'));
const AdminEDCWorkshopsHub = lazy(() => import('./admin/pages/AdminEDCWorkshopsHub'));
const AdminEDCSummerBootcampEditor = lazy(() => import('./admin/pages/AdminEDCSummerBootcampEditor'));
const AdminWorkshopEditor = lazy(() => import('./admin/pages/AdminWorkshopEditor'));
const AdminEDCHighlightsManager = lazy(() => import('./admin/pages/AdminEDCHighlightsManager'));
const AdminUsefulLinksOverview = lazy(() => import('./admin/pages/AdminUsefulLinksOverview'));
const AdminDisabilityEditor = lazy(() => import('./admin/pages/AdminDisabilityEditor'));
const AdminGEIAHEditor = lazy(() => import('./admin/pages/AdminGEIAHEditor'));
const AdminStudentGuideBookEditor = lazy(() => import('./admin/pages/AdminStudentGuideBookEditor'));
const AdminBrandGuidelineEditor = lazy(() => import('./admin/pages/AdminBrandGuidelineEditor'));
const AdminAcademicCalendarEditor = lazy(() => import('./admin/pages/AdminAcademicCalendarEditor'));
const AdminSocietiesManager = lazy(() => import('./admin/pages/AdminSocietiesManager'));
const AdminGalleryManager = lazy(() => import('./admin/pages/AdminGalleryManager'));
const AdminHeaderFooterEditor = lazy(() => import('./admin/pages/AdminHeaderFooterEditor'));
const AdminMediaLibrary = lazy(() => import('./admin/pages/AdminMediaLibrary'));
const AdminAboutOverview = lazy(() => import('./admin/pages/AdminAboutOverview'));
const AdminMissionEditor = lazy(() => import('./admin/pages/AdminMissionEditor'));
const AdminCampusIntroductionEditor = lazy(() => import('./admin/pages/AdminCampusIntroductionEditor'));
const AdminUniversityCharterEditor = lazy(() => import('./admin/pages/AdminUniversityCharterEditor'));
const AdminAboutManager = lazy(() => import('./admin/pages/AdminAboutManager'));
const AdminAllDepartmentsManager = lazy(() => import('./admin/pages/AdminAllDepartmentsManager'));
const AdminDepartmentsManager = lazy(() => import('./admin/pages/AdminDepartmentsManager'));
const AdminManageDepartmentsHub = lazy(() => import('./admin/pages/AdminManageDepartmentsHub'));
const AdminCSDepartmentEditor = lazy(() => import('./admin/pages/AdminCSDepartmentEditor'));
const AdminSEDepartmentEditor = lazy(() => import('./admin/pages/AdminSEDepartmentEditor'));
const AdminAIDepartmentEditor = lazy(() => import('./admin/pages/AdminAIDepartmentEditor'));
const AdminSchoolOfComputingManager = lazy(() => import('./admin/pages/AdminSchoolOfComputingManager'));
const AdminSchoolOfManagementManager = lazy(() => import('./admin/pages/AdminSchoolOfManagementManager'));
const AdminAdministrationStaffManager = lazy(() => import('./admin/pages/AdminAdministrationStaffManager'));
const AdminSchoolsManager = lazy(() => import('./admin/pages/AdminSchoolsManager'));
const AdminProgramsManager = lazy(() => import('./admin/pages/AdminProgramsManager'));
const AdminResearchGroupsManager = lazy(() => import('./admin/pages/AdminResearchGroupsManager'));
const AdminServicesManager = lazy(() => import('./admin/pages/AdminServicesManager'));
const AdminEdcManager = lazy(() => import('./admin/pages/AdminEdcManager'));
const AdminUsefulLinksManager = lazy(() => import('./admin/pages/AdminUsefulLinksManager'));
const AdminSettingsManager = lazy(() => import('./admin/pages/AdminSettingsManager'));
const AdminWebTeamManager = lazy(() => import('./admin/pages/AdminWebTeamManager'));
const AdminArchiveManager = lazy(() => import('./admin/pages/AdminArchiveManager'));

const GenericDepartmentPage = lazy(() => import('./pages/departments/GenericDepartmentPage'));
const AdminGenericDepartmentEditor = lazy(() => import('./admin/pages/AdminGenericDepartmentEditor'));

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
            <Route element={
              <Suspense fallback={
                <div className="flex items-center justify-center h-[60vh]">
                  <div className="w-10 h-10 border-4 border-[#0093DD] border-t-transparent rounded-full animate-spin"></div>
                </div>
              }>
                <Outlet />
              </Suspense>
            }>
              <Route index element={<HomePage />} />

              <Route path="WebTeam" element={<WebTeamPage />} />
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
              <Route path="departments/:slug" element={<GenericDepartmentPage />} />
              <Route path="staff/:slug" element={<PersonProfilePage />} />
              <Route path="people/:slug" element={<PersonProfilePage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="news/page/2" element={<NewsPageTwo />} />
              <Route path="news/:slug" element={<NewsDetailPage />} />
              <Route path="services/complaint-management" element={<ComplaintManagementPage />} />
              <Route path="services/gatepass-application" element={<GatepassApplicationPage />} />
              <Route path="campus/gallery" element={<GalleryPage />} />
              <Route path="campus/societies/:slug" element={<SocietyDetailPage />} />
              <Route path="useful-links/disability-accessibility" element={<DisabilityAccessibilityPage />} />
              <Route path="useful-links/geiah" element={<GEIAHPage />} />
              <Route path="useful-links/student-guide-book" element={<StudentGuideBookPage />} />
              <Route path="useful-links/brand-identity-guideline" element={<BrandIdentityGuidelinePage />} />
              <Route path="useful-links/academic-calendar" element={<AcademicCalendarPage />} />
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
          </Route>

          {/* Admin CMS Routes */}
          <Route path="/admin-panel5463/login" element={<Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}><AdminLoginPage /></Suspense>} />
          <Route path="/admin-panel5463" element={<RequireAdmin />}>
            <Route element={
              <Suspense fallback={<div className="flex items-center justify-center h-screen w-full bg-[#F3F4F6] text-[#6B7280]">Loading Admin Panel...</div>}>
                <AdminLayout />
              </Suspense>
            }>
              <Route index element={<AdminDashboardPage />} />
              <Route path="homepage" element={<AdminHomePageEditor />} />
              <Route path="about" element={<AdminAboutManager />} />
              <Route path="all-departments" element={<AdminAllDepartmentsManager />} />
              <Route path="departments" element={<AdminDepartmentsManager />} />
              <Route path="manage-departments" element={<AdminManageDepartmentsHub />} />
              <Route path="departments/cs" element={<AdminCSDepartmentEditor />} />
              <Route path="departments/se" element={<AdminSEDepartmentEditor />} />
              <Route path="departments/ai" element={<AdminAIDepartmentEditor />} />
              <Route path="departments/custom/:slug" element={<AdminGenericDepartmentEditor />} />
              <Route path="school-of-computing" element={<AdminSchoolOfComputingManager />} />
              <Route path="school-of-management" element={<AdminSchoolOfManagementManager />} />
              <Route path="administration-staff" element={<AdminAdministrationStaffManager />} />
              <Route path="schools" element={<AdminSchoolsManager />} />
              <Route path="programs" element={<AdminProgramsManager />} />
              <Route path="faculty" element={<AdminFacultyManager />} />
              <Route path="research-groups" element={<AdminResearchGroupsManager />} />
              <Route path="news" element={<AdminNewsManager />} />
              <Route path="campus-news" element={<AdminCampusNewsManager />} />
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
              <Route path="useful-links/academic-calendar" element={<AdminAcademicCalendarEditor />} />
              <Route path="header-footer" element={<AdminHeaderFooterEditor />} />
              <Route path="web-team" element={<AdminWebTeamManager />} />
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
