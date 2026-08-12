import React from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import { BriefcaseBusiness, Calendar, BookOpen, Sparkles, ChevronRight } from 'lucide-react';

export default function AdminEDCOverview() {
  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage EDC"
        subtitle="Manage EDC pages, conferences, workshops, speakers and highlights."
      />

      <AdminSection
        title="EDC Modules & Page Editors"
        description="Select an EDC section below to manage page content, executive workshops, conferences, and event highlights."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 — About EDC */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <BriefcaseBusiness className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                About EDC
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage About EDC overview, vision, mission and hero media.
              </p>
            </div>
            <Link
              to="/admin-panel5463/edc/about"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open Editor</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>

          {/* Card 2 — Conferences */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Conferences
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage EDC conferences, posters, schedule and conference speakers.
              </p>
            </div>
            <Link
              to="/admin-panel5463/edc/conferences-hub"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open Hub</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>

          {/* Card 3 — Workshops */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Workshops
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage Summer Bootcamp 2026 modules, schedule and registration.
              </p>
            </div>
            <Link
              to="/admin-panel5463/edc/workshops-hub"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open Hub</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>

          {/* Card 4 — Highlights */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Highlights
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage EDC highlight events and dynamic photo galleries.
              </p>
            </div>
            <Link
              to="/admin-panel5463/edc/highlights"
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
