export interface ScheduleRow {
  time: string;
  topic: string;
}

export interface SpeakerProfile {
  id: string;
  name: string;
  title: string;
  bio: string[];
}

export interface BootcampModule {
  id: string;
  title: string;
  description: string;
}

export interface HighlightEvent {
  id: string;
  title: string;
  subtext: string;
  description: string[];
  imageCount: number;
}

export const conferenceScheduleDay1: ScheduleRow[] = [
  { time: '08:30 AM - 09:30 AM', topic: 'Registration & Delegate Kit Distribution' },
  { time: '09:30 AM - 10:30 AM', topic: 'Opening Ceremony & Inaugural Address' },
  { time: '10:30 AM - 11:30 AM', topic: 'Keynote Session I: Emerging Trends in Computing' },
  { time: '11:30 AM - 12:00 PM', topic: 'Networking Tea Break' },
  { time: '12:00 PM - 01:30 PM', topic: 'Technical Track I: AI & Data Science Applications' },
  { time: '01:30 PM - 02:30 PM', topic: 'Prayer & Lunch Break' },
  { time: '02:30 PM - 04:00 PM', topic: 'Panel Discussion: Industry-Academia Collaboration' },
];

export const conferenceScheduleDay2: ScheduleRow[] = [
  { time: '09:00 AM - 10:00 AM', topic: 'Keynote Session II: Executive Leadership & Innovation' },
  { time: '10:00 AM - 11:30 AM', topic: 'Technical Track II: Software Engineering & Enterprise Solutions' },
  { time: '11:30 AM - 12:00 PM', topic: 'Networking Tea Break' },
  { time: '12:00 PM - 01:30 PM', topic: 'Poster Presentations & Innovation Showcase' },
  { time: '01:30 PM - 02:30 PM', topic: 'Prayer & Lunch Break' },
  { time: '02:30 PM - 03:30 PM', topic: 'Valedictory Session & Best Paper Awards' },
  { time: '03:30 PM - 04:30 PM', topic: 'Closing Ceremony & Certificate Distribution' },
];

export const conferenceSpeakers: SpeakerProfile[] = [
  {
    id: 'speaker-1',
    name: 'Dr. PLACEHOLDER: Speaker 1 Name',
    title: 'PLACEHOLDER: Chief Innovation Officer / University Professor',
    bio: [
      'PLACEHOLDER: A short introductory bio paragraph highlighting research contributions, professional achievements, and academic leadership in emerging technology domains.',
      'PLACEHOLDER: Additional background details regarding keynote addresses, international conference publications, and advisory roles in industry-academic forums.',
    ],
  },
  {
    id: 'speaker-2',
    name: 'Dr. PLACEHOLDER: Speaker 2 Name',
    title: 'PLACEHOLDER: Executive Director / Industry Strategist',
    bio: [
      'PLACEHOLDER: A short introductory bio paragraph highlighting corporate management expertise, executive development programs, and strategic organizational transformation.',
      'PLACEHOLDER: Additional background details regarding enterprise leadership workshops, consulting engagements, and national policy contributions.',
    ],
  },
  {
    id: 'speaker-3',
    name: 'Dr. PLACEHOLDER: Speaker 3 Name',
    title: 'PLACEHOLDER: Head of Research / Technical Specialist',
    bio: [
      'PLACEHOLDER: A short introductory bio paragraph detailing technical research focus, software engineering methodologies, and collaborative research initiatives.',
      'PLACEHOLDER: Additional background details regarding journal publications, student mentorship programs, and institutional development initiatives.',
    ],
  },
];

export const bootcampModules: BootcampModule[] = [
  {
    id: 'mod-1',
    title: 'PLACEHOLDER: Module 1 — Executive Leadership & Strategy',
    description: 'PLACEHOLDER: Overview of strategic decision-making, organizational leadership, and modern management frameworks.',
  },
  {
    id: 'mod-2',
    title: 'PLACEHOLDER: Module 2 — Data-Driven Business Analytics',
    description: 'PLACEHOLDER: Introduction to enterprise analytics, business intelligence tools, and data-informed decision strategies.',
  },
  {
    id: 'mod-3',
    title: 'PLACEHOLDER: Module 3 — Emerging Digital Technologies',
    description: 'PLACEHOLDER: Hands-on orientation on artificial intelligence applications, cloud computing, and digital transformation.',
  },
  {
    id: 'mod-4',
    title: 'PLACEHOLDER: Module 4 — Project Management & Agile Methods',
    description: 'PLACEHOLDER: Practical insights into agile project management, team execution, and professional delivery standards.',
  },
];

export const bootcampSchedule = [
  { day: 'Day 1', session: 'Foundation & Orientation', time: '09:00 AM - 04:00 PM' },
  { day: 'Day 2', session: 'Core Analytics & Interactive Workshop', time: '09:00 AM - 04:00 PM' },
  { day: 'Day 3', session: 'Technology Integration & Group Project', time: '09:00 AM - 04:00 PM' },
  { day: 'Day 4', session: 'Final Presentations & Certification', time: '09:00 AM - 02:00 PM' },
];

export const edcHighlightsData: HighlightEvent[] = [
  {
    id: 'highlight-1',
    title: 'PLACEHOLDER: EDC Highlight Event 1',
    subtext: 'PLACEHOLDER DATE | FAST-NUCES Multan Campus',
    description: [
      'PLACEHOLDER: A summary paragraph detailing the proceedings, participant engagement, and key outcomes of the executive development event hosted at FAST-NUCES Multan Campus.',
      'PLACEHOLDER: Additional context regarding guest speakers, workshop modules, certificate distribution, and participant feedback.',
    ],
    imageCount: 6,
  },
  {
    id: 'highlight-2',
    title: 'PLACEHOLDER: EDC Highlight Event 2',
    subtext: 'PLACEHOLDER DATE | FAST-NUCES Multan Campus',
    description: [
      'PLACEHOLDER: A summary paragraph detailing the proceedings, participant engagement, and key outcomes of the specialized training session conducted by industry experts.',
      'PLACEHOLDER: Additional details highlighting interactive discussions, case studies, and collaborative learning activities.',
    ],
    imageCount: 5,
  },
  {
    id: 'highlight-3',
    title: 'PLACEHOLDER: EDC Highlight Event 3',
    subtext: 'PLACEHOLDER DATE | FAST-NUCES Multan Campus',
    description: [
      'PLACEHOLDER: A summary paragraph detailing the proceedings, participant engagement, and key outcomes of the professional seminar organized at the Multan Campus.',
      'PLACEHOLDER: Additional information on closing remarks, networking opportunities, and future workshop announcements.',
    ],
    imageCount: 4,
  },
];
