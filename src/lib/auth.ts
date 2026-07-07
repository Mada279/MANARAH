import { login, type Organization, type User } from './api';

const TOKEN_KEY = 'manarah_auth_token';
const USER_KEY = 'manarah_auth_user';
const ORGS_KEY = 'manarah_auth_organizations';

export type AuthSession = {
  token: string;
  user: User;
  organizations: Organization[];
};

export function getStoredSession(): AuthSession | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);
  const organizationsRaw = localStorage.getItem(ORGS_KEY);

  if (!token || !userRaw || !organizationsRaw) return null;

  try {
    return {
      token,
      user: JSON.parse(userRaw) as User,
      organizations: JSON.parse(organizationsRaw) as Organization[],
    };
  } catch {
    clearStoredSession();
    return null;
  }
}

export function storeSession(session: AuthSession) {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  localStorage.setItem(ORGS_KEY, JSON.stringify(session.organizations));
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ORGS_KEY);
}

export async function loginAndStore(email: string) {
  const session = await login(email);
  storeSession(session);
  return session;
}

export function canManage(role?: string) {
  return ['owner', 'admin', 'program_manager', 'coordinator'].includes(role ?? '');
}
