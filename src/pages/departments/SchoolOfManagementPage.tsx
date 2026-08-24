import { useEffect, useState } from 'react';
import DepartmentPageTemplate from '../../components/departments/DepartmentPageTemplate';
import { mgmtPrograms, mgmtFaculty } from '../../data/departments';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function SchoolOfManagementPage() {
  const [cmsContent, setCmsContent] = useState<any>(null);

  useEffect(() => {
    const fetchCmsData = async () => {
      const data = await cmsService.getSetting<any>(
        'school_of_management_content',
        null
      );

      if (data) {
        setCmsContent(data);
      }
    };

    fetchCmsData();
  }, []);

  // ── Hero ──────────────────────────────────────────────────────────────────
  const heroTitle =
    cmsContent?.heroTitle || 'Department Of Management Sciences';

  const heroImage =
    cmsContent?.heroImageUrl ||
    cmsContent?.hero_image_url ||
    cmsContent?.heroImage ||
    '';

  // ── HOD ──────────────────────────────────────────────────────────────────
  const hodHeading =
    cmsContent?.hodHeading || "HOD'S MESSAGE";

  const hodName =
    cmsContent?.headName ||
    cmsContent?.hodName ||
    'Dr. [Head of Department]';

  const hodDesignation =
    cmsContent?.headDesignation ||
    cmsContent?.hodDesignation ||
    'Head, Department of Management Sciences';

  const hodMessage =
    cmsContent?.headMessage ||
    cmsContent?.hodMessage ||
    'Welcome to the Department of Management Sciences at FAST-NUCES Multan Campus. Our programs are designed to develop strategic thinkers, financial analysts, and entrepreneurial leaders ready for a dynamic global economy.';

  const hodPhoto =
    cmsContent?.headPhotoUrl ||
    cmsContent?.hodPhotoUrl ||
    '';

  // ── Programs ──────────────────────────────────────────────────────────────
  const programsHeading =
    cmsContent?.programsHeading || 'OUR PROGRAMS';

  const rawProgramsList =
    cmsContent?.programsList &&
    Array.isArray(cmsContent.programsList) &&
    cmsContent.programsList.length > 0
      ? cmsContent.programsList.filter(
          (p: any) => p.is_visible !== false
        )
      : mgmtPrograms
        ? mgmtPrograms.map((p: any, idx: number) => ({
            ...p,
            display_order: idx + 1,
          }))
        : [
            {
              id: 'bba',
              title: 'BBA',
              subtitle: 'Bachelor of Business Administration',
              display_order: 1,
            },
            {
              id: 'mba',
              title: 'MBA',
              subtitle: 'Master of Business Administration',
              display_order: 2,
            },
          ];

  const programsList = rawProgramsList.map((p: any) => ({
    ...p,
    targetUrl: p.targetUrl || 'https://nu.edu.pk/Program/BS(BA)',
  }));

  // ── Department Faculty ────────────────────────────────────────────────────
  const facultyHeading =
    cmsContent?.facultyHeading || 'DEPARTMENT FACULTY';

  const facultyList =
    cmsContent?.facultyList &&
    Array.isArray(cmsContent.facultyList) &&
    cmsContent.facultyList.length > 0
      ? cmsContent.facultyList.filter(
          (f: any) => f.is_visible !== false
        )
      : mgmtFaculty
        ? mgmtFaculty.map((f: any, idx: number) => ({
            ...f,
            display_order: idx + 1,
          }))
        : [
            {
              id: 'fac-1',
              name: 'Dr. [Faculty 1]',
              designation: 'Professor & HOD',
              display_order: 1,
            },
            {
              id: 'fac-2',
              name: 'Dr. [Faculty 2]',
              designation: 'Associate Professor',
              display_order: 2,
            },
          ];

  // ── Allied Faculty ────────────────────────────────────────────────────────
  const showAlliedFacultySection =
    cmsContent?.showAlliedFacultySection !== false &&
    cmsContent?.alliedFacultyVisible !== false;

  const alliedFacultyHeading =
    cmsContent?.alliedFacultyHeading || 'ALLIED FACULTY';

  const alliedFacultyList =
    cmsContent?.alliedFacultyList &&
    Array.isArray(cmsContent.alliedFacultyList) &&
    cmsContent.alliedFacultyList.length > 0
      ? cmsContent.alliedFacultyList.filter(
          (f: any) => f.is_visible !== false
        )
      : [];

  return (
    <DepartmentPageTemplate
      heroTitle={heroTitle}
      heroImage={heroImage}
      hodHeading={hodHeading}
      hodName={hodName}
      hodDesignation={hodDesignation}
      hodMessage={hodMessage}
      hodPhoto={hodPhoto}
      hodProfileLink="/people/management-hod"
      programsHeading={programsHeading}
      programsList={programsList}
      facultyHeading={facultyHeading}
      facultyList={facultyList}
      showAlliedFacultySection={showAlliedFacultySection}
      alliedFacultyHeading={alliedFacultyHeading}
      alliedFacultyList={alliedFacultyList}
    />
  );
}