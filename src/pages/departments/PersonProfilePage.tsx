import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import { initialStaffMembers, adminOfficesList } from '../../data/staffData';
import { csFaculty, mgmtFaculty } from '../../data/departments';
import { homepageContent } from '../../data/homepage';
import { cmsService } from '../../services/cmsService';
import DecorativeProfileImageFrame from '../../components/ui/DecorativeProfileImageFrame';
import { Mail, Phone, PhoneCall, Building2, ArrowLeft, BookOpen, Award, FileText, Globe, Layers, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isPubsExpanded, setIsPubsExpanded] = useState(false);
  const [isCollabExpanded, setIsCollabExpanded] = useState(false);

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
              photoUrl: foundFac.photoUrl || foundFac.photo_url || '',
              badgePhotoUrl: foundFac.badgePhotoUrl || foundFac.badge_photo_url || foundFac.photoUrl || '',
              email: foundFac.email || `${toSlug(foundFac.name)}@multan.nu.edu.pk`,
              introduction: foundFac.introduction || '',
              education: foundFac.education || 'Master / Ph.D. in Management Sciences',
            });
            setLoading(false);
            return;
          }
        }

        if (Array.isArray(mgmtData.alliedFacultyList)) {
          const foundAllied = mgmtData.alliedFacultyList.find(
            (f: any) => f.slug === cleanSlug || f.id === cleanSlug || toSlug(f.name) === cleanSlug
          );
          if (foundAllied) {
            setPerson({
              id: foundAllied.id,
              slug: foundAllied.slug || toSlug(foundAllied.name),
              name: foundAllied.name,
              designation: foundAllied.designation || 'Allied Faculty Member',
              departmentOrOffice: 'Department of Management Sciences',
              photoUrl: foundAllied.photoUrl || foundAllied.photo_url || '',
              badgePhotoUrl: foundAllied.badgePhotoUrl || foundAllied.badge_photo_url || foundAllied.photoUrl || '',
              email: foundAllied.email || `${toSlug(foundAllied.name)}@multan.nu.edu.pk`,
              introduction: foundAllied.introduction || '',
              education: foundAllied.education || foundAllied.qualification || 'Master / Ph.D. in Management Sciences',
            });
            setLoading(false);
            return;
          }
        }
      }

      // 4. Check Administration Staff from CMS
      const foundStaff = await cmsService.getAdminStaffBySlug(cleanSlug);
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

      // 5. Check Custom Generic Departments
      const customDepts = await cmsService.getCustomDepartments();
      if (customDepts && customDepts.length > 0) {
        const customContents = await Promise.all(
          customDepts.map((d: any) => cmsService.getCustomDepartmentContent(d.slug))
        );

        for (let i = 0; i < customDepts.length; i++) {
          const dept = customDepts[i];
          const customData = customContents[i];
          if (customData) {
            const deptName = customData.deptName || dept.title || 'Department';
            const heroTitle = customData.heroTitle || deptName;
            
            // HOD
            const hodName = customData.hodName || 'Dr. Head of Department';
            if (cleanSlug === `${dept.slug}-hod` || cleanSlug === toSlug(hodName)) {
              setPerson({
                id: `${dept.slug}-hod`,
                slug: `${dept.slug}-hod`,
                name: hodName,
                designation: customData.hodDesignation || `Head, ${heroTitle}`,
                departmentOrOffice: deptName,
                photoUrl: customData.hodPhotoUrl || '',
                badgePhotoUrl: customData.hodBadgePhotoUrl || customData.hodPhotoUrl || '',
                email: customData.hodEmail || '',
                phone: customData.hodPhone || '',
                extension: '',
                introduction: customData.hodMessage || `Welcome to the ${deptName}.`,
                education: customData.hodEducation || '',
                publications: customData.hodPublications || '',
                collaborations: customData.hodCollaborations || '',
                fundedProjects: customData.hodProjects || customData.hodFundedProjects || '',
              });
              setLoading(false);
              return;
            }

            // Faculty
            if (Array.isArray(customData.facultyList)) {
              const foundFac = customData.facultyList.find(
                (f: any) => f.slug === cleanSlug || f.id === cleanSlug || toSlug(f.name) === cleanSlug
              );
              if (foundFac) {
                setPerson({
                  id: foundFac.id,
                  slug: foundFac.slug || toSlug(foundFac.name),
                  name: foundFac.name,
                  designation: foundFac.designation || 'Faculty Member',
                  departmentOrOffice: deptName,
                  photoUrl: foundFac.photoUrl || foundFac.photo_url || foundFac.image || '',
                  badgePhotoUrl: foundFac.badgePhotoUrl || foundFac.badge_photo_url || foundFac.photoUrl || '',
                  email: foundFac.email || `${toSlug(foundFac.name)}@multan.nu.edu.pk`,
                  phone: foundFac.phone || '',
                  introduction: foundFac.introduction || foundFac.bio || foundFac.biography || '',
                  education: foundFac.education || foundFac.qualification || 'Master / Ph.D.',
                  publications: foundFac.publications || '',
                  collaborations: foundFac.collaborations || '',
                  fundedProjects: foundFac.fundedProjects || foundFac.funded_projects || '',
                });
                setLoading(false);
                return;
              }
            }

            // Allied Faculty
            if (Array.isArray(customData.alliedFacultyList)) {
              const foundAllied = customData.alliedFacultyList.find(
                (f: any) => f.slug === cleanSlug || f.id === cleanSlug || toSlug(f.name) === cleanSlug
              );
              if (foundAllied) {
                setPerson({
                  id: foundAllied.id,
                  slug: foundAllied.slug || toSlug(foundAllied.name),
                  name: foundAllied.name,
                  designation: foundAllied.designation || 'Allied Faculty Member',
                  departmentOrOffice: deptName,
                  photoUrl: foundAllied.photoUrl || foundAllied.photo_url || foundAllied.image || '',
                  badgePhotoUrl: foundAllied.badgePhotoUrl || foundAllied.badge_photo_url || foundAllied.photoUrl || '',
                  email: foundAllied.email || `${toSlug(foundAllied.name)}@multan.nu.edu.pk`,
                  introduction: foundAllied.introduction || foundAllied.bio || foundAllied.biography || '',
                  education: foundAllied.education || foundAllied.qualification || 'Master / Ph.D.',
                  publications: foundAllied.publications || '',
                  collaborations: foundAllied.collaborations || '',
                  fundedProjects: foundAllied.fundedProjects || foundAllied.funded_projects || '',
                });
                setLoading(false);
                return;
              }
            }
          }
        }
      }

      // 6. Fallback Search in Static Data (CS Faculty, Mgmt Faculty, Admin Staff)
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
    let rafId: number | null = null;

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

    const scheduleFit = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        fitIntroductionText();
      });
    };

    scheduleFit();

    const observer = new ResizeObserver(scheduleFit);
    if (introTextRef.current) observer.observe(introTextRef.current);

    window.addEventListener('resize', scheduleFit);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      observer.disconnect();
      window.removeEventListener('resize', scheduleFit);
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

  // Determine if this is an Administration Staff profile (non-academic)
  const isStaffProfile =
    person.id.includes('staff') ||
    person.slug.includes('staff') ||
    (person.departmentOrOffice &&
      (person.departmentOrOffice.toLowerCase().includes('office') ||
       person.departmentOrOffice.toLowerCase().includes('administration')));

  // Academic profile (Director, HODs, Department Faculty, Allied Faculty)
  const isAcademic =
    !isStaffProfile &&
    (person.id === 'director' ||
      person.id.includes('hod') ||
      person.slug === 'director' ||
      person.slug.includes('hod') ||
      person.id.includes('fac') ||
      person.id.includes('allied'));

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

        {isAcademic ? (
          /* ════ ACADEMIC FACULTY PROFILE LAYOUT (Original Layout) ════ */
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
                disableHoverEffect={true}
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
              {/* 1. INTRODUCTION CARD (Matched to Left Column Total Height) */}
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

              {/* 2. SUBSEQUENT ACADEMIC SECTIONS BELOW INTRODUCTION CARD */}
              <div className="w-full pt-[32px] space-y-[40px]">
                {/* 1. PUBLICATIONS CARD — HORIZONTAL FULL WIDTH */}
                <div className="w-full bg-[#0B2E59] rounded-[10px] p-[20px] sm:p-[24px] shadow-md text-white flex flex-col min-h-[380px]">
                  {/* Outer Card Header */}
                  <div className="flex items-center justify-between pb-[10px] mb-[14px] border-b border-white/20 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <FileText className="w-[18px] h-[18px] text-[#0093DD]" />
                      <h3 className="text-[17px] font-bold text-white uppercase tracking-wider m-0">
                        PUBLICATIONS
                      </h3>
                    </div>

                    {hasPubs && (
                      <button
                        type="button"
                        onClick={() => setIsPubsExpanded(!isPubsExpanded)}
                        aria-expanded={isPubsExpanded}
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-white/90 hover:text-white bg-transparent border-0 cursor-pointer transition-colors outline-none"
                      >
                        <span>{isPubsExpanded ? 'Collapse' : 'Expand'}</span>
                        {isPubsExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#0093DD]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#0093DD]" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Inner White Container */}
                  <div
                    className={`bg-white rounded-[8px] p-[16px] sm:p-[20px] flex-1 border border-white/40 shadow-inner transition-all duration-300 ${
                      isPubsExpanded
                        ? 'max-h-none overflow-visible'
                        : 'max-h-[310px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
                    }`}
                  >
                    <div className="text-[14px] leading-[1.7] text-[#0C71C3] font-medium whitespace-pre-line text-justify">
                      {hasPubs ? (
                        person.publications
                      ) : (
                        <span className="text-slate-400 italic font-normal">No publications listed.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. SIDE-BY-SIDE EQUAL ROW: EDUCATION (LEFT) & COLLABORATIONS (RIGHT) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] lg:gap-[32px] items-stretch w-full pt-[24px] lg:pt-[32px]">
                  {/* LEFT: EDUCATION CARD */}
                  <div className="w-full bg-white border border-[#E2E8F0] rounded-[10px] p-[20px] sm:p-[24px] shadow-sm flex flex-col justify-start min-h-[220px]">
                    <h3 className="text-[17px] font-bold text-[#0C71C3] uppercase mb-[10px] border-b border-[#E2E8F0] pb-[8px] flex items-center gap-2 m-0 flex-shrink-0">
                      <Award className="w-4 h-4 text-[#0093DD]" />
                      <span>EDUCATION</span>
                    </h3>
                    <div className="text-[14px] leading-[1.7] text-[#334155] whitespace-pre-line text-justify flex-1">
                      {hasEdu ? person.education : <span className="text-slate-400 italic font-normal">No education details listed.</span>}
                    </div>
                  </div>

                  {/* RIGHT: COLLABORATIONS CARD */}
                  <div className="w-full bg-white border border-[#E2E8F0] rounded-[10px] p-[20px] sm:p-[24px] shadow-sm flex flex-col justify-start min-h-[220px]">
                    <div className="flex items-center justify-between pb-[8px] mb-[10px] border-b border-[#E2E8F0] flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#0093DD]" />
                        <h3 className="text-[16px] sm:text-[17px] font-bold text-[#0C71C3] uppercase m-0">
                          <span>COLLABORATIONS AT NATIONAL AND INTERNATIONAL LEVEL</span>
                        </h3>
                      </div>

                      {hasCollab && (
                        <button
                          type="button"
                          onClick={() => setIsCollabExpanded(!isCollabExpanded)}
                          aria-expanded={isCollabExpanded}
                          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#0093DD] hover:text-[#0C71C3] bg-transparent border-0 cursor-pointer transition-colors outline-none ml-2 flex-shrink-0"
                        >
                          <span>{isCollabExpanded ? 'Collapse' : 'Expand'}</span>
                          {isCollabExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    <div
                      className={`flex-1 transition-all duration-300 ${
                        isCollabExpanded
                          ? 'max-h-none overflow-visible'
                          : 'max-h-[160px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
                      }`}
                    >
                      <div className="text-[14px] leading-[1.7] text-[#334155] whitespace-pre-line text-justify">
                        {hasCollab ? person.collaborations : <span className="text-slate-400 italic font-normal">No collaborations listed.</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. DETAIL OF FUNDED PROJECTS CARD */}
                <div className="pt-[24px] lg:pt-[32px]">
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
              </div>
            </div>
          </div>
        ) : (
          /* ════ ADMINISTRATION STAFF PROFILE LAYOUT (New Education + Intro Layout) ════ */
          <>
            {/* ROW 1: TOP 2-COLUMN GRID (PROFILE IMAGE & INTRODUCTION CARD) */}
            <div className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] gap-[36px] md:gap-[48px] items-start">
              {/* TOP LEFT: DECORATIVE PROFILE IMAGE FRAME */}
              <DecorativeProfileImageFrame
                src={person.photoUrl}
                badgeSrc={person.badgePhotoUrl}
                alt={person.name}
                showBadge={true}
                fallbackLabel="Profile Image"
                disableHoverEffect={true}
              />

              {/* TOP RIGHT: INTRODUCTION CARD */}
              <div className="w-full bg-white border border-[#E2E8F0] rounded-[8px] p-[24px] sm:p-[28px] md:p-[32px] shadow-sm flex flex-col h-[320px] overflow-hidden">
                <h3 className="text-[25px] font-bold text-[#0C71C3] uppercase mb-[14px] border-b border-[#E2E8F0] pb-[8px] flex items-center gap-2 m-0 flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-[#0093DD]" />
                  <span>INTRODUCTION</span>
                </h3>

                <div
                  ref={introTextRef}
                  className="flex-1 min-h-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-[#334155] whitespace-pre-line text-justify leading-[1.55]"
                  style={{ fontSize: `${introFontSize}px` }}
                >
                  {hasIntro ? person.introduction : <span className="text-slate-400 italic font-normal">No introduction details listed.</span>}
                </div>
              </div>
            </div>

            {/* ROW 2: MIDDLE 2-COLUMN GRID (NAME & CONTACT INFO & EDUCATION CARD) */}
            <div className="grid grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] gap-[36px] md:gap-[48px] items-stretch mt-[24px]">
              {/* MIDDLE LEFT: PERSON INFO AREA (Name, Designation, Contact Meta) */}
              <div className="w-full max-w-[280px] mx-auto md:mx-0 text-left space-y-[12px] flex flex-col justify-start">
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

              {/* MIDDLE RIGHT: EDUCATION CARD (Vertically matched to Left Person Info block) */}
              <div className="w-full bg-white border border-[#E2E8F0] rounded-[8px] p-[20px] sm:p-[24px] shadow-sm flex flex-col justify-start h-full overflow-hidden">
                <h3 className="text-[17px] font-bold text-[#0C71C3] uppercase mb-[10px] border-b border-[#E2E8F0] pb-[8px] flex items-center gap-2 m-0 flex-shrink-0">
                  <Award className="w-4 h-4 text-[#0093DD]" />
                  <span>EDUCATION</span>
                </h3>
                <div className="text-[14px] leading-[1.7] text-[#334155] whitespace-pre-line text-justify flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {hasEdu ? person.education : <span className="text-slate-400 italic font-normal">No education details listed.</span>}
                </div>
              </div>
            </div>

            {/* ROW 3: STAFF RESPONSIBILITIES IF PRESENT */}
            {hasResp && (
              <div className="w-full pt-[32px]">
                <div className="w-full bg-white border border-[#E2E8F0] rounded-[10px] p-[28px] md:p-[36px] shadow-sm space-y-[32px]">
                  <div>
                    <h3 className="text-[18px] font-bold text-[#0C71C3] uppercase mb-[12px] border-b border-[#E2E8F0] pb-[8px] flex items-center gap-2 m-0">
                      <Award className="w-4 h-4 text-[#0093DD]" />
                      <span>RESPONSIBILITIES</span>
                    </h3>
                    <div className="text-[14.5px] leading-[1.75] text-[#334155] whitespace-pre-line text-justify">
                      {person.responsibilities}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}