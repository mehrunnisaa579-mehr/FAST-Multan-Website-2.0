export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string;
  items?: NavSubItem[];
}

export const navigationData: NavItem[] = [
  {
    label: 'ABOUT',
    items: [
      { label: 'About FAST', href: '/about' },
      { label: 'Campus', href: '/campus' },
      { label: 'Director Message', href: '/director-message' },
    ],
  },
  {
    label: 'DEPARTMENTS',
    items: [
      { label: 'Departments', href: '/departments' },
      { label: 'Programs', href: '/programs' },
      { label: 'Faculty', href: '/faculty' },
    ],
  },
  {
    label: 'NEWS',
    href: '/news',
  },
  {
    label: 'ADMISSIONS',
    items: [
      { label: 'Undergraduate', href: '/admissions/undergraduate' },
      { label: 'Graduate', href: '/admissions/graduate' },
      { label: 'Fee Structure', href: '/admissions/fee-structure' },
      { label: 'Scholarships', href: '/admissions/scholarships' },
    ],
  },
  {
    label: 'SERVICES',
    items: [
      { label: 'Library', href: '/services/library' },
      { label: 'Career Services', href: '/services/career-services' },
      { label: 'Student Services', href: '/services/student-services' },
    ],
  },
  {
    label: 'CAMPUS',
    items: [
      { label: 'Societies', href: '/campus-life/societies' },
      { label: 'Events', href: '/campus-life/events' },
      { label: 'Gallery', href: '/campus-life/gallery' },
      { label: 'Facilities', href: '/campus-life/facilities' },
    ],
  },
  {
    label: 'USEFUL LINKS',
    items: [
      { label: 'Research Groups', href: '/research/research-groups' },
      { label: 'Publications', href: '/research/publications' },
      { label: 'Projects', href: '/research/projects' },
    ],
  },
  {
    label: 'EDC',
    href: '/edc',
  },
];
