import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { navigationData } from '../../data/navigation';
import type { NavItem, NavSubItem } from '../../data/navigation';

function DesktopSubItem({
  subItem,
  onClose,
  flyoutDirection = 'right',
}: {
  subItem: NavSubItem;
  onClose: () => void;
  flyoutDirection?: 'left' | 'right';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasSubmenu = !!subItem.items && subItem.items.length > 0;
  const isExternal = subItem.isExternal || (subItem.href && subItem.href.startsWith('http'));
  const isSubActive = !isExternal && subItem.href && location.pathname === subItem.href;

  return (
    <li
      className="relative group/sub"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex items-center justify-between">
        {subItem.href ? (
          isExternal ? (
            <a
              href={subItem.href}
              className="w-full text-left px-4 py-[11px] text-[13px] font-medium outline-none transition-colors text-[#333333] hover:bg-[#F5F5F5] hover:text-[#0093DD] focus:bg-[#F5F5F5] focus:text-[#0093DD] flex items-center justify-between"
            >
              <span>{subItem.label}</span>
              {hasSubmenu && <ChevronRight className="w-3.5 h-3.5 text-gray-400 ml-2" />}
            </a>
          ) : (
            <Link
              to={subItem.href}
              className={`w-full text-left px-4 py-[11px] text-[13px] font-medium outline-none transition-colors flex items-center justify-between ${
                isSubActive
                  ? 'text-[#0093DD] bg-[#F5F5F5]'
                  : 'text-[#333333] hover:bg-[#F5F5F5] hover:text-[#0093DD] focus:bg-[#F5F5F5] focus:text-[#0093DD]'
              }`}
            >
              <span>{subItem.label}</span>
              {hasSubmenu && <ChevronRight className="w-3.5 h-3.5 text-gray-400 ml-2" />}
            </Link>
          )
        ) : (
          <button
            type="button"
            className="w-full text-left px-4 py-[11px] text-[13px] font-medium outline-none transition-colors text-[#333333] hover:bg-[#F5F5F5] hover:text-[#0093DD] flex items-center justify-between cursor-pointer border-none bg-transparent"
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            <span>{subItem.label}</span>
            {hasSubmenu && <ChevronRight className="w-3.5 h-3.5 text-gray-400 ml-2" />}
          </button>
        )}
      </div>

      {hasSubmenu && (
        <div
          className={`absolute ${
            flyoutDirection === 'left' ? 'right-full top-0 mr-0.5' : 'left-full top-0 ml-0.5'
          } bg-white min-w-[220px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-[#EAEAEA] z-50 rounded-none transition-opacity duration-150 ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
        >
          <ul className="py-1">
            {subItem.items!.map((nestedItem) => (
              <DesktopSubItem
                key={nestedItem.label}
                subItem={nestedItem}
                onClose={onClose}
                flyoutDirection={flyoutDirection}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

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
      return item.items.some((subItem) => {
        if (subItem.href && location.pathname.startsWith(subItem.href)) return true;
        if (subItem.items) {
          return subItem.items.some((nested) => nested.href && location.pathname.startsWith(nested.href));
        }
        return false;
      });
    }
    return false;
  };

  return (
    <nav
      className="hidden min-[1050px]:flex items-center gap-[20px] justify-end mr-[40px]"
      role="navigation"
      aria-label="Primary Desktop Navigation"
    >
      {navigationData.map((item) => {
        const hasSubmenu = !!item.items;
        const active = isActive(item);

        if (hasSubmenu) {
          const isDropdownOpen = openDropdown === item.label;
          const isRightmost = item.label === 'EDC' || item.label === 'USEFUL LINKS';

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
                className={`absolute ${isRightmost ? 'right-0 left-auto' : 'left-0'} top-full mt-2 bg-white min-w-[220px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-[#EAEAEA] z-50 rounded-none transition-opacity duration-150 ${
                  isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
              >
                <ul className="py-1">
                  {item.items!.map((subItem) => (
                    <DesktopSubItem
                      key={subItem.label}
                      subItem={subItem}
                      onClose={() => setOpenDropdown(null)}
                      flyoutDirection={item.label === 'EDC' || item.label === 'CAMPUS' ? 'left' : 'right'}
                    />
                  ))}
                </ul>
              </div>
            </div>
          );
        }

        const isTopExternal = item.isExternal || (item.href && item.href.startsWith('http'));

        if (isTopExternal) {
          return (
            <a
              key={item.label}
              href={item.href}
              className="uppercase font-['Arial',_sans-serif] text-[13px] font-bold leading-none tracking-[0.3px] transition-colors outline-none whitespace-nowrap text-[#333333] hover:text-[#0093DD] focus:text-[#0093DD]"
            >
              {item.label}
            </a>
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

function MobileSubItem({
  subItem,
  depth = 1,
  onClose,
}: {
  subItem: NavSubItem;
  depth?: number;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasSubmenu = !!subItem.items && subItem.items.length > 0;
  const isExternal = subItem.isExternal || (subItem.href && subItem.href.startsWith('http'));
  const isActive = !isExternal && subItem.href && location.pathname === subItem.href;

  const paddingLeft = `${(depth + 1) * 16}px`;

  if (hasSubmenu) {
    return (
      <div className="border-b border-gray-100 last:border-b-0">
        <div
          className="flex items-center justify-between text-[13px] transition-colors hover:bg-[#F3F4F6]"
          style={{ paddingLeft }}
        >
          {subItem.href ? (
            <Link
              to={subItem.href}
              onClick={onClose}
              className={`flex-1 py-3 text-left font-medium ${
                isActive ? 'text-[#0093DD]' : 'text-[#555555]'
              }`}
            >
              {subItem.label}
            </Link>
          ) : (
            <span className="flex-1 py-3 text-left font-medium text-[#555555]">
              {subItem.label}
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label={`Toggle ${subItem.label} menu`}
            className="p-3 text-gray-400 hover:text-[#0093DD] outline-none cursor-pointer border-none bg-transparent"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-[#0093DD]' : ''
              }`}
            />
          </button>
        </div>
        {isOpen && (
          <div className="bg-[#F3F4F6]">
            {subItem.items!.map((nested) => (
              <MobileSubItem
                key={nested.label}
                subItem={nested}
                depth={depth + 1}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (isExternal) {
    return (
      <a
        href={subItem.href}
        onClick={onClose}
        style={{ paddingLeft }}
        className="block pr-4 py-3 text-[13px] transition-colors border-b border-gray-100 last:border-b-0 text-[#555555] hover:bg-[#F3F4F6] hover:text-[#0093DD]"
      >
        {subItem.label}
      </a>
    );
  }

  return (
    <Link
      to={subItem.href || '#'}
      onClick={onClose}
      style={{ paddingLeft }}
      className={`block pr-4 py-3 text-[13px] transition-colors border-b border-gray-100 last:border-b-0 ${
        isActive
          ? 'text-[#0093DD] bg-[#F3F4F6] font-medium'
          : 'text-[#555555] hover:bg-[#F3F4F6] hover:text-[#0093DD]'
      }`}
    >
      {subItem.label}
    </Link>
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
            const hasActiveChild = item.items!.some(
              (subItem) =>
                (!subItem.isExternal && subItem.href && location.pathname.startsWith(subItem.href)) ||
                (subItem.items && subItem.items.some((nested) => nested.href && location.pathname.startsWith(nested.href)))
            );

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
                  {item.items!.map((subItem) => (
                    <MobileSubItem
                      key={subItem.label}
                      subItem={subItem}
                      depth={1}
                      onClose={onClose}
                    />
                  ))}
                </div>
              </div>
            );
          }

          const isTopExternal = item.isExternal || (item.href && item.href.startsWith('http'));

          if (isTopExternal) {
            return (
              <div key={item.label} className="border-b border-[#F0F0F0] last:border-b-0">
                <a
                  href={item.href}
                  onClick={onClose}
                  className="block px-4 py-3.5 text-[13px] font-bold uppercase tracking-[0.3px] transition-colors text-[#333333] hover:text-[#0093DD]"
                >
                  {item.label}
                </a>
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
