import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import NewsCard from '../../components/news/NewsCard';
import NewsSidebar from '../../components/news/NewsSidebar';
import { newsPageOneData, createSlug } from '../../data/news';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../lib/supabase';
import '../../styles/news-pages.css';

export default function NewsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.trim() || '';

  const [heroTitle, setHeroTitle] = useState('CAMPUS NEWS');
  const [heroImage, setHeroImage] = useState('');
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [articlesPerPage, setArticlesPerPage] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchCampusNews = async () => {
      setLoading(true);
      const settings = await cmsService.getSetting<any>('campus_news_settings', null);
      if (settings) {
        if (settings.heroTitle) setHeroTitle(settings.heroTitle);
        if (settings.heroImageUrl || settings.heroImage) setHeroImage(settings.heroImageUrl || settings.heroImage);
        if (settings.articlesPerPage) setArticlesPerPage(Number(settings.articlesPerPage));
      }

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
          setNewsItems(formatted);
          setLoading(false);
          return;
        }
      }

      // Fallback only if database returned zero usable records
      const formattedFallback = newsPageOneData.map((item) => ({
        ...item,
        slug: item.slug || createSlug(item.title, item.id),
        category: item.category || 'Academic Announcements',
      }));
      setNewsItems(formattedFallback);
      setLoading(false);
    };

    fetchCampusNews();
  }, []);

  const filteredNews = newsItems.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const title = (item.title || '').toLowerCase();
    const excerpt = (item.excerpt || '').toLowerCase();
    const content = (item.content || '').toLowerCase();
    const category = (item.category || '').toLowerCase();
    const author = (item.author || '').toLowerCase();

    return (
      title.includes(q) ||
      excerpt.includes(q) ||
      content.includes(q) ||
      category.includes(q) ||
      author.includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / articlesPerPage));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validPage - 1) * articlesPerPage;
  const paginatedNews = filteredNews.slice(startIndex, startIndex + articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="news-page-bg">
      {/* Hero */}
      <AboutPageHero title={heroTitle} backgroundImage={heroImage} />

      {/* Main Content Area */}
      <div className="news-content-wrapper">
        <div className="flex flex-col min-[900px]:flex-row gap-[30px] items-start">
          {/* Left Main Content (72%) */}
          <div className="w-full min-[900px]:w-[72%] flex flex-col">
            {loading ? (
              <div className="bg-white border border-[#EAEAEA] rounded-[4px] p-12 text-center text-sm font-semibold text-[#0093DD]">
                Loading campus news...
              </div>
            ) : searchQuery && filteredNews.length === 0 ? (
              <div className="bg-white border border-[#EAEAEA] rounded-[4px] p-12 text-center text-sm text-[#666666]">
                No news articles found for &quot;{searchQuery}&quot;.
              </div>
            ) : newsItems.length === 0 ? (
              <div className="bg-white border border-[#EAEAEA] rounded-[4px] p-12 text-center text-sm text-[#666666]">
                No campus news articles published yet.
              </div>
            ) : (
              paginatedNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))
            )}

            {/* Pagination */}
            {!loading && filteredNews.length > articlesPerPage && (
              <div className="flex items-center gap-[8px] mt-[10px] select-none">
                {validPage > 1 && (
                  <button
                    type="button"
                    onClick={() => handlePageChange(validPage - 1)}
                    aria-label="Previous Page"
                    className="w-[38px] h-[38px] bg-white border border-[#DDDDDD] text-[#333333] hover:text-[#0093DD] hover:border-[#0093DD] font-semibold text-[14px] flex items-center justify-center rounded-[4px] transition-colors cursor-pointer"
                  >
                    &lt;
                  </button>
                )}

                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                  pageNum === validPage ? (
                    <span
                      key={pageNum}
                      className="w-[38px] h-[38px] bg-[#0093DD] text-white font-semibold text-[14px] flex items-center justify-center rounded-[4px]"
                    >
                      {pageNum}
                    </span>
                  ) : (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-[38px] h-[38px] bg-white border border-[#DDDDDD] text-[#333333] hover:text-[#0093DD] hover:border-[#0093DD] font-semibold text-[14px] flex items-center justify-center rounded-[4px] transition-colors cursor-pointer"
                    >
                      {pageNum}
                    </button>
                  )
                ))}

                {validPage < totalPages && (
                  <button
                    type="button"
                    onClick={() => handlePageChange(validPage + 1)}
                    aria-label="Next Page"
                    className="w-[38px] h-[38px] bg-white border border-[#DDDDDD] text-[#333333] hover:text-[#0093DD] hover:border-[#0093DD] font-semibold text-[14px] flex items-center justify-center rounded-[4px] transition-colors cursor-pointer"
                  >
                    &gt;
                  </button>
                )}
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
