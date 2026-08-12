import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import CmsImage from '../../components/ui/CmsImage';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

interface MgmtLinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  display_order: number;
  is_visible: boolean;
}

export default function SchoolOfManagementPage() {
  const [heroTitle, setHeroTitle] = useState('FAST School Of Management');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [headName, setHeadName] = useState('');
  const [headDesignation, setHeadDesignation] = useState('');
  const [headPhotoUrl, setHeadPhotoUrl] = useState('');
  const [headMessage, setHeadMessage] = useState('');
  const [programsList, setProgramsList] = useState<any[] | null>(null);
  const [facultyList, setFacultyList] = useState<any[] | null>(null);
  const [importantLinks, setImportantLinks] = useState<MgmtLinkItem[] | null>(null);

  useEffect(() => {
    const fetchCmsData = async () => {
      const savedData = await cmsService.getSetting<any>('school_of_management_content', null);
      if (savedData) {
        if (savedData.heroTitle) setHeroTitle(savedData.heroTitle);
        if (savedData.heroImageUrl || savedData.hero_image_url || savedData.heroImage) {
          setHeroImageUrl(savedData.heroImageUrl || savedData.hero_image_url || savedData.heroImage);
        }
        if (savedData.headName) setHeadName(savedData.headName);
        if (savedData.headDesignation) setHeadDesignation(savedData.headDesignation);
        if (savedData.headPhotoUrl) setHeadPhotoUrl(savedData.headPhotoUrl);
        if (savedData.headMessage) setHeadMessage(savedData.headMessage);
        if (savedData.programsList && Array.isArray(savedData.programsList)) {
          setProgramsList(savedData.programsList);
        }
        if (savedData.facultyList && Array.isArray(savedData.facultyList)) {
          setFacultyList(savedData.facultyList);
        }
        if (savedData.importantLinks && Array.isArray(savedData.importantLinks)) {
          setImportantLinks(savedData.importantLinks);
        }
      }
    };
    fetchCmsData();
  }, []);

  const visibleLinks = importantLinks ? importantLinks.filter((l) => l.is_visible !== false) : null;
  const visiblePrograms = programsList ? programsList.filter((p) => p.is_visible !== false) : null;
  const visibleFaculty = facultyList ? facultyList.filter((f) => f.is_visible !== false) : null;

  return (
    <div className="dept-page-container">
      {/* Shared Hero */}
      <AboutPageHero title={heroTitle} backgroundImage={heroImageUrl} />

      {/* Main Content Area */}
      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[55px] min-[1100px]:pb-[85px]">
        {/* HOD'S MESSAGE */}
        <section className="w-full text-center">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] uppercase mb-[28px] text-center">
            HOD'S MESSAGE
          </h2>

          <div className="flex flex-col md:flex-row gap-[32px] md:gap-[40px] items-center md:items-start text-left">
            {/* Left Column: Photo Placeholder */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-[190px] h-[235px] rounded-[4px] overflow-hidden flex items-center justify-center mb-[12px] shadow-sm${headPhotoUrl ? '' : ' bg-[#D9D9D9] p-[4px] text-center'}`}>
                <CmsImage
                  src={headPhotoUrl}
                  alt={headName || 'HOD Photo'}
                  fallbackLabel="PLACEHOLDER: HOD PHOTO"
                  fit="cover"
                />
              </div>
              <h3 className="text-[16px] font-bold text-[#333333]">{headName || 'Dr. [HOD Name]'}</h3>
              <p className="text-[13px] font-medium text-[#666666]">{headDesignation || 'Head, FAST School of Management'}</p>
            </div>

            {/* Right Column: Message Paragraphs */}
            <div className="flex-1 text-[15px] min-[700px]:text-[16px] leading-[1.7] text-[#444444] space-y-[16px]">
              {headMessage ? (
                <p>{headMessage}</p>
              ) : (
                <>
                  <p>
                    PLACEHOLDER: Welcome to the FAST School of Management Sciences at Multan Campus. We offer comprehensive business administration and management degrees focused on strategic decision-making, financial analytics, and entrepreneurial leadership.
                  </p>
                  <p>
                    PLACEHOLDER: Our programs equip students with modern managerial frameworks, digital business skills, and analytical capabilities required to lead contemporary corporate and financial institutions.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="dept-divider">
          <div className="dept-divider-line" />
          <div className="dept-divider-dot" />
        </div>

        {/* OUR PROGRAMS */}
        <section className="w-full text-center">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] mb-[28px] text-center">
            Our Programs
          </h2>

          <div className="flex flex-wrap justify-center gap-[24px] max-w-[1050px] mx-auto">
            {visiblePrograms && visiblePrograms.length > 0 ? (
              visiblePrograms.map((prog) => (
                <div key={prog.id} className="w-full max-w-[320px]">
                  <DepartmentCard
                    variant="program"
                    title={prog.title}
                    subtitle={prog.subtitle}
                    imageUrl={prog.image}
                    imageLabel="PROGRAM IMAGE"
                  />
                </div>
              ))
            ) : (
              <>
                <div className="w-full max-w-[320px]">
                  <DepartmentCard
                    variant="program"
                    title="BBA"
                    subtitle="Bachelor of Business Administration"
                    imageLabel="PLACEHOLDER: BBA PROGRAM"
                  />
                </div>
                <div className="w-full max-w-[320px]">
                  <DepartmentCard
                    variant="program"
                    title="BS (Business Analytics)"
                    subtitle="BS Business Analytics"
                    imageLabel="PLACEHOLDER: BS ANALYTICS"
                  />
                </div>
                <div className="w-full max-w-[320px]">
                  <DepartmentCard
                    variant="program"
                    title="BS (Financial Technology)"
                    subtitle="BS FinTech"
                    imageLabel="PLACEHOLDER: BS FINTECH"
                  />
                </div>
                <div className="w-full max-w-[320px]">
                  <DepartmentCard
                    variant="program"
                    title="MBA"
                    subtitle="Master of Business Administration"
                    imageLabel="PLACEHOLDER: MBA PROGRAM"
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* SECTION DIVIDER */}
        <div className="dept-divider">
          <div className="dept-divider-line" />
          <div className="dept-divider-dot" />
        </div>

        {/* IMPORTANT LINKS */}
        <section className="w-full text-center">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] mb-[20px] text-center">
            Important Links
          </h2>

          {visibleLinks && visibleLinks.length > 0 ? (
            <div className="flex flex-wrap justify-center items-center gap-[24px] text-center">
              {visibleLinks.map((link) => {
                const isExternal = link.url.startsWith('http');
                if (isExternal) {
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[16px] text-[#0C71C3] font-semibold hover:underline cursor-pointer flex flex-col items-center"
                      title={link.description}
                    >
                      <span>{link.title} →</span>
                      {link.description && (
                        <span className="text-[12px] font-normal text-[#666666] mt-0.5">{link.description}</span>
                      )}
                    </a>
                  );
                }
                return (
                  <Link
                    key={link.id}
                    to={link.url}
                    className="text-[16px] text-[#0C71C3] font-semibold hover:underline cursor-pointer flex flex-col items-center"
                    title={link.description}
                  >
                    <span>{link.title} →</span>
                    {link.description && (
                      <span className="text-[12px] font-normal text-[#666666] mt-0.5">{link.description}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[16px] text-[#0C71C3] font-semibold hover:underline cursor-pointer"
              >
                PLACEHOLDER: Department Important Link
              </a>
            </div>
          )}
        </section>

        {/* SECTION DIVIDER */}
        <div className="dept-divider">
          <div className="dept-divider-line" />
          <div className="dept-divider-dot" />
        </div>

        {/* DEPARTMENT FACULTY */}
        <section className="w-full text-center">
          <h2 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] mb-[28px] text-center">
            Department Faculty
          </h2>

          <div className="flex flex-wrap justify-center gap-[24px]">
            {visibleFaculty && visibleFaculty.length > 0 ? (
              visibleFaculty.map((fac) => (
                <div key={fac.id} className="w-full max-w-[240px] sm:w-[230px]">
                  <DepartmentCard
                    variant="faculty"
                    title={fac.name}
                    role={fac.designation}
                    imageUrl={fac.photoUrl}
                    imageLabel="FACULTY MEMBER"
                  />
                </div>
              ))
            ) : (
              Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="w-full max-w-[240px] sm:w-[230px]">
                  <DepartmentCard
                    variant="faculty"
                    title={`Dr. [Faculty ${idx + 1}]`}
                    role={idx % 2 === 0 ? 'Assistant Professor' : 'Lecturer'}
                    imageLabel={`FACULTY MEMBER ${idx + 1}`}
                  />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
