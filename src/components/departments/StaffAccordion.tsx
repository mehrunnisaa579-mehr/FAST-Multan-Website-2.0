import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
}

const adminGroups: AccordionItem[] = [
  { id: 'admin-office', title: 'Admin Office' },
  { id: 'academic-office', title: 'Academic Office' },
  { id: 'accounts-office', title: 'Accounts Office' },
  { id: 'engineering-labs', title: 'Engineering Labs' },
  { id: 'qec', title: 'Quality Enhancement Cell' },
  { id: 'library', title: 'Library' },
  { id: 'maintenance', title: 'Maintenance and Workshop' },
  { id: 'student-affairs', title: 'Student Affairs' },
  { id: 'it-networks', title: 'IT and Networks' },
];

export default function StaffAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full max-w-[1380px] mx-auto flex flex-col border border-[#DADADA] rounded-[4px] overflow-hidden">
      {adminGroups.map((group, index) => {
        const isOpen = openIndex === index;
        const panelId = `panel-${group.id}`;
        const buttonId = `button-${group.id}`;

        return (
          <div key={group.id} className="border-b border-[#DADADA] last:border-b-0">
            <button
              id={buttonId}
              type="button"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full bg-[#F5F5F5] hover:bg-[#EAEAEA] transition-colors py-[12px] px-[16px] flex justify-between items-center text-left outline-none cursor-pointer border-none select-none"
            >
              <span className="text-[15px] font-semibold text-[#333333]">
                {group.title}
              </span>
              <ChevronDown
                className={`w-[18px] h-[18px] text-[#555555] transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#0C71C3]' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="bg-white p-[16px] sm:p-[20px] text-left border-t border-[#DADADA]"
              >
                <p className="text-[14px] sm:text-[15px] text-[#444444] leading-[1.6]">
                  PLACEHOLDER: Staff names, designations, contact details, and office information will be added here for {group.title}.
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
