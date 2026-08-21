import type { StatConfig } from '../components/societies/SocietyStatsBanner';

export interface LeadershipMember {
  role: string;
  name: string;
  photoPlaceholder: string;
  photoUrl?: string;
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
  stats?: StatConfig[];
}

export const societiesData: Record<string, SocietyData> = {
  techsoc: {
    id: 'techsoc',
    name: 'TechSoc',
    heroTitle: 'TechSoc',
    headingTitle: 'TechSoc — Computing & Technology Society',
    route: '/campus/societies/techsoc',
    intro: 'The official computing and technology society of FAST-NUCES Multan Campus. TechSoc aims to foster innovation, software development skills, technical workshops, hackathons, and technology competitions for student developers.',
    instagramUrl: 'https://www.instagram.com/techsoc.nu',
    leadership: [
      { role: 'Mentor', name: 'Faculty Mentor', photoPlaceholder: 'MENTOR PHOTO' },
      { role: 'Co-Mentor', name: 'Co-Faculty Mentor', photoPlaceholder: 'CO-MENTOR PHOTO' },
      { role: 'President', name: 'Society President', photoPlaceholder: 'PRESIDENT PHOTO' },
    ],
    stats: [
      { label: 'Active Members', value: 150, suffix: '+' },
      { label: 'Events Hosted', value: 25, suffix: '+' },
      { label: 'Tech Workshops', value: 15, suffix: '+' },
    ],
  },
  fmm: {
    id: 'fmm',
    name: 'FMM',
    heroTitle: 'FMM',
    headingTitle: 'FMM — FAST Media Mavericks',
    route: '/campus/societies/fmm',
    intro: 'The official media and photography society of FAST-NUCES Multan Campus. FMM covers campus events, captures memorable student moments, produces digital media content, and leads video production initiatives.',
    instagramUrl: 'https://www.instagram.com/fastmediamavericks',
    leadership: [
      { role: 'Mentor', name: 'Faculty Mentor', photoPlaceholder: 'MENTOR PHOTO' },
      { role: 'Co-Mentor', name: 'Co-Faculty Mentor', photoPlaceholder: 'CO-MENTOR PHOTO' },
      { role: 'President', name: 'Society President', photoPlaceholder: 'PRESIDENT PHOTO' },
    ],
    stats: [
      { label: 'Media Members', value: 80, suffix: '+' },
      { label: 'Events Covered', value: 40, suffix: '+' },
      { label: 'Productions', value: 20, suffix: '+' },
    ],
  },
  figs: {
    id: 'figs',
    name: 'FIGS',
    heroTitle: 'FIGS',
    headingTitle: 'FIGS — FAST Innovation & Gaming Society',
    route: '/campus/societies/figs',
    intro: 'The official gaming, e-sports, and innovation society of FAST-NUCES Multan Campus. FIGS organizes competitive gaming tournaments, e-sports galas, hardware exhibitions, and creative technology showcases.',
    instagramUrl: 'https://www.instagram.com/figs_mtn',
    leadership: [
      { role: 'Mentor', name: 'Faculty Mentor', photoPlaceholder: 'MENTOR PHOTO' },
      { role: 'Co-Mentor', name: 'Co-Faculty Mentor', photoPlaceholder: 'CO-MENTOR PHOTO' },
      { role: 'President', name: 'Society President', photoPlaceholder: 'PRESIDENT PHOTO' },
    ],
    stats: [
      { label: 'Gamer Members', value: 120, suffix: '+' },
      { label: 'Tournaments', value: 18, suffix: '+' },
      { label: 'Innovations', value: 10, suffix: '+' },
    ],
  },
  dhanak: {
    id: 'dhanak',
    name: 'Dhanak',
    heroTitle: 'Dhanak',
    headingTitle: 'Dhanak — Arts & Dramatic Society',
    route: '/campus/societies/dhanak',
    intro: 'The official arts, drama, and cultural society of FAST-NUCES Multan Campus. Dhanak showcases creative artistic talents, theatrical performances, musical galas, and vibrant cultural festivities.',
    instagramUrl: 'https://www.instagram.com/dhanakfastmtn',
    leadership: [
      { role: 'Mentor', name: 'Faculty Mentor', photoPlaceholder: 'MENTOR PHOTO' },
      { role: 'Co-Mentor', name: 'Co-Faculty Mentor', photoPlaceholder: 'CO-MENTOR PHOTO' },
      { role: 'President', name: 'Society President', photoPlaceholder: 'PRESIDENT PHOTO' },
    ],
    stats: [
      { label: 'Artist Members', value: 90, suffix: '+' },
      { label: 'Performances', value: 30, suffix: '+' },
      { label: 'Exhibitions', value: 12, suffix: '+' },
    ],
  },
  bayaan: {
    id: 'bayaan',
    name: 'Bayaan',
    heroTitle: 'Bayaan',
    headingTitle: 'Bayaan — Debating & Literary Society',
    route: '/campus/societies/bayaan',
    intro: 'The official literary, debating, and public speaking society of FAST-NUCES Multan Campus. Bayaan empowers student voices through parliamentary debates, poetry recitations, writing competitions, and declamations.',
    instagramUrl: 'https://www.instagram.com/bayaan_fast',
    leadership: [
      { role: 'Mentor', name: 'Faculty Mentor', photoPlaceholder: 'MENTOR PHOTO' },
      { role: 'Co-Mentor', name: 'Co-Faculty Mentor', photoPlaceholder: 'CO-MENTOR PHOTO' },
      { role: 'President', name: 'Society President', photoPlaceholder: 'PRESIDENT PHOTO' },
    ],
    stats: [
      { label: 'Debater Members', value: 70, suffix: '+' },
      { label: 'Debates Hosted', value: 22, suffix: '+' },
      { label: 'Trophies Won', value: 14, suffix: '+' },
    ],
  },
};
