import AboutPageHero from '../../components/about/AboutPageHero';
import { conferenceSpeakers } from '../../data/edc';
import '../../styles/edc-pages.css';

export default function ConferenceSpeakersPage() {
  return (
    <div className="edc-page-bg">
      {/* Shared Hero */}
      <AboutPageHero title="Conference Speakers" />

      {/* Main Content Area */}
      <div className="edc-content-wrapper text-left space-y-[45px]">
        {conferenceSpeakers.map((speaker) => (
          <div
            key={speaker.id}
            className="flex flex-col sm:flex-row gap-[24px] items-start border-b border-[#EAEAEA] pb-[40px] last:border-b-0 last:pb-0"
          >
            {/* Speaker Photo Placeholder */}
            <div className="w-full sm:w-[190px] h-[220px] bg-[#D9D9D9] border border-[#CCCCCC] rounded-[4px] flex items-center justify-center p-[16px] flex-shrink-0">
              <span className="text-[12px] font-semibold text-[#666666] tracking-wide uppercase text-center">
                PLACEHOLDER: SPEAKER PHOTO
              </span>
            </div>

            {/* Speaker Details */}
            <div className="flex-1">
              <h2 className="text-[21px] font-bold text-[#0C71C3] mb-[4px]">
                {speaker.name}
              </h2>
              <p className="text-[14px] font-semibold text-[#666666] mb-[12px]">
                {speaker.title}
              </p>
              <div className="space-y-[10px] text-[15px] leading-[1.7] text-[#444444]">
                {speaker.bio.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
