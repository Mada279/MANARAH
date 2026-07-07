import { beneficiaries, impactMetrics, organizations, programs, saveStore, type Organization, type OrganizationType, type User, volunteers } from '../lib/memory-store.js';

export type CreateOrganizationInput = {
  name: string;
  slug: string;
  type: OrganizationType;
  country?: string;
  city?: string;
  description?: string;
};

export function listOrganizationsForUser(user: User) {
  return organizations.filter((organization) => user.organizationIds.includes(organization.id));
}

export function findOrganization(id: string) {
  return organizations.find((organization) => organization.id === id) ?? null;
}

export function userCanAccessOrganization(user: User, organizationId: string) {
  return user.organizationIds.includes(organizationId);
}

export function createOrganization(input: CreateOrganizationInput, user: User) {
  const organization: Organization = {
    id: `org-${crypto.randomUUID()}`,
    status: 'active',
    createdAt: new Date().toISOString(),
    ...input,
  };

  organizations.unshift(organization);

  if (!user.organizationIds.includes(organization.id)) {
    user.organizationIds.push(organization.id);
  }

  saveStore();
  return organization;
}

export function buildDashboard(organizationId: string) {
  const organizationPrograms = programs.filter(
    (program) => program.organizationId === organizationId && program.status === 'active',
  );
  const organizationBeneficiaries = beneficiaries.filter(
    (beneficiary) => beneficiary.organizationId === organizationId,
  );
  const organizationVolunteers = volunteers.filter((volunteer) => volunteer.organizationId === organizationId);
  const organizationMetrics = impactMetrics.filter((metric) => metric.organizationId === organizationId);

  return {
    programs: organizationPrograms.length,
    beneficiaries: organizationBeneficiaries.length,
    volunteers: organizationVolunteers.length,
    volunteerHours: organizationVolunteers.reduce((total, volunteer) => total + volunteer.totalHours, 0),
    documents: organizationMetrics.find((metric) => metric.key === 'documents_archived')?.current ?? 0,
    metrics: organizationMetrics.length,
  };
}
