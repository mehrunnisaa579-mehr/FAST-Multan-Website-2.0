export interface StaffMember {
  id: string;
  slug: string;
  name: string;
  designation: string;
  office: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  extension?: string;
  introduction?: string;
  education?: string;
  display_order?: number;
  is_visible?: boolean;
}

export const adminOfficesList = [
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

export const initialStaffMembers: StaffMember[] = adminOfficesList.flatMap((office) => {
  return Array.from({ length: 6 }).map((_, idx) => {
    const num = idx + 1;
    const slug = `${office.id}-staff-${num}`;
    return {
      id: slug,
      slug,
      name: `Staff Member ${num} (${office.title})`,
      designation: num === 1 ? 'Officer / Manager' : num === 2 ? 'Assistant Manager' : 'Staff Executive',
      office: office.id,
      photoUrl: '',
      email: `${slug}@multan.nu.edu.pk`,
      phone: '+92 (61) 111-128-128',
      extension: `10${num}`,
      introduction: `Staff Member ${num} is a valued member of the ${office.title} at FAST-NUCES Multan Campus, dedicated to operational excellence, administrative efficiency, and campus community support.`,
      education: 'Master Degree / Bachelor Degree in relevant field from a recognized university.',
      display_order: num,
      is_visible: true,
    };
  });
});
