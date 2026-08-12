import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../auth/useAdminAuth';
import { Menu, LogOut, User } from 'lucide-react';

interface AdminTopbarProps {
  onToggleSidebar: () => void;
  activeSectionTitle?: string;
}

export default function AdminTopbar({
  onToggleSidebar,
  activeSectionTitle = 'Dashboard',
}: AdminTopbarProps) {
  const { user, adminProfile, signOut } = useAdminAuth();
  const navigate = useNavigate();

  const displayName = adminProfile?.display_name || user?.email || 'Administrator';

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left Title & Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6] cursor-pointer outline-none transition-colors"
          aria-label="Toggle Sidebar Navigation"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-[#1F2937]">{activeSectionTitle}</span>
        </div>
      </div>

      {/* Right User Info & Sign Out */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Clickable Website Admin / User Badge */}
        <button
          type="button"
          onClick={() => navigate('/admin-panel5463/settings')}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] hover:border-[#0093DD]/50 rounded-full transition-colors cursor-pointer outline-none"
          title="Website Admin Settings"
        >
          <div className="w-6 h-6 rounded-full bg-[#0093DD] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-[#1F2937] truncate max-w-[180px] hidden sm:inline">
            {displayName}
          </span>
        </button>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#374151] hover:text-[#DC2626] bg-[#F3F4F6] hover:bg-red-50 rounded-md transition-colors cursor-pointer border border-[#E5E7EB]"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
