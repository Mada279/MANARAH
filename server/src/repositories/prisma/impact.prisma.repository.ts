import { getPrisma } from '../../lib/prisma.js';

export async function listPrismaImpactMetrics(organizationId: string) {
  const prisma = await getPrisma();
  const rows = await (prisma as any).impactMetric.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
  });

  return rows.map((row: any) => ({
    ...row,
    current: Number(row.current ?? 0),
    target: Number(row.targetValue ?? 1),
  }));
}

export async function createPrismaImpactMetric(organizationId: string, input: Record<string, unknown>) {
  const prisma = await getPrisma();
  const { target, current, ...rest } = input;
  return (prisma as any).impactMetric.create({
    data: { organizationId, ...rest, targetValue: target, current },
  });
}

export async function updatePrismaImpactMetric(organizationId: string, metricId: string, input: Record<string, unknown>) {
  const prisma = await getPrisma();
  const { target, ...rest } = input;
  return (prisma as any).impactMetric.update({
    where: { id: metricId, organizationId },
    data: { ...rest, ...(target ? { targetValue: target } : {}) },
  });
}

export async function deletePrismaImpactMetric(organizationId: string, metricId: string) {
  const prisma = await getPrisma();
  await (prisma as any).impactMetric.delete({ where: { id: metricId, organizationId } });
  return true;
}
