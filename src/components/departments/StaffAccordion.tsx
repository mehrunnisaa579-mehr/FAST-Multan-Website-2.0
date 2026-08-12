import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, User } from 'lucide-react';
import { adminOfficesList, initialStaffMembers } from '../../data/staffData';
import type { StaffMember } from '../../data/staffData';
import { cmsService } from '../../services/cmsService';

export default function StaffAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first accordion by default
  const [staffData, setStaffData] = useState<StaffMember[]>(initialStaffMembers);

  useEffect(() => {
    const fetchStaffData = async () => {
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

        // Merge CMS staff with initial placeholders per office so every office retains at least 6 cards
        const merged: StaffMember[] = [];
        adminOfficesList.forEach((office) => {
          const cmsForOffice = formatted.filter((s) => s.office === office.id && s.is_visible !== false);
          if (cmsForOffice.length > 0) {
            merged.push(...cmsForOffice);
          } else {
            const fallbackForOffice = initialStaffMembers.filter((s) => s.office === office.id);
            merged.push(...fallbackForOffice);
          }
        });
        setStaffData(merged);
      }
    };

    fetchStaffData();
  }, []);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-[1380px] mx-auto flex flex-col border border-[#DADADA] rounded-[4px] overflow-hidden text-left select-none">
      {adminOfficesList.map((group, index) => {
        const isOpen = openIndex === index;
        const panelId = `panel-${group.id}`;
        const buttonId = `button-${group.id}`;

        const officeMembers = staffData.filter((s) => s.office === group.id);

        return (
          <div key={group.id} className="border-b border-[#DADADA] last:border-b-0">
            <button
              id={buttonId}
              type="button"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full bg-[#F5F5F5] hover:bg-[#EAEAEA] transition-colors py-[14px] px-[20px] flex justify-between items-center text-left outline-none cursor-pointer border-none select-none"
            >
              <span className="text-[16px] font-bold text-[#333333]">
                {group.title}
              </span>
              <ChevronDown
                className={`w-[20px] h-[20px] text-[#555555] transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#0C71C3]' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="bg-white p-[20px] sm:p-[28px] border-t border-[#DADADA]"
              >
                {/* 3x2 Grid on Desktop (6 clickable cards per office) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[24px]">
                  {officeMembers.map((member) => (
                    <Link
                      key={member.slug || member.id}
                      to={`/staff/${member.slug || member.id}`}
                      className="bg-white border border-[#EAEAEA] rounded-[6px] p-[20px] flex flex-col items-center text-center shadow-xs card-hover-lift no-underline cursor-pointer group block"
                    >
                      {/* Photo / Placeholder Container */}
                      <div className="w-[120px] h-[150px] bg-[#F3F4F6] border border-[#E5E7EB] rounded-[4px] overflow-hidden flex items-center justify-center p-[6px] mb-[14px] shadow-xs group-hover:border-[#0093DD]">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-[2px]"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-[#9CA3AF]">
                            <User className="w-8 h-8 text-[#9CA3AF] group-hover:text-[#0093DD] transition-colors" />
                            <span className="text-[9px] font-bold tracking-wider uppercase text-[#888888]">
                              PHOTO
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Staff Name */}
                      <h4 className="text-[15px] font-bold text-[#333333] group-hover:text-[#0093DD] transition-colors leading-snug">
                        {member.name}
                      </h4>

                      {/* Designation */}
                      <p className="text-[13px] font-medium text-[#666666] mt-[4px]">
                        {member.designation}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
