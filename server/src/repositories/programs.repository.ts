import { beneficiaries, programs, saveStore, type Program, volunteers } from '../lib/memory-store.js';

export type ProgramListItem = Program & {
  beneficiaries: number;
  volunteers: number;
};

export type CreateProgramInput = {
  name: string;
  manager: string;
  category?: string;
  status: Program['status'];
  progress: number;
};

export type UpdateProgramInput = Partial<CreateProgramInput>;

function withCounts(program: Program): ProgramListItem {
  return {
    ...program,
    beneficiaries: beneficiaries.filter((beneficiary) => beneficiary.programId === program.id).length,
    volunteers: volunteers.filter((volunteer) => volunteer.programId === program.id).length,
  };
}

export function listPrograms(organizationId: string) {
  return programs.filter((program) => program.organizationId === organizationId).map(withCounts);
}

export function findProgram(organizationId: string, programId: string) {
  const program = programs.find((item) => item.id === programId && item.organizationId === organizationId);
  return program ? withCounts(program) : null;
}

export function createProgram(organizationId: string, input: CreateProgramInput) {
  const program: Program = {
    id: `program-${crypto.randomUUID()}`,
    organizationId,
    createdAt: new Date().toISOString(),
    ...input,
  };

  programs.unshift(program);
  saveStore();
  return withCounts(program);
}

export function updateProgram(organizationId: string, programId: string, input: UpdateProgramInput) {
  const program = programs.find((item) => item.id === programId && item.organizationId === organizationId);
  if (!program) return null;

  Object.assign(program, input, { updatedAt: new Date().toISOString() });
  saveStore();
  return withCounts(program);
}

export function deleteProgram(organizationId: string, programId: string) {
  const index = programs.findIndex((item) => item.id === programId && item.organizationId === organizationId);
  if (index === -1) return false;

  programs.splice(index, 1);
  saveStore();
  return true;
}
