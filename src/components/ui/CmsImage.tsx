import React, { useState, useEffect } from 'react';

export interface CmsImageProps {
  src?: string | null;
  alt: string;
  fallbackLabel?: string;
  fit?: 'cover' | 'contain';
  className?: string;
  containerClassName?: string;
  placeholderClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function CmsImage({
  src,
  alt,
  fallbackLabel = 'IMAGE PLACEHOLDER',
  fit = 'cover',
  className = '',
  containerClassName = '',
  placeholderClassName = '',
  onClick,
}: CmsImageProps) {
  const [error, setError] = useState(false);

  // Reset error if src changes
  useEffect(() => {
    setError(false);
  }, [src]);

  const isValidUrl =
    !!src &&
    typeof src === 'string' &&
    src.trim().length > 0 &&
    (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:')) &&
    !error;

  if (isValidUrl) {
    const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';
    return (
      <img
        src={src}
        alt={alt || 'FAST-NUCES Media'}
        onError={() => setError(true)}
        onClick={onClick}
        className={`w-full h-full ${fitClass} ${className}`}
      />
    );
  }

  return (
    <div
      onClick={onClick}
      className={`w-full h-full flex items-center justify-center p-3 text-center bg-white select-none ${containerClassName}`}
    >
      <span className={`text-[11px] font-semibold text-[#666666] tracking-wide uppercase ${placeholderClassName}`}>
        {fallbackLabel}
      </span>
    </div>
  );
}
