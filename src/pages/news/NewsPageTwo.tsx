import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import NewsCard from '../../components/news/NewsCard';
import NewsSidebar from '../../components/news/NewsSidebar';
import { newsPageTwoData, createSlug } from '../../data/news';
import { cmsService } from '../../services/cmsService';
import '../../styles/news-pages.css';

export default function NewsPageTwo() {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [allNews, setAllNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchPageTwoNews = async () => {
      const dbNews = await cmsService.getNews();
      if (dbNews && dbNews.length > 0) {
        const publishedArticles = dbNews.filter(
          (item: any) => item.published !== false && item.is_archived !== true
        );
        if (publishedArticles.length > 0) {
          const sorted = [...publishedArticles].sort((a: any, b: any) => {
            const timeA = new Date(a.updated_at || a.published_at || a.created_at || 0).getTime();
            const timeB = new Date(b.updated_at || b.published_at || b.created_at || 0).getTime();
            return timeB - timeA;
          });

          const formatted = sorted.map((item: any) => {
            const rawDate = item.published_at || item.updated_at || item.created_at;
            const parsedDate = rawDate ? new Date(rawDate) : null;
            const dateStr = parsedDate && !isNaN(parsedDate.getTime())
              ? parsedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : 'January 1, 2026';

            return {
              id: item.id,
              slug: item.slug || createSlug(item.title, item.id),
              title: item.title,
              excerpt: item.excerpt || '',
              content: item.long_description || item.content || item.excerpt || '',
              date: dateStr,
              author: item.author || 'Admin',
              category: item.category || 'Academic Announcements',
              imageLabel: 'NEWS IMAGE',
              image: item.hero_image || item.image_url || '',
            };
          });

          setAllNews(formatted);

          const pageTwoSlice = formatted.slice(6, 12);
          if (pageTwoSlice.length > 0) {
            setNewsItems(pageTwoSlice);
            return;
          }
        }
      }

      setNewsItems([]);
    };

    fetchPageTwoNews();
  }, []);

  return (
    <div className="news-page-bg">
      {/* Hero */}
      <AboutPageHero title="CAMPUS NEWS" />

      {/* Main Content Area */}
      <div className="news-content-wrapper">
        <div className="flex flex-col min-[900px]:flex-row gap-[30px] items-start">
          {/* Left Main Content (72%) */}
          <div className="w-full min-[900px]:w-[72%] flex flex-col">
            {newsItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}

            {/* Pagination for Page 2: < 1 2 */}
            <div className="flex items-center gap-[8px] mt-[10px] select-none">
              <Link
                to="/news"
                className="w-[38px] h-[38px] bg-white border border-[#DDDDDD] text-[#333333] hover:text-[#0093DD] hover:border-[#0093DD] font-semibold text-[14px] flex items-center justify-center rounded-[4px] transition-colors"
                aria-label="Previous Page"
              >
                &lt;
              </Link>
              <Link
                to="/news"
                className="w-[38px] h-[38px] bg-white border border-[#DDDDDD] text-[#333333] hover:text-[#0093DD] hover:border-[#0093DD] font-semibold text-[14px] flex items-center justify-center rounded-[4px] transition-colors"
              >
                1
              </Link>
              <span className="w-[38px] h-[38px] bg-[#0093DD] text-white font-semibold text-[14px] flex items-center justify-center rounded-[4px]">
                2
              </span>
            </div>
          </div>

          {/* Right Sidebar (28%) */}
          <div className="w-full min-[900px]:w-[28%] flex-shrink-0">
            <NewsSidebar articles={allNews} />
          </div>
        </div>
      </div>
    </div>
  );
}
