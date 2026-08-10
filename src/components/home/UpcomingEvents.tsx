import { useEffect, useState } from 'react';
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

export default function UpcomingEvents() {
  const [heading, setHeading] = useState('Upcoming Events');
  const [subtitle, setSubtitle] = useState("Have a look at what's coming up");
  const [events, setEvents] = useState<any[]>(homepageContent.upcomingEvents);

  useEffect(() => {
    const fetchEventsData = async () => {
      const data = await cmsService.getSetting<any>('homepage_full_content', null);
      if (data) {
        if (data.eventsHeading) setHeading(data.eventsHeading);
        if (data.eventsSubtitle) setSubtitle(data.eventsSubtitle);
      }
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

  return (
    <section className="py-[60px] w-full bg-[#F7F9FC] select-none">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        {/* Section Heading & Subheading */}
        <h2 className="text-[28px] font-bold text-[#0C71C3] text-center mb-2">
          {heading}
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[40px] font-medium">
          {subtitle}
        </p>

        {/* 2-column list centered at max-width 900px */}
        <div className="flex flex-col md:flex-row gap-[24px] justify-center items-stretch max-w-[900px] mx-auto">
          {events.map((event, index) => {
            const hasImage = !!event.image;
            return (
              <div 
                key={event.id || index}
                className="flex-1 w-full bg-white rounded-[8px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex flex-col text-left cursor-pointer transition-shadow hover:shadow-md"
              >
                {/* 1. MEDIA AREA (Image or EVENT IMAGE placeholder + Date Badge Overlay ONLY) */}
                <div className="relative h-[160px] w-full flex-shrink-0 bg-[#D9D9D9]">
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
                <div className="p-[16px] flex flex-col justify-between flex-1 gap-[12px]">
                  {/* Event Title */}
                  <h3 className="text-[16px] font-bold text-[#333333] leading-snug">
                    {event.title}
                  </h3>

                  {/* Event Description */}
                  {event.description && (
                    <p className="text-[14px] text-[#555555] leading-[1.6] line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  <div className="flex flex-col gap-[8px] mt-auto">
                    {/* Event Time Row (Rendered if start/end time exists) */}
                    {event.time ? (
                      <div className="flex items-center gap-[8px]">
                        <div className="w-[16px] h-[16px] rounded-full bg-[#E5E5E5] flex-shrink-0 flex items-center justify-center" />
                        <span className="text-[13px] text-[#666666] leading-none font-medium">
                          {event.time}
                        </span>
                      </div>
                    ) : null}

                    {/* Event Location Row (Rendered if location exists) */}
                    {event.location ? (
                      <div className="flex items-center gap-[8px]">
                        <div className="w-[16px] h-[16px] rounded-full bg-[#E5E5E5] flex-shrink-0 flex items-center justify-center" />
                        <span className="text-[13px] text-[#666666] leading-none font-medium">
                          {event.location}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
