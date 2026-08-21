import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Play, Newspaper, ArrowRight } from 'lucide-react';
import { homepageContent } from '../../data/homepage';
import { cmsService } from '../../services/cmsService';
import CmsImage from '../ui/CmsImage';

// Helper to format 24h time string to 12h AM/PM format
function formatTimeTo12Hour(timeStr?: string): string {
  if (!timeStr || !timeStr.trim()) return '';
  const clean = timeStr.trim();

  if (
    clean.toLowerCase().includes('am') ||
    clean.toLowerCase().includes('pm')
  ) {
    return clean.toUpperCase();
  }

  const parts = clean.split(':');

  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    if (isNaN(hours)) return clean;

    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${hours}:${minutes} ${ampm}`;
  }

  return clean;
}

export default function EventsAndNews() {
  // ── Events State ──────────────────────────────────────────────────────────
  const [eventsHeading, setEventsHeading] = useState('Upcoming Events');
  const [eventsSubtitle, setEventsSubtitle] = useState(
    "Have a look at what's coming up"
  );
  const [eventsList, setEventsList] = useState<any[]>([]);

  // ── News State ────────────────────────────────────────────────────────────
  const [newsHeading, setNewsHeading] = useState('News & Announcements');
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch CMS homepage settings
      const settings = await cmsService.getSetting<any>(
        'homepage_full_content',
        null
      );

      if (settings) {
        if (settings.eventsHeading) setEventsHeading(settings.eventsHeading);
        if (settings.eventsSubtitle) setEventsSubtitle(settings.eventsSubtitle);
        if (settings.newsHeading) setNewsHeading(settings.newsHeading);
      }

      // 2. Fetch CMS Events
      const cmsEvents = await cmsService.getEvents();
      let formattedEvents: any[] = [];

      if (cmsEvents && cmsEvents.length > 0) {
        formattedEvents = cmsEvents
          .filter(
            (item: any) =>
              item.published !== false && item.is_archived !== true
          )
          .map((item: any) => {
            const rawDate = item.event_date || '19 Aug';
            const parts = rawDate.trim().split(/\s+/);
            const day = parts[0] || '19';
            const month = parts[1]
              ? parts[1].substring(0, 3).toUpperCase()
              : 'AUG';

            const start12 = formatTimeTo12Hour(item.start_time);
            const end12 = formatTimeTo12Hour(item.end_time);

            let timeDisplay = '';

            if (start12 && end12) {
              timeDisplay = `${start12} – ${end12}`;
            } else if (start12) {
              timeDisplay = start12;
            }

            return {
              id: item.id,
              title: item.title || 'Campus Event',
              description: item.description || '',
              day,
              month,
              time: timeDisplay,
              location: item.location || 'FAST-NUCES Multan',
              image: item.image_url || item.image || '',
              videoUrl: item.video_url || item.videoUrl || '',
            };
          });
      }

      // Merge with default fallback events so 2x2 grid always has 4 items
      const combinedEvents = [...formattedEvents];

      homepageContent.upcomingEvents.forEach(
        (defEvent: any, idx: number) => {
          if (combinedEvents.length < 4) {
            combinedEvents.push({
              id: `default-event-${idx}`,
              title: defEvent.title || `Campus Event ${idx + 1}`,
              description: 'Join us for this upcoming university session.',
              day: defEvent.day || '19',
              month: defEvent.month || 'AUG',
              time: defEvent.time || '9:00 AM - 5:00 PM',
              location:
                defEvent.location || 'FAST-NUCES Multan Campus',
              image: defEvent.image || '',
              videoUrl: '',
            });
          }
        }
      );

      setEventsList(combinedEvents.slice(0, 4));

      // 3. Fetch CMS News
      const cmsNews = await cmsService.getNews();
      let formattedNews: any[] = [];

      if (cmsNews && cmsNews.length > 0) {
        formattedNews = cmsNews
          .filter(
            (n: any) =>
              n.published !== false &&
              n.is_visible !== false &&
              n.is_archived !== true
          )
          .map((n: any, idx: number) => {
            const pubDate = n.published_at ? new Date(n.published_at) : null;
            const diffDays = pubDate && !isNaN(pubDate.getTime())
              ? Math.abs((Date.now() - pubDate.getTime()) / (1000 * 60 * 60 * 24))
              : 999;
            const isNew = n.is_new === true || n.isNew === true || diffDays <= 7 || idx === 0;

            return {
              id: n.id,
              title: n.title,
              excerpt: n.excerpt || n.content || '',
              date: pubDate && !isNaN(pubDate.getTime())
                ? pubDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : n.date || 'Jan 1, 2026',
              author: n.author || 'Admin',
              slug: n.slug || n.id,
              isNew,
            };
          });
      }

      if (formattedNews.length < 4) {
        homepageContent.newsItems.forEach(
          (defNews: any, idx: number) => {
            formattedNews.push({
              id: `default-news-${idx}`,
              title: defNews.title || `University Update ${idx + 1}`,
              excerpt:
                defNews.excerpt ||
                'Latest announcement from FAST-NUCES Multan Campus.',
              date: defNews.date || 'Jan 1, 2026',
              author: defNews.author || 'Admin',
              slug: `news-${idx}`,
              isNew: idx === 0 || idx === 1,
            });
          }
        );
      }

      setNewsList(formattedNews);
    };

    fetchData();
  }, []);

  // Double news list for seamless infinite loop
  const infiniteNews = [...newsList, ...newsList];

  return (
    <section className="py-[48px] sm:py-[54px] w-full bg-[#F7F9FC]">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[32px] md:px-[40px]">

        {/* Section Header */}
        <div className="text-left mb-[16px] relative -top-[28px]">
          <h2 className="text-[22px] sm:text-[25px] font-bold text-[#0C71C3] uppercase tracking-tight leading-[1.5]">
            {eventsHeading}
          </h2>

          <p className="text-[13.5px] text-[#666666] font-medium mt-[-5px]">
            {eventsSubtitle}
          </p>
        </div>

        {/* ── Two Column Split Layout ── */}
        <div className="flex flex-col lg:flex-row gap-[28px] lg:gap-[32px] items-start">

          {/* ════ LEFT COLUMN — UPCOMING EVENTS ═════════════════════════════ */}
          <div className="w-full lg:w-[62%] flex flex-col justify-between">

            {/* 2 x 2 Event Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] sm:gap-[16px]">
              {eventsList.map((event) => {
                const hasVideo = !!event.videoUrl;
                const hasImage = !!event.image;

                return (
                  <div
                    key={event.id}
                    className="bg-white border border-[#E5E7EB] rounded-[8px] overflow-hidden flex flex-col shadow-xs card-hover-lift"
                  >

                    {/* Compact Media Area */}
                    <div className="relative w-full h-[125px] sm:h-[135px] bg-white overflow-hidden flex items-center justify-center flex-shrink-0">

                      {hasVideo ? (
                        <div className="w-full h-full relative group">

                          {event.videoUrl.endsWith('.mp4') ||
                          event.videoUrl.endsWith('.webm') ? (
                            <video
                              src={event.videoUrl}
                              muted
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#111827] flex items-center justify-center">
                              {hasImage ? (
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <CmsImage
                                  src={null}
                                  alt={event.title}
                                  fallbackLabel="EVENT VIDEO"
                                  fit="cover"
                                />
                              )}
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full bg-[#0093DD] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <CmsImage
                          src={event.image}
                          alt={event.title}
                          fallbackLabel="EVENT MEDIA"
                          fit="cover"
                        />
                      )}

                      {/* Compact Date Badge Overlay */}
                      <div className="absolute top-[8px] left-[8px] z-10 bg-[#0C71C3] text-white px-[8px] py-[4px] rounded-[4px] flex flex-col items-center justify-center shadow-md select-none">
                        <span className="text-[13.5px] font-bold leading-none">
                          {event.day}
                        </span>

                        <span className="text-[9.5px] font-bold uppercase tracking-wider mt-0.5">
                          {event.month}
                        </span>
                      </div>
                    </div>

                    {/* Compact Event Content Area */}
                    <div className="p-[12px] flex flex-col flex-1 justify-between gap-[6px] text-left">

                      <h3 className="text-[13.5px] font-bold text-[#1F2937] leading-snug line-clamp-1 hover:text-[#0C71C3] transition-colors">
                        {event.title}
                      </h3>

                      <div className="space-y-[3px] text-[11.5px] text-[#666666] font-medium pt-1 border-t border-[#F1F5F9]">

                        {event.time && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Clock className="w-3 h-3 text-[#0093DD] flex-shrink-0" />
                            <span className="truncate">{event.time}</span>
                          </div>
                        )}

                        {event.location && (
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3 h-3 text-[#0093DD] flex-shrink-0" />
                            <span className="truncate">
                              {event.location}
                            </span>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ════ RIGHT COLUMN — NEWS & ANNOUNCEMENTS ═══════════════════════ */}
          <div className="w-full lg:w-[38%] bg-[#0B2E59] rounded-[12px] p-[18px] sm:p-[20px] flex flex-col justify-between border border-[#082244] shadow-xl text-white overflow-hidden flex-shrink-0 h-auto min-h-[440px] max-h-[460px] lg:max-h-[460px]">

            {/* Navy Panel Top Heading */}
            <div className="pb-[10px] border-b border-white/15 flex items-center justify-between text-left flex-shrink-0">

              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-[#0093DD]" />

                <h2 className="text-[17px] font-bold text-white uppercase tracking-wider">
                  {newsHeading}
                </h2>
              </div>

              <span className="text-[10px] font-semibold text-white/60 tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded">
                LIVE
              </span>
            </div>

            {/* Scroller Track Window */}
            <div
              className={`relative flex-1 overflow-hidden my-2 select-none h-[290px] ${
                isPaused ? 'news-vertical-scroller-paused' : ''
              }`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              aria-label="News and Announcements continuous scroll"
            >

              {/* Top / Bottom Subtle Vignette Fades */}
              <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-b from-[#0B2E59] to-transparent z-10 pointer-events-none" />

              <div className="absolute bottom-0 inset-x-0 h-3 bg-gradient-to-t from-[#0B2E59] to-transparent z-10 pointer-events-none" />

              {/* Continuous Vertical Scrolling Loop Track */}
              <div className="news-vertical-scroller flex flex-col gap-[10px] pt-1">

                {infiniteNews.map((item, idx) => (
                  <Link
                    key={`${item.id}-${idx}`}
                    to="/news"
                    className="news-jelly-bar block no-underline p-[11px] px-[14px] rounded-[6px] text-left cursor-pointer"
                  >

                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className="text-[13.5px] font-bold text-[#0093DD] leading-snug line-clamp-1 flex-1">
                        {item.title}
                      </h4>
                      {item.isNew && (
                        <span className="new-badge-text badge-cute-dance flex-shrink-0">
                          NEW
                        </span>
                      )}
                    </div>

                    {item.excerpt && (
                      <p className="text-[11.5px] text-[#4B5563] leading-snug line-clamp-1 mb-1 font-normal">
                        {item.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10.5px] text-[#6B7280] font-medium pt-1 border-t border-[#F3F4F6]">
                      <span>{item.date}</span>
                    </div>

                  </Link>
                ))}

              </div>
            </div>

            {/* Bottom "View More" Button */}
            <Link
              to="/news"
              className="w-full bg-[#0093DD] hover:bg-[#061830] hover:border hover:border-[#0093DD]/50 text-[#FFFFFF] font-bold text-[12.5px] uppercase tracking-wider py-[10px] px-[16px] rounded-[6px] text-center shadow-md transition-all duration-250 no-underline flex items-center justify-center gap-2 group flex-shrink-0 mt-1"
            >
              <span>View More</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}