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
  Sparkles,
  ChevronDown,
  ChevronRight,
  FileText,
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
      { label: 'Departments', path: '/admin-panel5463/departments' },
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
      { label: 'Student Societies', path: '/admin-panel5463/societies' },
      { label: 'Photo Gallery', path: '/admin-panel5463/gallery' },
    ],
  },
  {
    label: 'Campus Services',
    icon: Sparkles,
    children: [
      { label: 'Overview Services', path: '/admin-panel5463/services' },
      { label: 'Career Services (CSO)', path: '/admin-panel5463/career-services' },
    ],
  },
  { label: 'EDC Center', icon: BriefcaseBusiness, path: '/admin-panel5463/edc' },
  { label: 'Useful Links', icon: LinkIcon, path: '/admin-panel5463/useful-links' },
  { label: 'Header & Footer', icon: PanelsTopLeft, path: '/admin-panel5463/header-footer' },
  { label: 'Media Library', icon: Images, path: '/admin-panel5463/media' },
  { label: 'Settings', icon: Settings, path: '/admin-panel5463/settings' },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ isOpen, onCloseMobile }: AdminSidebarProps) {
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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[270px] bg-[#1E3A6D] text-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header Lockup */}
        <div className="h-20 px-6 flex items-center border-b border-slate-700/60 bg-[#162D56]">
          <div className="w-10 h-10 rounded bg-[#0093DD] text-white flex items-center justify-center font-bold text-sm mr-3.5 flex-shrink-0 shadow-xs">
            FAST
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-base font-bold text-white tracking-tight">FAST-NUCES Multan</span>
            <span className="text-xs font-semibold text-[#0093DD] mt-0.5">Website Admin</span>
          </div>
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
