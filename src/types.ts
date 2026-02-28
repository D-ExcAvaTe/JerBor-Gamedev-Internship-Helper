export interface Tag {
  id: string;
  label: string;
  color: string; // Base Hex Color
  category: 'position' | 'location' | 'workMode' | 'stipend';
  count: number; // สำหรับเช็กความนิยม
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
  positions: string[];
  workMode: string[];
  stipend: string;
  stipendAmount: string;
  location: string;
  deadline: string;
  status: 'Open' | 'Closed';
  requirements: string[];
  benefits: string[];
  contactUrl: string;
  jobPostUrl: string; // <--- เพิ่มตัวนี้
  notes: string;
}