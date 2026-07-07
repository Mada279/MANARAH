import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { z } from 'zod';
import { resetStore, type User } from './lib/memory-store.js';
import {
  canManageRole,
  findUserByEmail,
  findUserByToken,
  getOrganizationsForUser,
  getTokenForUser,
} from './repositories/auth.repository.js';
import {
  buildDashboard,
  createOrganization,
  findOrganization,
  listOrganizationsForUser,
  userCanAccessOrganization,
} from './repositories/organizations.repository.js';
import {
  createProgram,
  deleteProgram,
  listPrograms,
  updateProgram,
} from './repositories/programs.repository.js';
import {
  createBeneficiary,
  deleteBeneficiary,
  listBeneficiaries,
  updateBeneficiary,
} from './repositories/beneficiaries.repository.js';
import {
  createVolunteer,
  deleteVolunteer,
  listVolunteers,
  updateVolunteer,
} from './repositories/volunteers.repository.js';
import {
  createImpactMetric,
  deleteImpactMetric,
  listImpactMetrics,
  updateImpactMetric,
} from './repositories/impact.repository.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

function getRequestUser(res: express.Response) {
  return res.locals.currentUser as User | undefined;
}

function routeParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? '';
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = req.header('authorization') ?? '';
  const [scheme, token] = header.split(' ');
  const user = token ? findUserByToken(token) : null;

  if (scheme !== 'Bearer' || !user) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization: Bearer token',
    });
    return;
  }

  res.locals.currentUser = user;
  next();
}

function requireManage(_req: express.Request, res: express.Response, next: express.NextFunction) {
  const user = getRequestUser(res);

  if (!canManageRole(user?.role)) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Current user role cannot perform this action',
    });
    return;
  }

  next();
}

function ensureOrganization(req: express.Request, res: express.Response) {
  const organizationId = routeParam(req.params.organizationId);
  const organization = findOrganization(organizationId);

  if (!organization) {
    res.status(404).json({ error: 'OrganizationNotFound' });
    return null;
  }

  const user = getRequestUser(res);
  if (user && !userCanAccessOrganization(user, organization.id)) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Current user is not a member of this organization',
    });
    return null;
  }

  return organization;
}

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'manarah-api',
    scope: 'Manarah OS Core + Mishkat MVP',
    persistence: 'json-file-store-prototype',
    architecture: 'repository-layer',
    timestamp: new Date().toISOString(),
  });
});

const loginSchema = z.object({
  email: z.string().email(),
});

app.post('/api/v1/auth/login', (req, res, next) => {
  try {
    const { email } = loginSchema.parse(req.body);
    const user = findUserByEmail(email);

    res.json({
      data: {
        token: getTokenForUser(user),
        user,
        organizations: getOrganizationsForUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api/v1', (req, res, next) => {
  if (req.path === '/auth/login') {
    next();
    return;
  }

  requireAuth(req, res, next);
});

app.get('/api/v1/me', (_req, res) => {
  const user = getRequestUser(res);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.json({
    data: {
      user,
      organizations: getOrganizationsForUser(user),
    },
  });
});

app.post('/api/v1/dev/reset-store', requireManage, (_req, res) => {
  resetStore();
  res.json({ data: { ok: true, message: 'Store reset to seed data' } });
});

app.get('/api/v1/organizations', (_req, res) => {
  const user = getRequestUser(res);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  res.json({ data: listOrganizationsForUser(user) });
});

const createOrganizationSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  type: z
    .enum(['charity', 'waqf', 'school', 'academy', 'mosque', 'community_center', 'initiative', 'other'])
    .default('other'),
  country: z.string().optional(),
  city: z.string().optional(),
  description: z.string().optional(),
});

app.post('/api/v1/organizations', requireManage, (req, res, next) => {
  try {
    const user = getRequestUser(res);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const input = createOrganizationSchema.parse(req.body);
    const organization = createOrganization(input, user);

    res.status(201).json({ data: organization });
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/organizations/:organizationId/dashboard', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  res.json({ data: buildDashboard(organization.id) });
});

app.get('/api/v1/organizations/:organizationId/programs', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  res.json({ data: listPrograms(organization.id) });
});

const createProgramSchema = z.object({
  name: z.string().min(2),
  manager: z.string().min(2).default('فريق التشغيل'),
  category: z.string().optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'archived']).default('active'),
  progress: z.coerce.number().min(0).max(100).default(0),
});

app.post('/api/v1/organizations/:organizationId/programs', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = createProgramSchema.parse(req.body);
    const program = createProgram(organization.id, input);

    res.status(201).json({ data: program });
  } catch (error) {
    next(error);
  }
});

const updateProgramSchema = createProgramSchema.partial();

