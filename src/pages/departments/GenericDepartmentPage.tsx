import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DepartmentPageTemplate from '../../components/departments/DepartmentPageTemplate';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

export default function GenericDepartmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [deptData, setDeptData] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchContent = async () => {
      setLoading(true);
      const data = await cmsService.getCustomDepartmentContent(slug);
      setDeptData(data);
      setLoading(false);
    };

    fetchContent();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#0093DD] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-[#666666]">Loading department content...</p>
      </div>
    );
  }

  // Normalize duplicate "Department of Department of ..." strings
  const cleanTitleString = (rawStr?: string) => {
    if (!rawStr) return '';
    let str = rawStr.trim();
    str = str.replace(/^(department\s+of\s+)+/i, 'Department of ');
    str = str.replace(/^(department\s+of\s+)+/i, 'Department of ');
    return str;
  };

  const rawDeptName = deptData?.deptName || slug?.replace(/-/g, ' ') || 'Department';
  const rawHeroTitle = deptData?.heroTitle || rawDeptName;

  let heroTitle = cleanTitleString(rawHeroTitle);
  if (!/^department\s+of/i.test(heroTitle) && !/^school\s+of/i.test(heroTitle)) {
    heroTitle = `Department of ${heroTitle}`;
  }

  const heroImage = deptData?.heroImageUrl || deptData?.hero_image_url || '';

  const hodHeading = deptData?.hodHeading || "HOD'S MESSAGE";
  const hodName = deptData?.hodName || 'Dr. Head of Department';
  const hodDesignation = cleanTitleString(deptData?.hodDesignation || `Head, ${heroTitle}`);
  const hodMessage = deptData?.hodMessage || 'Welcome to our department.';
  const hodPhoto = deptData?.hodPhotoUrl || '';

  const programsHeading = deptData?.programsHeading || 'OUR PROGRAMS';
  const rawPrograms = deptData?.programsList || [];
  const programsList = Array.isArray(rawPrograms)
    ? rawPrograms.filter((p: any) => p.is_visible !== false)
    : [];

  const facultyHeading = deptData?.facultyHeading || 'DEPARTMENT FACULTY';
  const rawFaculty = deptData?.facultyList || [];
  const facultyList = Array.isArray(rawFaculty)
    ? rawFaculty.filter((f: any) => f.is_visible !== false)
    : [];

  const showAlliedFacultySection =
    deptData?.showAlliedFacultySection !== false &&
    deptData?.alliedFacultyVisible !== false;

  const alliedFacultyHeading = deptData?.alliedFacultyHeading || 'ALLIED FACULTY';
  const rawAllied = deptData?.alliedFacultyList || [];
  const alliedFacultyList = Array.isArray(rawAllied)
    ? rawAllied.filter((f: any) => f.is_visible !== false)
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
      hodProfileLink={`/people/${slug}-hod`}
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
