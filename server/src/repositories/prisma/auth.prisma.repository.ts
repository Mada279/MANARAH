import { getPrisma } from '../../lib/prisma.js';

const adminToken = process.env.DEMO_AUTH_TOKEN ?? 'demo-token';
const viewerToken = process.env.DEMO_VIEWER_TOKEN ?? 'demo-viewer-token';

export function getTokenForPrismaUser(user: { role?: string | null }) {
  return user.role === 'viewer' ? viewerToken : adminToken;
}

export function canManagePrismaRole(role?: string | null) {
  return ['owner', 'admin', 'program_manager', 'coordinator'].includes(role ?? '');
}

export async function findPrismaUserByEmail(email: string) {
  const prisma = await getPrisma();
  return (prisma as any).user.findUnique({ where: { email } });
}

export async function findPrismaUserByToken(token: string) {
  const prisma = await getPrisma();
  const role = token === viewerToken ? 'viewer' : token === adminToken ? 'owner' : null;
  if (!role) return null;

  return (prisma as any).user.findFirst({
    where: {
      memberships: {
        some: {
          role: { name: role },
        },
      },
    },
    include: {
      memberships: { include: { role: true, organization: true } },
    },
  });
}
