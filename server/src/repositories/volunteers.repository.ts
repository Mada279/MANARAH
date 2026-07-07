import { findProgramName, saveStore, type Volunteer, volunteers } from '../lib/memory-store.js';

export type VolunteerListItem = Volunteer & {
  program: string;
};

export type CreateVolunteerInput = {
  name: string;
  programId?: string;
  skill?: string;
  totalHours: number;
  status: Volunteer['status'];
};

export type UpdateVolunteerInput = Partial<CreateVolunteerInput>;

function withProgram(volunteer: Volunteer): VolunteerListItem {
  return {
    ...volunteer,
    program: findProgramName(volunteer.programId),
  };
}

export function listVolunteers(organizationId: string) {
  return volunteers.filter((volunteer) => volunteer.organizationId === organizationId).map(withProgram);
}

export function createVolunteer(organizationId: string, input: CreateVolunteerInput) {
  const volunteer: Volunteer = {
    id: `vol-${crypto.randomUUID()}`,
    organizationId,
    createdAt: new Date().toISOString(),
    ...input,
  };

  volunteers.unshift(volunteer);
  saveStore();
  return withProgram(volunteer);
}

export function updateVolunteer(organizationId: string, volunteerId: string, input: UpdateVolunteerInput) {
  const volunteer = volunteers.find((item) => item.id === volunteerId && item.organizationId === organizationId);
  if (!volunteer) return null;

  Object.assign(volunteer, input, { updatedAt: new Date().toISOString() });
  saveStore();
  return withProgram(volunteer);
}

export function deleteVolunteer(organizationId: string, volunteerId: string) {
  const index = volunteers.findIndex((item) => item.id === volunteerId && item.organizationId === organizationId);
  if (index === -1) return false;

  volunteers.splice(index, 1);
  saveStore();
  return true;
}
