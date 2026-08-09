import { homepageContent } from '../../data/homepage';

export default function NewsAnnouncements() {
  const news = homepageContent.newsItems;

  return (
    <section className="py-[60px] w-full bg-white select-none">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        {/* Section Heading & Subheading */}
        <h2 className="text-[28px] font-bold text-[#16498C] text-center mb-2">
          News and Announcements
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[40px] font-medium">
          Recent updates from the campus
        </p>

        {/* Responsive flex cards layout */}
        <div className="flex flex-col md:flex-row gap-[24px] justify-center items-stretch">
          {news.map((item, index) => (
            <div 
              key={index}
              className="flex-1 w-full bg-white border border-[#EAEAEA] rounded-[8px] p-[20px] text-left flex flex-col justify-between group cursor-pointer transition-shadow hover:shadow-sm"
            >
              <div>
                <h3 className="text-[16px] font-bold text-[#16498C] mb-[8px] group-hover:text-[#0093DD] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-[14px] text-[#555555] leading-[1.6] mb-[12px]">
                  {item.excerpt}
                </p>
              </div>
              
              {/* Meta row at bottom */}
              <div className="flex items-center gap-[6px] text-[12px] text-[#999999] mt-auto font-medium">
                <span>{item.date}</span>
                <span>•</span>
                <span>{item.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
