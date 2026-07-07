export type OrganizationType =
  | 'charity'
  | 'waqf'
  | 'school'
  | 'academy'
  | 'mosque'
  | 'community_center'
  | 'initiative'
  | 'other';

export type Organization = {
  id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  country?: string;
  city?: string;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: string;
};

export const organizations: Organization[] = [
  {
    id: 'org-noor',
    name: 'مؤسسة النور المجتمعية',
    slug: 'noor-community',
    type: 'charity',
    country: 'EG',
    city: 'Cairo',
    description: 'مؤسسة تجريبية لاختبار Mishkat MVP.',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

export const dashboardByOrganizationId: Record<string, {
  programs: number;
  beneficiaries: number;
  volunteers: number;
  volunteerHours: number;
  documents: number;
  metrics: number;
}> = {
  'org-noor': {
    programs: 6,
    beneficiaries: 1248,
    volunteers: 86,
    volunteerHours: 3640,
    documents: 42,
    metrics: 12,
  },
};
