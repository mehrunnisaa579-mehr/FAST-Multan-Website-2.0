import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import NewsSidebar from '../../components/news/NewsSidebar';
import { newsPageOneData, newsPageTwoData, createSlug } from '../../data/news';
import { cmsService } from '../../services/cmsService';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import '../../styles/news-pages.css';

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<any | null>(null);
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      setLoading(true);

      // 1. Fetch lightweight news summary for sidebar (excludes large content fields)
      const dbNews = await cmsService.getNewsSummary();
      let combinedArticles: any[] = [];

      if (dbNews && dbNews.length > 0) {
        const publishedOnly = dbNews.filter(
          (n: any) => n.published !== false && n.is_archived !== true
        );
        if (publishedOnly.length > 0) {
          const sorted = [...publishedOnly].sort((a: any, b: any) => {
            const timeA = new Date(a.published_at || a.updated_at || a.created_at || 0).getTime();
            const timeB = new Date(b.published_at || b.updated_at || b.created_at || 0).getTime();
            return timeB - timeA;
          });

          combinedArticles = sorted.map((n: any) => {
            const rawDate = n.published_at || n.updated_at || n.created_at;
            const parsedDate = rawDate ? new Date(rawDate) : null;
            const dateStr = parsedDate && !isNaN(parsedDate.getTime())
              ? parsedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : 'January 1, 2026';

            return {
              id: n.id,
              slug: n.slug || createSlug(n.title, n.id),
              title: n.title,
              excerpt: n.excerpt || '',
              content: '',
              category: n.category || 'Academic Announcements',
              author: n.author || 'FAST-NUCES Multan Campus',
              date: dateStr,
              image: n.hero_image || n.image_url || '',
            };
          });
        }
      }

      if (combinedArticles.length === 0) {
        const fallbacks = [...newsPageOneData, ...newsPageTwoData].map((f) => ({
          ...f,
          slug: f.slug || createSlug(f.title, f.id),
          category: f.category || 'Academic Announcements',
          content: f.content || f.excerpt,
        }));
        combinedArticles = fallbacks;
      }

      setAllArticles(combinedArticles);

      // 2. Fetch specific news article by slug/id (includes large description/content field)
      let targetArticle: any = null;
      if (slug) {
        const dbArticle = await cmsService.getNewsBySlug(slug);
        if (dbArticle) {
          const rawDate = dbArticle.published_at || dbArticle.updated_at || dbArticle.created_at;
          const parsedDate = rawDate ? new Date(rawDate) : null;
          const dateStr = parsedDate && !isNaN(parsedDate.getTime())
            ? parsedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            : 'January 1, 2026';

          targetArticle = {
            id: dbArticle.id,
            slug: dbArticle.slug || createSlug(dbArticle.title, dbArticle.id),
            title: dbArticle.title,
            excerpt: dbArticle.excerpt || '',
            content: dbArticle.long_description || dbArticle.content || dbArticle.excerpt || 'No detailed content available.',
            category: dbArticle.category || 'Academic Announcements',
            author: dbArticle.author || 'FAST-NUCES Multan Campus',
            date: dateStr,
            image: dbArticle.hero_image || dbArticle.image_url || '',
          };
        }

        // Fallback search in local static data if not found in db
        if (!targetArticle) {
          const targetSlug = decodeURIComponent(slug).toLowerCase().trim();
          const fallbacks = [...newsPageOneData, ...newsPageTwoData].map((f) => ({
            ...f,
            slug: f.slug || createSlug(f.title, f.id),
            category: f.category || 'Academic Announcements',
            content: f.content || f.excerpt,
          }));
          const foundFallback = fallbacks.find((a) => {
            const itemSlug = (a.slug || createSlug(a.title, a.id)).toLowerCase().trim();
            const itemTitleSlug = createSlug(a.title, a.id).toLowerCase().trim();
            return itemSlug === targetSlug || itemTitleSlug === targetSlug || a.id === targetSlug;
          });
          if (foundFallback) {
            targetArticle = foundFallback;
          }
        }
      }

      setArticle(targetArticle);
      setLoading(false);
    };

    fetchArticleDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="news-page-bg min-h-[600px] flex items-center justify-center select-none">
        <div className="text-center p-12 bg-white rounded-lg border border-[#EAEAEA] shadow-sm">
          <p className="text-sm font-semibold text-[#0093DD]">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="news-page-bg select-none">
        <AboutPageHero title="ARTICLE NOT FOUND" />
        <div className="news-content-wrapper py-[80px] text-center max-w-[800px] mx-auto">
          <div className="bg-white p-[40px] border border-[#EAEAEA] rounded-[8px] shadow-sm">
            <h2 className="text-[24px] font-bold text-[#333333] mb-3">Article Not Found</h2>
            <p className="text-[15px] text-[#666666] mb-6">
              The requested news article could not be found or may have been removed.
            </p>
            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-sm font-semibold rounded-md transition-colors no-underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Campus News</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isImageUrl =
    !!article.image &&
    (article.image.startsWith('http') || article.image.startsWith('/') || article.image.startsWith('data:'));

  const paragraphs = article.content
    ? article.content.split(/\n\n|\n/).filter((p: string) => p.trim().length > 0)
    : [article.excerpt];

  return (
    <div className="news-page-bg">
      {/* Article Detail Hero */}
      <AboutPageHero
        title={article.title}
        backgroundImage={isImageUrl ? article.image : undefined}
      />

      {/* Main Content Layout */}
      <div className="news-content-wrapper">
        <div className="flex flex-col min-[900px]:flex-row gap-[30px] items-start">
          {/* Left / Main Article Column (72%) */}
          <div className="w-full min-[900px]:w-[72%] flex flex-col text-left bg-white p-[28px] border border-[#EAEAEA] rounded-[4px] shadow-xs">
            {/* Back Button */}
            <div className="mb-[20px]">
              <Link
                to="/news"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0093DD] hover:text-[#0C71C3] no-underline transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ALL CAMPUS NEWS</span>
              </Link>
            </div>

            {/* Title */}
            <h1 className="text-[24px] min-[700px]:text-[30px] font-bold text-[#333333] leading-snug mb-[16px]">
              {article.title}
            </h1>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-[16px] text-[13px] text-[#666666] mb-[24px] pb-[16px] border-b border-[#F0F0F0] font-medium">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#0093DD]" />
                <span>{article.author || 'FAST-NUCES Multan Campus'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#0093DD]" />
                <span>{article.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-[#0093DD] font-semibold">
                <Tag className="w-4 h-4" />
                <span>{article.category || 'Academic Announcements'}</span>
              </span>
            </div>

            {/* Featured Image */}
            {isImageUrl && (
              <div className="w-full aspect-[16/9] max-h-[450px] bg-white rounded-[4px] overflow-hidden mb-[28px] border border-[#EAEAEA]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Full Article Content */}
            <div className="space-y-[18px] text-[15px] min-[700px]:text-[16px] leading-[1.8] text-[#444444]">
              {paragraphs.map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Bottom Back Action */}
            <div className="pt-[32px] mt-[32px] border-t border-[#F0F0F0] flex justify-between items-center">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#333333] text-xs font-bold rounded-md transition-colors no-underline"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to News List</span>
              </Link>
            </div>
          </div>

          {/* Right Sidebar (28%) */}
          <div className="w-full min-[900px]:w-[28%] flex-shrink-0">
            <NewsSidebar articles={allArticles} />
          </div>
        </div>
      </div>
    </div>
  );
}
