import { beneficiaries, findProgramName, saveStore, type Beneficiary } from '../lib/memory-store.js';

export type BeneficiaryListItem = Beneficiary & {
  program: string;
};

export type CreateBeneficiaryInput = {
  name: string;
  programId?: string;
  city?: string;
  ageGroup?: string;
  status: Beneficiary['status'];
};

export type UpdateBeneficiaryInput = Partial<CreateBeneficiaryInput>;

function withProgram(beneficiary: Beneficiary): BeneficiaryListItem {
  return {
    ...beneficiary,
    program: findProgramName(beneficiary.programId),
  };
}

export function listBeneficiaries(organizationId: string) {
  return beneficiaries.filter((beneficiary) => beneficiary.organizationId === organizationId).map(withProgram);
}

export function createBeneficiary(organizationId: string, input: CreateBeneficiaryInput) {
  const beneficiary: Beneficiary = {
    id: `ben-${crypto.randomUUID()}`,
    organizationId,
    createdAt: new Date().toISOString(),
    ...input,
  };

  beneficiaries.unshift(beneficiary);
  saveStore();
  return withProgram(beneficiary);
}

export function updateBeneficiary(organizationId: string, beneficiaryId: string, input: UpdateBeneficiaryInput) {
  const beneficiary = beneficiaries.find(
    (item) => item.id === beneficiaryId && item.organizationId === organizationId,
  );
  if (!beneficiary) return null;

  Object.assign(beneficiary, input, { updatedAt: new Date().toISOString() });
  saveStore();
  return withProgram(beneficiary);
}

export function deleteBeneficiary(organizationId: string, beneficiaryId: string) {
  const index = beneficiaries.findIndex(
    (item) => item.id === beneficiaryId && item.organizationId === organizationId,
  );
  if (index === -1) return false;

  beneficiaries.splice(index, 1);
  saveStore();
  return true;
}
