import React from 'react';
import type { NewsItem } from '../../data/news';

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const hasImage = !!item.image;

  return (
    <article className="bg-white p-[28px] mb-[28px] border border-[#EAEAEA] rounded-[4px] text-left flex flex-col">
      {/* Optional Placeholder Image */}
      {hasImage && (
        <div className="w-full aspect-[16/9] bg-[#D9D9D9] rounded-[4px] flex items-center justify-center p-[16px] mb-[20px]">
          <span className="text-[13px] font-semibold text-[#666666] tracking-wide uppercase">
            {item.image}
          </span>
        </div>
      )}

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-[12px] text-[12px] text-[#888888] mb-[12px] font-medium">
        <span>By: {item.author || 'FAST-NUCES Multan Campus'}</span>
        <span>•</span>
        <span>{item.commentsCount || 'No Comments'}</span>
        <span>•</span>
        <span>{item.date}</span>
      </div>

      {/* Title */}
      <h2 className="text-[20px] font-semibold text-[#333333] leading-snug mb-[12px]">
        {item.title}
      </h2>

      {/* Excerpt */}
      <p className="text-[15px] text-[#555555] leading-[1.7] mb-[20px]">
        {item.excerpt}
      </p>

      {/* Read More Link */}
      <div>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="uppercase text-[13px] font-semibold text-[#333333] hover:text-[#0C71C3] underline underline-offset-4 transition-colors cursor-pointer"
        >
          READ MORE
        </a>
      </div>
    </article>
  );
}
