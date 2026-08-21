import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, User } from 'lucide-react';
import AboutPageHero from '../../components/about/AboutPageHero';
import { adminOfficesList, initialStaffMembers } from '../../data/staffData';
import type { StaffMember } from '../../data/staffData';
import { cmsService } from '../../services/cmsService';
import '../../styles/department-pages.css';

// ── Office label mapping (public display names → internal IDs) ──────────────
const PUBLIC_OFFICE_NAV = [
  { id: 'academic-office', label: 'Academic Office' },
  { id: 'admin-office', label: 'Admin Office' },
  { id: 'accounts-office', label: 'Account Office' },
  { id: 'engineering-labs', label: 'Engineering Labs' },
  { id: 'library', label: 'Library' },
  { id: 'qec', label: 'QEC' },
  { id: 'student-affairs', label: 'Student Affairs' },
  { id: 'it-networks', label: 'IT & Network' },
  { id: 'maintenance', label: 'Human Resources' },
] as const;

export default function AdministrationStaffPage() {
  // ── Hero CMS ──────────────────────────────────────────────────────────────
  const [heroTitle, setHeroTitle] = useState('Administration Staff');
  const [heroImageUrl, setHeroImageUrl] = useState<string | undefined>(
    undefined
  );

  // ── Staff data ────────────────────────────────────────────────────────────
  const [staffData, setStaffData] =
    useState<StaffMember[]>(initialStaffMembers);

  // ── Selected office ───────────────────────────────────────────────────────
  const [activeOfficeId, setActiveOfficeId] =
    useState<string>('academic-office');

  // ── Fetch hero + staff from CMS ───────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      // Hero
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

      // Staff members
      const dbStaff = await cmsService.getAdminStaff();

      if (dbStaff && dbStaff.length > 0) {
        const formatted: StaffMember[] = dbStaff.map((s: any) => ({
          id: s.id,
          slug: s.slug || s.id,
          name: s.name,
          designation: s.designation,
          office: s.office,
          photoUrl: s.photo_url || '',
          email: s.email || '',
          phone: s.phone || '',
          extension: s.extension || '',
          introduction: s.introduction || '',
          education: s.education || '',
          display_order: s.display_order || 1,
          is_visible: s.is_visible ?? true,
        }));

        // Per-office merge:
        // prefer CMS records, otherwise use placeholders
        const merged: StaffMember[] = [];

        adminOfficesList.forEach((office) => {
          const cmsForOffice = formatted.filter(
            (s) =>
              s.office === office.id &&
              s.is_visible !== false
          );

          if (cmsForOffice.length > 0) {
            merged.push(...cmsForOffice);
          } else {
            merged.push(
              ...initialStaffMembers.filter(
                (s) => s.office === office.id
              )
            );
          }
        });

        setStaffData(merged);
      }
    };

    fetchAll();
  }, []);

  // ── Visible staff for selected office ─────────────────────────────────────
  const visibleStaff = staffData.filter(
    (s) =>
      s.office === activeOfficeId &&
      s.is_visible !== false
  );

  const activeOfficeLabel =
    PUBLIC_OFFICE_NAV.find(
      (o) => o.id === activeOfficeId
    )?.label ?? 'Staff';

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
              {PUBLIC_OFFICE_NAV.map((office) => (

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

                    <Link
                      key={member.slug || member.id}
                      to={`/staff/${
                        member.slug || member.id
                      }`}
                      className="admin-staff-card"
                      aria-label={`View profile of ${member.name}`}
                    >

                      {/* Photo */}
                      <div className="admin-staff-card-photo">

                        {member.photoUrl ? (

                          <img
                            src={member.photoUrl}
                            alt={member.name}
                          />

                        ) : (

                          <User className="w-9 h-9 text-[#C4CDD6]" />

                        )}

                      </div>

                      {/* Name */}
                      <p className="admin-staff-card-name">
                        {member.name}
                      </p>

                      {/* Role */}
                      <p className="admin-staff-card-role">
                        {member.designation}
                      </p>

                    </Link>

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