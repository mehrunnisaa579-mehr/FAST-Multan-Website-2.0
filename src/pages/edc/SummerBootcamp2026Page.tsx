import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import '../../styles/edc-pages.css';
import bootcampPoster from '../../assets/images/bootcamp_course_poster.png';

export default function SummerBootcamp2026Page() {
  const [heroTitle, setHeroTitle] = useState('Summer Bootcamp 2026');
  const [heroImage, setHeroImage] = useState('');
  const [title, setTitle] = useState('Summer Bootcamp 2026');
  const [subtitle, setSubtitle] = useState(
    'Executive Development Centre — FAST-NUCES Multan Campus'
  );

  const [overview, setOverview] = useState(
    'The Summer Bootcamp 2026 is an intensive executive training program organized by the Executive Development Centre (EDC) at FAST-NUCES Multan Campus to enhance leadership, analytical, and digital skills.\n\nDesigned for corporate professionals, entrepreneurs, and advanced students, the bootcamp combines interactive lectures, practical case studies, and hands-on group project mentorship.'
  );

  const [promoImage, setPromoImage] = useState(bootcampPoster);

  const [courseTitle, setCourseTitle] = useState(
    'Full Stack Web Development & Freelancing Bootcamp'
  );

  const [objectives, setObjectives] = useState<string[]>([
    'Master modern front-end & back-end technologies (React, Node.js, Express, MongoDB/SQL).',
    'Build production-ready full stack web applications from scratch.',
    'Learn professional freelancing strategies, client acquisition, and proposal writing on platforms like Upwork and Fiverr.',
    'Gain hands-on experience through real-world capstone projects and industry-standard workflows.',
  ]);

  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([
    'Develop responsive, dynamic web applications using React and modern JavaScript.',
    'Design and deploy RESTful APIs and secure database architectures.',
    'Utilize Git and GitHub for version control and team collaboration.',
    'Launch and optimize freelancing profiles to secure high-paying global clients.',
    'Deliver end-to-end web development solutions from client requirements to production deployment.',
  ]);

  useEffect(() => {
    const fetchCmsData = async () => {
      const data = await cmsService.getSetting<any>(
        'edc_bootcamp_content',
        null
      );

      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.title) setTitle(data.title);
        if (data.subtitle) setSubtitle(data.subtitle);
        if (data.overview) setOverview(data.overview);

        if (data.promoImage) setPromoImage(data.promoImage);
        if (data.courseTitle) setCourseTitle(data.courseTitle);

        if (
          data.objectives &&
          Array.isArray(data.objectives) &&
          data.objectives.length > 0
        ) {
          setObjectives(data.objectives);
        }

        if (
          data.learningOutcomes &&
          Array.isArray(data.learningOutcomes) &&
          data.learningOutcomes.length > 0
        ) {
          setLearningOutcomes(data.learningOutcomes);
        }
      }
    };

    fetchCmsData();
  }, []);

  return (
    <div className="edc-page-bg">
      <AboutPageHero
        title={heroTitle}
        backgroundImage={heroImage}
      />

      {/* Centered Main Page Container */}
      <div className="w-full max-w-[1160px] mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 flex flex-col items-center justify-center">

        {/* Page Header Title Block */}
        <div className="text-center max-w-[900px] w-full mx-auto flex flex-col items-center justify-center">

          <h1 className="text-[28px] sm:text-[34px] font-bold text-[#0C71C3] tracking-tight leading-tight text-center w-full mb-3">
            {title}
          </h1>

          <p className="text-[16px] sm:text-[18px] text-[#555555] font-medium leading-relaxed text-center w-full">
            {subtitle}
          </p>

        </div>

        {/* Workshop Overview Section */}
        <div className="w-full max-w-[900px] mx-auto flex flex-col items-center text-center pt-10 pb-14">

          {/* Workshop Overview — Same Styling as Main Page Heading */}
          <h2 className="text-[28px] sm:text-[34px] font-bold text-[#0C71C3] tracking-tight leading-tight text-center w-full mb-6">
            Workshop Overview
          </h2>

          <div className="text-[15px] sm:text-[16px] leading-[1.85] text-[#444444] text-center w-full">

            {overview.split('\n\n').map((para, idx) => (
              <p
                key={idx}
                className="text-center w-full max-w-[900px] mx-auto mb-5"
              >
                {para}
              </p>
            ))}

          </div>
        </div>

        {/* Two-Column Reference Layout Section */}
        <div className="w-full max-w-[1160px] mx-auto pt-4 pb-6">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start justify-center text-left">

            {/* Left Column — Promotional Course Poster */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start w-full">

              <div className="w-full max-w-[400px] sm:max-w-[420px] rounded-xl overflow-hidden shadow-md border border-[#E2E8F0] bg-white group hover:shadow-xl transition-all duration-300">

                <img
                  src={promoImage}
                  alt={courseTitle}
                  className="w-full h-auto object-cover block"
                />

              </div>

            </div>

            {/* Right Column — Course Title, Objectives & Learning Outcomes */}
            <div className="lg:col-span-7 space-y-8 flex flex-col justify-start">

              {/* Course Title */}
              <div className="pb-1">

                <h2 className="text-[24px] sm:text-[28px] font-bold text-[#0C71C3] leading-tight mb-3">
                  {courseTitle}
                </h2>

              </div>

              {/* Objectives Section */}
              <div className="bg-[#F8FAFC] p-6 sm:p-7 rounded-xl border border-[#E2E8F0]">

                <h3 className="text-[18px] font-bold text-[#1E293B] flex items-center gap-2.5 mb-4 border-b border-[#E2E8F0] pb-3">

                  <span className="w-2.5 h-2.5 rounded-full bg-[#0093DD]"></span>

                  <span>Objectives</span>

                </h3>

                <ul className="space-y-3 text-[14px] sm:text-[15px] text-[#475569] leading-relaxed list-disc list-inside pl-1 font-medium">

                  {objectives.map((obj, idx) => (
                    <li key={idx} className="leading-normal">
                      {obj}
                    </li>
                  ))}

                </ul>

              </div>

              {/* Learning Outcomes Section */}
              <div className="bg-[#F8FAFC] p-6 sm:p-7 rounded-xl border border-[#E2E8F0]">

                <h3 className="text-[18px] font-bold text-[#1E293B] flex items-center gap-2.5 mb-4 border-b border-[#E2E8F0] pb-3">

                  <span className="w-2.5 h-2.5 rounded-full bg-[#0093DD]"></span>

                  <span>Learning Outcomes</span>

                </h3>

                <p className="text-[14px] font-semibold text-[#334155] italic mb-3">
                  Participants will be able to:
                </p>

                <ol className="space-y-3 text-[14px] sm:text-[15px] text-[#475569] leading-relaxed list-decimal list-inside pl-1 font-medium">

                  {learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="leading-normal">
                      {outcome}
                    </li>
                  ))}

                </ol>

              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}