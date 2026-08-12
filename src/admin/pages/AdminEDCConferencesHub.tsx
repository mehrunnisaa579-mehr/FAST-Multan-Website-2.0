import React from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import { Calendar, Users, ChevronRight, ArrowLeft } from 'lucide-react';

export default function AdminEDCConferencesHub() {
  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/edc"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to EDC Admin Hub"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Conferences Hub"
          subtitle="Manage main conference page content, schedule tables, posters, and conference speakers."
        />
      </div>

      <AdminSection
        title="Conference Controls"
        description="Select a conference management module below to update page content or speaker profiles."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A — Manage Conferences */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Manage Conferences
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage conference title, poster image upload, overview description, highlights and Day 1 / Day 2 schedule tables.
              </p>
            </div>
            <Link
              to="/admin-panel5463/edc/conferences"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open Conferences Editor</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>

          {/* Card B — Conference Speakers */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Conference Speakers
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Add, edit, reorder, show/hide conference speakers, titles, bios, and upload speaker profile photos.
              </p>
            </div>
            <Link
              to="/admin-panel5463/edc/conferences/speakers"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Manage Speakers</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>
        </div>
      </AdminSection>
    </div>
  );
}
