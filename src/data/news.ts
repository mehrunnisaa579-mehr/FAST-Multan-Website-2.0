export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author?: string;
  commentsCount?: string;
  image?: string;
}

export const newsPageOneData: NewsItem[] = [
  {
    id: 'news-1',
    title: 'PLACEHOLDER: Academic Announcement for Fall 2026',
    excerpt: 'PLACEHOLDER: A short summary of the official FAST-NUCES Multan Campus academic announcement will appear here detailing semester registration and orientation schedules.',
    date: 'August 10, 2026',
    author: 'FAST-NUCES Multan Campus',
    commentsCount: 'No Comments',
    image: 'PLACEHOLDER: NEWS IMAGE',
  },
  {
    id: 'news-2',
    title: 'PLACEHOLDER: Campus Research & Innovation Workshop',
    excerpt: 'PLACEHOLDER: A short summary of the official FAST-NUCES Multan Campus research workshop will appear here showcasing student and faculty achievements in artificial intelligence and computing.',
    date: 'August 5, 2026',
    author: 'FAST-NUCES Multan Campus',
    commentsCount: 'No Comments',
  },
  {
    id: 'news-3',
    title: 'PLACEHOLDER: Faculty & Staff Opportunity Announcement',
    excerpt: 'PLACEHOLDER: A short summary of the official FAST-NUCES Multan Campus faculty opportunity update will appear here specifying academic recruitment criteria and application procedures.',
    date: 'July 28, 2026',
    author: 'FAST-NUCES Multan Campus',
    commentsCount: 'No Comments',
    image: 'PLACEHOLDER: NEWS IMAGE',
  },
  {
    id: 'news-4',
    title: 'PLACEHOLDER: Student Affairs & Campus Life Update',
    excerpt: 'PLACEHOLDER: A short summary of the official FAST-NUCES Multan Campus student affairs update will appear here highlighting society activities, sports events, and campus community initiatives.',
    date: 'July 20, 2026',
    author: 'FAST-NUCES Multan Campus',
    commentsCount: 'No Comments',
  },
  {
    id: 'news-5',
    title: 'PLACEHOLDER: Industry Collaboration & Placement Drive',
    excerpt: 'PLACEHOLDER: A short summary of the official FAST-NUCES Multan Campus placement drive will appear here providing details on corporate partnerships and career development opportunities.',
    date: 'July 15, 2026',
    author: 'FAST-NUCES Multan Campus',
    commentsCount: 'No Comments',
    image: 'PLACEHOLDER: NEWS IMAGE',
  },
  {
    id: 'news-6',
    title: 'PLACEHOLDER: Department of Computing Seminar Series',
    excerpt: 'PLACEHOLDER: A short summary of the official FAST-NUCES Multan Campus computing seminar series will appear here featuring guest lectures from leading software engineering experts.',
    date: 'July 8, 2026',
    author: 'FAST-NUCES Multan Campus',
    commentsCount: 'No Comments',
  },
  {
    id: 'news-7',
    title: 'PLACEHOLDER: Annual Campus Sports & Cultural Festival',
    excerpt: 'PLACEHOLDER: A short summary of the official FAST-NUCES Multan Campus annual festival will appear here announcing dates, competition rules, and registration details for students.',
    date: 'July 1, 2026',
    author: 'FAST-NUCES Multan Campus',
    commentsCount: 'No Comments',
    image: 'PLACEHOLDER: NEWS IMAGE',
  },
];

export const newsPageTwoData: NewsItem[] = [
  {
    id: 'news-8',
    title: 'PLACEHOLDER: Graduate Thesis & Project Exhibition',
    excerpt: 'PLACEHOLDER: A short summary of the official FAST-NUCES Multan Campus graduate project exhibition will appear here highlighting innovative final year computer science projects.',
    date: 'June 25, 2026',
    author: 'FAST-NUCES Multan Campus',
    commentsCount: 'No Comments',
    image: 'PLACEHOLDER: NEWS IMAGE',
  },
  {
    id: 'news-9',
    title: 'PLACEHOLDER: School of Management Guest Speaker Session',
    excerpt: 'PLACEHOLDER: A short summary of the official FAST-NUCES Multan Campus management session will appear here detailing corporate leadership insights and business analytics trends.',
    date: 'June 18, 2026',
    author: 'FAST-NUCES Multan Campus',
    commentsCount: 'No Comments',
  },
  {
    id: 'news-10',
    title: 'PLACEHOLDER: National Programming Competition Achievements',
    excerpt: 'PLACEHOLDER: A short summary of the official FAST-NUCES Multan Campus programming team awards will appear here celebrating student success in national competitive coding contests.',
    date: 'June 10, 2026',
    author: 'FAST-NUCES Multan Campus',
    commentsCount: 'No Comments',
    image: 'PLACEHOLDER: NEWS IMAGE',
  },
  {
    id: 'news-11',
    title: 'PLACEHOLDER: Digital Library & E-Resource Expansion',
    excerpt: 'PLACEHOLDER: A short summary of the official FAST-NUCES Multan Campus library update will appear here announcing new international research journal subscriptions and digital resources.',
    date: 'May 30, 2026',
    author: 'FAST-NUCES Multan Campus',
    commentsCount: 'No Comments',
  },
  {
    id: 'news-12',
    title: 'PLACEHOLDER: Campus Quality Enhancement Cell Report',
    excerpt: 'PLACEHOLDER: A short summary of the official FAST-NUCES Multan Campus QEC report will appear here outlining academic audit results and quality assurance standards.',
    date: 'May 20, 2026',
    author: 'FAST-NUCES Multan Campus',
    commentsCount: 'No Comments',
    image: 'PLACEHOLDER: NEWS IMAGE',
  },
  {
    id: 'news-13',
    title: 'PLACEHOLDER: Community Outreach & Social Responsibility Drive',
    excerpt: 'PLACEHOLDER: A short summary of the official FAST-NUCES Multan Campus community outreach campaign will appear here describing student volunteer activities and societal impact.',
    date: 'May 10, 2026',
    author: 'FAST-NUCES Multan Campus',
    commentsCount: 'No Comments',
  },
];

export const recentNewsData = [
  { title: 'PLACEHOLDER: Academic Announcement for Fall 2026', date: 'August 10, 2026' },
  { title: 'PLACEHOLDER: Campus Research & Innovation Workshop', date: 'August 5, 2026' },
  { title: 'PLACEHOLDER: Faculty & Staff Opportunity Announcement', date: 'July 28, 2026' },
  { title: 'PLACEHOLDER: Student Affairs & Campus Life Update', date: 'July 20, 2026' },
];

export const categoriesData = [
  'Academic',
  'Campus Announcements',
  'Student Affairs',
  'Careers',
  'Research',
];

export const archivesData = [
  'August 2026',
  'July 2026',
  'June 2026',
  'May 2026',
  'April 2026',
  'March 2026',
  'February 2026',
  'January 2026',
  'December 2025',
  'November 2025',
];
