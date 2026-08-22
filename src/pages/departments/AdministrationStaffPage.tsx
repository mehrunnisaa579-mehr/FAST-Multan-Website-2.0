import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, User } from 'lucide-react';
import AboutPageHero from '../../components/about/AboutPageHero';
import DepartmentCard from '../../components/departments/DepartmentCard';
import { adminOfficesList, initialStaffMembers } from '../../data/staffData';
import type { StaffMember } from '../../data/staffData';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

interface OfficeNavItem {
  id: string;
  label: string;
  display_order?: number;
  is_visible?: boolean;
}

export default function AdministrationStaffPage() {
  // ── Hero CMS ──────────────────────────────────────────────────────────────
  const [heroTitle, setHeroTitle] = useState('Administration Staff');
  const [heroImageUrl, setHeroImageUrl] = useState<string | undefined>(
    undefined
  );

  // ── Dynamic Offices/Categories list ────────────────────────────────────────
  const [officeNavList, setOfficeNavList] = useState<OfficeNavItem[]>(
    adminOfficesList.map((o) => ({ id: o.id, label: o.title }))
  );

  // ── Staff data ────────────────────────────────────────────────────────────
  const [staffData, setStaffData] =
    useState<StaffMember[]>(initialStaffMembers);

  // ── Selected office ───────────────────────────────────────────────────────
  const [activeOfficeId, setActiveOfficeId] =
    useState<string>('academic-office');

  // ── Fetch hero + categories + staff from CMS ──────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      // 1. Hero
      const heroData = await cmsService.getSetting<any>(
        'admin_staff_hero_settings',
        null
      );

      if (heroData) {
        if (heroData.heroTitle) {
          setHeroTitle(heroData.heroTitle);
        }

        setHeroImageUrl(
          heroData.heroImageUrl ||
            heroData.heroImage ||
            undefined
        );
      }

      // 2. Dynamic Office Categories from CMS
      const savedOffices = await cmsService.getSetting<any[]>(
        'admin_offices_list',
        []
      );

      let currentOffices: OfficeNavItem[] = [];
      if (savedOffices && savedOffices.length > 0) {
        currentOffices = savedOffices
          .filter((o: any) => o.is_visible !== false)
          .map((o: any) => ({
            id: o.id,
            label: o.title || o.label || o.id,
            display_order: o.display_order || 1,
          }));
      } else {
        currentOffices = adminOfficesList.map((o) => ({
          id: o.id,
          label: o.title,
          display_order: 1,
        }));
      }

      // 3. Staff members from DB
      const dbStaff = await cmsService.getAdminStaff();

      if (dbStaff && dbStaff.length > 0) {
        const formatted: StaffMember[] = dbStaff.map((s: any) => ({
          id: s.id,
          slug: s.slug || s.id,
          name: s.name,
          designation: s.designation,
          office: s.office,
          photoUrl: s.photo_url || s.photoUrl || '',
          email: s.email || '',
          phone: s.phone || '',
          extension: s.extension || '',
          introduction: s.introduction || '',
          education: s.education || '',
          display_order: s.display_order || 1,
          is_visible: s.is_visible ?? true,
        }));

        // Check if any staff member is assigned to an office not yet present in currentOffices
        const existingOfficeIds = new Set(currentOffices.map((o) => o.id));
        formatted.forEach((s) => {
          if (s.office && !existingOfficeIds.has(s.office)) {
            currentOffices.push({
              id: s.office,
              label: s.office.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
              display_order: 99,
            });
            existingOfficeIds.add(s.office);
          }
        });

        setOfficeNavList(currentOffices);

        if (currentOffices.length > 0) {
          setActiveOfficeId((prev) =>
            currentOffices.some((o) => o.id === prev) ? prev : currentOffices[0].id
          );
        }

        // Per-office merge across ALL dynamic offices:
        const merged: StaffMember[] = [];

        currentOffices.forEach((office) => {
          const cmsForOffice = formatted.filter(
            (s) =>
              (s.office === office.id || s.office === office.label) &&
              s.is_visible !== false
          );

          if (cmsForOffice.length > 0) {
            merged.push(...cmsForOffice);
          } else {
            // Fallback to static placeholders ONLY if default pre-existing office has no CMS entries
            const fallbacks = initialStaffMembers.filter(
              (s) => s.office === office.id
            );
            merged.push(...fallbacks);
          }
        });

        setStaffData(merged);
      } else {
        setOfficeNavList(currentOffices);
        if (currentOffices.length > 0) {
          setActiveOfficeId((prev) =>
            currentOffices.some((o) => o.id === prev) ? prev : currentOffices[0].id
          );
        }
      }
    };

    fetchAll();
  }, []);

  // ── Visible staff for selected office ─────────────────────────────────────
  const visibleStaff = staffData.filter(
    (s) =>
      (s.office === activeOfficeId ||
        s.office ===
          officeNavList.find((o) => o.id === activeOfficeId)?.label) &&
      s.is_visible !== false
  );

  const activeOfficeLabel =
    officeNavList.find((o) => o.id === activeOfficeId)?.label ?? 'Staff';

  return (
    <div className="dept-page-container">

      {/* =====================================================
          HERO
          ===================================================== */}
      <AboutPageHero
        title={heroTitle}
        backgroundImage={heroImageUrl}
      />

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}
      <div className="w-full max-w-[1480px] mx-auto px-[28px] sm:px-[40px] md:px-[56px] py-[64px] sm:py-[72px]">

        <div className="admin-staff-layout">

          {/* =================================================
              LEFT SIDEBAR
              ================================================= */}
          <nav
            className="admin-staff-sidebar overflow-hidden"
            aria-label="Administrative offices"
            style={{
              minHeight: '625px',
            }}
          >

            {/* Sidebar Header */}
            <div
              className="
                admin-staff-sidebar-header
                min-h-[64px]
                px-[22px]
                flex
                items-center
                gap-[11px]
                text-[16px]
                font-bold
                tracking-[0.3px]
              "
            >
              <Users
                className="
                  w-[20px]
                  h-[20px]
                  opacity-95
                  flex-shrink-0
                "
              />

              <span>
                Administrative Staff
              </span>
            </div>

            {/* Office Navigation */}
            <ul
              className="
                admin-staff-office-list
                py-[6px]
              "
              role="list"
            >
              {officeNavList.map((office) => (

                <li key={office.id}>

                  <button
                    type="button"
                    className={`
                      admin-staff-office-btn
                      min-h-[53px]
                      px-[24px]
                      text-[15.5px]
                      font-medium
                      gap-[14px]
                      ${
                        activeOfficeId === office.id
                          ? 'active'
                          : ''
                      }
                    `}
                    onClick={() =>
                      setActiveOfficeId(office.id)
                    }
                    aria-current={
                      activeOfficeId === office.id
                        ? 'page'
                        : undefined
                    }
                  >

                    <span
                      className="
                        office-dot
                        !w-[8px]
                        !h-[8px]
                        !min-w-[8px]
                      "
                      aria-hidden="true"
                    />

                    <span>
                      {office.label}
                    </span>

                  </button>

                </li>

              ))}
            </ul>

          </nav>

          {/* =================================================
              RIGHT CONTENT AREA
              ================================================= */}
          <div className="admin-staff-content">

            {/* Section Heading */}
            <div className="admin-staff-content-header">

              <h2 className="admin-staff-content-title">
                {activeOfficeLabel}
              </h2>

              <p className="admin-staff-content-count">
                {visibleStaff.length}{' '}
                {visibleStaff.length === 1
                  ? 'member'
                  : 'members'}
              </p>

            </div>

            {/* Staff Grid */}
            {visibleStaff.length > 0 ? (

              <div className="admin-staff-grid">
                {visibleStaff
                  .slice()
                  .sort(
                    (a, b) =>
                      (a.display_order ?? 99) -
                      (b.display_order ?? 99)
                  )
                  .map((member) => (
                    <div key={member.slug || member.id} className="dept-faculty-wrapper">
                      <Link
                        to={`/staff/${member.slug || member.id}`}
                        className="no-underline block cursor-pointer h-full"
                        aria-label={`View profile of ${member.name}`}
                      >
                        <DepartmentCard
                          variant="faculty"
                          title={member.name}
                          role={member.designation}
                          imageUrl={member.photoUrl}
                          imageLabel={member.name ? member.name.substring(0, 2).toUpperCase() : 'STAFF MEMBER'}
                        />
                      </Link>
                    </div>
                  ))}
              </div>

            ) : (

              <div className="text-center py-[60px] text-[#9CA3AF] text-[14px]">
                No staff members found for this office.
              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}