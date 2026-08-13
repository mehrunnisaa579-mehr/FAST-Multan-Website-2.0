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
      { label: 'All Departments', href: '/departments' },
      {
        label: 'FAST School Of Computing',
        href: '/departments/computing',
        items: [
          {
            label: 'Department Of Computer Science',
            href: '/departments/computing/computer-science',
            items: [
              { label: 'Programs', href: '/departments/computing/computer-science/programs' },
              { label: 'Faculty', href: '/departments/computing/computer-science/faculty' },
              { label: 'Research Groups', href: '/departments/computing/computer-science/research-groups' },
            ],
          },
          {
            label: 'Department Of Software Engineering',
            href: '/departments/computing/software-engineering',
            items: [
              { label: 'Programs', href: '/departments/computing/software-engineering/programs' },
              { label: 'Faculty', href: '/departments/computing/software-engineering/faculty' },
            ],
          },
          {
            label: 'Department Of AI',
            href: '/departments/computing/ai-data-science',
            items: [
              { label: 'Programs', href: '/departments/computing/ai-data-science/programs' },
              { label: 'Faculty', href: '/departments/computing/ai-data-science/faculty' },
            ],
          },
        ],
      },
      {
        label: 'FAST School Of Management',
        href: '/departments/management',
        items: [
          { label: 'Programs', href: '/departments/management/programs' },
          { label: 'Faculty', href: '/departments/management/faculty' },
        ],
      },
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
      { label: 'Complaint Management System', href: '/services/complaint-management' },
      { label: 'FAST-NU Library', href: 'https://nu.insigniails.com/Library/Home', isExternal: true },
      { label: 'Gatepass Application', href: '/services/gatepass-application' },
      { label: 'FLEX', href: 'https://flexstudent.nu.edu.pk/Login', isExternal: true },
      { label: 'Career Services Office', href: '/services/career-services-office' },
      {
        label: 'Workshops',
        items: [
          { label: 'Summer Bootcamp 2026', href: '/edc/workshops/summer-bootcamp-2026' },
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
      { label: 'Disability & Accessibility Committee', href: '/useful-links/disability-accessibility' },
      { label: 'GEIAH', href: '/useful-links/geiah' },
      { label: 'Policies', href: 'https://nu.edu.pk/University/Policies', isExternal: true },
      { label: 'Student Guide Book', href: '/useful-links/student-guide-book' },
      { label: 'NUCES Brand Identity Guideline', href: '/useful-links/brand-identity-guideline' },
      { label: 'Academic Calendar', href: 'https://www.nu.edu.pk/Student/Calender', isExternal: true },
    ],
  },

];
