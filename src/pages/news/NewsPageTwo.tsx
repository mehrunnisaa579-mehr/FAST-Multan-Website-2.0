import { Link } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import NewsCard from '../../components/news/NewsCard';
import NewsSidebar from '../../components/news/NewsSidebar';
import { newsPageTwoData } from '../../data/news';
import '../../styles/news-pages.css';

export default function NewsPageTwo() {
  return (
    <div className="news-page-bg">
      {/* Hero */}
      <AboutPageHero title="CAMPUS NEWS" />

      {/* Main Content Area */}
      <div className="news-content-wrapper">
        <div className="flex flex-col min-[900px]:flex-row gap-[30px] items-start">
          {/* Left Main Content (72%) */}
          <div className="w-full min-[900px]:w-[72%] flex flex-col">
            {newsPageTwoData.map((item) => (
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
            <NewsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
