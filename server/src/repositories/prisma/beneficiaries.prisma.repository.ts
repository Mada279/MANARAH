import { getPrisma } from '../../lib/prisma.js';

export async function listPrismaBeneficiaries(organizationId: string) {
  const prisma = await getPrisma();
  const rows = await (prisma as any).beneficiary.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    include: { program: true },
  });

  return rows.map((row: any) => ({ ...row, program: row.program?.name ?? 'غير مرتبط' }));
}

export async function createPrismaBeneficiary(organizationId: string, input: Record<string, unknown>) {
  const prisma = await getPrisma();
  const row = await (prisma as any).beneficiary.create({
    data: { organizationId, ...input },
    include: { program: true },
  });
  return { ...row, program: row.program?.name ?? 'غير مرتبط' };
}

export async function updatePrismaBeneficiary(organizationId: string, beneficiaryId: string, input: Record<string, unknown>) {
  const prisma = await getPrisma();
  const row = await (prisma as any).beneficiary.update({
    where: { id: beneficiaryId, organizationId },
    data: input,
    include: { program: true },
  });
  return { ...row, program: row.program?.name ?? 'غير مرتبط' };
}

export async function deletePrismaBeneficiary(organizationId: string, beneficiaryId: string) {
  const prisma = await getPrisma();
  await (prisma as any).beneficiary.delete({ where: { id: beneficiaryId, organizationId } });
  return true;
}
