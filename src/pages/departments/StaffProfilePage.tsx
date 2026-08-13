import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AboutPageHero from '../../components/about/AboutPageHero';
import { initialStaffMembers, adminOfficesList } from '../../data/staffData';
import type { StaffMember } from '../../data/staffData';
import { cmsService } from '../../services/cmsService';
import CmsImage from '../../components/ui/CmsImage';
import { Mail, Phone, PhoneCall, Building2, User, ArrowLeft } from 'lucide-react';
import '../../styles/department-pages.css';

export default function StaffProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [staff, setStaff] = useState<StaffMember | null>(null);

  useEffect(() => {
    const fetchStaffProfile = async () => {
      // Try fetching from CMS
      const cmsStaff = await cmsService.getAdminStaff();
      if (cmsStaff && cmsStaff.length > 0) {
        const found = cmsStaff.find((s: any) => s.slug === slug || s.id === slug);
        if (found) {
          setStaff({
            id: found.id,
            slug: found.slug || found.id,
            name: found.name,
            designation: found.designation,
            office: found.office,
            photoUrl: found.photo_url || '',
            email: found.email || '',
            phone: found.phone || '',
            extension: found.extension || '',
            introduction: found.introduction || '',
            education: found.education || '',
          });
          return;
        }
      }

      // Fallback
      const local = initialStaffMembers.find((s) => s.slug === slug);
      if (local) {
        setStaff(local);
      } else {
        // Generic fallback for unknown slugs
        setStaff({
          id: slug || 'staff-member',
          slug: slug || 'staff-member',
          name: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Staff Member Profile',
          designation: 'Administration Staff',
          office: 'admin-office',
          email: 'staff@multan.nu.edu.pk',
          phone: '+92 (61) 111-128-128',
          extension: '100',
          introduction: 'Staff member at FAST-NUCES Multan Campus dedicated to operational and student support services.',
          education: 'Bachelor / Master Degree',
        });
      }
    };

    fetchStaffProfile();
  }, [slug]);

  if (!staff) {
    return (
      <div className="dept-page-container">
        <AboutPageHero title="Staff Profile" />
        <div className="py-20 text-center text-gray-600">Loading staff profile...</div>
      </div>
    );
  }

  const officeObj = adminOfficesList.find((o) => o.id === staff.office);
  const officeTitle = officeObj ? officeObj.title : staff.office || 'Administration Office';

  return (
    <div className="dept-page-container text-left">
      <AboutPageHero title={staff.name} />

      <div className="w-full max-w-[1180px] mx-auto px-[20px] min-[700px]:px-[24px] py-[40px] min-[700px]:py-[50px] min-[1100px]:pt-[55px] min-[1100px]:pb-[85px]">
        {/* Back link */}
        <div className="mb-[24px]">
          <Link
            to="/departments/administration-staff"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#0093DD] hover:text-[#0C71C3] no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Administration Staff</span>
          </Link>
        </div>

        {/* Profile Card Container (2-Column Desktop Grid) */}
        <div className="flex flex-col md:flex-row gap-[32px] md:gap-[48px] items-start">
          {/* Left Column: Photograph & Personal Details */}
          <div className="w-full md:w-[320px] bg-white border border-[#EAEAEA] rounded-[8px] p-[24px] shadow-sm flex flex-col items-center text-center flex-shrink-0 card-hover-lift">
            {/* Photograph / Placeholder */}
            <div className={`w-[180px] h-[225px] rounded-[6px] overflow-hidden flex items-center justify-center mb-[18px] shadow-xs${staff.photoUrl ? '' : ' bg-white border border-[#E5E7EB] p-[4px]'}`}>
              <CmsImage
                src={staff.photoUrl}
                alt={staff.name}
                fallbackLabel="STAFF PHOTO"
                fit="cover"
              />
            </div>

            <h2 className="text-[20px] font-bold text-[#333333] leading-snug">{staff.name}</h2>
            <p className="text-[14px] font-bold text-[#0C71C3] mt-[4px]">{staff.designation}</p>

            <div className="w-full border-t border-[#F0F0F0] my-[16px]" />

            {/* Meta Row: Office, Email, Phone */}
            <div className="w-full space-y-[12px] text-left text-[14px]">
              <div className="flex items-center gap-[10px] text-[#555555]">
                <Building2 className="w-4 h-4 text-[#0093DD] flex-shrink-0" />
                <span>{officeTitle}</span>
              </div>

              {staff.email && (
                <div className="flex items-center gap-[10px] text-[#555555] break-all">
                  <Mail className="w-4 h-4 text-[#0093DD] flex-shrink-0" />
                  <a href={`mailto:${staff.email}`} className="hover:text-[#0093DD] transition-colors">
                    {staff.email}
                  </a>
                </div>
              )}

              {staff.phone && (
                <div className="flex items-center gap-[10px] text-[#555555]">
                  <Phone className="w-4 h-4 text-[#0093DD] flex-shrink-0" />
                  <span>{staff.phone}</span>
                </div>
              )}

              {staff.extension && (
                <div className="flex items-center gap-[10px] text-[#555555]">
                  <PhoneCall className="w-4 h-4 text-[#0093DD] flex-shrink-0" />
                  <span>Ext: {staff.extension}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Introduction & Education */}
          <div className="flex-1 w-full bg-white border border-[#EAEAEA] rounded-[8px] p-[28px] md:p-[36px] shadow-sm space-y-[28px]">
            {/* Introduction Section */}
            <div>
              <h3 className="text-[20px] font-bold text-[#0C71C3] uppercase mb-[12px] border-b border-[#EAEAEA] pb-[8px]">
                INTRODUCTION
              </h3>
              <p className="text-[15px] leading-[1.8] text-[#444444]">
                {staff.introduction ||
                  'No detailed introduction text provided yet for this staff member.'}
              </p>
            </div>

            {/* Education Section */}
            <div>
              <h3 className="text-[20px] font-bold text-[#0C71C3] uppercase mb-[12px] border-b border-[#EAEAEA] pb-[8px]">
                EDUCATION
              </h3>
              <p className="text-[15px] leading-[1.8] text-[#444444]">
                {staff.education || 'Bachelor Degree / Master Degree in relevant discipline.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
