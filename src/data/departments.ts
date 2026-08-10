export interface FacultyMemberData {
  id: string;
  name: string;
  designation: string;
  photoPlaceholder: string;
}

export interface ProgramData {
  id: string;
  title: string;
  subtitle: string;
  imageLabel: string;
}

export interface ResearchTeamMember {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  bio: string;
  photoPlaceholder: string;
}

export interface ResearchArea {
  title: string;
  description: string;
}

export const csPrograms: ProgramData[] = [
  {
    id: 'bscs',
    title: 'BS Computer Science',
    subtitle: '4 Years Undergraduate Program',
    imageLabel: 'PLACEHOLDER: BS CS IMAGE',
  },
  {
    id: 'mscs',
    title: 'MS Computer Science',
    subtitle: '2 Years Graduate Program',
    imageLabel: 'PLACEHOLDER: MS CS IMAGE',
  },
  {
    id: 'phdcs',
    title: 'PhD Computer Science',
    subtitle: 'Postgraduate Research Program',
    imageLabel: 'PLACEHOLDER: PHD CS IMAGE',
  },
];

export const sePrograms: ProgramData[] = [
  {
    id: 'bsse',
    title: 'BS Software Engineering',
    subtitle: '4 Years Undergraduate Program',
    imageLabel: 'PLACEHOLDER: BS SE IMAGE',
  },
  {
    id: 'msse',
    title: 'MS Software Engineering',
    subtitle: '2 Years Graduate Program',
    imageLabel: 'PLACEHOLDER: MS SE IMAGE',
  },
];

export const aidsPrograms: ProgramData[] = [
  {
    id: 'bsai',
    title: 'BS Artificial Intelligence',
    subtitle: '4 Years Undergraduate Program',
    imageLabel: 'PLACEHOLDER: BS AI IMAGE',
  },
  {
    id: 'bsds',
    title: 'BS Data Science',
    subtitle: '4 Years Undergraduate Program',
    imageLabel: 'PLACEHOLDER: BS DS IMAGE',
  },
];

export const csFaculty: FacultyMemberData[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `cs-fac-${i + 1}`,
  name: `Dr. PLACEHOLDER: CS Faculty ${i + 1}`,
  designation: i === 0 ? 'Professor & HOD' : i < 3 ? 'Associate Professor' : 'Assistant Professor',
  photoPlaceholder: `PLACEHOLDER: CS FACULTY PHOTO ${i + 1}`,
}));

export const seFaculty: FacultyMemberData[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `se-fac-${i + 1}`,
  name: `Dr. PLACEHOLDER: SE Faculty ${i + 1}`,
  designation: i === 0 ? 'Professor & HOD' : i < 3 ? 'Associate Professor' : 'Assistant Professor',
  photoPlaceholder: `PLACEHOLDER: SE FACULTY PHOTO ${i + 1}`,
}));

export const aidsFaculty: FacultyMemberData[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `aids-fac-${i + 1}`,
  name: `Dr. PLACEHOLDER: AI & DS Faculty ${i + 1}`,
  designation: i === 0 ? 'Professor & HOD' : i < 3 ? 'Associate Professor' : 'Assistant Professor',
  photoPlaceholder: `PLACEHOLDER: AI & DS FACULTY PHOTO ${i + 1}`,
}));

export const csResearchAreas: ResearchArea[] = [
  {
    title: 'Machine Learning and Computer Vision',
    description: 'PLACEHOLDER: Focuses on deep learning architectures, image processing, object detection, and automated visual analysis.',
  },
  {
    title: 'Natural Language Processing',
    description: 'PLACEHOLDER: Investigates computational linguistics, text mining, large language models, and Urdu/regional language processing.',
  },
  {
    title: 'Medical Image Processing',
    description: 'PLACEHOLDER: Applies intelligent diagnostic algorithms to medical imaging, MRI/CT segmentation, and healthcare analytics.',
  },
  {
    title: 'Information Security',
    description: 'PLACEHOLDER: Researches cryptography, network security protocols, threat detection, and secure software engineering.',
  },
  {
    title: 'Parallel and Distributed Computing',
    description: 'PLACEHOLDER: Explores high-performance computing, cloud infrastructure, distributed algorithms, and GPU acceleration.',
  },
  {
    title: 'Swarm Robotics',
    description: 'PLACEHOLDER: Develops multi-agent robotic coordination algorithms, autonomous navigation systems, and sensor networks.',
  },
];

export const csResearchTeam: ResearchTeamMember[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `res-team-${i + 1}`,
  name: `Dr. PLACEHOLDER: Lead Researcher ${i + 1}`,
  designation: i === 0 ? 'Group Convener / Associate Professor' : 'Assistant Professor / Senior Researcher',
  qualification: 'Ph.D. Computer Science',
  bio: 'PLACEHOLDER: Researcher bio and summary of international journal publications, research grants, and student thesis supervision in computing domains.',
  photoPlaceholder: `PLACEHOLDER: RESEARCHER PHOTO ${i + 1}`,
}));
