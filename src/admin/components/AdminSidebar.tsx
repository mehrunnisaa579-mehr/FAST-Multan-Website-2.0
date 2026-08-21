import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Info,
  GraduationCap,
  Newspaper,
  Users,
  BriefcaseBusiness,
  PanelsTopLeft,
  Link as LinkIcon,
  Images,
  Settings,
  Archive,
  Sparkles,
  ChevronDown,
  ChevronRight,
  FileText,
  Building2,
  BookOpen,
} from 'lucide-react';

interface SubMenuItem {
  label: string;
  path: string;
}

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: SubMenuItem[];
}

const sidebarNavigation: MenuItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin-panel5463' },
  { label: 'Home Page', icon: Home, path: '/admin-panel5463/homepage' },
  { label: 'About Pages', icon: Info, path: '/admin-panel5463/about' },
  {
    label: 'Academics',
    icon: GraduationCap,
    children: [
      { label: 'All Departments', path: '/admin-panel5463/all-departments' },
      { label: 'Manage Departments', path: '/admin-panel5463/manage-departments' },
      { label: 'Schools & Academics', path: '/admin-panel5463/schools' },
      { label: 'Degree Programs', path: '/admin-panel5463/programs' },
      { label: 'Faculty Members', path: '/admin-panel5463/faculty' },
      { label: 'Research Groups', path: '/admin-panel5463/research-groups' },
    ],
  },
  {
    label: 'News & Events',
    icon: Newspaper,
    children: [
      { label: 'News & Announcements', path: '/admin-panel5463/news' },
      { label: 'Campus News', path: '/admin-panel5463/campus-news' },
      { label: 'Events Calendar', path: '/admin-panel5463/events' },
    ],
  },
  {
    label: 'Campus Life',
    icon: Users,
    children: [
      { label: 'Manage Campus Overview', path: '/admin-panel5463/campus' },
      { label: 'Student Societies', path: '/admin-panel5463/societies' },
      { label: 'Photo Gallery', path: '/admin-panel5463/gallery' },
    ],
  },
  {
    label: 'Campus Services',
    icon: Sparkles,
    children: [
      { label: 'Manage Services', path: '/admin-panel5463/services' },
      { label: 'Complaint Management', path: '/admin-panel5463/complaint-management' },
      { label: 'Gatepass Application', path: '/admin-panel5463/gatepass-application' },
      { label: 'Career Services (CSO)', path: '/admin-panel5463/career-services' },
      { label: 'EDC Workshops', path: '/admin-panel5463/edc/workshops-hub' },
    ],
  },
  { label: 'Useful Links', icon: LinkIcon, path: '/admin-panel5463/useful-links' },
  { label: 'Header & Footer', icon: PanelsTopLeft, path: '/admin-panel5463/header-footer' },
  { label: 'Media Library', icon: Images, path: '/admin-panel5463/media' },
  { label: 'Archive', icon: Archive, path: '/admin-panel5463/archive' },
  { label: 'Settings', icon: Settings, path: '/admin-panel5463/settings' },
];

interface AdminSidebarProps {
  isOpen: boolean;
  isDesktopCollapsed?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ isOpen, isDesktopCollapsed = false, onCloseMobile }: AdminSidebarProps) {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Academics: true,
    'News & Events': true,
    'Campus Life': true,
    'Campus Services': true,
  });

  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupLabel]: !prev[groupLabel],
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#1E3A6D] text-slate-200 flex flex-col transition-all duration-250 ease-in-out ${
          isOpen ? 'translate-x-0 w-[270px]' : '-translate-x-full lg:translate-x-0'
        } ${
          isDesktopCollapsed
            ? 'lg:w-0 lg:min-w-0 lg:overflow-hidden lg:opacity-0 lg:pointer-events-none lg:border-r-0 lg:p-0'
            : 'lg:w-[270px]'
        }`}
      >
        {/* Sidebar Header Lockup - Horizontal Logo Only */}
        <div className="h-20 px-4 flex items-center justify-center border-b border-slate-700/60 bg-[#162D56] flex-shrink-0">
          <img
            src="/cms-horizontal-logo.png"
            alt="FAST-NUCES Multan Logo"
            className="w-full max-w-[190px] sm:max-w-[200px] h-auto object-contain mx-auto"
          />
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-5 px-4 space-y-1.5 admin-sidebar-scroll text-left">
          {sidebarNavigation.map((item) => {
            const Icon = item.icon;
            const hasChildren = !!item.children;
            const isGroupExpanded = expandedGroups[item.label];

            if (hasChildren) {
              return (
                <div key={item.label} className="w-full">
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.label)}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-md text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer text-left min-h-[48px]"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className="w-5 h-5 flex-shrink-0 text-slate-300" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span className="text-slate-300">
                      {isGroupExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                  </button>

                  {isGroupExpanded && (
                    <div className="ml-5 pl-3 border-l border-slate-700/60 mt-1 space-y-1">
                      {item.children?.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          onClick={onCloseMobile}
                          className={({ isActive }) =>
                            `w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors block min-h-[42px] flex items-center ${
                              isActive
                                ? 'text-white font-bold bg-[#0093DD] shadow-xs'
                                : 'text-slate-300 hover:text-white hover:bg-white/10'
                            }`
                          }
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path!}
                end={item.path === '/admin-panel5463'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-sm font-semibold transition-colors text-left min-h-[48px] ${
                    isActive
                      ? 'bg-[#0093DD] text-white font-bold shadow-xs'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700/60 bg-[#162D56] text-xs text-slate-300 text-center font-medium">
          FAST-NUCES Multan Admin Panel
        </div>
      </aside>
    </>
  );
}
