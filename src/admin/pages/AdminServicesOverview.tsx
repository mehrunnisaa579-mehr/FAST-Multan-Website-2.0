import React from 'react';
import { Link } from 'react-router-dom';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminSection from '../components/ui/AdminSection';
import { FileText, ShieldCheck, BriefcaseBusiness, ChevronRight } from 'lucide-react';

export default function AdminServicesOverview() {
  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <AdminPageHeader
        title="Manage Services"
        subtitle="Manage editable service pages and service-related website content."
      />

      <AdminSection
        title="Editable Campus Services"
        description="Select a service module below to edit public service content, instructions, and application links."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 — Complaint Management System */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Complaint Management System
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage the Complaint Management System service page.
              </p>
            </div>
            <Link
              to="/admin-panel5463/complaint-management"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>

          {/* Card 2 — Gatepass Application */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Gatepass Application
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage the Gatepass Application service page.
              </p>
            </div>
            <Link
              to="/admin-panel5463/gatepass-application"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>

          {/* Card 3 — Career Services Office */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <BriefcaseBusiness className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                Career Services Office
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage Career Services page content, hero media and contact information.
              </p>
            </div>
            <Link
              to="/admin-panel5463/career-services"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>

          {/* Card 4 — EDC Workshops */}
          <AdminCard className="p-6 flex flex-col justify-between space-y-5 hover:border-[#0093DD]/50 transition-all shadow-xs hover:shadow-md group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] group-hover:bg-[#0093DD] group-hover:text-white flex items-center justify-center font-bold border border-[#E5E7EB] transition-colors">
                <BriefcaseBusiness className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#0093DD] transition-colors">
                EDC Workshops & Bootcamps
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                Manage EDC workshops, training bootcamps, schedule, and modules.
              </p>
            </div>
            <Link
              to="/admin-panel5463/edc/workshops-hub"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-xs transition-colors no-underline w-full"
            >
              <span>Open</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </AdminCard>
        </div>
      </AdminSection>
    </div>
  );
}
