import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { homepageContent } from '../../data/homepage';
import { cmsService } from '../../services/cmsService';

// Helper to format stored time (e.g. "09:00" or "17:00:00") to 12-hour AM/PM format
function formatTimeTo12Hour(timeStr?: string): string {
  if (!timeStr || !timeStr.trim()) return '';
  const clean = timeStr.trim();
  if (clean.toLowerCase().includes('am') || clean.toLowerCase().includes('pm')) {
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

interface UpcomingEventsProps {
  data?: any;
  eventsHeading?: string;
  eventsSubtitle?: string;
}

export default function UpcomingEvents({ data, eventsHeading, eventsSubtitle }: UpcomingEventsProps = {}) {
  const [heading, setHeading] = useState('Upcoming Events');
  const [subtitle, setSubtitle] = useState("Have a look at what's coming up");
  const [events, setEvents] = useState<any[]>(homepageContent.upcomingEvents);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eventsHeading) {
      setHeading(eventsHeading);
    } else if (data?.eventsHeading) {
      setHeading(data.eventsHeading);
    }

    if (eventsSubtitle) {
      setSubtitle(eventsSubtitle);
    } else if (data?.eventsSubtitle) {
      setSubtitle(data.eventsSubtitle);
    }
  }, [data, eventsHeading, eventsSubtitle]);

  useEffect(() => {
    const fetchEventsData = async () => {
      const cmsEvents = await cmsService.getEvents();
      if (cmsEvents && cmsEvents.length > 0) {
        const formatted = cmsEvents
          .filter((item: any) => item.published !== false)
          .map((item: any) => {
            const rawDate = item.event_date || '16 Aug';
            const parts = rawDate.trim().split(/\s+/);
            const day = parts[0] || '16';
            const month = parts[1] ? parts[1].substring(0, 3).toUpperCase() : 'AUG';

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
              image: item.image_url || '',
              title: item.title || 'Campus Event',
              description: item.description || '',
              day,
              month,
              time: timeDisplay,
              location: item.location || 'FAST-NUCES Multan Campus',
            };
          });

        if (formatted.length > 0) {
          setEvents(formatted);
        }
      }
    };
    fetchEventsData();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth > 640 ? 320 : 280;
      const offset = direction === 'left' ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-[60px] w-full bg-[#F7F9FC] overflow-x-hidden">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px] relative">
        <h2 className="text-[32px] sm:text-[38px] md:text-[40px] lg:text-[46px] leading-[1.1] font-bold text-[#0C71C3] uppercase tracking-tight md:tracking-[-1px] text-center mb-2">
          {heading}
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[40px] font-medium">
          {subtitle}
        </p>

        {/* Carousel Container with Left/Right Navigation */}
        <div className="relative w-full max-w-[1100px] mx-auto">
          {events.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => scroll('left')}
                className="absolute left-[6px] sm:-left-[20px] md:-left-[24px] top-1/2 -translate-y-1/2 z-20 w-[42px] h-[42px] rounded-full bg-white text-[#333333] shadow-[0_2px_10px_rgba(0,0,0,0.12)] hover:bg-[#F5F5F5] hover:text-[#0093DD] flex items-center justify-center transition-colors cursor-pointer outline-none border border-gray-100"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => scroll('right')}
                className="absolute right-[6px] sm:-right-[20px] md:-right-[24px] top-1/2 -translate-y-1/2 z-20 w-[42px] h-[42px] rounded-full bg-white text-[#333333] shadow-[0_2px_10px_rgba(0,0,0,0.12)] hover:bg-[#F5F5F5] hover:text-[#0093DD] flex items-center justify-center transition-colors cursor-pointer outline-none border border-gray-100"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Horizontal scrollable track */}
          <div
            ref={scrollRef}
            className={`flex flex-nowrap gap-[24px] overflow-x-auto scroll-smooth py-3 px-1 select-none min-w-0 ${events.length <= 3 ? 'justify-center' : 'justify-start'}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {events.map((event, index) => {
              const hasImage = !!event.image;
              return (
                <div
                  key={event.id || index}
                  className="w-[270px] sm:w-[290px] md:w-[310px] h-[480px] flex-shrink-0 bg-white rounded-[8px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex flex-col text-left cursor-pointer card-hover-lift"
                >
                  {/* 1. MEDIA AREA (Image or EVENT IMAGE placeholder + Date Badge Overlay ONLY) */}
                  <div className="relative h-[220px] w-full flex-shrink-0 bg-white overflow-hidden">
                    {hasImage ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover block"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[13px] font-semibold text-[#888888] tracking-wide">
                          EVENT IMAGE
                        </span>
                      </div>
                    )}

                    {/* Absolute date badge overlay */}
                    <div className="absolute top-[16px] left-[16px] z-20 bg-[#0C71C3] text-white px-[12px] py-[8px] rounded-[4px] flex flex-col items-center justify-center shadow-md">
                      <span className="text-[20px] font-bold leading-none">{event.day}</span>
                      <span className="text-[12px] font-bold uppercase tracking-wider mt-0.5">{event.month}</span>
                    </div>
                  </div>

                  {/* 2. CONTENT AREA (Always rendered below media area) */}
                  <div className="p-[20px] flex flex-col flex-1 justify-start gap-[12px]">
                    {/* Event Title */}
                    <h3 className="text-[16px] font-bold text-[#333333] leading-snug line-clamp-2 h-[48px] overflow-hidden">
                      {event.title}
                    </h3>

                    {/* Event Description */}
                    <p className="text-[14px] text-[#555555] leading-[1.5] line-clamp-3 h-[63px] overflow-hidden">
                      {event.description || ''}
                    </p>

                    <div className="flex flex-col gap-[8px] mt-auto">
                      {/* Event Time Row */}
                      {event.time ? (
                        <div className="flex items-center gap-[8px] h-[16px]">
                          <div className="w-[16px] h-[16px] rounded-full bg-[#E5E5E5] flex-shrink-0 flex items-center justify-center" />
                          <span className="text-[13px] text-[#666666] leading-none font-medium truncate">
                            {event.time}
                          </span>
                        </div>
                      ) : (
                        <div className="h-[16px]" />
                      )}

                      {/* Event Location Row */}
                      {event.location ? (
                        <div className="flex items-center gap-[8px] h-[16px]">
                          <div className="w-[16px] h-[16px] rounded-full bg-[#E5E5E5] flex-shrink-0 flex items-center justify-center" />
                          <span className="text-[13px] text-[#666666] leading-none font-medium truncate">
                            {event.location}
                          </span>
                        </div>
                      ) : (
                        <div className="h-[16px]" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

