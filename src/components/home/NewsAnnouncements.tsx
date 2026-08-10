import { useEffect, useState } from 'react';
import { homepageContent } from '../../data/homepage';
import { cmsService } from '../../services/cmsService';
import { Link } from 'react-router-dom';

export default function NewsAnnouncements() {
  const [heading, setHeading] = useState('News and Announcements');
  const [subtitle, setSubtitle] = useState('Recent updates from the campus');
  const [news, setNews] = useState<any[]>(homepageContent.newsItems);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const fetchNewsData = async () => {
      let count = 3;
      const data = await cmsService.getSetting<any>('homepage_full_content', null);
      if (data) {
        if (data.newsHeading) setHeading(data.newsHeading);
        if (data.newsSubtitle) setSubtitle(data.newsSubtitle);
        if (data.newsCount) count = Number(data.newsCount);
        if (data.showNewsSection !== undefined) setIsVisible(data.showNewsSection);
      }
      const cmsNews = await cmsService.getNews();
      if (cmsNews && cmsNews.length > 0) {
        setNews(cmsNews.slice(0, count));
      }
    };
    fetchNewsData();
  }, []);

  if (!isVisible) return null;

  return (
    <section className="py-[60px] w-full bg-white select-none">
      <div className="w-full max-w-[1300px] mx-auto px-[16px] sm:px-[40px]">
        {/* Section Heading & Subheading */}
        <h2 className="text-[28px] font-bold text-[#0C71C3] text-center mb-2">
          {heading}
        </h2>
        <p className="text-[15px] text-[#666666] text-center mb-[40px] font-medium">
          {subtitle}
        </p>

        {/* Responsive flex cards layout */}
        <div className="flex flex-col md:flex-row gap-[24px] justify-center items-stretch">
          {news.map((item, index) => {
            const dateDisplay = item.published_at
              ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : item.date || 'January 1, 2026';

            return (
              <Link
                key={index}
                to="/news"
                className="flex-1 w-full bg-white border border-[#EAEAEA] rounded-[8px] p-[20px] text-left flex flex-col justify-between group cursor-pointer transition-shadow hover:shadow-sm no-underline block"
              >
                <div>
                  <h3 className="text-[16px] font-bold text-[#0C71C3] mb-[8px] group-hover:text-[#0093DD] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-[#555555] leading-[1.6] mb-[12px] line-clamp-3">
                    {item.excerpt || item.content}
                  </p>
                </div>
                
                {/* Meta row at bottom */}
                <div className="flex items-center gap-[6px] text-[12px] text-[#999999] mt-auto font-medium">
                  <span>{dateDisplay}</span>
                  <span>•</span>
                  <span>{item.author || 'Admin'}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
