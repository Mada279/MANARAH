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
