export interface LeadershipMember {
  role: string;
  name: string;
  photoPlaceholder: string;
}

export interface SocietyData {
  id: string;
  name: string;
  heroTitle: string;
  headingTitle: string;
  route: string;
  intro: string;
  instagramUrl: string;
  leadership: LeadershipMember[];
}

export const societiesData: Record<string, SocietyData> = {
  techsoc: {
    id: 'techsoc',
    name: 'TechSoc',
    heroTitle: 'TechSoc',
    headingTitle: 'TechSoc — Computing & Technology Society',
    route: '/campus/societies/techsoc',
    intro: 'PLACEHOLDER: The official introduction, purpose, activities, and achievements of TechSoc will be added here.',
    instagramUrl: 'https://www.instagram.com/techsoc.nu',
    leadership: [
      { role: 'Mentor', name: 'PLACEHOLDER: Mentor Name', photoPlaceholder: 'PLACEHOLDER: MENTOR PHOTO' },
      { role: 'President', name: 'PLACEHOLDER: President Name', photoPlaceholder: 'PLACEHOLDER: PRESIDENT PHOTO' },
      { role: 'Vice President', name: 'PLACEHOLDER: Vice President Name 1', photoPlaceholder: 'PLACEHOLDER: VICE PRESIDENT PHOTO 1' },
      { role: 'Vice President', name: 'PLACEHOLDER: Vice President Name 2', photoPlaceholder: 'PLACEHOLDER: VICE PRESIDENT PHOTO 2' },
    ],
  },
  fmm: {
    id: 'fmm',
    name: 'FMM',
    heroTitle: 'FMM',
    headingTitle: 'FMM — FAST Media Mavericks',
    route: '/campus/societies/fmm',
    intro: 'PLACEHOLDER: The official introduction, purpose, activities, and achievements of FMM will be added here.',
    instagramUrl: 'https://www.instagram.com/fastmediamavericks',
    leadership: [
      { role: 'Mentor', name: 'PLACEHOLDER: Mentor Name', photoPlaceholder: 'PLACEHOLDER: MENTOR PHOTO' },
      { role: 'President', name: 'PLACEHOLDER: President Name', photoPlaceholder: 'PLACEHOLDER: PRESIDENT PHOTO' },
      { role: 'Vice President', name: 'PLACEHOLDER: Vice President Name 1', photoPlaceholder: 'PLACEHOLDER: VICE PRESIDENT PHOTO 1' },
      { role: 'Vice President', name: 'PLACEHOLDER: Vice President Name 2', photoPlaceholder: 'PLACEHOLDER: VICE PRESIDENT PHOTO 2' },
    ],
  },
  figs: {
    id: 'figs',
    name: 'FIGS',
    heroTitle: 'FIGS',
    headingTitle: 'FIGS — FAST Innovation & Gaming Society',
    route: '/campus/societies/figs',
    intro: 'PLACEHOLDER: The official introduction, purpose, activities, and achievements of FIGS will be added here.',
    instagramUrl: 'https://www.instagram.com/figs_mtn',
    leadership: [
      { role: 'Mentor', name: 'PLACEHOLDER: Mentor Name', photoPlaceholder: 'PLACEHOLDER: MENTOR PHOTO' },
      { role: 'President', name: 'PLACEHOLDER: President Name', photoPlaceholder: 'PLACEHOLDER: PRESIDENT PHOTO' },
      { role: 'Vice President', name: 'PLACEHOLDER: Vice President Name 1', photoPlaceholder: 'PLACEHOLDER: VICE PRESIDENT PHOTO 1' },
      { role: 'Vice President', name: 'PLACEHOLDER: Vice President Name 2', photoPlaceholder: 'PLACEHOLDER: VICE PRESIDENT PHOTO 2' },
    ],
  },
  dhanak: {
    id: 'dhanak',
    name: 'Dhanak',
    heroTitle: 'Dhanak',
    headingTitle: 'Dhanak — Arts & Dramatic Society',
    route: '/campus/societies/dhanak',
    intro: 'PLACEHOLDER: The official introduction, purpose, activities, and achievements of Dhanak will be added here.',
    instagramUrl: 'https://www.instagram.com/dhanakfastmtn',
    leadership: [
      { role: 'Mentor', name: 'PLACEHOLDER: Mentor Name', photoPlaceholder: 'PLACEHOLDER: MENTOR PHOTO' },
      { role: 'President', name: 'PLACEHOLDER: President Name', photoPlaceholder: 'PLACEHOLDER: PRESIDENT PHOTO' },
      { role: 'Vice President', name: 'PLACEHOLDER: Vice President Name 1', photoPlaceholder: 'PLACEHOLDER: VICE PRESIDENT PHOTO 1' },
      { role: 'Vice President', name: 'PLACEHOLDER: Vice President Name 2', photoPlaceholder: 'PLACEHOLDER: VICE PRESIDENT PHOTO 2' },
    ],
  },
  bayaan: {
    id: 'bayaan',
    name: 'Bayaan',
    heroTitle: 'Bayaan',
    headingTitle: 'Bayaan — Debating & Literary Society',
    route: '/campus/societies/bayaan',
    intro: 'PLACEHOLDER: The official introduction, purpose, activities, and achievements of Bayaan will be added here.',
    instagramUrl: 'https://www.instagram.com/bayaan_fast',
    leadership: [
      { role: 'Mentor', name: 'PLACEHOLDER: Mentor Name', photoPlaceholder: 'PLACEHOLDER: MENTOR PHOTO' },
      { role: 'President', name: 'PLACEHOLDER: President Name', photoPlaceholder: 'PLACEHOLDER: PRESIDENT PHOTO' },
      { role: 'Vice President', name: 'PLACEHOLDER: Vice President Name 1', photoPlaceholder: 'PLACEHOLDER: VICE PRESIDENT PHOTO 1' },
      { role: 'Vice President', name: 'PLACEHOLDER: Vice President Name 2', photoPlaceholder: 'PLACEHOLDER: VICE PRESIDENT PHOTO 2' },
    ],
  },
};
