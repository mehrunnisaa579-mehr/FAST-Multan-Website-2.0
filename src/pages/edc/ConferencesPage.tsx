import AboutPageHero from '../../components/about/AboutPageHero';
import { conferenceScheduleDay1, conferenceScheduleDay2 } from '../../data/edc';
import '../../styles/edc-pages.css';

export default function ConferencesPage() {
  return (
    <div className="edc-page-bg">
      {/* Shared Hero */}
      <AboutPageHero title="Conferences" />

      {/* Main Content Area */}
      <div className="edc-content-wrapper text-left">
        {/* Main Centered Heading */}
        <h1 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] text-center mb-[32px]">
          PLACEHOLDER: EDC Conference 2026
        </h1>

        {/* Two Column Layout (Poster Left, Text Right) */}
        <div className="flex flex-col md:flex-row gap-[32px] items-start mb-[50px]">
          {/* Left: Poster Placeholder */}
          <div className="w-full md:w-[320px] h-[430px] bg-[#D9D9D9] border border-[#CCCCCC] rounded-[4px] flex items-center justify-center p-[20px] flex-shrink-0 mx-auto">
            <span className="text-[13px] font-semibold text-[#666666] tracking-wide uppercase text-center">
              PLACEHOLDER: CONFERENCE POSTER
            </span>
          </div>

          {/* Right: Description & Details */}
          <div className="flex-1 space-y-[16px] text-[15px] leading-[1.75] text-[#444444]">
            <p>
              PLACEHOLDER: Official conference details, thematic tracks, and institutional objectives for the FAST-NUCES Multan Executive Development Centre Conference will appear here.
            </p>
            <p>
              PLACEHOLDER: The conference brings together leading academic researchers, industry executives, and postgraduate scholars to exchange insights on modern technology trends and management practices.
            </p>
            <p>
              PLACEHOLDER: Key conference highlights include peer-reviewed technical sessions, executive keynotes, panel discussions on regional industrial growth, and paper award ceremonies.
            </p>
            <div className="bg-[#F9FAFB] p-[16px] border border-[#EAEAEA] rounded-[4px] mt-[20px]">
              <p className="font-semibold text-[#333333] mb-[6px]">Conference Overview Highlights:</p>
              <ul className="list-disc list-inside space-y-[4px] text-[14px]">
                <li>PLACEHOLDER: Keynote addresses by international academic & industry experts</li>
                <li>PLACEHOLDER: Parallel technical research paper presentation tracks</li>
                <li>PLACEHOLDER: Interactive panel discussions & delegate networking sessions</li>
              </ul>
            </div>
            <p className="text-[14px] text-[#666666]">
              PLACEHOLDER: Registration and paper submission details will be officially published prior to the event.
            </p>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="border-t border-[#EAEAEA] pt-[40px]">
          <h2 className="text-[22px] font-bold text-[#0C71C3] mb-[24px]">
            Conference Schedule
          </h2>

          {/* Day 1 */}
          <h3 className="text-[18px] font-bold text-[#333333] mb-[12px]">
            Conference Day 1
          </h3>
          <div className="edc-table-wrapper">
            <table className="edc-table">
              <thead>
                <tr>
                  <th className="w-[30%]">Time</th>
                  <th className="w-[70%]">Topic</th>
                </tr>
              </thead>
              <tbody>
                {conferenceScheduleDay1.map((row, idx) => (
                  <tr key={idx}>
                    <td className="font-medium text-[#444444]">{row.time}</td>
                    <td>{row.topic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Day 2 */}
          <h3 className="text-[18px] font-bold text-[#333333] mt-[35px] mb-[12px]">
            Conference Day 2
          </h3>
          <div className="edc-table-wrapper">
            <table className="edc-table">
              <thead>
                <tr>
                  <th className="w-[30%]">Time</th>
                  <th className="w-[70%]">Topic</th>
                </tr>
              </thead>
              <tbody>
                {conferenceScheduleDay2.map((row, idx) => (
                  <tr key={idx}>
                    <td className="font-medium text-[#444444]">{row.time}</td>
                    <td>{row.topic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
