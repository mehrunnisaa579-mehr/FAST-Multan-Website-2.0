import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { bootcampModules as defaultModules, bootcampSchedule as defaultSchedule } from '../../data/edc';
import { cmsService } from '../../services/cmsService';
import '../../styles/edc-pages.css';

export default function SummerBootcamp2026Page() {
  const [heroTitle, setHeroTitle] = useState('Summer Bootcamp 2026');
  const [heroImage, setHeroImage] = useState('');
  const [title, setTitle] = useState('Summer Bootcamp 2026');
  const [subtitle, setSubtitle] = useState('Executive Development Centre — FAST-NUCES Multan Campus');
  const [overview, setOverview] = useState(
    'The Summer Bootcamp 2026 is an intensive executive training program organized by the Executive Development Centre (EDC) at FAST-NUCES Multan Campus to enhance leadership, analytical, and digital skills.\n\nDesigned for corporate professionals, entrepreneurs, and advanced students, the bootcamp combines interactive lectures, practical case studies, and hands-on group project mentorship.'
  );
  const [modules, setModules] = useState<any[]>(defaultModules);
  const [schedule, setSchedule] = useState<any[]>(defaultSchedule);

  const [openingDate, setOpeningDate] = useState('Registration opening date');
  const [eligibility, setEligibility] = useState('Eligibility criteria & prerequisites');
  const [fee, setFee] = useState('Registration fee structure');
  const [contact, setContact] = useState('EDC Multan contact email & phone');

  useEffect(() => {
    const fetchCmsData = async () => {
      const data = await cmsService.getSetting<any>('edc_bootcamp_content', null);
      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.title) setTitle(data.title);
        if (data.subtitle) setSubtitle(data.subtitle);
        if (data.overview) setOverview(data.overview);
        if (data.modules && Array.isArray(data.modules)) setModules(data.modules.filter((m: any) => m.is_visible ?? true));
        if (data.schedule && Array.isArray(data.schedule)) setSchedule(data.schedule);

        if (data.openingDate) setOpeningDate(data.openingDate);
        if (data.eligibility) setEligibility(data.eligibility);
        if (data.fee) setFee(data.fee);
        if (data.contact) setContact(data.contact);
      }
    };
    fetchCmsData();
  }, []);

  return (
    <div className="edc-page-bg">
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      <div className="w-full max-w-[1060px] mx-auto px-[20px] sm:px-[28px] py-[48px] sm:py-[64px] space-y-[48px] sm:space-y-[56px] flex flex-col items-center text-center">
        {/* Page Header Title Block */}
        <div className="text-center max-w-[850px] w-full mx-auto pb-2 flex flex-col items-center">
          <h1 className="text-[26px] min-[700px]:text-[32px] font-bold text-[#0C71C3] tracking-tight leading-tight text-center w-full">
            {title}
          </h1>
          <p className="text-[15px] sm:text-[17px] text-[#555555] mt-[10px] font-medium leading-relaxed text-center w-full">
            {subtitle}
          </p>
        </div>

        {/* Overview */}
        <div className="space-y-[16px] w-full max-w-[850px] mx-auto flex flex-col items-center text-center">
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0C71C3] pb-[10px] border-b border-[#E2E8F0] text-center w-full">
            Workshop Overview
          </h2>
          <div className="space-y-[16px] text-[15px] sm:text-[16px] leading-[1.8] text-[#444444] w-full text-center flex flex-col items-center">
            {overview.split('\n\n').map((para, idx) => (
              <p key={idx} className="text-center w-full max-w-[850px] mx-auto">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-[20px] w-full max-w-[1060px] mx-auto flex flex-col items-center text-center">
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0C71C3] pb-[10px] border-b border-[#E2E8F0] text-center max-w-[850px] w-full mx-auto">
            Bootcamp Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] sm:gap-[28px] pt-1 w-full">
            {modules.map((mod, idx) => (
              <div
                key={mod.id || idx}
                className="bg-white p-[24px] border border-[#E2E8F0] rounded-[8px] shadow-xs card-hover-lift flex flex-col items-center text-center gap-[16px]"
              >
                <div className="p-[10px] bg-[#F0F9FF] border border-[#B9E6FE] rounded-[8px] flex-shrink-0 text-[#0093DD] overflow-hidden w-12 h-12 flex items-center justify-center mx-auto">
                  {mod.icon_url || mod.icon ? (
                    <img src={mod.icon_url || mod.icon} alt="Icon" className="w-full h-full object-cover rounded" />
                  ) : (
                    <BookOpen className="w-[22px] h-[22px]" />
                  )}
                </div>
                <div className="flex-1 text-center">
                  <h3 className="text-[17px] font-bold text-[#1F2937] mb-[6px] leading-snug text-center">
                    {mod.title}
                  </h3>
                  <p className="text-[14px] leading-[1.65] text-[#555555] text-center">
                    {mod.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-[20px] w-full max-w-[900px] mx-auto flex flex-col items-center text-center">
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0C71C3] pb-[10px] border-b border-[#E2E8F0] text-center w-full">
            Schedule
          </h2>
          <div className="edc-table-wrapper w-full">
            <table className="edc-table">
              <thead>
                <tr>
                  <th className="w-[20%]">Day</th>
                  <th className="w-[50%]">Session</th>
                  <th className="w-[30%]">Time</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-[#1F2937]">{row.day}</td>
                    <td className="text-[#333333]">{row.session}</td>
                    <td className="text-[#64748B] font-medium">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registration */}
        <div className="bg-[#F8FAFC] p-[28px] sm:p-[36px] border border-[#E2E8F0] rounded-[10px] shadow-xs space-y-[20px] w-full max-w-[900px] mx-auto flex flex-col items-center text-center">
          <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0C71C3] pb-[10px] border-b border-[#CBD5E1] text-center w-full">
            Registration Details
          </h2>
          <div className="grid grid-cols-1 gap-[12px] text-[15px] leading-[1.7] text-[#334155] w-full">
            <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-[6px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
              <span className="font-bold text-[#1E293B]">Registration Opening Date:</span>
              <span className="text-[#475569]">{openingDate}</span>
            </div>
            <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-[6px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
              <span className="font-bold text-[#1E293B]">Eligibility:</span>
              <span className="text-[#475569]">{eligibility}</span>
            </div>
            <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-[6px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
              <span className="font-bold text-[#1E293B]">Registration Fee:</span>
              <span className="text-[#475569]">{fee}</span>
            </div>
            <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-[6px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
              <span className="font-bold text-[#1E293B]">Contact Details:</span>
              <span className="text-[#475569]">{contact}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
