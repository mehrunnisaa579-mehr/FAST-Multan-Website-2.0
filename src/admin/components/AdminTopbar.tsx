import React from 'react';
import { useAdminAuth } from '../auth/useAdminAuth';
import { Menu, LogOut, User } from 'lucide-react';

interface AdminTopbarProps {
  onToggleMobileSidebar: () => void;
  activeSectionTitle?: string;
}

export default function AdminTopbar({
  onToggleMobileSidebar,
  activeSectionTitle = 'Dashboard',
}: AdminTopbarProps) {
  const { user, adminProfile, signOut } = useAdminAuth();

  const displayName = adminProfile?.display_name || user?.email || 'Administrator';

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left Title & Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="p-1.5 rounded-md text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F3F4F6] lg:hidden cursor-pointer outline-none"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-[#1F2937]">{activeSectionTitle}</span>
        </div>
      </div>

      {/* Right User Info & Sign Out */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* User Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full">
          <div className="w-6 h-6 rounded-full bg-[#0093DD] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-[#1F2937] truncate max-w-[180px] hidden sm:inline">
            {displayName}
          </span>
        </div>

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
