import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { cmsService } from '../../services/cmsService';
import type { WorkshopRecord } from '../../services/cmsService';
import '../../styles/edc-pages.css';

/**
 * Generic dynamic workshop detail page.
 * Reads the :slug URL param and loads workshop data from workshops_list CMS setting.
 *
 * NOTE: The specific slug "summer-bootcamp-2026" is handled by its own route
 * (SummerBootcamp2026Page) registered before this route in App.tsx, so it will
 * never reach this component.
 */
export default function WorkshopDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [workshop, setWorkshop] = useState<WorkshopRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await cmsService.getSetting<{ items?: WorkshopRecord[] }>('workshops_list', { items: [] });
        const items: WorkshopRecord[] = data?.items || [];
        const found = items.find((w) => w.slug === slug && w.is_archived !== true);
        if (found) {
          setWorkshop(found);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug]);

  if (loading) {
    return (
      <div className="edc-page-bg flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-[3px] border-[#0093DD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !workshop) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="edc-page-bg">
      <AboutPageHero title={workshop.title} backgroundImage={workshop.hero_image || ''} />

      <div className="w-full max-w-[1060px] mx-auto px-[20px] sm:px-[28px] py-[48px] sm:py-[64px] space-y-[48px] sm:space-y-[56px] flex flex-col items-center text-center">

        {/* Page Header Title Block */}
        <div className="text-center max-w-[850px] w-full mx-auto pb-2 flex flex-col items-center">
          <h1 className="text-[26px] min-[700px]:text-[32px] font-bold text-[#0C71C3] tracking-tight leading-tight text-center w-full">
            {workshop.title}
          </h1>
          {workshop.subtitle && (
            <p className="text-[15px] sm:text-[17px] text-[#555555] mt-[10px] font-medium leading-relaxed text-center w-full">
              {workshop.subtitle}
            </p>
          )}
        </div>

        {/* Overview */}
        {workshop.overview && (
          <div className="space-y-[16px] w-full max-w-[850px] mx-auto flex flex-col items-center text-center">
            <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0C71C3] pb-[10px] border-b border-[#E2E8F0] text-center w-full">
              Workshop Overview
            </h2>
            <div className="space-y-[16px] text-[15px] sm:text-[16px] leading-[1.8] text-[#444444] w-full text-center flex flex-col items-center">
              {workshop.overview.split('\n\n').map((para, idx) => (
                <p key={idx} className="text-center w-full max-w-[850px] mx-auto">
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Details card: venue, date, registration */}
        {(workshop.venue || workshop.date_label || workshop.registration_link) && (
          <div className="bg-[#F8FAFC] p-[28px] sm:p-[36px] border border-[#E2E8F0] rounded-[10px] shadow-xs space-y-[20px] w-full max-w-[900px] mx-auto flex flex-col items-center text-center">
            <h2 className="text-[20px] sm:text-[22px] font-bold text-[#0C71C3] pb-[10px] border-b border-[#CBD5E1] text-center w-full">
              Workshop Details
            </h2>
            <div className="grid grid-cols-1 gap-[12px] text-[15px] leading-[1.7] text-[#334155] w-full">
              {workshop.date_label && (
                <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-[6px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <span className="font-bold text-[#1E293B]">Date / Year:</span>
                  <span className="text-[#475569]">{workshop.date_label}</span>
                </div>
              )}
              {workshop.venue && (
                <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-[6px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <span className="font-bold text-[#1E293B]">Venue / Location:</span>
                  <span className="text-[#475569]">{workshop.venue}</span>
                </div>
              )}
              {workshop.registration_link && (
                <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-[6px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <span className="font-bold text-[#1E293B]">Registration:</span>
                  <a
                    href={workshop.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0093DD] font-semibold hover:underline"
                  >
                    Register Now →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Fallback icon block if no details at all */}
        {!workshop.overview && !workshop.venue && !workshop.date_label && !workshop.registration_link && (
          <div className="flex flex-col items-center gap-4 py-12 text-[#9CA3AF]">
            <BookOpen className="w-12 h-12" />
            <p className="text-sm font-medium">Workshop details coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
