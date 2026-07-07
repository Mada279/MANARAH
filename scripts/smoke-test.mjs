const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:4000';

let authToken = null;

async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${options?.method ?? 'GET'} ${path} failed: ${response.status} ${body}`);
  }

  if (response.status === 204) return undefined;
  return response.json();
}

console.log(`Running Manarah API smoke test against ${API_BASE_URL}`);

const health = await request('/health');
console.log('✓ health', health.ok);

const unauthorized = await fetch(`${API_BASE_URL}/api/v1/organizations`);
if (unauthorized.status !== 401) {
  throw new Error(`Expected unauthorized organizations request to return 401, got ${unauthorized.status}`);
}
console.log('✓ protected organizations require token');

const viewerLogin = await request('/api/v1/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email: 'viewer@manarah.local' }),
});
authToken = viewerLogin.data.token;
console.log('✓ viewer login', viewerLogin.data.user.email);

const viewerOrganizations = await request('/api/v1/organizations');
const viewerOrganization = viewerOrganizations.data[0];
if (!viewerOrganization) throw new Error('Viewer has no organization');
console.log('✓ viewer can read organizations');

const viewerWrite = await fetch(`${API_BASE_URL}/api/v1/organizations/${viewerOrganization.id}/programs`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  },
  body: JSON.stringify({ name: 'Viewer Forbidden Program', manager: 'Smoke Test', progress: 1 }),
});
if (viewerWrite.status !== 403) {
  throw new Error(`Expected viewer write request to return 403, got ${viewerWrite.status}`);
}
console.log('✓ viewer writes are forbidden');

const parentLogin = await request('/api/v1/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email: 'parent@manarah.local' }),
});
authToken = parentLogin.data.token;
const parentResults = await request('/api/v1/parent/students/student-yassin/results');
if (!parentResults.data.internalBoardingDetailsHidden) {
  throw new Error('Parent results should hide internal boarding details');
}
console.log('✓ parent sees results only', parentResults.data.studentName);

const login = await request('/api/v1/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email: 'admin@manarah.local' }),
});
authToken = login.data.token;
console.log('✓ admin login', login.data.user.email);

const me = await request('/api/v1/me');
console.log('✓ me', me.data.user.email);

const organizations = await request('/api/v1/organizations');
const organization = organizations.data[0];
if (!organization) throw new Error('No organization returned');
console.log('✓ organization', organization.slug);

const program = await request(`/api/v1/organizations/${organization.id}/programs`, {
  method: 'POST',
  body: JSON.stringify({ name: `Smoke Program ${Date.now()}`, manager: 'Smoke Test', progress: 25 }),
});
console.log('✓ create program', program.data.id);

const beneficiary = await request(`/api/v1/organizations/${organization.id}/beneficiaries`, {
  method: 'POST',
  body: JSON.stringify({ name: `Smoke Beneficiary ${Date.now()}`, city: 'Cairo', programId: program.data.id }),
});
console.log('✓ create beneficiary', beneficiary.data.id);

const volunteer = await request(`/api/v1/organizations/${organization.id}/volunteers`, {
  method: 'POST',
  body: JSON.stringify({ name: `Smoke Volunteer ${Date.now()}`, skill: 'Testing', totalHours: 3, programId: program.data.id }),
});
console.log('✓ create volunteer', volunteer.data.id);

const dashboard = await request(`/api/v1/organizations/${organization.id}/dashboard`);
console.log('✓ dashboard', dashboard.data);

const educationSummary = await request(`/api/v1/organizations/${organization.id}/education/summary`);
if (typeof educationSummary.data.students !== 'number') {
  throw new Error('Education summary did not include students count');
}
console.log('✓ education summary', educationSummary.data);

const supervisorDashboard = await request(`/api/v1/organizations/${organization.id}/education/boarding/supervisor-dashboard`);
if (!Array.isArray(supervisorDashboard.data.alerts)) {
  throw new Error('Supervisor dashboard missing alerts');
}
console.log('✓ supervisor dashboard', supervisorDashboard.data.date);

const boardingSummary = await request(`/api/v1/organizations/${organization.id}/education/boarding/summary`);
if (boardingSummary.data.girlsBoardingSupported !== false) {
  throw new Error('Girls boarding must be disabled in the boys-only boarding module');
}
console.log('✓ boys boarding summary', boardingSummary.data);

const boardingReport = await request(`/api/v1/organizations/${organization.id}/education/boarding/reports/summary`);
if (!boardingReport.data.parentVisibilityPolicy) {
  throw new Error('Boarding report missing parent visibility policy');
}
console.log('✓ boarding report', boardingReport.data.title);

const boardingResidents = await request(`/api/v1/organizations/${organization.id}/education/boarding/residents`);
const firstResident = boardingResidents.data[0];
if (!firstResident) throw new Error('No boarding resident returned');

const checkIn = await request(`/api/v1/organizations/${organization.id}/education/boarding/residents/${firstResident.id}/check-ins`, {
  method: 'POST',
  body: JSON.stringify({
    fajrPrayer: true,
    quranSession: true,
    memorizationPages: 1,
    revisionPages: 4,
    behaviorScore: 88,
    cleanlinessScore: 90,
    sleepDisciplineScore: 82,
    healthStatus: 'good',
    supervisorNote: 'Smoke daily boarding check-in',
    parentVisible: false,
  }),
});
console.log('✓ create boarding check-in', checkIn.data.id);

const checkIns = await request(`/api/v1/organizations/${organization.id}/education/boarding/residents/${firstResident.id}/check-ins`);
if (!checkIns.data.some((item) => item.id === checkIn.data.id)) {
  throw new Error('Created boarding check-in not returned');
}
console.log('✓ boarding check-ins', checkIns.data.length);

const monthlyBoardingReport = await request(`/api/v1/organizations/${organization.id}/education/boarding/reports/monthly`);
if (typeof monthlyBoardingReport.data.daysTracked !== 'number') {
  throw new Error('Monthly boarding report missing daysTracked');
}
console.log('✓ monthly boarding report', monthlyBoardingReport.data.month);

const educationClasses = await request(`/api/v1/organizations/${organization.id}/education/classes`);
const firstClass = educationClasses.data[0];
if (!firstClass) throw new Error('No education class returned');

const student = await request(`/api/v1/organizations/${organization.id}/education/students`, {
  method: 'POST',
  body: JSON.stringify({
    name: `Smoke Student ${Date.now()}`,
    classId: firstClass.id,
    track: 'hybrid',
    academicProgress: 80,
    quranMemorizedPages: 12,
    attendanceRate: 95,
    tuitionStatus: 'paid',
  }),
});
console.log('✓ create student', student.data.id);

const studentReport = await request(`/api/v1/organizations/${organization.id}/education/students/${student.data.id}/report`);
if (!studentReport.data.recommendations?.length) {
  throw new Error('Student report did not include recommendations');
}
console.log('✓ student report', studentReport.data.title);

const finance = await request(`/api/v1/organizations/${organization.id}/education/finance`, {
  method: 'POST',
  body: JSON.stringify({
    type: 'income',
    category: 'tuition',
    amount: 1000,
    description: 'Smoke tuition entry',
  }),
});
console.log('✓ create finance entry', finance.data.id);

const auditLogs = await request(`/api/v1/organizations/${organization.id}/audit-logs?limit=10`);
if (!auditLogs.data.some((log) => log.action === 'program.create')) {
  throw new Error('Expected audit logs to include program.create');
}
console.log('✓ audit logs', auditLogs.data.length);

await request(`/api/v1/organizations/${organization.id}/volunteers/${volunteer.data.id}`, { method: 'DELETE' });
await request(`/api/v1/organizations/${organization.id}/beneficiaries/${beneficiary.data.id}`, { method: 'DELETE' });
await request(`/api/v1/organizations/${organization.id}/programs/${program.data.id}`, { method: 'DELETE' });
await request('/api/v1/dev/reset-store', { method: 'POST' });
console.log('✓ cleanup and reset');

console.log('Smoke test completed successfully.');
