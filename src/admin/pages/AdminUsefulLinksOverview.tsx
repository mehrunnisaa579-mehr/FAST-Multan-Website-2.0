import React from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import { Accessibility, Shield, FileText, Bookmark, ChevronRight } from 'lucide-react';

export default function AdminUsefulLinksOverview() {
  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage Useful Links"
        subtitle="Manage editable Useful Links pages, documents, policy content and downloadable resources."
      />

      <AdminSection
        title="Editable Useful Links & Policy Pages"
        description="Select an editable page module below to manage policy text, hero banners, PDF documents, and downloadable resources."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 — Disability & Accessibility */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <Accessibility className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Disability & Accessibility
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage accessibility page content and hero media.
              </p>
            </div>
            <Link
              to="/admin-panel5463/useful-links/disability-accessibility"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open Editor</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>

          {/* Card 2 — GEIAH */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                GEIAH
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage Gender Equality & Harassment policy page.
              </p>
            </div>
            <Link
              to="/admin-panel5463/useful-links/geiah"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open Editor</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>

          {/* Card 3 — Student Guide Book */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Student Guide Book
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage Guide Book content, PDF and download.
              </p>
            </div>
            <Link
              to="/admin-panel5463/useful-links/student-guide-book"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open Editor</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>

          {/* Card 4 — NUCES Brand Identity Guideline */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                NUCES Brand Identity Guideline
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage brand guideline PDF and downloadable resources.
              </p>
            </div>
            <Link
              to="/admin-panel5463/useful-links/brand-identity-guideline"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open Editor</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>
        </div>
      </AdminSection>
    </div>
  );
}
