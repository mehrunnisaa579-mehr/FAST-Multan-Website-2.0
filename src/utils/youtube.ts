/**
 * Utility functions for YouTube URL parsing and embed URL generation.
 */

/**
 * Extracts an 11-character YouTube video ID from various YouTube URL formats.
 *
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Regex covering standard watch, shorts, embed, v, and youtu.be links
  const regExp = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  if (match && match[1]) {
    return match[1];
  }

  // Fallback query parameter parsing for alternative URL strings
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (parsed.searchParams.has('v')) {
      const v = parsed.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        return v;
      }
    }
    const pathSegments = parsed.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment && /^[a-zA-Z0-9_-]{11}$/.test(lastSegment)) {
      if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
        return lastSegment;
      }
    }
  } catch {
    // Ignore URL parse errors
  }

  return null;
}

/**
 * Generates a privacy-friendly YouTube embed URL (youtube-nocookie.com)
 * from a given YouTube video URL.
 *
 * Returns null if the URL is invalid or the video ID cannot be extracted.
 */
export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}
