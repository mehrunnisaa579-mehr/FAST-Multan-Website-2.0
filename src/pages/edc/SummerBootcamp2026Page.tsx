import { BookOpen } from 'lucide-react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { bootcampModules, bootcampSchedule } from '../../data/edc';
import '../../styles/edc-pages.css';

export default function SummerBootcamp2026Page() {
  return (
    <div className="edc-page-bg">
      {/* Shared Hero */}
      <AboutPageHero title="Summer Bootcamp 2026" />

      {/* Main Content Area */}
      <div className="edc-content-wrapper text-left">
        {/* Main Headings */}
        <div className="text-center mb-[36px]">
          <h1 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3]">
            Summer Bootcamp 2026
          </h1>
          <p className="text-[15px] sm:text-[16px] text-[#555555] mt-[6px]">
            PLACEHOLDER: Executive Development Centre — FAST-NUCES Multan Campus
          </p>
        </div>

        {/* 1. Workshop Overview */}
        <div className="mb-[40px]">
          <h2 className="text-[20px] font-bold text-[#0C71C3] mb-[12px]">
            Workshop Overview
          </h2>
          <div className="space-y-[12px] text-[15px] leading-[1.75] text-[#444444]">
            <p>
              PLACEHOLDER: The Summer Bootcamp 2026 is an intensive executive training program organized by the Executive Development Centre (EDC) at FAST-NUCES Multan Campus to enhance leadership, analytical, and digital skills.
            </p>
            <p>
              PLACEHOLDER: Designed for corporate professionals, entrepreneurs, and advanced students, the bootcamp combines interactive lectures, practical case studies, and hands-on group project mentorship.
            </p>
          </div>
        </div>

        {/* 2. Bootcamp Modules */}
        <div className="mb-[40px]">
          <h2 className="text-[20px] font-bold text-[#0C71C3] mb-[16px]">
            Bootcamp Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            {bootcampModules.map((mod) => (
              <div
                key={mod.id}
                className="bg-white p-[20px] border border-[#EAEAEA] rounded-[4px] shadow-sm flex items-start gap-[14px]"
              >
                <div className="p-[10px] bg-[#F5F5F5] rounded-[4px] flex-shrink-0 text-[#0093DD]">
                  <BookOpen className="w-[20px] h-[20px]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#333333] mb-[6px]">
                    {mod.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-[#555555]">
                    {mod.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Schedule */}
        <div className="mb-[40px]">
          <h2 className="text-[20px] font-bold text-[#0C71C3] mb-[16px]">
            Schedule
          </h2>
          <div className="edc-table-wrapper">
            <table className="edc-table">
              <thead>
                <tr>
                  <th className="w-[20%]">Day</th>
                  <th className="w-[50%]">Session</th>
                  <th className="w-[30%]">Time</th>
                </tr>
              </thead>
              <tbody>
                {bootcampSchedule.map((row, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-[#333333]">{row.day}</td>
                    <td>{row.session}</td>
                    <td className="text-[#666666]">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Registration Details */}
        <div className="bg-[#F9FAFB] p-[24px] border border-[#EAEAEA] rounded-[4px]">
          <h2 className="text-[20px] font-bold text-[#0C71C3] mb-[16px]">
            Registration Details
          </h2>
          <div className="space-y-[8px] text-[15px] leading-[1.7] text-[#444444]">
            <p><span className="font-semibold text-[#333333]">Registration Opening Date:</span> PLACEHOLDER: Registration opening date</p>
            <p><span className="font-semibold text-[#333333]">Eligibility:</span> PLACEHOLDER: Eligibility criteria & prerequisites</p>
            <p><span className="font-semibold text-[#333333]">Registration Fee:</span> PLACEHOLDER: Registration fee structure</p>
            <p><span className="font-semibold text-[#333333]">Contact Details:</span> PLACEHOLDER: EDC Multan contact email & phone</p>
          </div>
        </div>
      </div>
    </div>
  );
}
