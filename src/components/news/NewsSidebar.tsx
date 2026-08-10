import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { recentNewsData, categoriesData, archivesData } from '../../data/news';

interface NewsSidebarProps {
  articles?: any[];
}

export default function NewsSidebar({ articles }: NewsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // 1. Auto-generate Recent News from latest articles
  const recentItems = articles && articles.length > 0
    ? articles.slice(0, 4).map((a) => ({ title: a.title, date: a.date }))
    : recentNewsData;

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
          <input
            type="text"
            placeholder="Search Here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 h-[48px] px-[14px] text-[14px] bg-[#F5F5F5] border border-[#E0E0E0] border-r-0 rounded-l-[4px] outline-none text-[#333333] focus:bg-white focus:border-[#0093DD] transition-colors"
          />
          <button
            type="submit"
            aria-label="Search"
            className="w-[48px] h-[48px] bg-[#0093DD] hover:bg-[#0C71C3] text-white rounded-r-[4px] flex items-center justify-center transition-colors cursor-pointer border-none outline-none flex-shrink-0"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>
        </form>
      </div>

      {/* 2. RECENT NEWS (Auto-generated from Campus News articles) */}
      <div className="bg-white p-[20px] mb-[22px] border border-[#EAEAEA] rounded-[4px]">
        <h3 className="text-[16px] font-bold text-[#333333] mb-[16px] uppercase border-b border-[#EAEAEA] pb-[8px]">
          RECENT NEWS
        </h3>
        <div className="flex flex-col gap-[14px]">
          {recentItems.map((item, idx) => (
            <div key={idx} className="flex flex-col text-left">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[14px] font-semibold text-[#333333] hover:text-[#0C71C3] transition-colors leading-snug"
              >
                {item.title}
              </a>
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
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[14px] text-[#555555] hover:text-[#0093DD] transition-colors block"
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. ARCHIVES (Auto-generated from Publish Dates) */}
      <div className="bg-white p-[20px] mb-[22px] border border-[#EAEAEA] rounded-[4px]">
        <h3 className="text-[16px] font-bold text-[#333333] mb-[16px] uppercase border-b border-[#EAEAEA] pb-[8px]">
          ARCHIVES
        </h3>
        <ul className="flex flex-col">
          {archivesList.map((archive, idx) => (
            <li key={idx} className="border-b border-[#F0F0F0] py-[8px] last:border-b-0">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-[14px] text-[#555555] hover:text-[#0093DD] transition-colors block"
              >
                {archive}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
