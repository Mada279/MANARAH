import { organizations, type User, users } from '../lib/memory-store.js';

const adminToken = process.env.DEMO_AUTH_TOKEN ?? 'demo-token';
const viewerToken = process.env.DEMO_VIEWER_TOKEN ?? 'demo-viewer-token';

export function findUserByEmail(email: string) {
  return users.find((user) => user.email === email) ?? users[0];
}

export function findUserByToken(token: string) {
  if (token === adminToken) return users.find((user) => user.role === 'owner') ?? users[0];
  if (token === viewerToken) return users.find((user) => user.role === 'viewer') ?? null;
  return null;
}

export function getTokenForUser(user: User) {
  return user.role === 'viewer' ? viewerToken : adminToken;
}

export function canManageRole(role?: string) {
  return ['owner', 'admin', 'program_manager', 'coordinator'].includes(role ?? '');
}

export function getOrganizationsForUser(user: User) {
  return organizations.filter((organization) => user.organizationIds.includes(organization.id));
}
