import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { conferenceScheduleDay1, conferenceScheduleDay2 } from '../../data/edc';
import { cmsService } from '../../services/cmsService';
import CmsImage from '../../components/ui/CmsImage';
import '../../styles/edc-pages.css';

export default function ConferencesPage() {
  const [heroTitle, setHeroTitle] = useState('Conferences');
  const [heroImage, setHeroImage] = useState('');
  const [heading, setHeading] = useState('PLACEHOLDER: EDC Conference 2026');
  const [posterUrl, setPosterUrl] = useState('');
  const [description, setDescription] = useState(
    'PLACEHOLDER: Official conference details, thematic tracks, and institutional objectives for the FAST-NUCES Multan Executive Development Centre Conference will appear here.\n\nPLACEHOLDER: The conference brings together leading academic researchers, industry executives, and postgraduate scholars to exchange insights on modern technology trends and management practices.\n\nPLACEHOLDER: Key conference highlights include peer-reviewed technical sessions, executive keynotes, panel discussions on regional industrial growth, and paper award ceremonies.'
  );
  const [highlights, setHighlights] = useState<string[]>([
    'Keynote addresses by international academic & industry experts',
    'Parallel technical research paper presentation tracks',
    'Interactive panel discussions & delegate networking sessions',
  ]);
  const [day1Schedule, setDay1Schedule] = useState(conferenceScheduleDay1);
  const [day2Schedule, setDay2Schedule] = useState(conferenceScheduleDay2);

  useEffect(() => {
    const fetchCmsData = async () => {
      const data = await cmsService.getSetting<any>('edc_conference_content', null);
      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        if (data.heroImage) setHeroImage(data.heroImage);
        if (data.heading) setHeading(data.heading);
        if (data.posterUrl) setPosterUrl(data.posterUrl);
        if (data.description) setDescription(data.description);
        if (data.highlights && Array.isArray(data.highlights)) setHighlights(data.highlights);
        if (data.day1Schedule && Array.isArray(data.day1Schedule)) setDay1Schedule(data.day1Schedule);
        if (data.day2Schedule && Array.isArray(data.day2Schedule)) setDay2Schedule(data.day2Schedule);
      }
    };
    fetchCmsData();
  }, []);

  return (
    <div className="edc-page-bg">
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      <div className="edc-content-wrapper text-left">
        <h1 className="text-[24px] min-[700px]:text-[28px] font-bold text-[#0C71C3] text-center mb-[32px]">
          {heading}
        </h1>

        <div className="flex flex-col md:flex-row gap-[32px] items-start mb-[50px]">
          {/* Left Poster */}
          <div className={`w-full md:w-[320px] min-h-[400px] rounded-[4px] flex items-center justify-center flex-shrink-0 mx-auto overflow-hidden${posterUrl ? '' : ' bg-white border border-[#CCCCCC] p-[4px]'}`}>
            <CmsImage
              src={posterUrl}
              alt={heading || 'Conference Poster'}
              fallbackLabel="PLACEHOLDER: CONFERENCE POSTER"
              fit="contain"
            />
          </div>

          {/* Right Text */}
          <div className="flex-1 space-y-[16px] text-[15px] leading-[1.75] text-[#444444]">
            {description.split('\n\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}

            {highlights.length > 0 && (
              <div className="bg-[#F9FAFB] p-[16px] border border-[#EAEAEA] rounded-[4px] mt-[20px]">
                <p className="font-semibold text-[#333333] mb-[6px]">Conference Overview Highlights:</p>
                <ul className="list-disc list-inside space-y-[4px] text-[14px]">
                  {highlights.map((hl, idx) => (
                    <li key={idx}>{hl}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Schedule */}
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
                {day1Schedule.map((row, idx) => (
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
                {day2Schedule.map((row, idx) => (
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
