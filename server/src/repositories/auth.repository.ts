import { organizations, type User, users } from '../lib/memory-store.js';

const adminToken = process.env.DEMO_AUTH_TOKEN ?? 'demo-token';
const viewerToken = process.env.DEMO_VIEWER_TOKEN ?? 'demo-viewer-token';
const parentToken = process.env.DEMO_PARENT_TOKEN ?? 'demo-parent-token';

export function findUserByEmail(email: string) {
  return users.find((user) => user.email === email) ?? users[0];
}

export function findUserByToken(token: string) {
  if (token === adminToken) return users.find((user) => user.role === 'owner') ?? users[0];
  if (token === viewerToken) return users.find((user) => user.role === 'viewer') ?? null;
  if (token === parentToken) return users.find((user) => user.role === 'parent') ?? null;
  return null;
}

export function getTokenForUser(user: User) {
  if (user.role === 'viewer') return viewerToken;
  if (user.role === 'parent') return parentToken;
  return adminToken;
}

export function canManageRole(role?: string) {
  return ['owner', 'admin', 'program_manager', 'coordinator'].includes(role ?? '');
}

export function getOrganizationsForUser(user: User) {
  return organizations.filter((organization) => user.organizationIds.includes(organization.id));
}
