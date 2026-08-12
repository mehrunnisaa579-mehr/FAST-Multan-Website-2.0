import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import AdminScrollToTop from '../components/AdminScrollToTop';

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    try {
      return localStorage.getItem('admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const location = useLocation();

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setIsDesktopCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem('admin_sidebar_collapsed', String(next));
        } catch {
          // ignore localStorage error
        }
        return next;
      });
    }
  };

  // Determine title from current pathname for topbar
  const getPageTitle = (path: string) => {
    if (path.endsWith('/homepage')) return 'Edit Home Page';
    if (path.endsWith('/news')) return 'Manage News & Announcements';
    if (path.endsWith('/events')) return 'Manage Events';
    if (path.endsWith('/faculty')) return 'Manage Faculty';
    if (path.endsWith('/societies')) return 'Manage Societies';
    if (path.endsWith('/gallery')) return 'Manage Photo Gallery';
    if (path.endsWith('/header-footer')) return 'Header & Footer Settings';
    if (path.endsWith('/media')) return 'Media Library';
    if (path.endsWith('/about')) return 'About Pages';
    if (path.endsWith('/schools')) return 'Schools & Departments';
    if (path.endsWith('/programs')) return 'Programs';
    if (path.endsWith('/research-groups')) return 'Research Groups';
    if (path.endsWith('/videos')) return 'Videos';
    if (path.endsWith('/edc')) return 'EDC';
    if (path.endsWith('/useful-links')) return 'Useful Links';
    if (path.endsWith('/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex flex-col lg:flex-row text-[#1F2937] admin-body">
      <AdminScrollToTop />
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={mobileSidebarOpen}
        isDesktopCollapsed={isDesktopCollapsed}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-250 ease-in-out">
        <AdminTopbar
          onToggleSidebar={toggleSidebar}
          activeSectionTitle={getPageTitle(location.pathname)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1450px] w-full mx-auto">
          {/* ONLY Outlet is rendered here - fixing duplicate dashboard content completely */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
