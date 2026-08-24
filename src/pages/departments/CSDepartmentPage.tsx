import { useEffect, useState } from 'react';
import DepartmentPageTemplate from '../../components/departments/DepartmentPageTemplate';
import { csPrograms, csFaculty } from '../../data/departments';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function CSDepartmentPage() {
  const [cmsContent, setCmsContent] = useState<any>(null);

  useEffect(() => {
    const fetchCmsData = async () => {
      const data = await cmsService.getSetting<any>(
        'department_cs_content',
        null
      );

      if (data) {
        setCmsContent(data);
      }
    };

    fetchCmsData();
  }, []);

  const heroTitle =
    cmsContent?.heroTitle || 'Department Of Computer Science';

  const heroImage =
    cmsContent?.heroImageUrl ||
    cmsContent?.hero_image_url ||
    cmsContent?.heroImage ||
    cmsContent?.hero_image ||
    '';

  const hodHeading =
    cmsContent?.hodHeading || "HOD'S MESSAGE";

  const hodName =
    cmsContent?.hodName || 'Dr. Head of Department';

  const hodDesignation =
    cmsContent?.hodDesignation ||
    'Head, Department of Computer Science';

  const hodMessage =
    cmsContent?.hodMessage ||
    'Welcome to the Department of Computer Science at FAST-NUCES Multan Campus. Our department offers world-class degree programs in computing, software development, artificial intelligence, and cutting-edge research.';

  const hodPhoto =
    cmsContent?.hodPhotoUrl || '';

  const programsHeading =
    cmsContent?.programsHeading || 'OUR PROGRAMS';

  const programsList =
    cmsContent?.programsList &&
      Array.isArray(cmsContent.programsList) &&
      cmsContent.programsList.length > 0
      ? cmsContent.programsList
          .filter((p: any) => p.is_visible !== false)
          .map((p: any) => {
            const tLower = (p.title || '').toLowerCase();
            let targetUrl = 'https://nu.edu.pk/Program/BS(CS)';
            if (tLower.includes('software engineering') || tLower.includes('bs(se)')) {
              targetUrl = 'https://nu.edu.pk/Program/BS(SE)';
            } else if (tLower.includes('artificial intelligence') || tLower.includes('bs(ai)')) {
              targetUrl = 'https://nu.edu.pk/Program/BS(AI)';
            }
            return {
              ...p,
              targetUrl,
            };
          })
      : csPrograms.map((p, idx) => {
          const tLower = (p.title || '').toLowerCase();
          let targetUrl = 'https://nu.edu.pk/Program/BS(CS)';
          if (tLower.includes('software engineering') || tLower.includes('bs(se)')) {
            targetUrl = 'https://nu.edu.pk/Program/BS(SE)';
          } else if (tLower.includes('artificial intelligence') || tLower.includes('bs(ai)')) {
            targetUrl = 'https://nu.edu.pk/Program/BS(AI)';
          }
          return {
            ...p,
            targetUrl,
            display_order: idx + 1,
          };
        });

  const facultyHeading =
    cmsContent?.facultyHeading || 'DEPARTMENT FACULTY';

  const facultyList =
    cmsContent?.facultyList &&
      Array.isArray(cmsContent.facultyList) &&
      cmsContent.facultyList.length > 0
      ? cmsContent.facultyList.filter(
        (f: any) => f.is_visible !== false
      )
      : csFaculty.map((f, idx) => ({
        ...f,
        display_order: idx + 1,
      }));

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
      : [
        {
          id: 'allied-default-1',
          name: 'Dr. Allied Faculty Placeholder',
          designation: 'Associated Professor (CS)',
          photoUrl: '',
          photoPlaceholder: 'PLACEHOLDER: PHOTO',
        },
      ];

  return (
    <DepartmentPageTemplate
      heroTitle={heroTitle}
      heroImage={heroImage}
      hodHeading={hodHeading}
      hodName={hodName}
      hodDesignation={hodDesignation}
      hodMessage={hodMessage}
      hodPhoto={hodPhoto}
      hodProfileLink="/people/cs-hod"
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