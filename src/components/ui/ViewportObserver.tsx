import React, { useState, useEffect, useRef } from 'react';

interface ViewportObserverProps {
  children: React.ReactNode;
  height?: string | number; // Fallback height to prevent CLS
  rootMargin?: string;
  className?: string;
}

export default function ViewportObserver({
  children,
  height = '500px', // Default fallback
  rootMargin = '400px',
  className = '',
}: ViewportObserverProps) {
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasIntersected) return;

    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [hasIntersected, rootMargin]);

  return (
    <div
      ref={ref}
      style={{ minHeight: height, width: '100%' }}
      className={`viewport-observer-wrapper ${className}`}
    >
      {hasIntersected ? children : null}
    </div>
  );
}

export function useVisibilityObserver(rootMargin = '0px') {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  return { ref, isVisible };
}
