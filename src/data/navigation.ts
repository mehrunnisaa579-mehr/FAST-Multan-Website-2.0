export interface NavSubItem {
  label: string;
  href?: string;
  isExternal?: boolean;
  items?: NavSubItem[];
}

export interface NavItem {
  label: string;
  href?: string;
  isExternal?: boolean;
  items?: NavSubItem[];
}

export interface ServiceItem {
  id: string;
  name: string;
  parent_id?: string | null;
  parent_name?: string | null;
  url: string;
  is_external?: boolean;
  display_order: number;
  is_active: boolean;
}

export const defaultServicesList: ServiceItem[] = [
  {
    id: 'fast-nu-library',
    name: 'FAST-NU Library',
    parent_id: null,
    parent_name: 'None',
    url: 'https://nu.insigniails.com/Library/Home',
    is_external: true,
    display_order: 1,
    is_active: true,
  },
  {
    id: 'flex',
    name: 'FLEX',
    parent_id: null,
    parent_name: 'None',
    url: 'https://flexstudent.nu.edu.pk/Login',
    is_external: true,
    display_order: 2,
    is_active: true,
  },

  {
    id: 'workshops',
    name: 'Workshops',
    parent_id: null,
    parent_name: 'None',
    url: '/edc/workshops/summer-bootcamp-2026',
    is_external: false,
    display_order: 4,
    is_active: true,
  },
  {
    id: 'complaint-management-system',
    name: 'Complaint Management System',
    parent_id: null,
    parent_name: 'None',
    url: '/services/complaint-management',
    is_external: false,
    display_order: 5,
    is_active: true,
  },
  {
    id: 'alumni',
    name: 'Alumni',
    parent_id: null,
    parent_name: 'None',
    url: 'https://nu.edu.pk/Alumni',
    is_external: true,
    display_order: 6,
    is_active: true,
  },
  {
    id: 'fan',
    name: 'FAN',
    parent_id: 'alumni',
    parent_name: 'Alumni',
    url: 'https://alumni.nu.edu.pk/',
    is_external: true,
    display_order: 1,
    is_active: true,
  },
];

export const navigationData: NavItem[] = [
  {
    label: 'ABOUT',
    items: [
      { label: 'Our Mission', href: '/about/mission' },
      { label: 'Campus Introduction', href: '/about/campus-introduction' },
      { label: 'Chancellor', href: 'https://nu.edu.pk/University/Chancellor', isExternal: true },
      { label: 'Board Of Trustees', href: 'https://nu.edu.pk/University/Trustees', isExternal: true },
      { label: 'Board Of Governors', href: 'https://nu.edu.pk/University/Governers', isExternal: true },
      { label: 'Officers', href: 'https://nu.edu.pk/University/Officers', isExternal: true },
      { label: 'Membership', href: 'https://nu.edu.pk/University/Membership', isExternal: true },
      { label: 'University Charter', href: '/about/university-charter' },
    ],
  },
  {
    label: 'DEPARTMENTS',
    items: [
      { label: 'Department Of Computer Science', href: '/departments/computer-science' },
      { label: 'Department Of Management Science', href: '/departments/management' },
      { label: 'Administration Staff', href: '/departments/administration-staff' },
    ],
  },
  {
    label: 'ADMISSIONS',
    items: [
      { label: 'Admission Schedule', href: 'https://nu.edu.pk/Admissions/Schedule', isExternal: true },
      { label: 'How To Apply', href: 'https://nu.edu.pk/Admissions/HowToApply', isExternal: true },
      { label: 'Eligibility Criteria', href: 'https://nu.edu.pk/Admissions/EligibilityCriteria', isExternal: true },
      { label: 'Scholarship', href: 'https://nu.edu.pk/Admissions/Scholarship', isExternal: true },
      { label: 'Test Pattern', href: 'https://nu.edu.pk/Admissions/TestPattern', isExternal: true },
      { label: 'Fee Structure', href: 'https://nu.edu.pk/Admissions/FeeStructure', isExternal: true },
    ],
  },
  {
    label: 'SERVICES',
    items: [
      { label: 'FAST-NU Library', href: 'https://nu.insigniails.com/Library/Home', isExternal: true },
      { label: 'FLEX', href: 'https://flexstudent.nu.edu.pk/Login', isExternal: true },
      {
        label: 'Workshops',
        items: [
          { label: 'Summer Bootcamp 2026', href: '/edc/workshops/summer-bootcamp-2026' },
        ],
      },
      { label: 'Complaint Management System', href: '/services/complaint-management' },
      {
        label: 'Alumni',
        href: 'https://nu.edu.pk/Alumni',
        isExternal: true,
        items: [
          { label: 'FAN', href: 'https://alumni.nu.edu.pk/', isExternal: true },
        ],
      },
    ],
  },
  {
    label: 'CAMPUS',
    items: [
      { label: 'Gallery', href: '/campus/gallery' },
      {
        label: 'Societies',
        items: [
          { label: 'TechSoc', href: '/campus/societies/techsoc' },
          { label: 'FMM', href: '/campus/societies/fmm' },
          { label: 'Figs', href: '/campus/societies/figs' },
          { label: 'Dhanak', href: '/campus/societies/dhanak' },
          { label: 'Bayaan', href: '/campus/societies/bayaan' },
        ],
      },
    ],
  },
  {
    label: 'USEFUL LINKS',
    items: [
      { label: 'News', href: '/news' },
      { label: 'Policies', href: 'https://nu.edu.pk/University/Policies', isExternal: true },
      { label: 'Student Guide Book', href: '/useful-links/student-guide-book' },
      { label: 'Academic Calendar', href: '/useful-links/academic-calendar' },
    ],
  },

];
