import React, { useEffect, useRef, useState } from 'react';

export interface StatConfig {
  label: string;
  value: number;
  suffix?: string;
}

interface SocietyStatsBannerProps {
  stats: StatConfig[];
}

export default function SocietyStatsBanner({ stats }: SocietyStatsBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState<number[]>([0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!containerRef.current || hasAnimated) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCounts(stats.map((s) => s.value || 0));
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          const duration = 1600; // 1.6 seconds smooth count up
          const startTime = performance.now();
          const targetValues = stats.map((s) => Number(s.value) || 0);

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Smooth cubic ease-out
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const nextCounts = targetValues.map((target) => Math.floor(easeProgress * target));
            setCounts(nextCounts);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCounts(targetValues);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [stats, hasAnimated]);

  if (!stats || stats.length === 0) return null;

  return (
    <div ref={containerRef} className="w-full max-w-[1000px] mx-auto my-[64px] sm:my-[84px] text-center">
      <div className="w-full bg-[#0B2E59] rounded-[16px] p-[32px] sm:p-[48px] shadow-lg border border-[#1E40af]/30 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[28px] sm:gap-[36px] items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-white/15">
          {stats.map((st, idx) => (
            <div key={idx} className={`flex flex-col items-center justify-center ${idx > 0 ? 'pt-[20px] sm:pt-0 sm:pl-[20px]' : ''}`}>
              {/* Animated Stat Value */}
              <div className="text-[36px] sm:text-[44px] md:text-[50px] font-extrabold text-white tracking-tight leading-none mb-[8px] flex items-center justify-center">
                <span>{counts[idx] ?? st.value}</span>
                {st.suffix && <span className="text-[#0093DD] font-bold ml-0.5">{st.suffix}</span>}
              </div>

              {/* Stat Label */}
              <div className="text-[13.5px] sm:text-[14.5px] font-semibold text-white/90 uppercase tracking-wider text-center">
                {st.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
