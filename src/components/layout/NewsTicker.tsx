import React, { useEffect, useState } from 'react';
import { cmsService } from '../../services/cmsService';

const defaultNewsItem = 'Orientation Ceremony — 16 August 2026';

export default function NewsTicker() {
  const [tickerText, setTickerText] = useState(defaultNewsItem);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const fetchTicker = async () => {
      const data = await cmsService.getSetting<{ tickerText?: string; tickerEnabled?: boolean }>('header_footer_content', {});
      if (data) {
        if (data.tickerText) setTickerText(data.tickerText);
        if (data.tickerEnabled !== undefined) setEnabled(data.tickerEnabled);
      }
    };
    fetchTicker();
  }, []);

  if (!enabled) return null;

  const formattedItem = `• ${tickerText} •`;
  const itemsArray = Array(8).fill(formattedItem);

  return (
    <div
      className="w-full h-[34px] sm:h-[38px] bg-[#1E3A6D] text-white flex items-center overflow-hidden relative z-30"
      aria-label="Latest news"
    >
      <div className="w-full overflow-hidden relative h-full flex items-center">
        <div className="news-ticker-track text-[13px] sm:text-[14px] font-medium tracking-wide">
          {itemsArray.map((item, idx) => (
            <span key={idx} className="mx-[16px] sm:mx-[24px] inline-block whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
