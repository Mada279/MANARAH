export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationIds: string[];
  createdAt: string;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  type: string;
  country?: string;
  city?: string;
  description?: string;
  status: string;
  createdAt: string;
};

export type OrganizationDashboard = {
  programs: number;
  beneficiaries: number;
  volunteers: number;
  volunteerHours: number;
  documents: number;
  metrics: number;
};

export type Program = {
  id: string;
  organizationId: string;
  name: string;
  manager: string;
  category?: string;
  status: string;
  progress: number;
  beneficiaries: number;
  volunteers: number;
  createdAt: string;
};

export type Beneficiary = {
  id: string;
  organizationId: string;
  programId?: string;
  program: string;
  name: string;
  city?: string;
  ageGroup?: string;
  status: string;
  createdAt: string;
};

export type Volunteer = {
  id: string;
  organizationId: string;
  programId?: string;
  program: string;
  name: string;
  skill?: string;
  totalHours: number;
  status: string;
  createdAt: string;
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
};

type ApiResponse<T> = {
  data: T;
};

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:4000';

function getAuthToken() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem('manarah_auth_token');
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function login(email = 'admin@manarah.local') {
  const response = await request<ApiResponse<{ token: string; user: User; organizations: Organization[] }>>(
    '/api/v1/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    },
  );
  return response.data;
}

export async function getCurrentUser() {
  const response = await request<ApiResponse<{ user: User; organizations: Organization[] }>>('/api/v1/me');
  return response.data;
}

export async function getOrganizations() {
  const response = await request<ApiResponse<Organization[]>>('/api/v1/organizations');
  return response.data;
}

export async function getOrganizationDashboard(organizationId: string) {
  const response = await request<ApiResponse<OrganizationDashboard>>(
    `/api/v1/organizations/${organizationId}/dashboard`,
  );
  return response.data;
}

