import { useEffect, useState } from 'react';
import { navigationData } from '../data/navigation';
import type { NavItem } from '../data/navigation';
import { cmsService } from '../services/cmsService';

export function useDynamicNavigation() {
  const [navItems, setNavItems] = useState<NavItem[]>(navigationData);

  useEffect(() => {
    const fetchDynamicNav = async () => {
      try {
        // 1. Fetch visibility settings for Services
        const gatepassData = await cmsService.getSetting<any>('gatepass_application_content', null);
        const complaintData = await cmsService.getSetting<any>('complaint_management_content', null);

        const gatepassVisible = gatepassData ? (gatepassData.isVisible ?? gatepassData.is_visible ?? true) : true;
        const complaintVisible = complaintData ? (complaintData.isVisible ?? complaintData.is_visible ?? true) : true;

        let updatedNav = navigationData.map((item) => {
          if (item.label === 'SERVICES' && item.items) {
            const filteredServices = item.items.filter((sub) => {
              if (sub.href === '/services/gatepass-application' && !gatepassVisible) return false;
              if (sub.href === '/services/complaint-management' && !complaintVisible) return false;
              return true;
            });
            return { ...item, items: filteredServices };
          }
          return item;
        });

        // 1b. Fetch custom created departments for DEPARTMENTS menu
        const customDepts = await cmsService.getCustomDepartments();
        updatedNav = updatedNav.map((item) => {
          if (item.label === 'DEPARTMENTS' && item.items) {
            let deptItems = [...item.items];

            if (customDepts && customDepts.length > 0) {
              const customNavItems = customDepts.map((d: any) => ({
                label: d.name,
                href: `/departments/${d.slug}`,
              }));
              const existingSlugs = new Set(deptItems.map((i) => i.href));
              const newItems = customNavItems.filter((i: any) => !existingSlugs.has(i.href));
              deptItems = [...deptItems, ...newItems];
            }

            // Pin Administrative Staff to always render LAST
            const isAdminStaff = (i: any) =>
              i.href === '/departments/administration-staff' ||
              i.label.toLowerCase().includes('administration staff') ||
              i.label.toLowerCase().includes('administrative staff');

            const academicDepts = deptItems.filter((i) => !isAdminStaff(i));
            const adminStaffDepts = deptItems.filter(isAdminStaff);

            return { ...item, items: [...academicDepts, ...adminStaffDepts] };
          }
          return item;
        });

        // 2. Fetch societies for Campus menu
        let societies = await cmsService.getSetting<any[]>('student_societies_full_list', []);
        if (!societies || societies.length === 0) {
          societies = await cmsService.getSocieties();
        }

        if (societies && societies.length > 0) {
          const visibleSocieties = societies
            .filter((s: any) => s.is_visible !== false)
            .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));

          if (visibleSocieties.length > 0) {
            updatedNav = updatedNav.map((item) => {
              if (item.label === 'CAMPUS' && item.items) {
                const updatedCampusItems = item.items.map((sub) => {
                  if (sub.label === 'Societies') {
                    return {
                      ...sub,
                      items: visibleSocieties.map((soc: any) => ({
                        label: soc.name || soc.short_name || soc.slug.toUpperCase(),
                        href: `/campus/societies/${soc.slug}`,
                      })),
                    };
                  }
                  return sub;
                });
                return { ...item, items: updatedCampusItems };
              }
              return item;
            });
          }
        }

        // 3. Fetch workshops for Services → Workshops submenu
        const workshopsData = await cmsService.getSetting<{ items?: any[] }>('workshops_list', { items: [] });
        const workshopItems: any[] = (workshopsData?.items || [])
          .filter((w: any) => w.is_archived !== true && w.is_visible !== false)
          .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));

        if (workshopItems.length > 0) {
          updatedNav = updatedNav.map((item) => {
            if (item.label === 'SERVICES' && item.items) {
              const updatedServiceItems = item.items.map((sub) => {
                if (sub.label === 'Workshops') {
                  return {
                    ...sub,
                    items: workshopItems.map((w: any) => ({
                      label: w.title,
                      href: `/edc/workshops/${w.slug}`,
                    })),
                  };
                }
                return sub;
              });
              return { ...item, items: updatedServiceItems };
            }
            return item;
          });
        }

        setNavItems(updatedNav);
      } catch (err) {
        console.error('Failed to load dynamic navigation', err);
      }
    };

    fetchDynamicNav();
  }, []);

  return navItems;
}
