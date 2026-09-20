export interface EditorialMember {
  id: string;
  name: string;
  role: string;
  category: 'leadership' | 'chief_editor' | 'advisory' | 'member' | 'specialist';
  degrees?: string;
  department?: string;
  affiliation: string;
  subAffiliation?: string;
  location: string;
  initials: string;
  avatarBg?: string;
  email?: string;
  phone?: string;
  institutionalProfile?: string;
  orcid?: string;
  additionalRoles?: string[];
  researchFocus?: string[];
}

export interface Article {
  id: string;
  articleNumber: number;
  title: string;
  authors: string[];
  volume: number;
  issue: number;
  year: number;
  pages: string;
  driveLink: string;
  doi: string;
  abstract: string;
  keywords: string[];
  category: string;
  publishedDate: string;
  downloads?: number;
  views?: number;
}

export interface PolicyItem {
  id: string;
  number: number;
  title: string;
  slug: string;
  description: string;
  highlights: string[];
}

export interface ResearchDomain {
  id: string;
  title: string;
  description: string;
  topics: string[];
  icon: string;
}