app.patch('/api/v1/organizations/:organizationId/programs/:programId', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = updateProgramSchema.parse(req.body);
    const program = updateProgram(organization.id, routeParam(req.params.programId), input);

    if (!program) {
      res.status(404).json({ error: 'ProgramNotFound' });
      return;
    }

    res.json({ data: program });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/v1/organizations/:organizationId/programs/:programId', requireManage, (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  const deleted = deleteProgram(organization.id, routeParam(req.params.programId));
  if (!deleted) {
    res.status(404).json({ error: 'ProgramNotFound' });
    return;
  }

  res.status(204).send();
});

app.get('/api/v1/organizations/:organizationId/beneficiaries', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  res.json({ data: listBeneficiaries(organization.id) });
});

const createBeneficiarySchema = z.object({
  name: z.string().min(2),
  programId: z.string().optional(),
  city: z.string().optional(),
  ageGroup: z.string().optional(),
  status: z.enum(['active', 'follow_up', 'completed', 'archived']).default('active'),
});

app.post('/api/v1/organizations/:organizationId/beneficiaries', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = createBeneficiarySchema.parse(req.body);
    const beneficiary = createBeneficiary(organization.id, input);

    res.status(201).json({ data: beneficiary });
  } catch (error) {
    next(error);
  }
});

const updateBeneficiarySchema = createBeneficiarySchema.partial();

app.patch('/api/v1/organizations/:organizationId/beneficiaries/:beneficiaryId', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = updateBeneficiarySchema.parse(req.body);
    const beneficiary = updateBeneficiary(organization.id, routeParam(req.params.beneficiaryId), input);

    if (!beneficiary) {
      res.status(404).json({ error: 'BeneficiaryNotFound' });
      return;
    }

    res.json({ data: beneficiary });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/v1/organizations/:organizationId/beneficiaries/:beneficiaryId', requireManage, (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  const deleted = deleteBeneficiary(organization.id, routeParam(req.params.beneficiaryId));
  if (!deleted) {
    res.status(404).json({ error: 'BeneficiaryNotFound' });
    return;
  }

  res.status(204).send();
});

app.get('/api/v1/organizations/:organizationId/volunteers', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  res.json({ data: listVolunteers(organization.id) });
});

const createVolunteerSchema = z.object({
  name: z.string().min(2),
  programId: z.string().optional(),
  skill: z.string().optional(),
  totalHours: z.coerce.number().int().min(0).default(0),
  status: z.enum(['available', 'assigned', 'inactive', 'archived']).default('available'),
});

app.post('/api/v1/organizations/:organizationId/volunteers', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = createVolunteerSchema.parse(req.body);
    const volunteer = createVolunteer(organization.id, input);

    res.status(201).json({ data: volunteer });
  } catch (error) {
    next(error);
  }
});

const updateVolunteerSchema = createVolunteerSchema.partial();

app.patch('/api/v1/organizations/:organizationId/volunteers/:volunteerId', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = updateVolunteerSchema.parse(req.body);
    const volunteer = updateVolunteer(organization.id, routeParam(req.params.volunteerId), input);

    if (!volunteer) {
      res.status(404).json({ error: 'VolunteerNotFound' });
      return;
    }

    res.json({ data: volunteer });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/v1/organizations/:organizationId/volunteers/:volunteerId', requireManage, (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  const deleted = deleteVolunteer(organization.id, routeParam(req.params.volunteerId));
  if (!deleted) {
    res.status(404).json({ error: 'VolunteerNotFound' });
    return;
  }

  res.status(204).send();
});

app.get('/api/v1/organizations/:organizationId/impact-metrics', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  res.json({ data: listImpactMetrics(organization.id) });
});

const createImpactMetricSchema = z.object({
  name: z.string().min(2),
  key: z.string().min(2).regex(/^[a-z0-9_]+$/),
  current: z.coerce.number().min(0).default(0),
  target: z.coerce.number().positive().default(1),
  unit: z.string().min(1).default('عدد'),
  programId: z.string().optional(),
});

app.post('/api/v1/organizations/:organizationId/impact-metrics', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = createImpactMetricSchema.parse(req.body);
    const metric = createImpactMetric(organization.id, input);

    res.status(201).json({ data: metric });
  } catch (error) {
    next(error);
  }
});

const updateImpactMetricSchema = createImpactMetricSchema.partial();

app.patch('/api/v1/organizations/:organizationId/impact-metrics/:metricId', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = updateImpactMetricSchema.parse(req.body);
    const metric = updateImpactMetric(organization.id, routeParam(req.params.metricId), input);

    if (!metric) {
      res.status(404).json({ error: 'ImpactMetricNotFound' });
      return;
    }

    res.json({ data: metric });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/v1/organizations/:organizationId/impact-metrics/:metricId', requireManage, (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  const deleted = deleteImpactMetric(organization.id, routeParam(req.params.metricId));
  if (!deleted) {
    res.status(404).json({ error: 'ImpactMetricNotFound' });
    return;
  }

  res.status(204).send();
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: 'ValidationError', details: error.flatten() });
    return;
  }

  console.error(error);
  res.status(500).json({ error: 'InternalServerError' });
});

app.listen(port, () => {
  console.log(`Manarah API prototype listening on http://localhost:${port}`);
});
