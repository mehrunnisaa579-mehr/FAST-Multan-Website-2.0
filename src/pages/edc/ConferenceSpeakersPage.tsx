import { useEffect, useState } from 'react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { conferenceSpeakers as defaultSpeakers } from '../../data/edc';
import { cmsService } from '../../services/cmsService';
import CmsImage from '../../components/ui/CmsImage';
import '../../styles/edc-pages.css';

export default function ConferenceSpeakersPage() {
  const [heroTitle, setHeroTitle] = useState('Conference Speakers');
  const [heroImage, setHeroImage] = useState('');
  const [speakers, setSpeakers] = useState<any[]>(defaultSpeakers);

  useEffect(() => {
    const fetchSpeakers = async () => {
      const data = await cmsService.getSetting<any>('edc_speakers_list', null);
      if (data) {
        if (data.heroTitle) setHeroTitle(data.heroTitle);
        setHeroImage(data.heroImage || '');
        if (data.speakers && Array.isArray(data.speakers) && data.speakers.length > 0) {
          setSpeakers(data.speakers.filter((s: any) => s.is_visible ?? true));
        }
      }
    };
    fetchSpeakers();
  }, []);

  return (
    <div className="edc-page-bg">
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      <div className="edc-content-wrapper text-left space-y-[45px]">
        {speakers.map((speaker, sIdx) => {
          const bioParagraphs = Array.isArray(speaker.bio)
            ? speaker.bio
            : (speaker.bio || '').split('\n\n');

          const photoSrc = speaker.photo_url || speaker.photo || speaker.image;

          return (
            <div
              key={speaker.id || sIdx}
              className="flex flex-col sm:flex-row gap-[24px] items-start border-b border-[#EAEAEA] pb-[40px] last:border-b-0 last:pb-0 card-hover-lift rounded-[8px] p-[16px]"
            >
              {/* Speaker Photo */}
              <div className="w-full sm:w-[190px] h-[220px] rounded-[4px] flex items-center justify-center flex-shrink-0 overflow-hidden bg-white border border-[#E5E7EB] person-photo-glow">
                <CmsImage
                  src={photoSrc}
                  alt={speaker.name}
                  fallbackLabel="SPEAKER PHOTO"
                  fit="cover"
                />
              </div>

              {/* Speaker Details */}
              <div className="flex-1">
                <h2 className="text-[21px] font-bold text-[#0C71C3] mb-[4px]">
                  {speaker.name}
                </h2>
                <p className="text-[14px] font-semibold text-[#666666] mb-[12px]">
                  {speaker.title} {speaker.organization ? `— ${speaker.organization}` : ''}
                </p>
                <div className="space-y-[10px] text-[15px] leading-[1.7] text-[#444444]">
                  {bioParagraphs.map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
