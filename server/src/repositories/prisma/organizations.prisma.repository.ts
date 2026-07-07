import { getPrisma } from '../../lib/prisma.js';

export async function listPrismaOrganizationsForUser(userId: string) {
  const prisma = await getPrisma();
  const memberships = await (prisma as any).organizationMember.findMany({
    where: { userId },
    include: { organization: true },
  });

  return memberships.map((membership: any) => membership.organization);
}

export async function findPrismaOrganization(id: string) {
  const prisma = await getPrisma();
  return (prisma as any).organization.findUnique({ where: { id } });
}

export async function prismaUserCanAccessOrganization(userId: string, organizationId: string) {
  const prisma = await getPrisma();
  const count = await (prisma as any).organizationMember.count({
    where: { userId, organizationId },
  });
  return count > 0;
}

export async function buildPrismaDashboard(organizationId: string) {
  const prisma = await getPrisma();
  const [programs, beneficiaries, volunteers, metrics, volunteerHours] = await Promise.all([
    (prisma as any).program.count({ where: { organizationId, status: 'active' } }),
    (prisma as any).beneficiary.count({ where: { organizationId } }),
    (prisma as any).volunteer.count({ where: { organizationId } }),
    (prisma as any).impactMetric.count({ where: { organizationId } }),
    (prisma as any).volunteer.aggregate({ where: { organizationId }, _sum: { totalHours: true } }),
  ]);

  return {
    programs,
    beneficiaries,
    volunteers,
    volunteerHours: volunteerHours._sum.totalHours ?? 0,
    documents: 0,
    metrics,
  };
}
