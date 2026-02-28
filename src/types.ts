export interface Tag {
  id: string;
  label: string;
  color: string;
  icon?: string;
}

export interface ConfigCategory {
  id: string;
  label: string;
  tags: Tag[];
}

export interface Internship {
  id: string;
  name: string;
  logoUrl: string;
  positions: string[]; // เก็บเป็น Array ของ Tag ID
  workMode: string[];
  stipend: string;
  stipendAmount: string;
  location: string;
  deadline: string;
  status: 'Open' | 'Closed';
  requirements: string[];
  benefits: string[];
  contactUrl: string;
  notes: string;
}