import { homepageContent } from '../../data/homepage';

export default function UpcomingEvents() {
  const events = homepageContent.upcomingEvents;

  return (
    <section className="py-[60px] w-full bg-[#F7F9FC] select-none">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        {/* Section Heading & Subheading */}
        <h2 className="text-[28px] font-bold text-[#16498C] text-center mb-2">
          Upcoming Events
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[40px] font-medium">
          Have a look at what's coming up
        </p>

        {/* 2-column list centered at max-width 900px */}
        <div className="flex flex-col md:flex-row gap-[24px] justify-center items-stretch max-w-[900px] mx-auto">
          {events.map((event, index) => {
            const hasImage = !!event.image;
            return (
              <div 
                key={index}
                className="flex-1 w-full bg-white rounded-[8px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex flex-col text-left cursor-pointer transition-shadow hover:shadow-md"
              >
                {/* Event Image area */}
                <div className="relative h-[160px] w-full flex-shrink-0">
                  {hasImage ? (
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-[#D9D9D9] flex items-center justify-center">
                      <span className="text-[13px] font-semibold text-[#888888] tracking-wide">
                        EVENT IMAGE
                      </span>
                    </div>
                  )}

                  {/* Absolute date badge */}
                  <div className="absolute top-[16px] left-[16px] z-20 bg-[#16498C] text-white px-[12px] py-[8px] rounded-[4px] flex flex-col items-center justify-center shadow-md">
                    <span className="text-[20px] font-bold leading-none">{event.day}</span>
                    <span className="text-[12px] font-bold uppercase tracking-wider mt-0.5">{event.month}</span>
                  </div>
                </div>

                {/* Event Info padding 16px */}
                <div className="p-[16px] flex flex-col justify-between flex-1 gap-[12px]">
                  <h3 className="text-[16px] font-bold text-[#333333] leading-snug">
                    {event.title}
                  </h3>

                  <div className="flex flex-col gap-[8px]">
                    {/* Time */}
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[16px] h-[16px] rounded-full bg-[#E5E5E5] flex-shrink-0 flex items-center justify-center" />
                      <span className="text-[13px] text-[#666666] leading-none font-medium">
                        {event.time}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-[8px]">
                      <div className="w-[16px] h-[16px] rounded-full bg-[#E5E5E5] flex-shrink-0 flex items-center justify-center" />
                      <span className="text-[13px] text-[#666666] leading-none font-medium">
                        {event.location}
                      </span>
                    </div>
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
