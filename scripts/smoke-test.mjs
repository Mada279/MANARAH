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

await request(`/api/v1/organizations/${organization.id}/volunteers/${volunteer.data.id}`, { method: 'DELETE' });
await request(`/api/v1/organizations/${organization.id}/beneficiaries/${beneficiary.data.id}`, { method: 'DELETE' });
await request(`/api/v1/organizations/${organization.id}/programs/${program.data.id}`, { method: 'DELETE' });
console.log('✓ cleanup');

console.log('Smoke test completed successfully.');
