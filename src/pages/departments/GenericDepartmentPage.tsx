import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DecorativeProfileImageFrame from '../../components/ui/DecorativeProfileImageFrame';
import CmsImage from '../../components/ui/CmsImage';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { cmsService } from '../../services/cmsService';
import { GraduationCap, Users, BookOpen, ChevronRight, User } from 'lucide-react';

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

  const deptName = deptData?.deptName || slug?.replace(/-/g, ' ').toUpperCase() || 'DEPARTMENT';
  const heroTitle = deptData?.heroTitle || deptName;
  const heroSubtitle = deptData?.heroSubtitle || deptData?.description || 'Academic Excellence & Innovation';
  const heroImage = deptData?.heroImageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200';

  const hodName = deptData?.hodName || 'Head of Department';
  const hodDesignation = deptData?.hodDesignation || `Head, ${deptName}`;
  const hodMessage = deptData?.hodMessage || 'Welcome to our department.';
  const hodPhoto = deptData?.hodPhotoUrl || '';

  const programs = deptData?.programsList || [];
  const faculty = deptData?.facultyList || [];
  const alliedFaculty = deptData?.alliedFacultyList || [];

  return (
    <div className="w-full bg-[#F7F9FC] min-h-screen text-left">
      {/* ── HERO BANNER ── */}
      <section className="relative w-full bg-[#0B2E59] text-white py-16 sm:py-20 overflow-hidden">
        {heroImage && (
          <div className="absolute inset-0 z-0 opacity-20">
            <img src={heroImage} alt={heroTitle} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative z-10 w-full max-w-[1300px] mx-auto px-4 sm:px-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight mb-3">
            {heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto font-medium">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="w-full max-w-[1300px] mx-auto px-4 sm:px-10 py-12 space-y-16">
        {/* ── HOD MESSAGE SECTION ── */}
        <section className="bg-white rounded-xl p-6 sm:p-10 border border-[#E5E7EB] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-center">
            {/* HOD Photo */}
            <div className="flex flex-col items-center text-center">
              <DecorativeProfileImageFrame
                src={hodPhoto}
                alt={hodName}
                showBadge={true}
                fallbackLabel="HOD PHOTO"
                className="mb-4"
              />
              <h3 className="text-lg font-bold text-[#1F2937]">{hodName}</h3>
              <p className="text-xs font-semibold text-[#0093DD] mt-1">{hodDesignation}</p>
              {deptData?.hodEducation && (
                <p className="text-xs text-[#6B7280] mt-0.5">{deptData.hodEducation}</p>
              )}
            </div>

            {/* HOD Text */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0C71C3] uppercase tracking-tight">
                Head of Department's Message
              </h2>
              <div className="text-sm leading-relaxed text-[#4B5563] space-y-3 whitespace-pre-line">
                {hodMessage}
              </div>
            </div>
          </div>
        </section>

        {/* ── PROGRAMS SECTION ── */}
        {programs.length > 0 && (
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0C71C3] uppercase tracking-tight">
                {deptData?.programsHeading || 'Degree Programs Offered'}
              </h2>
              <p className="text-sm text-[#666666] mt-1">
                Explore our academic degree programs designed for career success
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs
                .filter((p: any) => p.is_visible !== false)
                .map((prog: any, idx: number) => (
                  <div
                    key={prog.id || idx}
                    className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-[#0093DD]/10 text-[#0093DD] flex items-center justify-center mb-4">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-[#1F2937] mb-1">{prog.title}</h3>
                      <p className="text-xs font-semibold text-[#0093DD] mb-3">{prog.subtitle}</p>
                      {prog.description && (
                        <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">
                          {prog.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ── DEPARTMENT FACULTY SECTION ── */}
        {faculty.length > 0 && (
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0C71C3] uppercase tracking-tight">
                {deptData?.facultyHeading || 'Department Faculty'}
              </h2>
              <p className="text-sm text-[#666666] mt-1">
                Meet our dedicated teaching faculty and researchers
              </p>
            </div>

            <div className="dept-card-row dept-faculty-grid">
              {faculty
                .filter((f: any) => f.is_visible !== false)
                .map((fac: any, idx: number) => (
                  <div key={fac.id || idx} className="dept-faculty-wrapper">
                    <Link to={`/people/${fac.slug || fac.id}`} className="no-underline block cursor-pointer h-full">
                      <DepartmentCard
                        variant="faculty"
                        title={fac.name}
                        role={fac.designation}
                        imageUrl={fac.photoUrl}
                        imageLabel={fac.name ? fac.name.substring(0, 2).toUpperCase() : 'FACULTY MEMBER'}
                      />
                    </Link>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ── ALLIED FACULTY SECTION ── */}
        {deptData?.showAlliedFacultySection !== false && alliedFaculty.length > 0 && (
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#7C3AED] uppercase tracking-tight">
                {deptData?.alliedFacultyHeading || 'Allied Faculty'}
              </h2>
              <p className="text-sm text-[#666666] mt-1">
                Visiting and allied faculty members contributing across disciplines
              </p>
            </div>

            <div className="dept-card-row dept-faculty-grid">
              {alliedFaculty
                .filter((f: any) => f.is_visible !== false)
                .map((fac: any, idx: number) => (
                  <div key={fac.id || idx} className="dept-faculty-wrapper">
                    <Link to={`/people/${fac.slug || fac.id}`} className="no-underline block cursor-pointer h-full">
                      <DepartmentCard
                        variant="faculty"
                        title={fac.name}
                        role={fac.designation}
                        imageUrl={fac.photoUrl}
                        imageLabel={fac.name ? fac.name.substring(0, 2).toUpperCase() : 'ALLIED FACULTY'}
                      />
                    </Link>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
