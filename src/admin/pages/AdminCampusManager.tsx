import React from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import { Users, Image, ChevronRight, Sparkles } from 'lucide-react';

export default function AdminCampusManager() {
  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage Campus"
        subtitle="Manage campus societies, gallery, videos and campus-life content."
      />

      <AdminSection
        title="Campus Life Modules"
        description="Select a module to manage campus student societies or the public photo/video gallery."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 — Manage Societies */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Manage Societies
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Add, edit, remove and manage campus societies and leadership.
              </p>
            </div>
            <Link
              to="/admin-panel5463/societies"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open Societies Admin</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>

          {/* Card 2 — Manage Photo Gallery */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <Image className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Manage Photo Gallery
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage campus gallery videos, thumbnails and media.
              </p>
            </div>
            <Link
              to="/admin-panel5463/gallery"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open Photo Gallery Admin</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>
        </div>
      </AdminSection>
    </div>
  );
}
