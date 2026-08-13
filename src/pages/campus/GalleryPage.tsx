import { useEffect, useState } from 'react';
import { Play, X } from 'lucide-react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { galleryItems as defaultGallery } from '../../data/gallery';
import { cmsService } from '../../services/cmsService';
import CmsImage from '../../components/ui/CmsImage';
import '../../styles/campus-pages.css';

interface GalleryDisplayItem {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  thumbnail_url?: string;
  video_type?: 'uploaded' | 'youtube';
  video_url?: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryDisplayItem[]>(defaultGallery);
  const [activeVideo, setActiveVideo] = useState<GalleryDisplayItem | null>(null);
  const [heroTitle, setHeroTitle] = useState('Gallery');
  const [heroImageUrl, setHeroImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchGallery = async () => {
      const heroSettings = await cmsService.getSetting<any>('campus_gallery_settings', null);
      if (heroSettings) {
        if (heroSettings.heroTitle) setHeroTitle(heroSettings.heroTitle);
        if (heroSettings.heroImageUrl || heroSettings.heroImage) {
          setHeroImageUrl(heroSettings.heroImageUrl || heroSettings.heroImage);
        } else {
          setHeroImageUrl(undefined);
        }
      }

      let cmsList = await cmsService.getSetting<any[]>('campus_gallery_list', []);
      if (!cmsList || cmsList.length === 0) {
        const dbItems = await cmsService.getGalleryItems();
        if (dbItems && dbItems.length > 0) {
          cmsList = dbItems.map((g: any, idx: number) => ({
            id: g.id || `gal-${idx + 1}`,
            title: g.caption || g.title || `Campus Video #${idx + 1}`,
            subtitle: g.subtitle || 'FAST-NUCES Multan Campus',
            thumbnail_url: g.image_url || g.thumbnail_url || '',
            thumbnail: 'VIDEO THUMBNAIL',
            video_type: g.video_type || (g.video_url?.includes('youtube') ? 'youtube' : 'uploaded'),
            video_url: g.video_url || '',
            display_order: g.display_order || idx + 1,
            is_visible: g.published ?? true,
          }));
        }
      }

      if (cmsList && cmsList.length > 0) {
        const visible = cmsList
          .filter((i: any) => i.is_visible !== false)
          .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
          .map((i: any) => ({
            id: i.id,
            title: i.title || 'Campus Video Highlight',
            subtitle: i.subtitle || 'FAST-NUCES Multan Campus',
            thumbnail: i.thumbnail || 'VIDEO THUMBNAIL',
            thumbnail_url: i.thumbnail_url || i.image_url || '',
            video_type: i.video_type || 'youtube',
            video_url: i.video_url || '',
          }));

        if (visible.length > 0) {
          setItems(visible);
        }
      }
    };

    fetchGallery();
  }, []);

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : url;
  };

  return (
    <div className="campus-page-bg">
      {/* Hero */}
      <AboutPageHero title={heroTitle} backgroundImage={heroImageUrl} />

      {/* Main Content Area */}
      <div className="gallery-content-wrapper">
        <div className="grid grid-cols-1 min-[700px]:grid-cols-2 gap-[28px] min-[700px]:gap-[28px_32px]">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveVideo(item)}
              className="gallery-card group cursor-pointer relative shadow-sm card-hover-lift overflow-hidden rounded-[4px]"
            >
              {/* Video/Thumbnail Preview */}
              <div className="absolute inset-0 w-full h-full">
                {(() => {
                  const videoSrc = item.video_url || '';
                  const isDirectVideo = videoSrc.endsWith('.mp4') || videoSrc.endsWith('.webm') || videoSrc.endsWith('.ogg');
                  const ytMatch = videoSrc.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^?&#]+)/);

                  // If there's a separate thumbnail image, use it
                  if (item.thumbnail_url) {
                    return <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />;
                  }
                  // Direct video file → <video> preview
                  if (isDirectVideo && videoSrc) {
                    return (
                      <video
                        src={videoSrc}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    );
                  }
                  // YouTube → auto-thumbnail
                  if (ytMatch) {
                    return <img src={`https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`} alt={item.title} className="w-full h-full object-cover" />;
                  }
                  // Fallback placeholder
                  return (
                    <div className="w-full h-full bg-white flex items-center justify-center">
                      <span className="text-[13px] font-semibold text-[#888888] tracking-wide">VIDEO</span>
                    </div>
                  );
                })()}
              </div>

              {/* Centered Red Play Button */}
              <div className="relative z-10 w-[56px] h-[56px] rounded-full bg-[#FF0000] flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-1.08">
                <Play className="w-[20px] h-[20px] text-white fill-white ml-[3px]" />
              </div>

              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-[36px] pb-[16px] px-[16px] flex flex-col text-left z-20">
                <h3 className="text-[15px] font-bold text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-[12px] font-medium text-white/85 mt-[3px]">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full z-10 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-4 bg-[#1E3A6D] text-white text-left">
              <h3 className="text-lg font-bold">{activeVideo.title}</h3>
              <p className="text-xs opacity-80">{activeVideo.subtitle}</p>
            </div>

            <div className="aspect-video w-full bg-black flex items-center justify-center">
              {activeVideo.video_url ? (
                activeVideo.video_type === 'uploaded' ? (
                  <video src={activeVideo.video_url} controls autoPlay className="w-full h-full" />
                ) : (
                  <iframe
                    src={getYoutubeEmbedUrl(activeVideo.video_url)}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <div className="text-white p-8 text-center">
                  <Play className="w-12 h-12 text-[#FF0000] mx-auto mb-3" />
                  <p className="text-base font-bold mb-1">{activeVideo.title}</p>
                  <p className="text-xs text-gray-400">Video media file will be uploaded by the campus administrator.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
