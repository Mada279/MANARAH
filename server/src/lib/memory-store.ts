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
      name: 'د. مالك بالدي',
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
      name: 'مؤسسة التميز التعليمية',
      slug: 'altamayuz-education',
      type: 'academy',
      country: 'متعدد المواقع',
      city: 'لابي / كنديا / كوندرا / القرية',
      description: 'مؤسسة تعليمية تجريبية يديرها د. مالك بالدي، وتشمل مدارس متعددة وقسم تحفيظ خارجي وداخلي.',
      status: 'active',
      createdAt: now,
    },
  ],
  programs: [
    {
      id: 'program-school-1-labi',
      organizationId: 'org-noor',
      name: 'مدرسة ١ - لابي',
      manager: 'د. مالك بالدي',
      category: 'school',
      status: 'active',
      progress: 86,
      createdAt: now,
    },
    {
      id: 'program-school-2-kindia',
      organizationId: 'org-noor',
      name: 'مدرسة ٢ - كنديا',
      manager: 'د. مالك بالدي',
      category: 'school',
      status: 'active',
      progress: 79,
      createdAt: now,
    },
    {
      id: 'program-school-3-kundara',
      organizationId: 'org-noor',
      name: 'مدرسة ٣ - كوندرا',
      manager: 'د. مالك بالدي',
      category: 'school',
      status: 'active',
      progress: 74,
      createdAt: now,
    },
    {
      id: 'program-quran-external-boys',
      organizationId: 'org-noor',
      name: 'قسم التحفيظ الخارجي - أولاد',
      manager: 'مشرف التحفيظ الخارجي',
      category: 'quran_external_boys',
      status: 'active',
      progress: 88,
      createdAt: now,
    },
    {
      id: 'program-quran-external-girls',
      organizationId: 'org-noor',
      name: 'قسم التحفيظ الخارجي - بنات',
      manager: 'مشرفة التحفيظ الخارجي',
      category: 'quran_external_girls',
      status: 'active',
      progress: 84,
      createdAt: now,
    },
    {
      id: 'program-quran-internal-boys',
      organizationId: 'org-noor',
      name: 'قسم التحفيظ الداخلي - بنين',
      manager: 'المشرف التربوي الداخلي',
      category: 'quran_internal_boys',
      status: 'active',
      progress: 81,
      createdAt: now,
    },
  ],
  beneficiaries: [
    {
      id: 'ben-labi-students',
      organizationId: 'org-noor',
      programId: 'program-school-1-labi',
      name: 'طلاب مدرسة ١ - لابي',
      city: 'لابي',
      ageGroup: 'school_students',
      status: 'active',
      createdAt: now,
    },
    {
      id: 'ben-quran-boys',
      organizationId: 'org-noor',
      programId: 'program-quran-external-boys',
      name: 'طلاب التحفيظ الخارجي - أولاد',
      city: 'القرية',
      ageGroup: 'quran_students',
      status: 'active',
      createdAt: now,
    },
    {
      id: 'ben-quran-girls',
      organizationId: 'org-noor',
      programId: 'program-quran-external-girls',
      name: 'طالبات التحفيظ الخارجي - بنات',
      city: 'القرية',
      ageGroup: 'quran_students',
      status: 'active',
      createdAt: now,
    },
  ],
  volunteers: [
    {
      id: 'vol-school-support',
      organizationId: 'org-noor',
      programId: 'program-school-1-labi',
      name: 'فريق دعم مدارس التميز',
      skill: 'إدارة مدرسية',
      totalHours: 124,
      status: 'assigned',
      createdAt: now,
    },
    {
      id: 'vol-quran-supervision',
      organizationId: 'org-noor',
      programId: 'program-quran-internal-boys',
      name: 'فريق إشراف الداخلي',
      skill: 'إشراف وتربية',
      totalHours: 156,
      status: 'assigned',
      createdAt: now,
    },
    {
      id: 'vol-parent-communication',
      organizationId: 'org-noor',
      programId: 'program-quran-external-girls',
      name: 'فريق تواصل أولياء الأمور',
      skill: 'متابعة وتقارير',
      totalHours: 64,
      status: 'available',
      createdAt: now,
    },
  ],
  impactMetrics: [
    {
      id: 'metric-students',
      organizationId: 'org-noor',
      name: 'عدد الطلاب والطالبات',
      key: 'students_count',
      current: 420,
      target: 600,
      unit: 'طالب/طالبة',
      createdAt: now,
    },
    {
      id: 'metric-quran-attendance',
      organizationId: 'org-noor',
      name: 'حضور حلقات التحفيظ',
      key: 'quran_attendance',
      current: 87,
      target: 95,
      unit: '%',
      createdAt: now,
    },
    {
      id: 'metric-education-progress',
      organizationId: 'org-noor',
      name: 'متوسط التقدم العلمي',
      key: 'education_progress',
      current: 82,
      target: 90,
      unit: '%',
      createdAt: now,
    },
    {
      id: 'metric-reports-completeness',
      organizationId: 'org-noor',
      name: 'اكتمال تقارير المتابعة',
      key: 'reports_completeness',
      current: 76,
      target: 100,
      unit: '%',
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
      id: 'class-school-1-labi',
      organizationId: 'org-noor',
      name: 'مدرسة ١ - لابي',
      track: 'school',
      level: 'مدرسة أساسية',
      teacherName: 'مدير المدرسة - لابي',
      room: 'لابي',
      studentsCount: 120,
      averageProgress: 84,
      createdAt: now,
    },
    {
      id: 'class-school-2-kindia',
      organizationId: 'org-noor',
      name: 'مدرسة ٢ - كنديا',
      track: 'school',
      level: 'مدرسة أساسية',
      teacherName: 'مدير المدرسة - كنديا',
      room: 'كنديا',
      studentsCount: 105,
      averageProgress: 80,
      createdAt: now,
    },
    {
      id: 'class-school-3-kundara',
      organizationId: 'org-noor',
      name: 'مدرسة ٣ - كوندرا',
      track: 'school',
      level: 'مدرسة أساسية',
      teacherName: 'مدير المدرسة - كوندرا',
      room: 'كوندرا',
      studentsCount: 95,
      averageProgress: 77,
      createdAt: now,
    },
    {
      id: 'class-quran-external-boys',
      organizationId: 'org-noor',
      name: 'التحفيظ الخارجي - أولاد',
      track: 'quran',
      level: 'خارجي',
      teacherName: 'محفظ قسم الأولاد الخارجي',
      room: 'القرية - خارجي أولاد',
      studentsCount: 48,
      averageProgress: 86,
      createdAt: now,
    },
    {
      id: 'class-quran-external-girls',
      organizationId: 'org-noor',
      name: 'التحفيظ الخارجي - بنات',
      track: 'quran',
      level: 'خارجي',
      teacherName: 'محفظة قسم البنات الخارجي',
      room: 'القرية - خارجي بنات',
      studentsCount: 44,
      averageProgress: 89,
      createdAt: now,
    },
    {
      id: 'class-quran-internal-boys',
      organizationId: 'org-noor',
      name: 'التحفيظ الداخلي - بنين',
      track: 'quran',
      level: 'داخلي بنين',
      teacherName: 'المشرف التربوي الداخلي',
      room: 'القرية - داخلي بنين',
      studentsCount: 28,
      averageProgress: 82,
      createdAt: now,
    },
  ],
  students: [
    {
      id: 'student-labi-1',
      organizationId: 'org-noor',
      classId: 'class-school-1-labi',
      name: 'آدم مالك',
      guardianName: 'مالك بالدي',
      track: 'school',
      academicProgress: 88,
      quranMemorizedPages: 18,
      attendanceRate: 96,
      tuitionStatus: 'paid',
      status: 'active',
      createdAt: now,
    },
    {
      id: 'student-yassin',
      organizationId: 'org-noor',
      classId: 'class-quran-internal-boys',
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
      id: 'student-girls-quran-1',
      organizationId: 'org-noor',
      classId: 'class-quran-external-girls',
      name: 'حفصة إبراهيم',
      guardianName: 'إبراهيم يوسف',
      track: 'quran',
      academicProgress: 93,
      quranMemorizedPages: 120,
      attendanceRate: 98,
      tuitionStatus: 'partial',
      status: 'active',
      createdAt: now,
    },
    {
      id: 'student-kindia-1',
      organizationId: 'org-noor',
      classId: 'class-school-2-kindia',
      name: 'مريم كنديا',
      guardianName: 'ولي أمر مريم',
      track: 'school',
      academicProgress: 81,
      quranMemorizedPages: 12,
      attendanceRate: 94,
      tuitionStatus: 'paid',
      status: 'active',
      createdAt: now,
    },
  ],
  staffMembers: [
    {
      id: 'staff-malik-baldi',
      organizationId: 'org-noor',
      name: 'د. مالك بالدي',
      role: 'supervisor',
      department: 'admin',
      salary: 0,
      status: 'active',
      createdAt: now,
    },
    {
      id: 'staff-school-labi',
      organizationId: 'org-noor',
      name: 'مدير مدرسة ١ - لابي',
      role: 'admin',
      department: 'school',
      salary: 8500,
      status: 'active',
      createdAt: now,
    },
    {
      id: 'staff-school-kindia',
      organizationId: 'org-noor',
      name: 'مدير مدرسة ٢ - كنديا',
      role: 'admin',
      department: 'school',
      salary: 8200,
      status: 'active',
      createdAt: now,
    },
    {
      id: 'staff-school-kundara',
      organizationId: 'org-noor',
      name: 'مدير مدرسة ٣ - كوندرا',
      role: 'admin',
      department: 'school',
      salary: 8000,
      status: 'active',
      createdAt: now,
    },
    {
      id: 'staff-quran-boys',
      organizationId: 'org-noor',
      name: 'مشرف التحفيظ الخارجي - أولاد',
      role: 'quran_teacher',
      department: 'quran',
      salary: 7000,
      status: 'active',
      createdAt: now,
    },
    {
      id: 'staff-quran-girls',
      organizationId: 'org-noor',
      name: 'مشرفة التحفيظ الخارجي - بنات',
      role: 'quran_teacher',
      department: 'quran',
      salary: 7000,
      status: 'active',
      createdAt: now,
    },
    {
      id: 'staff-accountant',
      organizationId: 'org-noor',
      name: 'مسؤول ماليات مؤسسة التميز',
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
      description: 'رسوم مدارس التميز - لابي وكنديا وكوندرا',
      date: now,
      createdAt: now,
    },
    {
      id: 'finance-donation-quran',
      organizationId: 'org-noor',
      type: 'income',
      category: 'donation',
      amount: 18000,
      description: 'دعم قسم التحفيظ الخارجي والداخلي',
      date: now,
      createdAt: now,
    },
    {
      id: 'finance-salaries-july',
      organizationId: 'org-noor',
      type: 'expense',
      category: 'salary',
      amount: 22000,
      description: 'رواتب المدارس والتحفيظ والموارد البشرية',
      date: now,
      createdAt: now,
    },
  ],
  boardingResidents: [
    {
      id: 'boarding-yassin',
      organizationId: 'org-noor',
      studentId: 'student-yassin',
      room: 'سكن البنين - القرية - غرفة ٣',
      supervisorName: 'المشرف التربوي للداخلي - قسم البنين',
      tarbiyahScore: 86,
      supervisionScore: 90,
      quranRevisionScore: 78,
      healthStatus: 'good',
      notes: 'طالب داخلي في قسم البنين بدار التحفيظ، تظهر لولي الأمر النتائج العامة فقط.',
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

  const removeObsoleteSeedIds = <T extends { id: string }>(items: T[], obsoleteIds: string[]) => {
    const obsolete = new Set(obsoleteIds);
    return items.filter((item) => !obsolete.has(item.id));
  };

  const upsertById = <T extends { id: string }>(items: T[], defaults: T[]) => {
    for (const defaultItem of defaults) {
      const existing = items.find((item) => item.id === defaultItem.id);
      if (existing) {
        Object.assign(existing, defaultItem);
      } else {
        items.push(defaultItem);
      }
    }
  };

  store.programs = removeObsoleteSeedIds(store.programs, [
    'program-student-sponsorship',
    'program-monthly-baskets',
    'program-volunteer-training',
  ]);
  store.beneficiaries = removeObsoleteSeedIds(store.beneficiaries, ['ben-ahmed', 'ben-mariam', 'ben-family-284']);
  store.volunteers = removeObsoleteSeedIds(store.volunteers, ['vol-sara', 'vol-mahmoud', 'vol-omar']);
  store.impactMetrics = removeObsoleteSeedIds(store.impactMetrics, [
    'metric-beneficiaries',
    'metric-volunteer-hours',
    'metric-documents',
    'metric-impact-completeness',
  ]);
  store.educationClasses = removeObsoleteSeedIds(store.educationClasses, [
    'class-grade-5-a',
    'class-quran-hifz-1',
    'class-quran-itqan',
  ]);
  store.students = removeObsoleteSeedIds(store.students, ['student-aya', 'student-malak']);
  store.staffMembers = removeObsoleteSeedIds(store.staffMembers, ['staff-mona', 'staff-khaled']);

  upsertById(store.users, defaultStore.users);
  upsertById(store.organizations, defaultStore.organizations);
  upsertById(store.programs, defaultStore.programs);
  upsertById(store.beneficiaries, defaultStore.beneficiaries);
  upsertById(store.volunteers, defaultStore.volunteers);
  upsertById(store.impactMetrics, defaultStore.impactMetrics);
  upsertById(store.educationClasses, defaultStore.educationClasses);
  upsertById(store.students, defaultStore.students);
  upsertById(store.staffMembers, defaultStore.staffMembers);
  upsertById(store.financeEntries, defaultStore.financeEntries);
  upsertById(store.boardingResidents, defaultStore.boardingResidents);
  upsertById(store.boardingCheckIns, defaultStore.boardingCheckIns);

  if (!store.auditLogs.some((item) => item.id === 'audit-initial')) {
    store.auditLogs.push(...defaultStore.auditLogs);
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
