import { useEffect, useState } from 'react';
import { navigationData, defaultServicesList, type ServiceItem } from '../data/navigation';
import type { NavItem, NavSubItem } from '../data/navigation';
import { cmsService } from '../services/cmsService';

export function useDynamicNavigation() {
  const [navItems, setNavItems] = useState<NavItem[]>(navigationData);

  useEffect(() => {
    const fetchDynamicNav = async () => {
      try {
        // Fetch all independent navigation CMS settings concurrently
        const [
          cmsServices,
          complaintData,
          alumniData,
          workshopsData,
          customDepts,
          societiesSetting,
        ] = await Promise.all([
          cmsService.getSetting<ServiceItem[]>('services_full_list', defaultServicesList),
          cmsService.getSetting<any>('complaint_management_content', null),
          cmsService.getSetting<any>('alumni_service_content', null),
          cmsService.getSetting<{ items?: any[] }>('workshops_list', { items: [] }),
          cmsService.getCustomDepartments(),
          cmsService.getSetting<any[]>('student_societies_full_list', []),
        ]);

        const fanCmsUrl = alumniData && (alumniData.fanUrl || alumniData.url) ? (alumniData.fanUrl || alumniData.url) : null;
        const alumniCmsChildren: any[] =
          alumniData && alumniData.children && Array.isArray(alumniData.children)
            ? alumniData.children.filter((c: any) => c.is_active !== false)
            : [];

        let servicesList = (cmsServices && cmsServices.length > 0 ? cmsServices : defaultServicesList)
          .filter((s) => s.is_active !== false)
          .filter((s) => s.id !== 'career-services-office' && s.name !== 'Career Services Office');

        // If Complaint Management CMS module has a custom URL configured, use it
        if (complaintData && (complaintData.buttonUrl || complaintData.url)) {
          const compUrl = complaintData.buttonUrl || complaintData.url;
          servicesList = servicesList.map((s) => {
            if (s.name.toLowerCase().includes('complaint')) {
              return { ...s, url: compUrl, is_external: compUrl.startsWith('http') };
            }
            return s;
          });
        }

        // Sync FAN URL if saved in legacy alumni_service_content
        if (fanCmsUrl && alumniCmsChildren.length === 0) {
          servicesList = servicesList.map((s) => {
            if (s.name.toLowerCase() === 'fan' || s.id === 'fan') {
              return { ...s, url: fanCmsUrl, is_external: fanCmsUrl.startsWith('http') };
            }
            return s;
          });
        }

        // Process workshops for Services → Workshops submenu
        const workshopItems: any[] = (workshopsData?.items || [])
          .filter((w: any) => w.is_archived !== true && w.is_visible !== false)
          .sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));

        let updatedNav = navigationData.map((item) => {
          if (item.label === 'SERVICES') {
            // Top level services sorted by display_order
            const topLevel = servicesList
              .filter((s) => !s.parent_id || s.parent_id === 'none' || s.parent_name === 'None' || !s.parent_name)
              .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

            const serviceSubItems: NavSubItem[] = topLevel.map((service) => {
              const children = servicesList
                .filter(
                  (s) =>
                    s.parent_id === service.id ||
                    (s.parent_name && s.parent_name.toLowerCase() === service.name.toLowerCase())
                )
                .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

              const isExt = service.is_external ?? (service.url ? service.url.startsWith('http') : true);

              if (service.name.toLowerCase() === 'workshops') {
                return {
                  label: service.name,
                  href: service.url || '/edc/workshops/summer-bootcamp-2026',
                  isExternal: false,
                  items:
                    workshopItems.length > 0
                      ? workshopItems.map((w: any) => ({
                          label: w.title,
                          href: `/edc/workshops/${w.slug}`,
                        }))
                      : [
                          { label: 'Summer Bootcamp 2026', href: '/edc/workshops/summer-bootcamp-2026' },
                        ],
                };
              }

              // Alumni is ONLY a parent hover item — clicking it does NOTHING (href: '#')
              if (service.name.toLowerCase() === 'alumni') {
                const alumniSubmenuItems =
                  alumniCmsChildren.length > 0
                    ? alumniCmsChildren.map((c: any) => ({
                        label: c.name,
                        href: c.url,
                        isExternal: c.url ? c.url.startsWith('http') : true,
                      }))
                    : children.length > 0
                    ? children.map((child) => ({
                        label: child.name,
                        href: child.url,
                        isExternal: child.is_external ?? (child.url ? child.url.startsWith('http') : true),
                      }))
                    : [
                        {
                          label: 'FAN',
                          href: fanCmsUrl || 'https://alumni.nu.edu.pk/',
                          isExternal: true,
                        },
                      ];

                return {
                  label: service.name,
                  href: '#',
                  isExternal: false,
                  items: alumniSubmenuItems,
                };
              }

              if (children.length > 0) {
                return {
                  label: service.name,
                  href: service.url,
                  isExternal: isExt,
                  items: children.map((child) => ({
                    label: child.name,
                    href: child.url,
                    isExternal: child.is_external ?? (child.url ? child.url.startsWith('http') : true),
                  })),
                };
              }

              return {
                label: service.name,
                href: service.url,
                isExternal: isExt,
              };
            });

            return { ...item, items: serviceSubItems };
          }
          return item;
        });

        // 2. Map custom created departments for DEPARTMENTS menu
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

        // 3. Process societies for Campus menu
        let societies = societiesSetting;
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

        setNavItems(updatedNav);
      } catch (err) {
        console.error('Failed to load dynamic navigation', err);
      }
    };

    fetchDynamicNav();
  }, []);

  return navItems;
}
