import React, { useState } from 'react';

export interface MediaPreviewProps {
  /** Image URL — used when type is 'image' or as fallback thumbnail */
  imageUrl?: string | null;
  /** Video URL — used when type is 'video' */
  videoUrl?: string | null;
  /** 'image' | 'video' — auto-detected from URLs if omitted */
  type?: 'image' | 'video';
  alt?: string;
  fallbackLabel?: string;
  /** CSS class applied to the <img> or <video> element */
  className?: string;
  /** Called on click (for play overlays) */
  onClick?: (e: React.MouseEvent) => void;
}

/** Returns true if the URL looks like a direct video file */
function looksLikeVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg') || lower.includes('/video/');
}

/**
 * Shared media preview for card thumbnails.
 * - Image → <img> with object-cover
 * - Video → <video> muted, preload=metadata, no controls (first-frame preview)
 * - Missing → gray placeholder text
 */
export default function MediaPreview({
  imageUrl,
  videoUrl,
  type,
  alt = 'Media Preview',
  fallbackLabel = 'MEDIA',
  className = '',
  onClick,
}: MediaPreviewProps) {
  const [videoError, setVideoError] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Auto-detect type
  const resolvedType = type || (videoUrl ? 'video' : (looksLikeVideoUrl(imageUrl) ? 'video' : 'image'));

  // If type is video, prefer videoUrl; fallback to imageUrl if it's a video URL
  const effectiveVideoUrl = videoUrl || (resolvedType === 'video' ? imageUrl : null);
  const effectiveImageUrl = imageUrl;

  // Render video preview
  if (resolvedType === 'video' && effectiveVideoUrl && !videoError) {
    // For YouTube URLs, we can't use <video>. Check if it's a direct file.
    const isDirectVideo = looksLikeVideoUrl(effectiveVideoUrl);

    if (isDirectVideo) {
      return (
        <video
          src={effectiveVideoUrl}
          muted
          playsInline
          preload="metadata"
          onError={() => setVideoError(true)}
          onClick={onClick}
          className={`w-full h-full object-cover ${className}`}
        />
      );
    }

    // For YouTube/embed URLs, try to extract a YouTube thumbnail
    const ytId = extractYouTubeId(effectiveVideoUrl);
    if (ytId) {
      return (
        <img
          src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
          alt={alt}
          onError={() => setVideoError(true)}
          onClick={onClick}
          className={`w-full h-full object-cover ${className}`}
        />
      );
    }
  }

  // Render image preview
  if (effectiveImageUrl && !imgError) {
    return (
      <img
        src={effectiveImageUrl}
        alt={alt}
        onError={() => setImgError(true)}
        onClick={onClick}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  // Placeholder
  return (
    <div
      onClick={onClick}
      className={`w-full h-full bg-[#D9D9D9] flex items-center justify-center ${className}`}
    >
      <span className="text-[13px] font-semibold text-[#888888] tracking-wide select-none">
        {fallbackLabel}
      </span>
    </div>
  );
}

/** Extract YouTube video ID from various URL formats */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&#]+)/,
    /(?:youtu\.be\/)([^?&#]+)/,
    /(?:youtube\.com\/embed\/)([^?&#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}
