import React from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import { Target, Compass, Scroll, ChevronRight } from 'lucide-react';

export default function AdminAboutOverview() {
  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage About Pages"
        subtitle="Manage editable About pages, hero banner media, introductory content, and the campus photo gallery."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 — Our Mission */}
        <AdminCard className="p-6 flex flex-col justify-between space-y-4 hover:border-[#0093DD]/50 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center font-bold border border-[#BAE6FD]">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937]">Our Mission</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Manage the mission and vision page text, hero banner image, and institutional objectives.
            </p>
          </div>
          <Link
            to="/admin-panel5463/about/mission"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md shadow-xs transition-colors no-underline w-full"
          >
            <span>Open Mission Editor</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </AdminCard>

        {/* Card 2 — Campus Introduction */}
        <AdminCard className="p-6 flex flex-col justify-between space-y-4 hover:border-[#0093DD]/50 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center font-bold border border-[#BAE6FD]">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937]">Campus Introduction</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Manage introductory campus overview text, featured photos, hero media, and campus photo gallery.
            </p>
          </div>
          <Link
            to="/admin-panel5463/about/campus-introduction"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md shadow-xs transition-colors no-underline w-full"
          >
            <span>Open Introduction Editor</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </AdminCard>

        {/* Card 3 — University Charter */}
        <AdminCard className="p-6 flex flex-col justify-between space-y-4 hover:border-[#0093DD]/50 transition-colors">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center font-bold border border-[#BAE6FD]">
              <Scroll className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937]">University Charter</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Manage official University Charter details, legal accreditation text, and hero background media.
            </p>
          </div>
          <Link
            to="/admin-panel5463/about/university-charter"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-semibold rounded-md shadow-xs transition-colors no-underline w-full"
          >
            <span>Open Charter Editor</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </AdminCard>
      </div>
    </div>
  );
}
