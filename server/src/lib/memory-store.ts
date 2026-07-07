import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export type OrganizationType =
  | 'charity'
  | 'waqf'
  | 'school'
  | 'academy'
  | 'mosque'
  | 'community_center'
  | 'initiative'
  | 'other';

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'program_manager' | 'coordinator' | 'viewer';
  organizationIds: string[];
  createdAt: string;
};

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

export type Program = {
  id: string;
  organizationId: string;
  name: string;
  manager: string;
  category?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  progress: number;
  createdAt: string;
  updatedAt?: string;
};

export type Beneficiary = {
  id: string;
  organizationId: string;
  programId?: string;
  name: string;
  city?: string;
  ageGroup?: string;
  status: 'active' | 'follow_up' | 'completed' | 'archived';
  createdAt: string;
  updatedAt?: string;
};

export type Volunteer = {
  id: string;
  organizationId: string;
  programId?: string;
  name: string;
  skill?: string;
  totalHours: number;
  status: 'available' | 'assigned' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt?: string;
};

export type ImpactMetric = {
  id: string;
  organizationId: string;
  programId?: string;
  name: string;
  key: string;
  current: number;
  target: number;
  unit: string;
  createdAt: string;
  updatedAt?: string;
};

export type Store = {
  users: User[];
  organizations: Organization[];
  programs: Program[];
  beneficiaries: Beneficiary[];
  volunteers: Volunteer[];
  impactMetrics: ImpactMetric[];
};

const now = new Date().toISOString();

const defaultStore: Store = {
  users: [
    {
      id: 'user-admin',
      name: 'مدير منارة التجريبي',
      email: 'admin@manarah.local',
      role: 'owner',
      organizationIds: ['org-noor'],
      createdAt: now,
    },
    {
      id: 'user-viewer',
      name: 'مراجع منارة التجريبي',
      email: 'viewer@manarah.local',
      role: 'viewer',
      organizationIds: ['org-noor'],
      createdAt: now,
    },
  ],
  organizations: [
    {
      id: 'org-noor',
      name: 'مؤسسة النور المجتمعية',
      slug: 'noor-community',
      type: 'charity',
      country: 'EG',
      city: 'Cairo',
      description: 'مؤسسة تجريبية لاختبار Mishkat MVP.',
      status: 'active',
      createdAt: now,
    },
  ],
  programs: [
    {
      id: 'program-student-sponsorship',
      organizationId: 'org-noor',
      name: 'برنامج كفالة طالب علم',
      manager: 'فريق التعليم',
      category: 'education',
      status: 'active',
      progress: 78,
      createdAt: now,
    },
    {
      id: 'program-monthly-baskets',
      organizationId: 'org-noor',
      name: 'مبادرة السلال الشهرية',
      manager: 'فريق الإغاثة',
      category: 'relief',
      status: 'active',
      progress: 64,
      createdAt: now,
    },
    {
      id: 'program-volunteer-training',
      organizationId: 'org-noor',
      name: 'دورات تأهيل المتطوعين',
      manager: 'فريق المجتمع',
      category: 'community',
      status: 'active',
      progress: 91,
      createdAt: now,
    },
  ],
  beneficiaries: [
    {
      id: 'ben-ahmed',
      organizationId: 'org-noor',
      programId: 'program-student-sponsorship',
      name: 'أحمد محمد',
      city: 'القاهرة',
      ageGroup: 'youth',
      status: 'active',
      createdAt: now,
    },
    {
      id: 'ben-mariam',
      organizationId: 'org-noor',
      programId: 'program-volunteer-training',
      name: 'مريم خالد',
      city: 'الجيزة',
      ageGroup: 'adult',
      status: 'follow_up',
      createdAt: now,
    },
    {
      id: 'ben-family-284',
      organizationId: 'org-noor',
      programId: 'program-monthly-baskets',
      name: 'أسرة رقم 284',
      city: 'القاهرة',
      ageGroup: 'family',
      status: 'active',
      createdAt: now,
    },
  ],
  volunteers: [
    {
      id: 'vol-sara',
      organizationId: 'org-noor',
      programId: 'program-student-sponsorship',
      name: 'سارة علي',
      skill: 'تعليم',
      totalHours: 124,
      status: 'available',
      createdAt: now,
    },
    {
      id: 'vol-mahmoud',
      organizationId: 'org-noor',
      programId: 'program-monthly-baskets',
      name: 'محمود حسن',
      skill: 'لوجستيات',
      totalHours: 88,
      status: 'assigned',
      createdAt: now,
    },
    {
      id: 'vol-omar',
      organizationId: 'org-noor',
      programId: 'program-volunteer-training',
      name: 'عمر يوسف',
      skill: 'تحليل بيانات',
      totalHours: 46,
      status: 'available',
      createdAt: now,
    },
  ],
  impactMetrics: [
    {
      id: 'metric-beneficiaries',
      organizationId: 'org-noor',
      name: 'عدد المستفيدين',
      key: 'beneficiaries_count',
      current: 1248,
      target: 1600,
      unit: 'مستفيد',
      createdAt: now,
    },
    {
      id: 'metric-volunteer-hours',
      organizationId: 'org-noor',
      name: 'ساعات التطوع',
      key: 'volunteer_hours',
      current: 3640,
      target: 5000,
      unit: 'ساعة',
      createdAt: now,
    },
    {
      id: 'metric-documents',
      organizationId: 'org-noor',
      name: 'المستندات المؤرشفة',
      key: 'documents_archived',
      current: 42,
      target: 60,
      unit: 'مستند',
      createdAt: now,
    },
    {
      id: 'metric-impact-completeness',
      organizationId: 'org-noor',
      name: 'اكتمال مؤشرات الأثر',
      key: 'impact_metrics_completeness',
      current: 12,
      target: 12,
      unit: 'مؤشر',
      createdAt: now,
    },
  ],
};

