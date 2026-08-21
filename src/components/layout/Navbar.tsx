import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import type { NavItem, NavSubItem } from '../../data/navigation';
import { useDynamicNavigation } from '../../hooks/useDynamicNavigation';

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
  const isExternal =
    subItem.isExternal ||
    (subItem.href && subItem.href.startsWith('http'));

  const isSubActive =
    !isExternal &&
    subItem.href &&
    location.pathname === subItem.href;

  const ChevronIcon =
    flyoutDirection === 'left'
      ? ChevronLeft
      : ChevronRight;

  const rowContent = (
    <div className="flex items-center justify-between w-full transition-transform duration-200 ease-out group-hover/item:translate-x-[6px]">
      <div className="flex items-center min-w-0">
        <svg
          className={`w-[15px] h-[15px] mr-[9px] fill-current flex-shrink-0 transition-colors duration-200 ${
            isSubActive ? 'text-[#0093DD]' : 'text-[#555555] group-hover/item:text-[#0093DD]'
          }`}
          viewBox="0 0 24 24"
        >
          <path d="M10 17l5-5-5-5v10z" />
        </svg>
        <span className="truncate">{subItem.label}</span>
      </div>
      {hasSubmenu && (
        <ChevronIcon
          className={`w-3.5 h-3.5 ml-3 flex-shrink-0 transition-colors duration-200 ${
            isSubActive
              ? 'text-[#0093DD]'
              : 'text-gray-400 group-hover/item:text-[#0093DD]'
          }`}
        />
      )}
    </div>
  );

  return (
    <li
      className="relative group/sub"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="w-full">
        {subItem.href ? (
          isExternal ? (
            <a
              href={subItem.href}
              className="group/item w-full text-left px-[18px] py-[7px] text-[13px] font-medium outline-none transition-colors duration-200 text-[#333333] hover:bg-[#F0F9FF] hover:text-[#0093DD] focus:bg-[#F0F9FF] focus:text-[#0093DD] flex items-center justify-between"
            >
              {rowContent}
            </a>
          ) : (
            <Link
              to={subItem.href}
              onClick={onClose}
              className={`group/item w-full text-left px-[18px] py-[7px] text-[13px] font-medium outline-none transition-colors duration-200 flex items-center justify-between ${
                isSubActive
                  ? 'text-[#0093DD] bg-[#F0F9FF] font-semibold'
                  : 'text-[#333333] hover:bg-[#F0F9FF] hover:text-[#0093DD] focus:bg-[#F0F9FF] focus:text-[#0093DD]'
              }`}
            >
              {rowContent}
            </Link>
          )
        ) : (
          <button
            type="button"
            className="group/item w-full text-left px-[18px] py-[7px] text-[13px] font-medium outline-none transition-colors duration-200 text-[#333333] hover:bg-[#F0F9FF] hover:text-[#0093DD] flex items-center justify-between cursor-pointer border-none bg-transparent"
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            {rowContent}
          </button>
        )}
      </div>

      {hasSubmenu && (
        <div
          className={`absolute ${
            flyoutDirection === 'left'
              ? 'right-full top-0 mr-0.5'
              : 'left-full top-0 ml-0.5'
          } bg-white min-w-[250px] w-max max-w-[330px] shadow-[0_6px_18px_rgba(0,0,0,0.08)] border border-[#EAEAEA] border-t-2 border-t-[#0093DD] z-50 rounded-[4px] transition-all duration-220 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen
              ? 'opacity-100 translate-y-0 visible pointer-events-auto'
              : 'opacity-0 -translate-y-[5px] invisible pointer-events-none'
          }`}
        >
          <ul className="py-1.5">
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
  const navItems = useDynamicNavigation();

  const [openDropdown, setOpenDropdown] =
    useState<string | null>(null);

  const location = useLocation();

  const handleFocus = (label: string) => {
    setOpenDropdown(label);
  };

  const handleBlur = (
    e: React.FocusEvent
  ) => {
    if (
      !e.currentTarget.contains(
        e.relatedTarget
      )
    ) {
      setOpenDropdown(null);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {
    if (e.key === 'Escape') {
      setOpenDropdown(null);
    }
  };

  const isActive = (item: NavItem) => {
    if (item.href) {
      if (item.href === '/') {
        return location.pathname === '/';
      }

      return location.pathname.startsWith(
        item.href
      );
    }

    if (item.items) {
      return item.items.some((subItem) => {
        if (
          subItem.href &&
          location.pathname.startsWith(
            subItem.href
          )
        ) {
          return true;
        }

        if (subItem.items) {
          return subItem.items.some(
            (nested) =>
              nested.href &&
              location.pathname.startsWith(
                nested.href
              )
          );
        }

        return false;
      });
    }

    return false;
  };

  return (
    <nav
      className="hidden min-[1050px]:flex items-center gap-[24px] justify-end mr-[40px] h-full"
      role="navigation"
      aria-label="Primary Desktop Navigation"
    >
      {navItems.map((item) => {
        const hasSubmenu = !!item.items;
        const active = isActive(item);

        if (hasSubmenu) {
          const isDropdownOpen =
            openDropdown === item.label;

          const isRightmost =
            item.label === 'EDC' ||
            item.label === 'USEFUL LINKS';

          return (
            <div
              key={item.label}
              className="relative group h-full flex items-center"
              onMouseEnter={() =>
                setOpenDropdown(item.label)
              }
              onMouseLeave={() =>
                setOpenDropdown(null)
              }
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
            >
              <button
                type="button"
                className={`py-2 flex items-center uppercase font-['Arial','Helvetica',sans-serif] text-[16px] font-medium leading-none tracking-[0px] transition-colors duration-200 outline-none cursor-pointer select-none whitespace-nowrap ${
                  active || isDropdownOpen
                    ? 'text-[#0093DD]'
                    : 'text-[#333333] hover:text-[#0093DD]'
                }`}
                aria-haspopup="true"
                aria-expanded={
                  isDropdownOpen
                }
                onFocus={() =>
                  handleFocus(item.label)
                }
                onClick={() =>
                  setOpenDropdown(
                    isDropdownOpen
                      ? null
                      : item.label
                  )
                }
              >
                <span>
                  {item.label}
                </span>

                {/* Solid triangle / cone like reference navbar */}
                <span
                  className={`ml-[5px] text-[13px] leading-none transition-all duration-200 ${
                    isDropdownOpen
                      ? 'text-[#0093DD] rotate-180'
                      : active
                      ? 'text-[#0093DD]'
                      : 'text-[#333333] group-hover:text-[#0093DD]'
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Dropdown Container directly touching navbar with Blue Top Border */}
              <div
                className={`absolute ${
                  isRightmost
                    ? 'right-0 left-auto'
                    : 'left-0'
                } top-full min-w-[270px] w-max max-w-[340px] z-50 transition-all duration-220 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  isDropdownOpen
                    ? 'opacity-100 translate-y-0 visible pointer-events-auto'
                    : 'opacity-0 -translate-y-[5px] invisible pointer-events-none'
                }`}
              >
                <div className="bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-[#EAEAEA] border-t-2 border-t-[#0093DD] rounded-[4px] py-1.5">
                  <ul>
                    {item.items!.map(
                      (subItem) => (
                        <DesktopSubItem
                          key={
                            subItem.label
                          }
                          subItem={
                            subItem
                          }
                          onClose={() =>
                            setOpenDropdown(
                              null
                            )
                          }
                          flyoutDirection={
                            item.label ===
                              'CAMPUS' ||
                            subItem.label ===
                              'Workshops'
                              ? 'left'
                              : 'right'
                          }
                        />
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          );
        }

        const isTopExternal =
          item.isExternal ||
          (item.href &&
            item.href.startsWith('http'));

        if (isTopExternal) {
          return (
            <div
              key={item.label}
              className="relative group h-full flex items-center"
            >
              <a
                href={item.href}
                className="py-2 uppercase font-['Arial','Helvetica',sans-serif] text-[16px] font-medium leading-none tracking-[0px] transition-colors duration-200 outline-none whitespace-nowrap text-[#333333] hover:text-[#0093DD] focus:text-[#0093DD]"
              >
                {item.label}
              </a>
            </div>
          );
        }

        return (
          <div
            key={item.label}
            className="relative group h-full flex items-center"
          >
            <Link
              to={item.href || '/'}
              className={`py-2 uppercase font-['Arial','Helvetica',sans-serif] text-[16px] font-medium leading-none tracking-[0px] transition-colors duration-200 outline-none whitespace-nowrap ${
                active
                  ? 'text-[#0093DD]'
                  : 'text-[#333333] hover:text-[#0093DD] focus:text-[#0093DD]'
              }`}
            >
              {item.label}
            </Link>
          </div>
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
  const [isOpen, setIsOpen] =
    useState(false);

  const location = useLocation();

  const hasSubmenu =
    !!subItem.items &&
    subItem.items.length > 0;

  const isExternal =
    subItem.isExternal ||
    (subItem.href &&
      subItem.href.startsWith('http'));

  const isActive =
    !isExternal &&
    subItem.href &&
    location.pathname ===
      subItem.href;

  const paddingLeft = `${
    (depth + 1) * 16
  }px`;

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
                isActive
                  ? 'text-[#0093DD]'
                  : 'text-[#555555]'
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
            onClick={() =>
              setIsOpen(!isOpen)
            }
            aria-expanded={isOpen}
            aria-label={`Toggle ${subItem.label} menu`}
            className="p-3 text-gray-400 hover:text-[#0093DD] outline-none cursor-pointer border-none bg-transparent"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isOpen
                  ? 'rotate-180 text-[#0093DD]'
                  : ''
              }`}
            />
          </button>
        </div>

        {isOpen && (
          <div className="bg-[#F3F4F6]">
            {subItem.items!.map(
              (nested) => (
                <MobileSubItem
                  key={nested.label}
                  subItem={nested}
                  depth={depth + 1}
                  onClose={onClose}
                />
              )
            )}
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
        className="block pr-4 py-3 text-[13px] transition-all duration-200 border-b border-gray-100 last:border-b-0 text-[#555555] hover:bg-[#F3F4F6] hover:text-[#0093DD] hover:translate-x-[6px]"
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
      className={`block pr-4 py-3 text-[13px] transition-all duration-200 border-b border-gray-100 last:border-b-0 hover:translate-x-[6px] ${
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

export function MobileNavbar({
  isOpen,
  onClose,
}: MobileNavbarProps) {
  const navItems =
    useDynamicNavigation();

  const [
    openMobileSubmenu,
    setOpenMobileSubmenu,
  ] = useState<string | null>(null);

  const location = useLocation();

  if (!isOpen) return null;

  const isActive = (href?: string) => {
    if (!href) return false;

    if (href === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(
      href
    );
  };

  return (
    <div className="min-[1050px]:hidden border-t border-[#E5E7EB] bg-white w-full">
      <nav
        className="flex flex-col max-w-[1300px] mx-auto"
        role="navigation"
        aria-label="Primary Mobile Navigation"
      >
        {navItems.map((item) => {
          const hasSubmenu =
            !!item.items;

          const isSubmenuOpen =
            openMobileSubmenu ===
            item.label;

          if (hasSubmenu) {
            const hasActiveChild =
              item.items!.some(
                (subItem) =>
                  (!subItem.isExternal &&
                    subItem.href &&
                    location.pathname.startsWith(
                      subItem.href
                    )) ||
                  (subItem.items &&
                    subItem.items.some(
                      (nested) =>
                        nested.href &&
                        location.pathname.startsWith(
                          nested.href
                        )
                    ))
              );

            return (
              <div
                key={item.label}
                className="border-b border-[#F0F0F0] last:border-b-0"
              >
                <button
                  type="button"
                  className={`w-full flex justify-between items-center px-4 py-3.5 text-[13px] font-bold uppercase tracking-[0.3px] transition-colors outline-none cursor-pointer ${
                    hasActiveChild ||
                    isSubmenuOpen
                      ? 'text-[#0093DD]'
                      : 'text-[#333333]'
                  }`}
                  onClick={() =>
                    setOpenMobileSubmenu(
                      isSubmenuOpen
                        ? null
                        : item.label
                    )
                  }
                  aria-expanded={
                    isSubmenuOpen
                  }
                >
                  <span>
                    {item.label}
                  </span>

                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isSubmenuOpen
                        ? 'rotate-180 text-[#0093DD]'
                        : 'text-gray-400'
                    }`}
                  />
                </button>

                <div
                  className={`bg-[#F9FAFB] border-t border-[#E5E7EB] transition-all duration-200 ${
                    isSubmenuOpen
                      ? 'block'
                      : 'hidden'
                  }`}
                >
                  {item.items!.map(
                    (subItem) => (
                      <MobileSubItem
                        key={
                          subItem.label
                        }
                        subItem={
                          subItem
                        }
                        depth={1}
                        onClose={
                          onClose
                        }
                      />
                    )
                  )}
                </div>
              </div>
            );
          }

          const isTopExternal =
            item.isExternal ||
            (item.href &&
              item.href.startsWith(
                'http'
              ));

          if (isTopExternal) {
            return (
              <div
                key={item.label}
                className="border-b border-[#F0F0F0] last:border-b-0"
              >
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

          const active =
            isActive(item.href);

          return (
            <div
              key={item.label}
              className="border-b border-[#F0F0F0] last:border-b-0"
            >
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