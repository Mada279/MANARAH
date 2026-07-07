import { getPrisma } from '../../lib/prisma.js';

export async function listPrismaVolunteers(organizationId: string) {
  const prisma = await getPrisma();
  const rows = await (prisma as any).volunteer.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    include: { program: true },
  });

  return rows.map((row: any) => ({ ...row, skill: row.skills?.[0], program: row.program?.name ?? 'غير مرتبط' }));
}

export async function createPrismaVolunteer(organizationId: string, input: Record<string, unknown>) {
  const prisma = await getPrisma();
  const { skill, ...rest } = input;
  const row = await (prisma as any).volunteer.create({
    data: { organizationId, ...rest, skills: skill ? [skill] : [] },
    include: { program: true },
  });
  return { ...row, skill: row.skills?.[0], program: row.program?.name ?? 'غير مرتبط' };
}

export async function updatePrismaVolunteer(organizationId: string, volunteerId: string, input: Record<string, unknown>) {
  const prisma = await getPrisma();
  const { skill, ...rest } = input;
  const row = await (prisma as any).volunteer.update({
    where: { id: volunteerId, organizationId },
    data: { ...rest, ...(skill ? { skills: [skill] } : {}) },
    include: { program: true },
  });
  return { ...row, skill: row.skills?.[0], program: row.program?.name ?? 'غير مرتبط' };
}

export async function deletePrismaVolunteer(organizationId: string, volunteerId: string) {
  const prisma = await getPrisma();
  await (prisma as any).volunteer.delete({ where: { id: volunteerId, organizationId } });
  return true;
}