const dataDir = process.env.DATA_DIR ?? path.join(process.cwd(), 'server', 'data');
const storePath = path.join(dataDir, 'manarah-store.json');

function cloneDefaultStore(): Store {
  return JSON.parse(JSON.stringify(defaultStore)) as Store;
}

function normalizeStore(store: Store): Store {
  store.users ??= [];
  store.organizations ??= [];
  store.programs ??= [];
  store.beneficiaries ??= [];
  store.volunteers ??= [];
  store.impactMetrics ??= [];

  for (const defaultUser of defaultStore.users) {
    if (!store.users.some((user) => user.email === defaultUser.email)) {
      store.users.push(defaultUser);
    }
  }

  for (const defaultOrganization of defaultStore.organizations) {
    if (!store.organizations.some((organization) => organization.id === defaultOrganization.id)) {
      store.organizations.push(defaultOrganization);
    }
  }

  return store;
}

function loadStore(): Store {
  try {
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    if (!existsSync(storePath)) {
      const initialStore = cloneDefaultStore();
      writeFileSync(storePath, JSON.stringify(initialStore, null, 2), 'utf8');
      return initialStore;
    }

    const loadedStore = normalizeStore(JSON.parse(readFileSync(storePath, 'utf8')) as Store);
    writeFileSync(storePath, JSON.stringify(loadedStore, null, 2), 'utf8');
    return loadedStore;
  } catch (error) {
    console.warn('Falling back to default in-memory store:', error);
    return cloneDefaultStore();
  }
}

export const store = loadStore();

export const users = store.users;
export const organizations = store.organizations;
export const programs = store.programs;
export const beneficiaries = store.beneficiaries;
export const volunteers = store.volunteers;
export const impactMetrics = store.impactMetrics;

export function saveStore() {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
}

export function resetStore() {
  const freshStore = cloneDefaultStore();

  users.splice(0, users.length, ...freshStore.users);
  organizations.splice(0, organizations.length, ...freshStore.organizations);
  programs.splice(0, programs.length, ...freshStore.programs);
  beneficiaries.splice(0, beneficiaries.length, ...freshStore.beneficiaries);
  volunteers.splice(0, volunteers.length, ...freshStore.volunteers);
  impactMetrics.splice(0, impactMetrics.length, ...freshStore.impactMetrics);

  saveStore();
}

export function findProgramName(programId?: string) {
  if (!programId) return 'غير مرتبط';
  return programs.find((program) => program.id === programId)?.name ?? 'برنامج غير معروف';
}

export function buildOrganizationDashboard(organizationId: string) {
  const organizationPrograms = programs.filter(
    (program) => program.organizationId === organizationId && program.status === 'active',
  );
  const organizationBeneficiaries = beneficiaries.filter(
    (beneficiary) => beneficiary.organizationId === organizationId,
  );
  const organizationVolunteers = volunteers.filter((volunteer) => volunteer.organizationId === organizationId);
  const organizationMetrics = impactMetrics.filter((metric) => metric.organizationId === organizationId);

  return {
    programs: organizationPrograms.length,
    beneficiaries: organizationBeneficiaries.length,
    volunteers: organizationVolunteers.length,
    volunteerHours: organizationVolunteers.reduce((total, volunteer) => total + volunteer.totalHours, 0),
    documents: organizationMetrics.find((metric) => metric.key === 'documents_archived')?.current ?? 0,
    metrics: organizationMetrics.length,
  };
}