export async function createOrganization(input: Pick<Organization, 'name' | 'slug' | 'type'> & {
  country?: string;
  city?: string;
  description?: string;
}) {
  const response = await request<ApiResponse<Organization>>('/api/v1/organizations', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return response.data;
}

export async function getPrograms(organizationId: string) {
  const response = await request<ApiResponse<Program[]>>(
    `/api/v1/organizations/${organizationId}/programs`,
  );
  return response.data;
}

export async function createProgram(
  organizationId: string,
  input: Pick<Program, 'name' | 'manager'> & Partial<Pick<Program, 'category' | 'status' | 'progress'>>,
) {
  const response = await request<ApiResponse<Program>>(
    `/api/v1/organizations/${organizationId}/programs`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );
  return response.data;
}

export async function getBeneficiaries(organizationId: string) {
  const response = await request<ApiResponse<Beneficiary[]>>(
    `/api/v1/organizations/${organizationId}/beneficiaries`,
  );
  return response.data;
}

export async function createBeneficiary(
  organizationId: string,
  input: Pick<Beneficiary, 'name'> & Partial<Pick<Beneficiary, 'programId' | 'city' | 'ageGroup' | 'status'>>,
) {
  const response = await request<ApiResponse<Beneficiary>>(
    `/api/v1/organizations/${organizationId}/beneficiaries`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );
  return response.data;
}

export async function getVolunteers(organizationId: string) {
  const response = await request<ApiResponse<Volunteer[]>>(
    `/api/v1/organizations/${organizationId}/volunteers`,
  );
  return response.data;
}

export async function createVolunteer(
  organizationId: string,
  input: Pick<Volunteer, 'name'> & Partial<Pick<Volunteer, 'programId' | 'skill' | 'totalHours' | 'status'>>,
) {
  const response = await request<ApiResponse<Volunteer>>(
    `/api/v1/organizations/${organizationId}/volunteers`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );
  return response.data;
}

export async function getImpactMetrics(organizationId: string) {
  const response = await request<ApiResponse<ImpactMetric[]>>(
    `/api/v1/organizations/${organizationId}/impact-metrics`,
  );
  return response.data;
}

export async function createImpactMetric(
  organizationId: string,
  input: Pick<ImpactMetric, 'name' | 'key' | 'unit'> &
    Partial<Pick<ImpactMetric, 'programId' | 'current' | 'target'>>,
) {
  const response = await request<ApiResponse<ImpactMetric>>(
    `/api/v1/organizations/${organizationId}/impact-metrics`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );
  return response.data;
}

export async function updateProgram(
  organizationId: string,
  programId: string,
  input: Partial<Pick<Program, 'name' | 'manager' | 'category' | 'status' | 'progress'>>,
) {
  const response = await request<ApiResponse<Program>>(
    `/api/v1/organizations/${organizationId}/programs/${programId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  );
  return response.data;
}

export async function deleteProgram(organizationId: string, programId: string) {
  await request<void>(`/api/v1/organizations/${organizationId}/programs/${programId}`, {
    method: 'DELETE',
  });
}

export async function updateBeneficiary(
  organizationId: string,
  beneficiaryId: string,
  input: Partial<Pick<Beneficiary, 'name' | 'programId' | 'city' | 'ageGroup' | 'status'>>,
) {
  const response = await request<ApiResponse<Beneficiary>>(
    `/api/v1/organizations/${organizationId}/beneficiaries/${beneficiaryId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  );
  return response.data;
}

export async function deleteBeneficiary(organizationId: string, beneficiaryId: string) {
  await request<void>(`/api/v1/organizations/${organizationId}/beneficiaries/${beneficiaryId}`, {
    method: 'DELETE',
  });
}

export async function updateVolunteer(
  organizationId: string,
  volunteerId: string,
  input: Partial<Pick<Volunteer, 'name' | 'programId' | 'skill' | 'totalHours' | 'status'>>,
) {
  const response = await request<ApiResponse<Volunteer>>(
    `/api/v1/organizations/${organizationId}/volunteers/${volunteerId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  );
  return response.data;
}

export async function deleteVolunteer(organizationId: string, volunteerId: string) {
  await request<void>(`/api/v1/organizations/${organizationId}/volunteers/${volunteerId}`, {
    method: 'DELETE',
  });
}

export async function updateImpactMetric(
  organizationId: string,
  metricId: string,
  input: Partial<Pick<ImpactMetric, 'name' | 'key' | 'unit' | 'programId' | 'current' | 'target'>>,
) {
  const response = await request<ApiResponse<ImpactMetric>>(
    `/api/v1/organizations/${organizationId}/impact-metrics/${metricId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  );
  return response.data;
}

export async function deleteImpactMetric(organizationId: string, metricId: string) {
  await request<void>(`/api/v1/organizations/${organizationId}/impact-metrics/${metricId}`, {
    method: 'DELETE',
  });
}

export async function resetPrototypeStore() {
  const response = await request<ApiResponse<{ ok: boolean; message: string }>>('/api/v1/dev/reset-store', {
    method: 'POST',
  });
  return response.data;
}

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

export async function getAuditLogs(organizationId: string, limit = 50) {
  const response = await request<ApiResponse<AuditLog[]>>(
    `/api/v1/organizations/${organizationId}/audit-logs?limit=${limit}`,
  );
  return response.data;
}

export type EducationSummary = {
  classes: number;
  schoolClasses: number;
  quranClasses: number;
  students: number;
  staff: number;
  averageAcademicProgress: number;
  averageQuranPages: number;
  attendanceRate: number;
  income: number;
  expenses: number;
  balance: number;
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
};

export type Student = {
  id: string;
  organizationId: string;
  classId?: string;
  className?: string;
  name: string;
  guardianName?: string;
  track: 'school' | 'quran' | 'hybrid';
  academicProgress: number;
  quranMemorizedPages: number;
  attendanceRate: number;
  tuitionStatus: 'paid' | 'partial' | 'due' | 'scholarship';
  status: string;
  createdAt: string;
};

export type StaffMember = {
  id: string;
  organizationId: string;
  name: string;
  role: string;
  department: string;
  salary: number;
  status: string;
  createdAt: string;
};

export type FinanceEntry = {
  id: string;
  organizationId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
};

export async function getEducationSummary(organizationId: string) {
  const response = await request<ApiResponse<EducationSummary>>(
    `/api/v1/organizations/${organizationId}/education/summary`,
  );
  return response.data;
}

export async function getEducationClasses(organizationId: string) {
  const response = await request<ApiResponse<EducationClass[]>>(
    `/api/v1/organizations/${organizationId}/education/classes`,
  );
  return response.data;
}

export async function createEducationClass(
  organizationId: string,
  input: Omit<EducationClass, 'id' | 'organizationId' | 'createdAt'>,
) {
  const response = await request<ApiResponse<EducationClass>>(
    `/api/v1/organizations/${organizationId}/education/classes`,
    { method: 'POST', body: JSON.stringify(input) },
  );
  return response.data;
}

export async function getStudents(organizationId: string) {
  const response = await request<ApiResponse<Student[]>>(
    `/api/v1/organizations/${organizationId}/education/students`,
  );
  return response.data;
}

export async function createStudent(
  organizationId: string,
  input: Omit<Student, 'id' | 'organizationId' | 'createdAt' | 'className'>,
) {
  const response = await request<ApiResponse<Student>>(
    `/api/v1/organizations/${organizationId}/education/students`,
    { method: 'POST', body: JSON.stringify(input) },
  );
  return response.data;
}

export async function getStaffMembers(organizationId: string) {
  const response = await request<ApiResponse<StaffMember[]>>(
    `/api/v1/organizations/${organizationId}/education/staff`,
  );
  return response.data;
}

export async function createStaffMember(
  organizationId: string,
  input: Omit<StaffMember, 'id' | 'organizationId' | 'createdAt'>,
) {
  const response = await request<ApiResponse<StaffMember>>(
    `/api/v1/organizations/${organizationId}/education/staff`,
    { method: 'POST', body: JSON.stringify(input) },
  );
  return response.data;
}

export async function getFinanceEntries(organizationId: string) {
  const response = await request<ApiResponse<FinanceEntry[]>>(
    `/api/v1/organizations/${organizationId}/education/finance`,
  );
  return response.data;
}

export async function createFinanceEntry(
  organizationId: string,
  input: Omit<FinanceEntry, 'id' | 'organizationId' | 'createdAt'>,
) {
  const response = await request<ApiResponse<FinanceEntry>>(
    `/api/v1/organizations/${organizationId}/education/finance`,
    { method: 'POST', body: JSON.stringify(input) },
  );
  return response.data;
}

export type EducationReport = {
  title: string;
  generatedAt: string;
  summary: EducationSummary;
  highlights: string[];
  risks: string[];
  recommendations: string[];
  financialNotes: string[];
};

export async function getEducationReport(organizationId: string) {
  const response = await request<ApiResponse<EducationReport>>(
    `/api/v1/organizations/${organizationId}/education/reports/summary`,
  );
  return response.data;
}

export type StudentReport = {
  title: string;
  generatedAt: string;
  student: Student;
  classInfo?: EducationClass;
  alerts: string[];
  recommendations: string[];
  progress: {
    academicProgress: number;
    quranMemorizedPages: number;
    attendanceRate: number;
    tuitionStatus: Student['tuitionStatus'];
  };
};

export async function getStudentReport(organizationId: string, studentId: string) {
  const response = await request<ApiResponse<StudentReport>>(
    `/api/v1/organizations/${organizationId}/education/students/${studentId}/report`,
  );
  return response.data;
}

export type BoardingSummary = {
  residents: number;
  rooms: number;
  averageTarbiyahScore: number;
  averageSupervisionScore: number;
  averageQuranRevisionScore: number;
  healthAlerts: number;
  parentVisibleReports: number;
  boysOnly: true;
  girlsBoardingSupported: false;
};

export type BoardingResident = {
  id: string;
  organizationId: string;
  studentId: string;
  studentName: string;
  className: string;
  track: 'school' | 'quran' | 'hybrid';
  room: string;
  supervisorName: string;
  tarbiyahScore: number;
  supervisionScore: number;
  quranRevisionScore: number;
  academicProgress: number;
  quranMemorizedPages: number;
  attendanceRate: number;
  healthStatus: 'good' | 'watch' | 'needs_attention';
  notes?: string;
  parentVisible: boolean;
  createdAt: string;
};

export type BoardingReport = {
  title: string;
  generatedAt: string;
  summary: BoardingSummary;
  highlights: string[];
  supervisionNotes: string[];
  tarbiyahRecommendations: string[];
  parentVisibilityPolicy: string;
};

export type ParentStudentResults = {
  studentName: string;
  className: string;
  academicProgress: number;
  quranMemorizedPages: number;
  attendanceRate: number;
  tuitionStatus: Student['tuitionStatus'];
  publicRecommendations: string[];
  internalBoardingDetailsHidden: true;
};

export async function getBoardingSummary(organizationId: string) {
  const response = await request<ApiResponse<BoardingSummary>>(
    `/api/v1/organizations/${organizationId}/education/boarding/summary`,
  );
  return response.data;
}

export async function getBoardingResidents(organizationId: string) {
  const response = await request<ApiResponse<BoardingResident[]>>(
    `/api/v1/organizations/${organizationId}/education/boarding/residents`,
  );
  return response.data;
}

export async function createBoardingResident(
  organizationId: string,
  input: Pick<BoardingResident, 'studentId' | 'room' | 'supervisorName'> &
    Partial<Pick<BoardingResident, 'tarbiyahScore' | 'supervisionScore' | 'quranRevisionScore' | 'healthStatus' | 'notes' | 'parentVisible'>>,
) {
  const response = await request<ApiResponse<BoardingResident>>(
    `/api/v1/organizations/${organizationId}/education/boarding/residents`,
    { method: 'POST', body: JSON.stringify(input) },
  );
  return response.data;
}

export async function getBoardingReport(organizationId: string) {
  const response = await request<ApiResponse<BoardingReport>>(
    `/api/v1/organizations/${organizationId}/education/boarding/reports/summary`,
  );
  return response.data;
}

export async function getParentStudentResults(studentId: string) {
  const response = await request<ApiResponse<ParentStudentResults>>(
    `/api/v1/parent/students/${studentId}/results`,
  );
  return response.data;
}

export type BoardingCheckIn = {
  id: string;
  organizationId: string;
  residentId: string;
  residentName: string;
  room: string;
  supervisorName: string;
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
};

export async function getBoardingCheckIns(organizationId: string, residentId: string) {
  const response = await request<ApiResponse<BoardingCheckIn[]>>(
    `/api/v1/organizations/${organizationId}/education/boarding/residents/${residentId}/check-ins`,
  );
  return response.data;
}

export async function createBoardingCheckIn(
  organizationId: string,
  residentId: string,
  input: Omit<BoardingCheckIn, 'id' | 'organizationId' | 'residentId' | 'residentName' | 'room' | 'supervisorName' | 'createdAt'>,
) {
  const response = await request<ApiResponse<BoardingCheckIn>>(
    `/api/v1/organizations/${organizationId}/education/boarding/residents/${residentId}/check-ins`,
    { method: 'POST', body: JSON.stringify(input) },
  );
  return response.data;
}

export type BoardingMonthlyReport = {
  title: string;
  month: string;
  generatedAt: string;
  daysTracked: number;
  fajrAttendanceRate: number;
  quranSessionAttendanceRate: number;
  totalMemorizationPages: number;
  totalRevisionPages: number;
  averageBehaviorScore: number;
  averageCleanlinessScore: number;
  averageSleepDisciplineScore: number;
  healthAlerts: number;
  supervisorRecommendations: string[];
  parentSafeSummary: string[];
  internalNotesCount: number;
};

export async function getBoardingMonthlyReport(organizationId: string, month?: string) {
  const suffix = month ? `?month=${encodeURIComponent(month)}` : '';
  const response = await request<ApiResponse<BoardingMonthlyReport>>(
    `/api/v1/organizations/${organizationId}/education/boarding/reports/monthly${suffix}`,
  );
  return response.data;
}

export type BoardingSupervisorDashboard = {
  title: string;
  generatedAt: string;
  date: string;
  supervisorName?: string;
  students: BoardingResident[];
  todayCheckIns: BoardingCheckIn[];
  studentsWithoutTodayCheckIn: BoardingResident[];
  missingFajr: BoardingResident[];
  missingQuranSession: BoardingResident[];
  healthAttention: BoardingResident[];
  lowBehavior: BoardingResident[];
  lowCleanliness: BoardingResident[];
  lowSleepDiscipline: BoardingResident[];
  alerts: string[];
  quickRecommendations: string[];
};

export async function getBoardingSupervisorDashboard(
  organizationId: string,
  input?: { supervisorName?: string; date?: string },
) {
  const params = new URLSearchParams();
  if (input?.supervisorName) params.set('supervisorName', input.supervisorName);
  if (input?.date) params.set('date', input.date);
  const suffix = params.toString() ? `?${params}` : '';
  const response = await request<ApiResponse<BoardingSupervisorDashboard>>(
    `/api/v1/organizations/${organizationId}/education/boarding/supervisor-dashboard${suffix}`,
  );
  return response.data;
}
