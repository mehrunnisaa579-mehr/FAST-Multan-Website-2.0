import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import { initialStaffMembers, adminOfficesList } from '../../data/staffData';
import { csFaculty, mgmtFaculty } from '../../data/departments';
import { homepageContent } from '../../data/homepage';
import { cmsService } from '../../services/cmsService';
import DecorativeProfileImageFrame from '../../components/ui/DecorativeProfileImageFrame';
import { Mail, Phone, PhoneCall, Building2, ArrowLeft, BookOpen, Award, FileText, Globe, Layers } from 'lucide-react';
import '../../styles/department-pages.css';

export interface PersonProfile {
  id: string;
  slug: string;
  name: string;
  designation: string;
  departmentOrOffice?: string;
  photoUrl?: string;
  badgePhotoUrl?: string;
  email?: string;
  phone?: string;
  extension?: string;
  introduction?: string;
  education?: string;
  publications?: string;
  collaborations?: string;
  fundedProjects?: string;
  responsibilities?: string;
}

function toSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function PersonProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [person, setPerson] = useState<PersonProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const introTextRef = useRef<HTMLDivElement>(null);
  const [introFontSize, setIntroFontSize] = useState(16);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const cleanSlug = (slug || '').toLowerCase();

      // 1. Check if Director
      if (cleanSlug === 'director' || cleanSlug.includes('director') || cleanSlug.includes('sarfraz')) {
        const homeData = await cmsService.getSetting<any>('homepage_full_content', null);
        const name = homeData?.directorName || homepageContent.directorMessage.name;
        const title = homeData?.directorTitle || homepageContent.directorMessage.title;
        const message = homeData?.directorMessage || homepageContent.directorMessage.message;
        const photo = homeData?.directorPhoto || homepageContent.directorMessage.photo || '';

        setPerson({
          id: 'director',
          slug: 'director',
          name,
          designation: title,
          departmentOrOffice: 'Campus Director Office',
          photoUrl: photo,
          badgePhotoUrl: homeData?.directorBadgePhoto || homeData?.directorBadgePhotoUrl || photo,
          email: homeData?.directorEmail || 'director@multan.nu.edu.pk',
          phone: homeData?.directorPhone || '+92 (61) 111-128-128',
          extension: homeData?.directorExt || '101',
          introduction: message,
          education: homeData?.directorEducation || 'Ph.D. in Computer Science / Higher Education Leadership',
          publications: homeData?.directorPublications || '',
          collaborations: homeData?.directorCollaborations || '',
          fundedProjects: homeData?.directorProjects || '',
        });
        setLoading(false);
        return;
      }

      // 2. Check CS Department (HOD, Faculty, Allied Faculty)
      const csData = await cmsService.getSetting<any>('department_cs_content', null);
      if (csData) {
        // HOD
        const hodName = csData.hodName || 'Dr. Head of Department';
        if (cleanSlug === 'cs-hod' || cleanSlug === 'computer-science-hod' || cleanSlug === toSlug(hodName)) {
          setPerson({
            id: 'cs-hod',
            slug: 'cs-hod',
            name: hodName,
            designation: csData.hodDesignation || 'Head, Department of Computer Science',
            departmentOrOffice: 'Department of Computer Science',
            photoUrl: csData.hodPhotoUrl || '',
            badgePhotoUrl: csData.hodBadgePhotoUrl || csData.hodBadgePhoto || csData.hodPhotoUrl || '',
            email: csData.hodEmail || 'hod.cs@multan.nu.edu.pk',
            phone: csData.hodPhone || '+92 (61) 111-128-128',
            extension: '201',
            introduction: csData.hodMessage || 'Welcome to the Department of Computer Science at FAST-NUCES Multan Campus.',
            education: csData.hodEducation || 'Ph.D. in Computer Science',
            publications: csData.hodPublications || '',
            collaborations: csData.hodCollaborations || '',
            fundedProjects: csData.hodProjects || csData.hodFundedProjects || '',
          });
          setLoading(false);
          return;
        }

        // Faculty
        if (Array.isArray(csData.facultyList)) {
          const foundFac = csData.facultyList.find(
            (f: any) => f.slug === cleanSlug || f.id === cleanSlug || toSlug(f.name) === cleanSlug
          );
          if (foundFac) {
            setPerson({
              id: foundFac.id,
              slug: foundFac.slug || toSlug(foundFac.name),
              name: foundFac.name,
              designation: foundFac.designation || 'Faculty Member',
              departmentOrOffice: 'Department of Computer Science',
              photoUrl: foundFac.photoUrl || '',
              badgePhotoUrl: foundFac.badgePhotoUrl || foundFac.badge_photo_url || foundFac.photoUrl || '',
              email: foundFac.email || `${toSlug(foundFac.name)}@multan.nu.edu.pk`,
              phone: foundFac.phone || '+92 (61) 111-128-128',
              introduction: foundFac.introduction || foundFac.bio || '',
              education: foundFac.education || 'Master / Ph.D. in Computer Science',
              publications: foundFac.publications || '',
              collaborations: foundFac.collaborations || '',
              fundedProjects: foundFac.fundedProjects || '',
            });
            setLoading(false);
            return;
          }
        }

        // Allied Faculty
        if (Array.isArray(csData.alliedFacultyList)) {
          const foundAllied = csData.alliedFacultyList.find(
            (f: any) => f.slug === cleanSlug || f.id === cleanSlug || toSlug(f.name) === cleanSlug
          );
          if (foundAllied) {
            setPerson({
              id: foundAllied.id,
              slug: foundAllied.slug || toSlug(foundAllied.name),
              name: foundAllied.name,
              designation: foundAllied.designation || 'Allied Faculty Member',
              departmentOrOffice: 'Department of Computer Science (Allied)',
              photoUrl: foundAllied.photoUrl || '',
              badgePhotoUrl: foundAllied.badgePhotoUrl || foundAllied.badge_photo_url || foundAllied.photoUrl || '',
              email: foundAllied.email || `${toSlug(foundAllied.name)}@multan.nu.edu.pk`,
              introduction: foundAllied.introduction || '',
              education: foundAllied.education || 'Ph.D. / M.Phil Degree',
            });
            setLoading(false);
            return;
          }
        }
      }

      // 3. Check Management Department (HOD, Faculty, Allied Faculty)
      const mgmtData = await cmsService.getSetting<any>('school_of_management_content', null);
      if (mgmtData) {
        const hodName = mgmtData.headName || mgmtData.hodName || 'Dr. Head of Department';
        if (cleanSlug === 'management-hod' || cleanSlug === 'school-of-management-hod' || cleanSlug === toSlug(hodName)) {
          setPerson({
            id: 'management-hod',
            slug: 'management-hod',
            name: hodName,
            designation: mgmtData.headDesignation || mgmtData.hodDesignation || 'Head, Department of Management Sciences',
            departmentOrOffice: 'Department of Management Sciences',
            photoUrl: mgmtData.headPhotoUrl || mgmtData.hodPhotoUrl || '',
            badgePhotoUrl: mgmtData.headBadgePhotoUrl || mgmtData.hodBadgePhotoUrl || mgmtData.headPhotoUrl || '',
            email: mgmtData.hodEmail || 'hod.mgmt@multan.nu.edu.pk',
            phone: mgmtData.hodPhone || '+92 (61) 111-128-128',
            extension: '301',
            introduction: mgmtData.headMessage || mgmtData.hodMessage || 'Welcome to the Department of Management Sciences.',
            education: mgmtData.hodEducation || 'Ph.D. in Management Sciences / Business Administration',
            publications: mgmtData.hodPublications || '',
            collaborations: mgmtData.hodCollaborations || '',
            fundedProjects: mgmtData.hodProjects || mgmtData.hodFundedProjects || '',
          });
          setLoading(false);
          return;
        }

        if (Array.isArray(mgmtData.facultyList)) {
          const foundFac = mgmtData.facultyList.find(
            (f: any) => f.slug === cleanSlug || f.id === cleanSlug || toSlug(f.name) === cleanSlug
          );
          if (foundFac) {
            setPerson({
              id: foundFac.id,
              slug: foundFac.slug || toSlug(foundFac.name),
              name: foundFac.name,
              designation: foundFac.designation || 'Faculty Member',
              departmentOrOffice: 'Department of Management Sciences',
              photoUrl: foundFac.photoUrl || '',
              badgePhotoUrl: foundFac.badgePhotoUrl || foundFac.badge_photo_url || foundFac.photoUrl || '',
              email: foundFac.email || `${toSlug(foundFac.name)}@multan.nu.edu.pk`,
              introduction: foundFac.introduction || '',
              education: foundFac.education || 'Master / Ph.D. in Management Sciences',
            });
            setLoading(false);
            return;
          }
        }
      }

      // 4. Check Administration Staff from CMS
      const cmsStaff = await cmsService.getAdminStaff();
      if (cmsStaff && cmsStaff.length > 0) {
        const foundStaff = cmsStaff.find(
          (s: any) => s.slug === cleanSlug || s.id === cleanSlug || toSlug(s.name) === cleanSlug
        );
        if (foundStaff) {
          const savedOffices = await cmsService.getSetting<any[]>('admin_offices_list', []);
          const officeObj = (savedOffices || []).find((o: any) => o.id === foundStaff.office) || adminOfficesList.find((o) => o.id === foundStaff.office);
          const officeTitle = officeObj ? (officeObj.title || officeObj.label) : (foundStaff.office ? foundStaff.office.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'Administration Office');
          setPerson({
            id: foundStaff.id,
            slug: foundStaff.slug || foundStaff.id,
            name: foundStaff.name,
            designation: foundStaff.designation || 'Administrative Staff',
            departmentOrOffice: officeTitle,
            photoUrl: foundStaff.photo_url || foundStaff.photoUrl || '',
            badgePhotoUrl: foundStaff.badge_photo_url || foundStaff.badgePhotoUrl || foundStaff.photo_url || '',
            email: foundStaff.email || '',
            phone: foundStaff.phone || '',
            extension: foundStaff.extension || '',
            introduction: foundStaff.introduction || '',
            education: foundStaff.education || '',
          });
          setLoading(false);
          return;
        }
      }

      // 5. Fallback Search in Static Data (CS Faculty, Mgmt Faculty, Admin Staff)
      const staticCsFac = csFaculty.find((f: any) => toSlug(f.name) === cleanSlug || f.id === cleanSlug);
      if (staticCsFac) {
        setPerson({
          id: staticCsFac.id,
          slug: toSlug(staticCsFac.name),
          name: staticCsFac.name,
          designation: staticCsFac.designation,
          departmentOrOffice: 'Department of Computer Science',
          email: `${toSlug(staticCsFac.name)}@multan.nu.edu.pk`,
          education: 'Master / Ph.D. Degree in Computer Science',
          introduction: `Faculty member in the Department of Computer Science at FAST-NUCES Multan Campus.`,
        });
        setLoading(false);
        return;
      }

      const staticMgmtFac = (mgmtFaculty || []).find((f: any) => toSlug(f.name) === cleanSlug || f.id === cleanSlug);
      if (staticMgmtFac) {
        setPerson({
          id: staticMgmtFac.id,
          slug: toSlug(staticMgmtFac.name),
          name: staticMgmtFac.name,
          designation: staticMgmtFac.designation,
          departmentOrOffice: 'Department of Management Sciences',
          email: `${toSlug(staticMgmtFac.name)}@multan.nu.edu.pk`,
          education: 'Master / Ph.D. Degree in Business Administration',
          introduction: `Faculty member in the Department of Management Sciences at FAST-NUCES Multan Campus.`,
        });
        setLoading(false);
        return;
      }

      const staticStaff = initialStaffMembers.find((s) => s.slug === cleanSlug || s.id === cleanSlug);
      if (staticStaff) {
        const officeObj = adminOfficesList.find((o) => o.id === staticStaff.office);
        setPerson({
          id: staticStaff.id,
          slug: staticStaff.slug,
          name: staticStaff.name,
          designation: staticStaff.designation,
          departmentOrOffice: officeObj ? officeObj.title : staticStaff.office || 'Administration Office',
          photoUrl: staticStaff.photoUrl,
          email: staticStaff.email,
          phone: staticStaff.phone,
          extension: staticStaff.extension,
          introduction: staticStaff.introduction,
          education: staticStaff.education,
        });
        setLoading(false);
        return;
      }

      // Generic Dynamic Fallback for any unknown slug
      const formattedName = cleanSlug
        ? cleanSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Faculty / Staff Member';

      setPerson({
        id: cleanSlug || 'person-profile',
        slug: cleanSlug || 'person-profile',
        name: formattedName.startsWith('Dr') ? formattedName : `Dr. ${formattedName}`,
        designation: 'Faculty / Staff Member',
        departmentOrOffice: 'FAST-NUCES Multan Campus',
        email: `${cleanSlug || 'info'}@multan.nu.edu.pk`,
        phone: '+92 (61) 111-128-128',
        introduction: `Academic profile for ${formattedName} at FAST-NUCES Multan Campus.`,
        education: 'Graduate / Postgraduate Degree in relevant field.',
      });
      setLoading(false);
    };

    fetchProfile();
  }, [slug]);

  useEffect(() => {
    const fitIntroductionText = () => {
      const el = introTextRef.current;
      if (!el || !person?.introduction) return;

      const MIN_FONT = 12;
      const MAX_FONT = 24;
      const STEP = 0.25;

      let low = MIN_FONT;
      let high = MAX_FONT;
      let best = MIN_FONT;

      while (high - low > STEP) {
        const mid = (low + high) / 2;
        el.style.fontSize = `${mid}px`;

        const fits =
          el.scrollHeight <= el.clientHeight + 1 &&
          el.scrollWidth <= el.clientWidth + 1;

        if (fits) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }

      el.style.fontSize = `${best}px`;
      setIntroFontSize(best);
    };

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(fitIntroductionText);
    });

    const observer = new ResizeObserver(fitIntroductionText);
    if (introTextRef.current) observer.observe(introTextRef.current);

    window.addEventListener('resize', fitIntroductionText);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', fitIntroductionText);
    };
  }, [person?.introduction]);

  if (loading) {
    return (
      <div className="dept-page-container">
        <AboutPageHero title="Faculty / Staff Profile" />
        <div className="py-20 text-center text-[#64748B] text-[16px] font-medium">Loading profile...</div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="dept-page-container">
        <AboutPageHero title="Profile Not Found" />
        <div className="py-20 text-center text-[#64748B]">Profile record not found.</div>
      </div>
    );
  }

  // Determine if this is an academic profile (Director, HODs, Faculty, Allied Faculty)
  const isAcademic =
    person.id === 'director' ||
    person.id.includes('hod') ||
    person.slug === 'director' ||
    person.slug.includes('hod') ||
    person.id.includes('fac') ||
    person.id.includes('allied') ||
    (person.departmentOrOffice &&
      !person.departmentOrOffice.toLowerCase().includes('office') &&
      !person.departmentOrOffice.toLowerCase().includes('administration'));

  // Check section content
  const hasIntro = !!(person.introduction && person.introduction.trim());
  const hasEdu = !!(person.education && person.education.trim());
  const hasPubs = !!(person.publications && person.publications.trim());
  const hasCollab = !!(person.collaborations && person.collaborations.trim());
  const hasProjects = !!(person.fundedProjects && person.fundedProjects.trim());
  const hasResp = !!(person.responsibilities && person.responsibilities.trim());

  return (
    <div className="dept-page-container text-left">
      {/* Hero Header with Person Name */}
      <AboutPageHero title={person.name} />

      {/* Main Content Container matching CS Master Layout */}
      <div className="w-full max-w-[1480px] mx-auto px-[28px] sm:px-[40px] md:px-[56px] py-[64px] sm:py-[72px]">
        {/* Back Button */}
        <div className="relative -top-[20px] mb-[8px]">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#0093DD] hover:text-[#0C71C3] no-underline bg-transparent border-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] gap-[36px] md:gap-[48px] items-start">
          {/* ════ LEFT COLUMN — DECORATIVE IMAGE & INFO BLOCKS ═══════════════ */}
          <div className="w-full space-y-[24px]">
            {/* BLOCK 1: DECORATIVE ARCHITECTURAL PROFILE IMAGE COMPOSITION */}
            <DecorativeProfileImageFrame
              src={person.photoUrl}
              badgeSrc={person.badgePhotoUrl}
              alt={person.name}
              showBadge={true}
              fallbackLabel="Profile Image"
            />

            {/* BLOCK 2: PERSON INFO AREA BELOW IMAGE */}
            <div className="w-full max-w-[280px] mx-auto md:mx-0 text-left space-y-[12px]">
              {/* Name & Designation */}
              <div>
                <h2 className="text-[20px] font-bold text-[#1F2937] leading-snug m-0">
                  {person.name}
                </h2>
                <p className="text-[14px] font-bold text-[#0093DD] mt-[3px] m-0">
                  {person.designation}
                </p>
              </div>

              <div className="w-full border-t border-[#E2E8F0] pt-[12px]" />

              {/* Department & Contact Meta */}
              <div className="space-y-[10px] text-[13.5px]">
                {person.departmentOrOffice && (
                  <div className="flex items-center gap-[10px] text-[#475569]">
                    <Building2 className="w-4 h-4 text-[#0093DD] flex-shrink-0" />
                    <span>{person.departmentOrOffice}</span>
                  </div>
                )}

                {person.email && (
                  <div className="flex items-center gap-[10px] text-[#475569] break-all">
                    <Mail className="w-4 h-4 text-[#0093DD] flex-shrink-0" />
                    <a href={`mailto:${person.email}`} className="hover:text-[#0093DD] transition-colors">
                      {person.email}
                    </a>
                  </div>
                )}

                {person.phone && (
                  <div className="flex items-center gap-[10px] text-[#475569]">
                    <Phone className="w-4 h-4 text-[#0093DD] flex-shrink-0" />
                    <span>{person.phone}</span>
                  </div>
                )}

                {person.extension && (
                  <div className="flex items-center gap-[10px] text-[#475569]">
                    <PhoneCall className="w-4 h-4 text-[#0093DD] flex-shrink-0" />
                    <span>Ext: {person.extension}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN — ACADEMIC & PROFILE DETAILS ═════════════════ */}
          <div className="w-full">
            {/* 1. INTRODUCTION CARD (Top & Bottom Height Matched to Left Profile Block) */}
            <div className="w-full bg-white border border-[#E2E8F0] rounded-[8px] p-[24px] sm:p-[28px] md:p-[32px] shadow-sm flex flex-col h-[460px] md:h-[510px] overflow-hidden">
              <h3 className="text-[25px] font-bold text-[#0C71C3] uppercase mb-[14px] border-b border-[#E2E8F0] pb-[8px] flex items-center gap-2 m-0 flex-shrink-0">
                <BookOpen className="w-4 h-4 text-[#0093DD]" />
                <span>INTRODUCTION</span>
              </h3>

              <div
                ref={introTextRef}
                className="flex-1 min-h-0 overflow-hidden text-[#334155] whitespace-pre-line text-justify leading-[1.55]"
                style={{ fontSize: `${introFontSize}px` }}
              >
                {hasIntro ? person.introduction : <span className="text-slate-400 italic font-normal">No introduction details listed.</span>}
              </div>
            </div>

            {/* 2. SUBSEQUENT ACADEMIC & STAFF SECTIONS BELOW INTRODUCTION CARD */}
            {(hasEdu || isAcademic || hasResp) && (
              <div className="w-full pt-[32px] space-y-[40px]">
                {isAcademic ? (
                  <>
                    {/* 2-COLUMN GRID: LEFT = PUBLICATIONS (OUTER NAVY #0B2E59 + INNER WHITE SCROLL CARD), RIGHT = EDUCATION & COLLABORATIONS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] lg:gap-[32px] items-stretch w-full">
                      {/* LEFT COLUMN — PUBLICATIONS CARD (OUTER #0B2E59 NAVY + INNER WHITE CARD WITH BLUE TEXT) */}
                      <div className="w-full bg-[#0B2E59] rounded-[10px] p-[20px] sm:p-[24px] shadow-md text-white flex flex-col h-full min-h-[380px]">
                        {/* Outer Card Header */}
                        <div className="flex items-center gap-2 pb-[10px] mb-[14px] border-b border-white/20 flex-shrink-0">
                          <FileText className="w-[18px] h-[18px] text-[#0093DD]" />
                          <h3 className="text-[17px] font-bold text-white uppercase tracking-wider m-0">
                            PUBLICATIONS
                          </h3>
                        </div>

                        {/* Inner White Container */}
                        <div className="bg-white rounded-[8px] p-[16px] sm:p-[20px] flex-1 max-h-[310px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border border-white/40 shadow-inner">
                          <div className="text-[14px] leading-[1.7] text-[#0C71C3] font-medium whitespace-pre-line text-justify">
                            {hasPubs ? (
                              person.publications
                            ) : (
                              <span className="text-slate-400 italic font-normal">No publications listed.</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* RIGHT COLUMN — STACKED EDUCATION & COLLABORATIONS CARDS (WHITE HEADINGS) */}
                      <div className="flex flex-col justify-between h-full gap-[20px] lg:gap-[24px] w-full">
                        {/* 1. EDUCATION CARD */}
                        <div className="w-full bg-white border border-[#E2E8F0] rounded-[10px] p-[20px] sm:p-[24px] shadow-sm flex-1 flex flex-col justify-start">
                          <h3 className="text-[17px] font-bold text-[#0C71C3] uppercase mb-[10px] border-b border-[#E2E8F0] pb-[8px] flex items-center gap-2 m-0 flex-shrink-0">
                            <Award className="w-4 h-4 text-[#0093DD]" />
                            <span>EDUCATION</span>
                          </h3>
                          <div className="text-[14px] leading-[1.7] text-[#334155] whitespace-pre-line text-justify">
                            {hasEdu ? person.education : <span className="text-slate-400 italic font-normal">No education details listed.</span>}
                          </div>
                        </div>

                        {/* 2. COLLABORATIONS CARD */}
                        <div className="w-full bg-white border border-[#E2E8F0] rounded-[10px] p-[20px] sm:p-[24px] shadow-sm flex-1 flex flex-col justify-start">
                          <h3 className="text-[16px] sm:text-[17px] font-bold text-[#0C71C3] uppercase mb-[10px] border-b border-[#E2E8F0] pb-[8px] flex items-center gap-2 m-0 flex-shrink-0">
                            <Globe className="w-4 h-4 text-[#0093DD]" />
                            <span>COLLABORATIONS AT NATIONAL AND INTERNATIONAL LEVEL</span>
                          </h3>
                          <div className="text-[14px] leading-[1.7] text-[#334155] whitespace-pre-line text-justify flex-1">
                            {hasCollab ? person.collaborations : <span className="text-slate-400 italic font-normal">No collaborations listed.</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. DETAIL OF FUNDED PROJECTS CARD */}
                    <div className="pt-[32px]">
                    <div className="w-full bg-white border border-[#E2E8F0] rounded-[10px] p-[20px] sm:p-[24px] shadow-sm">
                      <h3 className="text-[17px] font-bold text-[#0C71C3] uppercase mb-[12px] border-b border-[#E2E8F0] pb-[8px] flex items-center gap-2 m-0">
                        <Layers className="w-4 h-4 text-[#0093DD]" />
                        <span>DETAIL OF FUNDED PROJECTS</span>
                      </h3>

                      <div className="text-[14px] leading-[1.7] text-[#334155] whitespace-pre-line text-justify min-h-[210px] sm:min-h-[230px]">
                        {hasProjects ? person.fundedProjects : <span className="text-slate-400 italic font-normal">No funded projects listed.</span>}
                      </div>
                    </div>
                  </div>
                  </>
                ) : (
                  /* NON-ACADEMIC STAFF PROFILES */
                  <div className="w-full bg-white border border-[#E2E8F0] rounded-[10px] p-[28px] md:p-[36px] shadow-sm space-y-[32px]">
                    {hasEdu && (
                      <div>
                        <h3 className="text-[18px] font-bold text-[#0C71C3] uppercase mb-[12px] border-b border-[#E2E8F0] pb-[8px] flex items-center gap-2 m-0">
                          <Award className="w-4 h-4 text-[#0093DD]" />
                          <span>EDUCATION</span>
                        </h3>
                        <div className="text-[14.5px] leading-[1.75] text-[#334155] whitespace-pre-line text-justify">
                          {person.education}
                        </div>
                      </div>
                    )}
                    {hasResp && (
                      <div>
                        <h3 className="text-[18px] font-bold text-[#0C71C3] uppercase mb-[12px] border-b border-[#E2E8F0] pb-[8px] flex items-center gap-2 m-0">
                          <Award className="w-4 h-4 text-[#0093DD]" />
                          <span>RESPONSIBILITIES</span>
                        </h3>
                        <div className="text-[14.5px] leading-[1.75] text-[#334155] whitespace-pre-line text-justify">
                          {person.responsibilities}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}