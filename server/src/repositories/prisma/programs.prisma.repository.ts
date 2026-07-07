import { getPrisma } from '../../lib/prisma.js';

export async function listPrismaPrograms(organizationId: string) {
  const prisma = await getPrisma();
  const programs = await (prisma as any).program.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { beneficiaries: true, volunteers: true } } },
  });

  return programs.map((program: any) => ({
    ...program,
    beneficiaries: program._count.beneficiaries,
    volunteers: program._count.volunteers,
    progress: program.progress ?? 0,
  }));
}

export async function createPrismaProgram(organizationId: string, input: Record<string, unknown>) {
  const prisma = await getPrisma();
  const program = await (prisma as any).program.create({
    data: { organizationId, ...input },
  });
  return { ...program, beneficiaries: 0, volunteers: 0, progress: (input.progress as number | undefined) ?? 0 };
}

export async function updatePrismaProgram(organizationId: string, programId: string, input: Record<string, unknown>) {
  const prisma = await getPrisma();
  return (prisma as any).program.update({
    where: { id: programId, organizationId },
    data: input,
  });
}

export async function deletePrismaProgram(organizationId: string, programId: string) {
  const prisma = await getPrisma();
  await (prisma as any).program.delete({ where: { id: programId, organizationId } });
  return true;
}
