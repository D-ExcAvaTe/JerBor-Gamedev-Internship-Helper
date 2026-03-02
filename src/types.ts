export interface Tag {
  id: string;
  label: string;
  color: string;
  category: 'position' | 'workMode' | 'stipend';
  positionCategory?: 'programmer' | 'artist' | 'design' | 'other';
  count: number;
}

export interface ConfigCategory {
  id: string;
  label: string;
  tags: Tag[];
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  label: string;
  color: string;
  tags: Tag[];
}

export type AppStatus =
  | 'saved'
  | 'applied'
  | 'interviewing'
  | 'offered'
  | 'rejected';

export interface Internship {
  id: string;
  name: string;
  logoUrl: string;

  positions: string[];
  workMode: string[];

  stipend: 'paid' | 'unpaid';
  stipendAmount: string;

  location: string;

  deadline: string;
  deadlineLabel: string;
  daysLeft: string;

  status: 'Open' | 'Closed';

  requirements: string[];
  benefits: string[];

  workHours: string;
  email: string;

  contactUrl: string;
  jobPostUrl: string;

  notes: string;
}