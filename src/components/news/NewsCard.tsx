import React from 'react';
import { Link } from 'react-router-dom';
import type { NewsItem } from '../../data/news';
import { createSlug } from '../../data/news';
import CmsImage from '../ui/CmsImage';

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  const hasImage = !!item.image && item.image.trim().length > 0;
  const slug = item.slug || createSlug(item.title, item.id);

  return (
    <article className="bg-white p-[28px] mb-[28px] border border-[#EAEAEA] rounded-[4px] text-left flex flex-col shadow-xs card-hover-lift">
      {/* Featured Image Area */}
      {hasImage && (
        <div className="w-full aspect-[16/9] max-h-[360px] rounded-[4px] overflow-hidden mb-[20px]">
          <CmsImage
            src={item.image}
            alt={item.title}
            fallbackLabel={item.image || 'FEATURED NEWS IMAGE'}
            fit="cover"
          />
        </div>
      )}

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-[12px] text-[12px] text-[#888888] mb-[12px] font-medium">
        <span>By: {item.author || 'FAST-NUCES Multan Campus'}</span>
        <span>•</span>
        {item.category && (
          <>
            <span className="text-[#0093DD] font-semibold">{item.category}</span>
            <span>•</span>
          </>
        )}
        <span>{item.commentsCount || 'No Comments'}</span>
        <span>•</span>
        <span>{item.date}</span>
      </div>

      {/* Title */}
      <h2 className="text-[20px] font-semibold text-[#333333] leading-snug mb-[12px] hover:text-[#0C71C3] transition-colors">
        <Link to={`/news/${slug}`} className="no-underline text-[#333333] hover:text-[#0C71C3]">
          {item.title}
        </Link>
      </h2>

      {/* Short Excerpt */}
      <p className="text-[15px] text-[#555555] leading-[1.7] mb-[20px] line-clamp-3">
        {item.excerpt}
      </p>

      {/* Read More Link */}
      <div>
        <Link
          to={`/news/${slug}`}
          className="uppercase text-[13px] font-semibold text-[#333333] hover:text-[#0C71C3] underline underline-offset-4 transition-colors cursor-pointer inline-block"
        >
          READ MORE
        </Link>
      </div>
    </article>
  );
}
