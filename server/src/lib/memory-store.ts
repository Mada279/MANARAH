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
  role: 'owner' | 'admin' | 'program_manager' | 'coordinator' | 'viewer' | 'parent';
  organizationIds: string[];
  parentStudentIds?: string[];
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

export type AuditLog = {
  id: string;
  organizationId?: string;
  actorUserId?: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type EducationClass = {
  id: string;
  organizationId: string;
  name: string;
  track: 'school' | 'quran' | 'hybrid';
  level: string;
  teacherName: string;
  room?: string;
  studentsCount: number;
  averageProgress: number;
  createdAt: string;
  updatedAt?: string;
};

export type Student = {
  id: string;
  organizationId: string;
  classId?: string;
  name: string;
  guardianName?: string;
  track: 'school' | 'quran' | 'hybrid';
  academicProgress: number;
  quranMemorizedPages: number;
  attendanceRate: number;
  tuitionStatus: 'paid' | 'partial' | 'due' | 'scholarship';
  status: 'active' | 'follow_up' | 'graduated' | 'archived';
  createdAt: string;
  updatedAt?: string;
};

export type StaffMember = {
  id: string;
  organizationId: string;
  name: string;
  role: 'teacher' | 'quran_teacher' | 'admin' | 'accountant' | 'supervisor' | 'hr';
  department: 'school' | 'quran' | 'finance' | 'hr' | 'admin';
  salary: number;
  status: 'active' | 'on_leave' | 'inactive';
  createdAt: string;
  updatedAt?: string;
};

export type FinanceEntry = {
  id: string;
  organizationId: string;
  type: 'income' | 'expense';
  category: 'tuition' | 'donation' | 'salary' | 'operations' | 'books' | 'transport' | 'other';
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
};

export type BoardingResident = {
  id: string;
  organizationId: string;
  studentId: string;
  room: string;
  supervisorName: string;
  tarbiyahScore: number;
  supervisionScore: number;
  quranRevisionScore: number;
  healthStatus: 'good' | 'watch' | 'needs_attention';
  notes?: string;
  parentVisible: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type BoardingCheckIn = {
  id: string;
  organizationId: string;
  residentId: string;
  date: string;
  fajrPrayer: boolean;
  quranSession: boolean;
  memorizationPages: number;
  revisionPages: number;
  behaviorScore: number;
  cleanlinessScore: number;
  sleepDisciplineScore: number;
  healthStatus: 'good' | 'watch' | 'needs_attention';
  supervisorNote?: string;
  parentVisible: boolean;
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
  auditLogs: AuditLog[];
  educationClasses: EducationClass[];
  students: Student[];
  staffMembers: StaffMember[];
  financeEntries: FinanceEntry[];
  boardingResidents: BoardingResident[];
  boardingCheckIns: BoardingCheckIn[];
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
    {
      id: 'user-parent-yassin',
      name: 'ولي أمر ياسين أحمد',
      email: 'parent@manarah.local',
      role: 'parent',
      organizationIds: ['org-noor'],
      parentStudentIds: ['student-yassin'],
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
  auditLogs: [
    {
      id: 'audit-initial',
      organizationId: 'org-noor',
      actorUserId: 'user-admin',
      actorEmail: 'admin@manarah.local',
      action: 'store.seeded',
      entityType: 'system',
      entityId: 'default-store',
      metadata: { message: 'Initial MANARAH MVP seed data created' },
      createdAt: now,
    },
  ],
  educationClasses: [
    {
      id: 'class-grade-5-a',
      organizationId: 'org-noor',
      name: 'الصف الخامس - أ',
      track: 'school',
      level: 'ابتدائي',
      teacherName: 'أ. منى عبد الرحمن',
      room: 'A-105',
      studentsCount: 28,
      averageProgress: 84,
      createdAt: now,
    },
    {
      id: 'class-quran-hifz-1',
      organizationId: 'org-noor',
      name: 'حلقة حفظ جزء عم',
      track: 'quran',
      level: 'مبتدئ',
      teacherName: 'الشيخ خالد منصور',
      room: 'Q-01',
      studentsCount: 18,
      averageProgress: 72,
      createdAt: now,
    },
    {
      id: 'class-quran-itqan',
      organizationId: 'org-noor',
      name: 'حلقة الإتقان والمراجعة',
      track: 'quran',
      level: 'متقدم',
      teacherName: 'الشيخة فاطمة سالم',
      room: 'Q-03',
      studentsCount: 14,
      averageProgress: 91,
      createdAt: now,
    },
  ],
  students: [
    {
      id: 'student-aya',
      organizationId: 'org-noor',
      classId: 'class-grade-5-a',
      name: 'آية محمود',
      guardianName: 'محمود علي',
      track: 'school',
      academicProgress: 88,
      quranMemorizedPages: 22,
      attendanceRate: 96,
      tuitionStatus: 'paid',
      status: 'active',
      createdAt: now,
    },
    {
      id: 'student-yassin',
      organizationId: 'org-noor',
      classId: 'class-quran-hifz-1',
      name: 'ياسين أحمد',
      guardianName: 'أحمد حسن',
      track: 'quran',
      academicProgress: 74,
      quranMemorizedPages: 38,
      attendanceRate: 91,
      tuitionStatus: 'scholarship',
      status: 'active',
      createdAt: now,
    },
    {
      id: 'student-malak',
      organizationId: 'org-noor',
      classId: 'class-quran-itqan',
      name: 'ملك إبراهيم',
      guardianName: 'إبراهيم يوسف',
      track: 'hybrid',
      academicProgress: 93,
      quranMemorizedPages: 120,
      attendanceRate: 98,
      tuitionStatus: 'partial',
      status: 'active',
      createdAt: now,
    },
  ],
  staffMembers: [
    {
      id: 'staff-mona',
      organizationId: 'org-noor',
      name: 'أ. منى عبد الرحمن',
      role: 'teacher',
      department: 'school',
      salary: 8500,
      status: 'active',
      createdAt: now,
    },
    {
      id: 'staff-khaled',
      organizationId: 'org-noor',
      name: 'الشيخ خالد منصور',
      role: 'quran_teacher',
      department: 'quran',
      salary: 7000,
      status: 'active',
      createdAt: now,
    },
    {
      id: 'staff-accountant',
      organizationId: 'org-noor',
      name: 'أ. أحمد محاسب',
      role: 'accountant',
      department: 'finance',
      salary: 6500,
      status: 'active',
      createdAt: now,
    },
  ],
  financeEntries: [
    {
      id: 'finance-tuition-july',
      organizationId: 'org-noor',
      type: 'income',
      category: 'tuition',
      amount: 42000,
      description: 'مصروفات دراسية - يوليو',
      date: now,
      createdAt: now,
    },
    {
      id: 'finance-donation-quran',
      organizationId: 'org-noor',
      type: 'income',
      category: 'donation',
      amount: 18000,
      description: 'دعم حلقات التحفيظ',
      date: now,
      createdAt: now,
    },
    {
      id: 'finance-salaries-july',
      organizationId: 'org-noor',
      type: 'expense',
      category: 'salary',
      amount: 22000,
      description: 'رواتب المعلمين والإدارة',
      date: now,
      createdAt: now,
    },
  ],
  boardingResidents: [
    {
      id: 'boarding-yassin',
      organizationId: 'org-noor',
      studentId: 'student-yassin',
      room: 'غرفة 3 - مبنى البنين',
      supervisorName: 'المشرف التربوي أ. مصطفى',
      tarbiyahScore: 86,
      supervisionScore: 90,
      quranRevisionScore: 78,
      healthStatus: 'good',
      notes: 'طالب منتظم في السكن الداخلي وحلقة الحفظ، يحتاج زيادة ورد المراجعة.',
      parentVisible: true,
      createdAt: now,
    },
  ],
  boardingCheckIns: [
    {
      id: 'checkin-yassin-1',
      organizationId: 'org-noor',
      residentId: 'boarding-yassin',
      date: now,
      fajrPrayer: true,
      quranSession: true,
      memorizationPages: 2,
      revisionPages: 5,
      behaviorScore: 88,
      cleanlinessScore: 92,
      sleepDisciplineScore: 84,
      healthStatus: 'good',
      supervisorNote: 'حضور جيد للحلقة، يحتاج تثبيت ورد المراجعة قبل النوم.',
      parentVisible: false,
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
  store.auditLogs ??= [];
  store.educationClasses ??= [];
  store.students ??= [];
  store.staffMembers ??= [];
  store.financeEntries ??= [];
  store.boardingResidents ??= [];
  store.boardingCheckIns ??= [];

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

  for (const defaultClass of defaultStore.educationClasses) {
    if (!store.educationClasses.some((item) => item.id === defaultClass.id)) {
      store.educationClasses.push(defaultClass);
    }
  }

  for (const defaultStudent of defaultStore.students) {
    if (!store.students.some((item) => item.id === defaultStudent.id)) {
      store.students.push(defaultStudent);
    }
  }

  for (const defaultStaff of defaultStore.staffMembers) {
    if (!store.staffMembers.some((item) => item.id === defaultStaff.id)) {
      store.staffMembers.push(defaultStaff);
    }
  }

  for (const defaultEntry of defaultStore.financeEntries) {
    if (!store.financeEntries.some((item) => item.id === defaultEntry.id)) {
      store.financeEntries.push(defaultEntry);
    }
  }

  for (const defaultResident of defaultStore.boardingResidents) {
    if (!store.boardingResidents.some((item) => item.id === defaultResident.id)) {
      store.boardingResidents.push(defaultResident);
    }
  }

  for (const defaultCheckIn of defaultStore.boardingCheckIns) {
    if (!store.boardingCheckIns.some((item) => item.id === defaultCheckIn.id)) {
      store.boardingCheckIns.push(defaultCheckIn);
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
export const auditLogs = store.auditLogs;
export const educationClasses = store.educationClasses;
export const students = store.students;
export const staffMembers = store.staffMembers;
export const financeEntries = store.financeEntries;
export const boardingResidents = store.boardingResidents;
export const boardingCheckIns = store.boardingCheckIns;

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
  auditLogs.splice(0, auditLogs.length, ...freshStore.auditLogs);
  educationClasses.splice(0, educationClasses.length, ...freshStore.educationClasses);
  students.splice(0, students.length, ...freshStore.students);
  staffMembers.splice(0, staffMembers.length, ...freshStore.staffMembers);
  financeEntries.splice(0, financeEntries.length, ...freshStore.financeEntries);
  boardingResidents.splice(0, boardingResidents.length, ...freshStore.boardingResidents);
  boardingCheckIns.splice(0, boardingCheckIns.length, ...freshStore.boardingCheckIns);

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
