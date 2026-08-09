import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { navigationData } from '../../data/navigation';
import type { NavItem } from '../../data/navigation';

export function DesktopNavbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  const handleFocus = (label: string) => {
    setOpenDropdown(label);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setOpenDropdown(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpenDropdown(null);
    }
  };

  const isActive = (item: NavItem) => {
    if (item.href) {
      if (item.href === '/') {
        return location.pathname === '/';
      }
      return location.pathname.startsWith(item.href);
    }
    if (item.items) {
      return item.items.some((subItem) => location.pathname === subItem.href);
    }
    return false;
  };

  return (
    <nav
      className="hidden min-[1050px]:flex items-center gap-[24px] justify-end"
      role="navigation"
      aria-label="Primary Desktop Navigation"
    >
      {navigationData.map((item) => {
        const hasSubmenu = !!item.items;
        const active = isActive(item);

        if (hasSubmenu) {
          const isDropdownOpen = openDropdown === item.label;
          return (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            >
              <button
                type="button"
                className={`flex items-center uppercase font-['Arial',_sans-serif] text-[13px] font-bold leading-none tracking-[0.3px] transition-colors outline-none cursor-pointer select-none whitespace-nowrap ${
                  active || isDropdownOpen
                    ? 'text-[#0093DD]'
                    : 'text-[#333333] hover:text-[#0093DD]'
                }`}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                onFocus={() => handleFocus(item.label)}
                onClick={() => setOpenDropdown(isDropdownOpen ? null : item.label)}
              >
                <span>{item.label}</span>
                <ChevronDown 
                  className={`w-[10px] h-[10px] ml-[4px] transition-colors ${
                    active || isDropdownOpen
                      ? 'text-[#0093DD]'
                      : 'text-[#333333] group-hover:text-[#0093DD]'
                  }`} 
                />
              </button>

              <div
                className={`absolute left-0 top-full mt-2 bg-white min-w-[200px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-[#EAEAEA] z-50 rounded-none transition-opacity duration-150 ${
                  isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
              >
                <ul className="py-1">
                  {item.items!.map((subItem) => {
                    const isSubActive = location.pathname === subItem.href;
                    return (
                      <li key={subItem.label}>
                        <Link
                          to={subItem.href}
                          className={`block px-4 py-[11px] text-[13px] font-medium outline-none transition-colors rounded-none ${
                            isSubActive
                              ? 'text-[#0093DD] bg-[#F5F5F5]'
                              : 'text-[#333333] hover:bg-[#F5F5F5] hover:text-[#0093DD] focus:bg-[#F5F5F5] focus:text-[#0093DD]'
                          }`}
                        >
                          {subItem.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        }

        return (
          <Link
            key={item.label}
            to={item.href || '/'}
            className={`uppercase font-['Arial',_sans-serif] text-[13px] font-bold leading-none tracking-[0.3px] transition-colors outline-none whitespace-nowrap ${
              active
                ? 'text-[#0093DD]'
                : 'text-[#333333] hover:text-[#0093DD] focus:text-[#0093DD]'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

interface MobileNavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavbar({ isOpen, onClose }: MobileNavbarProps) {
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const location = useLocation();

  if (!isOpen) return null;

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-[1050px]:hidden border-t border-[#E5E7EB] bg-white w-full">
      <nav
        className="flex flex-col max-w-[1300px] mx-auto"
        role="navigation"
        aria-label="Primary Mobile Navigation"
      >
        {navigationData.map((item) => {
          const hasSubmenu = !!item.items;
          const isSubmenuOpen = openMobileSubmenu === item.label;

          if (hasSubmenu) {
            const hasActiveChild = item.items!.some((subItem) => location.pathname === subItem.href);

            return (
              <div key={item.label} className="border-b border-[#F0F0F0] last:border-b-0">
                <button
                  type="button"
                  className={`w-full flex justify-between items-center px-4 py-3.5 text-[13px] font-bold uppercase tracking-[0.3px] transition-colors outline-none cursor-pointer ${
                    hasActiveChild || isSubmenuOpen ? 'text-[#0093DD]' : 'text-[#333333]'
                  }`}
                  onClick={() => setOpenMobileSubmenu(isSubmenuOpen ? null : item.label)}
                  aria-expanded={isSubmenuOpen}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isSubmenuOpen ? 'rotate-180 text-[#0093DD]' : 'text-gray-400'
                    }`}
                  />
                </button>
                <div
                  className={`bg-[#F9FAFB] border-t border-[#E5E7EB] transition-all duration-200 ${
                    isSubmenuOpen ? 'block' : 'hidden'
                  }`}
                >
                  {item.items!.map((subItem) => {
                    const active = location.pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.label}
                        to={subItem.href}
                        onClick={onClose}
                        className={`block pl-8 pr-4 py-3 text-[13px] transition-colors border-b border-gray-100 last:border-b-0 ${
                          active
                            ? 'text-[#0093DD] bg-[#F3F4F6] font-medium'
                            : 'text-[#555555] hover:bg-[#F3F4F6] hover:text-[#0093DD]'
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          const active = isActive(item.href);

          return (
            <div key={item.label} className="border-b border-[#F0F0F0] last:border-b-0">
              <Link
                to={item.href || '/'}
                onClick={onClose}
                className={`block px-4 py-3.5 text-[13px] font-bold uppercase tracking-[0.3px] transition-colors ${
                  active
                    ? 'text-[#0093DD] font-bold'
                    : 'text-[#333333] hover:text-[#0093DD]'
                }`}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
