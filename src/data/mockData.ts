import { ConfigCategory, Internship } from '../types';

export const mockConfig: ConfigCategory[] = [
  {
    id: 'position',
    label: 'Position',
    tags: [
      { id: 'pos_gamedev', label: 'Game Dev', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
      { id: 'pos_artist', label: '2D/3D Artist', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
      { id: 'pos_pm', label: 'Project Manager', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
      { id: 'pos_qa', label: 'QA Tester', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
      { id: 'pos_frontend', label: 'Frontend', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
      { id: 'pos_backend', label: 'Backend', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    ]
  },
  {
    id: 'workMode',
    label: 'Work Mode',
    tags: [
      { id: 'mode_onsite', label: 'Onsite', color: 'bg-zinc-700 text-zinc-300 border-zinc-600' },
      { id: 'mode_hybrid', label: 'Hybrid', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
      { id: 'mode_remote', label: 'Remote', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
    ]
  },
  {
    id: 'stipend',
    label: 'Stipend',
    tags: [
      { id: 'stipend_paid', label: 'Paid', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
      { id: 'stipend_unpaid', label: 'Unpaid', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
    ]
  }
];

export const mockInternships: Internship[] = [
  {
    id: '1',
    name: 'PixelForge Studios',
    logoUrl: 'https://picsum.photos/seed/pixelforge/100/100',
    positions: ['pos_gamedev', 'pos_artist'],
    workMode: ['mode_hybrid'],
    stipend: 'stipend_paid',
    stipendAmount: '15,000 THB/month',
    location: 'Sukhumvit, BKK',
    deadline: '2026-04-15T00:00:00Z',
    status: 'Open',
    requirements: ['Proficient in Unity and C#', 'Portfolio of previous game projects'],
    benefits: ['Free snacks and drinks', 'Flexible working hours'],
    contactUrl: 'https://example.com/apply/pixelforge',
    notes: 'Great place to learn Unity. Seniors are very helpful but expect crunch time near milestones.'
  },
  {
    id: '2',
    name: 'TechNova Solutions',
    logoUrl: 'https://picsum.photos/seed/technova/100/100',
    positions: ['pos_frontend', 'pos_backend'],
    workMode: ['mode_remote'],
    stipend: 'stipend_paid',
    stipendAmount: '12,000 THB/month',
    location: 'Remote',
    deadline: '2026-03-10T00:00:00Z',
    status: 'Open',
    requirements: ['React, TypeScript, Node.js', 'Basic understanding of REST APIs'],
    benefits: ['Work from anywhere', 'Monthly learning budget'],
    contactUrl: 'https://example.com/apply/technova',
    notes: 'Very modern tech stack. Good for independent learners.'
  },
  {
    id: '3',
    name: 'Creative Minds Agency',
    logoUrl: 'https://picsum.photos/seed/creativeminds/100/100',
    positions: ['pos_pm', 'pos_artist'],
    workMode: ['mode_onsite'],
    stipend: 'stipend_unpaid',
    stipendAmount: '0 THB',
    location: 'Ari, BKK',
    deadline: '2026-05-01T00:00:00Z',
    status: 'Open',
    requirements: ['Strong communication skills', 'Adobe Creative Suite'],
    benefits: ['Travel allowance', 'Company outings'],
    contactUrl: 'https://example.com/apply/creativeminds',
    notes: 'Fast-paced agency environment. Good for building a diverse portfolio.'
  },
  {
    id: '4',
    name: 'BugSquashers Inc.',
    logoUrl: 'https://picsum.photos/seed/bugsquashers/100/100',
    positions: ['pos_qa'],
    workMode: ['mode_hybrid'],
    stipend: 'stipend_paid',
    stipendAmount: '10,000 THB/month',
    location: 'Silom, BKK',
    deadline: '2026-02-28T00:00:00Z',
    status: 'Closed',
    requirements: ['Attention to detail', 'Familiarity with Jira'],
    benefits: ['Health insurance', 'Free lunch on Fridays'],
    contactUrl: 'https://example.com/apply/bugsquashers',
    notes: 'Structured QA processes. A bit corporate but stable.'
  },
  {
    id: '5',
    name: 'IndieQuest Games',
    logoUrl: 'https://picsum.photos/seed/indiequest/100/100',
    positions: ['pos_gamedev'],
    workMode: ['mode_remote'],
    stipend: 'stipend_paid',
    stipendAmount: '8,000 THB/month',
    location: 'Remote',
    deadline: '2026-06-30T00:00:00Z',
    status: 'Open',
    requirements: ['Godot Engine experience', 'Passion for indie games'],
    benefits: ['Revenue share potential', 'Very flexible'],
    contactUrl: 'https://example.com/apply/indiequest',
    notes: 'Small team, very passionate. You will wear many hats.'
  }
];
