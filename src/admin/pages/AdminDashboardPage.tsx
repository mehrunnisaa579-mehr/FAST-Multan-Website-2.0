import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Home,
  Newspaper,
  Calendar,
  Users,
  Image,
  PanelsTopLeft,
  Images,
  ArrowRight,
  Info,
  GraduationCap,
  FileText,
  BriefcaseBusiness,
  Building2,
  BookOpen,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';

interface ActionCard {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ElementType;
}

const actionCards: ActionCard[] = [
  {
    id: 'home',
    title: 'Edit Home Page',
    description: 'Update homepage text, images and sections.',
    path: '/admin-panel5463/homepage',
    icon: Home,
  },
  {
    id: 'manage-about',
    title: 'Manage About',
    description: 'Manage editable About pages, hero media, text content and campus gallery.',
    path: '/admin-panel5463/about',
    icon: Info,
  },
  {
    id: 'all-departments',
    title: 'All Departments',
    description: 'Manage All Departments overview page, Director message, hero media, and department cards.',
    path: '/admin-panel5463/all-departments',
    icon: GraduationCap,
  },
  {
    id: 'school-of-computing',
    title: 'FAST School of Computing',
    description: 'Manage School of Computing page, departments, heads, programs/faculty links and media.',
    path: '/admin-panel5463/school-of-computing',
    icon: GraduationCap,
  },
  {
    id: 'school-of-management',
    title: 'FAST School of Management',
    description: 'Manage Management school page, programs, faculty and media.',
    path: '/admin-panel5463/school-of-management',
    icon: BookOpen,
  },
  {
    id: 'administration-staff',
    title: 'Administration Staff',
    description: 'Manage administration offices, staff cards and staff detail profiles.',
    path: '/admin-panel5463/administration-staff',
    icon: Building2,
  },
  {
    id: 'services',
    title: 'Manage Services',
    description: 'Manage editable service pages and service-related website content.',
    path: '/admin-panel5463/services',
    icon: Sparkles,
  },
  {
    id: 'campus',
    title: 'Manage Campus',
    description: 'Manage campus societies, gallery, videos and campus-life content.',
    path: '/admin-panel5463/campus',
    icon: Building2,
  },
  {
    id: 'useful-links',
    title: 'Manage Useful Links',
    description: 'Manage editable Useful Links pages, documents, policy content and downloadable resources.',
    path: '/admin-panel5463/useful-links',
    icon: LinkIcon,
  },
  {
    id: 'header-footer',
    title: 'Header & Footer',
    description: 'Update top news ticker and footer details.',
    path: '/admin-panel5463/header-footer',
    icon: PanelsTopLeft,
  },
  {
    id: 'media',
    title: 'Media Library',
    description: 'Upload photos, documents and files.',
    path: '/admin-panel5463/media',
    icon: Images,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 text-left">
      {/* Dashboard Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] tracking-tight">
          Welcome to Website Administration
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280] mt-1.5 leading-relaxed">
          Update and manage the FAST-NUCES Multan website from one place.
        </p>
      </div>

      {/* Status Info Box */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 flex items-start gap-3.5 shadow-xs">
        <div className="w-9 h-9 rounded-full bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">
            Website editing tools are active
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5 leading-relaxed">
            Click any section card below or use the sidebar menu to update website content live.
          </p>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {actionCards.map((card) => {
          const Icon = card.icon;
          return (
            <RouterLink
              key={card.id}
              to={card.path}
              className="bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-xs hover:border-[#0093DD] hover:shadow-md transition-all flex flex-col justify-between group min-h-[190px] no-underline block"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#F0F9FF] text-[#0093DD] flex items-center justify-center mb-4 group-hover:bg-[#0093DD] group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-[#1F2937] mb-1.5 group-hover:text-[#0093DD] transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
                  {card.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-sm font-bold text-[#0093DD]">
                <span>Open</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </RouterLink>
          );
        })}
      </div>
    </div>
  );
}
