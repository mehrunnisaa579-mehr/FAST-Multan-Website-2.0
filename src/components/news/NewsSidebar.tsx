import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { recentNewsData, categoriesData, archivesData, createSlug } from '../../data/news';

interface NewsSidebarProps {
  articles?: any[];
}

export default function NewsSidebar({ articles }: NewsSidebarProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(activeSearch);

  useEffect(() => {
    setSearchTerm(activeSearch);
  }, [activeSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (query) {
      navigate(`/news?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/news');
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    navigate('/news');
  };

  // 1. Auto-generate Recent News from latest articles with slugs
  const recentItems = articles && articles.length > 0
    ? articles.slice(0, 4).map((a) => ({
        id: a.id,
        title: a.title,
        date: a.date,
        slug: a.slug || createSlug(a.title, a.id),
      }))
    : recentNewsData.map((item, idx) => ({
        id: `recent-${idx}`,
        title: item.title,
        date: item.date,
        slug: createSlug(item.title, `recent-${idx}`),
      }));

  // 2. Categories list
  const categoriesList = Array.from(
    new Set([
      ...(articles || []).map((a) => a.category).filter(Boolean),
      ...categoriesData,
    ])
  );

  // 3. Auto-generate Archives by Month/Year
  const generatedArchives = Array.from(
    new Set(
      (articles || []).map((a) => {
        if (!a.date) return null;
        const d = new Date(a.date);
        if (isNaN(d.getTime())) return a.date;
        return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }).filter(Boolean)
    )
  );

  const archivesList = generatedArchives.length > 0 ? generatedArchives : archivesData;

  return (
    <aside className="w-full flex flex-col text-left select-none">
      {/* 1. SEARCH */}
      <div className="bg-white p-[20px] mb-[22px] border border-[#EAEAEA] rounded-[4px]">
        <form onSubmit={handleSearch} className="flex items-center w-full">
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              placeholder="Search Here"
              value={searchTerm}
              onChange={(e) => {
                const val = e.target.value;
                setSearchTerm(val);
                if (!val.trim() && activeSearch) {
                  navigate('/news');
                }
              }}
              className="w-full h-[48px] pl-[14px] pr-[36px] text-[14px] bg-[#F5F5F5] border border-[#E0E0E0] border-r-0 rounded-l-[4px] outline-none text-[#333333] focus:bg-white focus:border-[#0093DD] transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-[8px] text-[#888888] hover:text-[#333333] p-1 border-none bg-transparent cursor-pointer flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            aria-label="Search"
            className="w-[48px] h-[48px] bg-[#0093DD] hover:bg-[#0C71C3] text-white rounded-r-[4px] flex items-center justify-center transition-colors cursor-pointer border-none outline-none flex-shrink-0"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>
        </form>
      </div>

      {/* 2. RECENT NEWS (Links directly to news detail page) */}
      <div className="bg-white p-[20px] mb-[22px] border border-[#EAEAEA] rounded-[4px]">
        <h3 className="text-[16px] font-bold text-[#333333] mb-[16px] uppercase border-b border-[#EAEAEA] pb-[8px]">
          RECENT NEWS
        </h3>
        <div className="flex flex-col gap-[14px]">
          {recentItems.map((item) => (
            <div key={item.id || item.slug} className="flex flex-col text-left">
              <Link
                to={`/news/${item.slug}`}
                className="text-[14px] font-semibold text-[#333333] hover:text-[#0C71C3] transition-colors leading-snug no-underline"
              >
                {item.title}
              </Link>
              <span className="text-[12px] text-[#888888] mt-[2px]">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CATEGORIES */}
      <div className="bg-white p-[20px] mb-[22px] border border-[#EAEAEA] rounded-[4px]">
        <h3 className="text-[16px] font-bold text-[#333333] mb-[16px] uppercase border-b border-[#EAEAEA] pb-[8px]">
          CATEGORIES
        </h3>
        <ul className="flex flex-col">
          {categoriesList.map((category, idx) => (
            <li key={idx} className="border-b border-[#F0F0F0] py-[8px] last:border-b-0">
              <Link
                to={`/news?search=${encodeURIComponent(String(category))}`}
                className="text-[14px] text-[#555555] hover:text-[#0093DD] transition-colors block no-underline"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. ARCHIVES */}
      <div className="bg-white p-[20px] mb-[22px] border border-[#EAEAEA] rounded-[4px]">
        <h3 className="text-[16px] font-bold text-[#333333] mb-[16px] uppercase border-b border-[#EAEAEA] pb-[8px]">
          ARCHIVES
        </h3>
        <ul className="flex flex-col">
          {archivesList.map((archive, idx) => (
            <li key={idx} className="border-b border-[#F0F0F0] py-[8px] last:border-b-0">
              <Link
                to={`/news?search=${encodeURIComponent(String(archive))}`}
                className="text-[14px] text-[#555555] hover:text-[#0093DD] transition-colors block no-underline"
              >
                {archive}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
