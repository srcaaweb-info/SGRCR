export interface EditorialMember {
  id: string;
  name: string;
  role: string; // Academic designation / institutional title
  editorialRole: string; // SGRCR role e.g. "Chairperson – SGRCR", "Chief Editor", "Chief Reviewer – SGRCR"
  category: 'leadership' | 'chief_editor' | 'chief_reviewer' | 'associate_editor' | 'section_editor' | 'advisory' | 'member' | 'specialist';
  groupTier: 'chairperson' | 'chief_editor' | 'chief_reviewer' | 'associate_editor' | 'section_editor' | 'advisory_international' | 'advisory_national' | 'editorial_member';
  serialNumber?: number;
  degrees?: string;
  department?: string;
  affiliation: string;
  subAffiliation?: string;
  location: string;
  officialPostalAddress?: string;
  initials: string;
  avatarBg?: string;
  email?: string;
  emails?: string[];
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
  pdfUrl: string; // Direct on-server / website PDF path (ISSN requirement compliance)
  fileSize?: string;
  pdfFileName?: string;
  driveLink?: string;
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
