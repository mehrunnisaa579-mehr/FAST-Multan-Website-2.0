import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import NewsCard from '../../components/news/NewsCard';
import NewsSidebar from '../../components/news/NewsSidebar';
import { newsPageOneData } from '../../data/news';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../lib/supabase';
import '../../styles/news-pages.css';

export default function NewsPage() {
  const [heroTitle, setHeroTitle] = useState('CAMPUS NEWS');
  const [heroImage, setHeroImage] = useState('');
  const [newsItems, setNewsItems] = useState<any[]>(newsPageOneData);
  const [articlesPerPage, setArticlesPerPage] = useState<number>(6);

  useEffect(() => {
    const fetchCampusNews = async () => {
      const settings = await cmsService.getSetting<any>('campus_news_settings', null);
      if (settings) {
        if (settings.heroTitle) setHeroTitle(settings.heroTitle);
        if (settings.heroImageUrl) setHeroImage(settings.heroImageUrl);
        if (settings.articlesPerPage) setArticlesPerPage(Number(settings.articlesPerPage));
      }

      const { data: dbNews } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('display_order', { ascending: true });

      if (dbNews && dbNews.length > 0) {
        const formatted = dbNews.map((item: any) => ({
          id: item.id,
          title: item.title,
          date: new Date(item.published_at || item.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
          author: item.author || 'Admin',
          category: item.category || 'Academic Announcements',
          imageLabel: 'NEWS IMAGE',
          image: item.image_url,
          paragraphs: item.content ? [item.excerpt || item.content, item.content] : [item.excerpt || 'Campus news article update.'],
        }));
        setNewsItems(formatted);
      }
    };
    fetchCampusNews();
  }, []);

  return (
    <div className="news-page-bg select-none">
      {/* Hero */}
      <AboutPageHero title={heroTitle} />

      {/* Main Content Area */}
      <div className="news-content-wrapper">
        <div className="flex flex-col min-[900px]:flex-row gap-[30px] items-start">
          {/* Left Main Content (72%) */}
          <div className="w-full min-[900px]:w-[72%] flex flex-col">
            {newsItems.slice(0, articlesPerPage).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}

            {/* Pagination */}
            {newsItems.length > articlesPerPage && (
              <div className="flex items-center gap-[8px] mt-[10px] select-none">
                <span className="w-[38px] h-[38px] bg-[#0093DD] text-white font-semibold text-[14px] flex items-center justify-center rounded-[4px]">
                  1
                </span>
                <Link
                  to="/news/page/2"
                  className="w-[38px] h-[38px] bg-white border border-[#DDDDDD] text-[#333333] hover:text-[#0093DD] hover:border-[#0093DD] font-semibold text-[14px] flex items-center justify-center rounded-[4px] transition-colors"
                >
                  2
                </Link>
                <Link
                  to="/news/page/2"
                  className="w-[38px] h-[38px] bg-white border border-[#DDDDDD] text-[#333333] hover:text-[#0093DD] hover:border-[#0093DD] font-semibold text-[14px] flex items-center justify-center rounded-[4px] transition-colors"
                  aria-label="Next Page"
                >
                  &gt;
                </Link>
              </div>
            )}
          </div>

          {/* Right Sidebar (28%) */}
          <div className="w-full min-[900px]:w-[28%] flex-shrink-0">
            <NewsSidebar articles={newsItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
