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
import { listAuditLogs, recordAuditLog } from './repositories/audit.repository.js';
import {
  buildBoardingMonthlyReport,
  buildBoardingReport,
  buildBoardingSummary,
  buildBoardingSupervisorDashboard,
  createBoardingCheckIn,
  buildEducationReport,
  buildEducationSummary,
  buildParentStudentResults,
  buildStudentReport,
  createBoardingResident,
  createEducationClass,
  createFinanceEntry,
  createStaffMember,
  createStudent,
  listBoardingCheckIns,
  listBoardingResidents,
  listEducationClasses,
  listFinanceEntries,
  listStaffMembers,
  listStudents,
} from './repositories/education.repository.js';

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

function audit(res: express.Response, input: {
  organizationId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  recordAuditLog({
    actor: getRequestUser(res),
    ...input,
  });
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

    recordAuditLog({
      actor: user,
      action: 'auth.login',
      entityType: 'user',
      entityId: user.id,
      metadata: { email: user.email, role: user.role },
    });

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

app.get('/api/v1/parent/students/:studentId/results', (req, res) => {
  const user = getRequestUser(res);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const studentId = routeParam(req.params.studentId);
  const canView = canManageRole(user.role) || user.parentStudentIds?.includes(studentId);
  if (!canView) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Parent can only view assigned student results',
    });
    return;
  }

  const results = buildParentStudentResults(studentId);
  if (!results) {
    res.status(404).json({ error: 'StudentNotFound' });
    return;
  }

  res.json({ data: results });
});

app.post('/api/v1/dev/reset-store', requireManage, (_req, res) => {
  resetStore();
  audit(res, {
    action: 'store.reset',
    entityType: 'system',
    entityId: 'json-store',
  });
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
    audit(res, {
      organizationId: organization.id,
      action: 'organization.create',
      entityType: 'organization',
      entityId: organization.id,
      metadata: { name: organization.name, slug: organization.slug },
    });

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

app.get('/api/v1/organizations/:organizationId/audit-logs', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  const limit = Number(req.query.limit ?? 50);
  res.json({ data: listAuditLogs(organization.id, Number.isFinite(limit) ? limit : 50) });
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
    audit(res, {
      organizationId: organization.id,
      action: 'program.create',
      entityType: 'program',
      entityId: program.id,
      metadata: { name: program.name },
    });

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

    audit(res, {
      organizationId: organization.id,
      action: 'program.update',
      entityType: 'program',
      entityId: program.id,
      metadata: { fields: Object.keys(input) },
    });

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

  audit(res, {
    organizationId: organization.id,
    action: 'program.delete',
    entityType: 'program',
    entityId: routeParam(req.params.programId),
  });

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
    audit(res, {
      organizationId: organization.id,
      action: 'beneficiary.create',
      entityType: 'beneficiary',
      entityId: beneficiary.id,
      metadata: { name: beneficiary.name },
    });

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

    audit(res, {
      organizationId: organization.id,
      action: 'beneficiary.update',
      entityType: 'beneficiary',
      entityId: beneficiary.id,
      metadata: { fields: Object.keys(input) },
    });

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

  audit(res, {
    organizationId: organization.id,
    action: 'beneficiary.delete',
    entityType: 'beneficiary',
    entityId: routeParam(req.params.beneficiaryId),
  });

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
    audit(res, {
      organizationId: organization.id,
      action: 'volunteer.create',
      entityType: 'volunteer',
      entityId: volunteer.id,
      metadata: { name: volunteer.name },
    });

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

    audit(res, {
      organizationId: organization.id,
      action: 'volunteer.update',
      entityType: 'volunteer',
      entityId: volunteer.id,
      metadata: { fields: Object.keys(input) },
    });

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

  audit(res, {
    organizationId: organization.id,
    action: 'volunteer.delete',
    entityType: 'volunteer',
    entityId: routeParam(req.params.volunteerId),
  });

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
    audit(res, {
      organizationId: organization.id,
      action: 'impactMetric.create',
      entityType: 'impactMetric',
      entityId: metric.id,
      metadata: { name: metric.name, key: metric.key },
    });

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

    audit(res, {
      organizationId: organization.id,
      action: 'impactMetric.update',
      entityType: 'impactMetric',
      entityId: metric.id,
      metadata: { fields: Object.keys(input) },
    });

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

  audit(res, {
    organizationId: organization.id,
    action: 'impactMetric.delete',
    entityType: 'impactMetric',
    entityId: routeParam(req.params.metricId),
  });

  res.status(204).send();
});


app.get('/api/v1/organizations/:organizationId/education/summary', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  res.json({ data: buildEducationSummary(organization.id) });
});

app.get('/api/v1/organizations/:organizationId/education/reports/summary', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  const report = buildEducationReport(organization.id);
  audit(res, {
    organizationId: organization.id,
    action: 'educationReport.view',
    entityType: 'educationReport',
    entityId: 'summary',
  });

  res.json({ data: report });
});

app.get('/api/v1/organizations/:organizationId/education/classes', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  res.json({ data: listEducationClasses(organization.id) });
});

const createEducationClassSchema = z.object({
  name: z.string().min(2),
  track: z.enum(['school', 'quran', 'hybrid']).default('school'),
  level: z.string().min(1),
  teacherName: z.string().min(2),
  room: z.string().optional(),
  studentsCount: z.coerce.number().int().min(0).default(0),
  averageProgress: z.coerce.number().min(0).max(100).default(0),
});

app.post('/api/v1/organizations/:organizationId/education/classes', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = createEducationClassSchema.parse(req.body);
    const item = createEducationClass(organization.id, input);
    audit(res, {
      organizationId: organization.id,
      action: 'educationClass.create',
      entityType: 'educationClass',
      entityId: item.id,
      metadata: { name: item.name, track: item.track },
    });

    res.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
});


app.get('/api/v1/organizations/:organizationId/education/boarding/summary', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  res.json({ data: buildBoardingSummary(organization.id) });
});

app.get('/api/v1/organizations/:organizationId/education/boarding/residents', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  res.json({ data: listBoardingResidents(organization.id) });
});

const createBoardingResidentSchema = z.object({
  studentId: z.string().min(2),
  room: z.string().min(2),
  supervisorName: z.string().min(2),
  tarbiyahScore: z.coerce.number().min(0).max(100).default(80),
  supervisionScore: z.coerce.number().min(0).max(100).default(80),
  quranRevisionScore: z.coerce.number().min(0).max(100).default(80),
  healthStatus: z.enum(['good', 'watch', 'needs_attention']).default('good'),
  notes: z.string().optional(),
  parentVisible: z.coerce.boolean().default(true),
});

app.post('/api/v1/organizations/:organizationId/education/boarding/residents', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = createBoardingResidentSchema.parse(req.body);
    const resident = createBoardingResident(organization.id, input);
    audit(res, {
      organizationId: organization.id,
      action: 'boardingResident.create',
      entityType: 'boardingResident',
      entityId: resident.id,
      metadata: { studentId: resident.studentId, boysOnly: true },
    });

    res.status(201).json({ data: resident });
  } catch (error) {
    if (error instanceof Error && error.message === 'StudentNotFound') {
      res.status(404).json({ error: 'StudentNotFound' });
      return;
    }
    next(error);
  }
});

app.get('/api/v1/organizations/:organizationId/education/boarding/supervisor-dashboard', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  const supervisorName = typeof req.query.supervisorName === 'string' ? req.query.supervisorName : undefined;
  const date = typeof req.query.date === 'string' ? req.query.date : undefined;
  const dashboard = buildBoardingSupervisorDashboard(organization.id, supervisorName, date);
  audit(res, {
    organizationId: organization.id,
    action: 'boardingSupervisorDashboard.view',
    entityType: 'boardingSupervisorDashboard',
    entityId: dashboard.date,
    metadata: { supervisorName },
  });

  res.json({ data: dashboard });
});

app.get('/api/v1/organizations/:organizationId/education/boarding/reports/summary', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  const report = buildBoardingReport(organization.id);
  audit(res, {
    organizationId: organization.id,
    action: 'boardingReport.view',
    entityType: 'boardingReport',
    entityId: 'boys-boarding-summary',
  });

  res.json({ data: report });
});

app.get('/api/v1/organizations/:organizationId/education/boarding/reports/monthly', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  const month = typeof req.query.month === 'string' ? req.query.month : undefined;
  const report = buildBoardingMonthlyReport(organization.id, month);
  audit(res, {
    organizationId: organization.id,
    action: 'boardingMonthlyReport.view',
    entityType: 'boardingMonthlyReport',
    entityId: report.month,
  });

  res.json({ data: report });
});

app.get('/api/v1/organizations/:organizationId/education/boarding/residents/:residentId/check-ins', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  res.json({ data: listBoardingCheckIns(organization.id, routeParam(req.params.residentId)) });
});

const createBoardingCheckInSchema = z.object({
  date: z.string().default(() => new Date().toISOString()),
  fajrPrayer: z.coerce.boolean().default(false),
  quranSession: z.coerce.boolean().default(false),
  memorizationPages: z.coerce.number().int().min(0).default(0),
  revisionPages: z.coerce.number().int().min(0).default(0),
  behaviorScore: z.coerce.number().min(0).max(100).default(80),
  cleanlinessScore: z.coerce.number().min(0).max(100).default(80),
  sleepDisciplineScore: z.coerce.number().min(0).max(100).default(80),
  healthStatus: z.enum(['good', 'watch', 'needs_attention']).default('good'),
  supervisorNote: z.string().optional(),
  parentVisible: z.coerce.boolean().default(false),
});

app.post('/api/v1/organizations/:organizationId/education/boarding/residents/:residentId/check-ins', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = createBoardingCheckInSchema.parse(req.body);
    const checkIn = createBoardingCheckIn(organization.id, {
      residentId: routeParam(req.params.residentId),
      ...input,
    });
    audit(res, {
      organizationId: organization.id,
      action: 'boardingCheckIn.create',
      entityType: 'boardingCheckIn',
      entityId: checkIn.id,
      metadata: { residentId: checkIn.residentId, parentVisible: checkIn.parentVisible },
    });

    res.status(201).json({ data: checkIn });
  } catch (error) {
    if (error instanceof Error && error.message === 'BoardingResidentNotFound') {
      res.status(404).json({ error: 'BoardingResidentNotFound' });
      return;
    }
    next(error);
  }
});

app.get('/api/v1/organizations/:organizationId/education/students', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  res.json({ data: listStudents(organization.id) });
});

app.get('/api/v1/organizations/:organizationId/education/students/:studentId/report', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  const report = buildStudentReport(organization.id, routeParam(req.params.studentId));
  if (!report) {
    res.status(404).json({ error: 'StudentNotFound' });
    return;
  }

  audit(res, {
    organizationId: organization.id,
    action: 'studentReport.view',
    entityType: 'student',
    entityId: report.student.id,
  });

  res.json({ data: report });
});

const createStudentSchema = z.object({
  name: z.string().min(2),
  classId: z.string().optional(),
  guardianName: z.string().optional(),
  track: z.enum(['school', 'quran', 'hybrid']).default('school'),
  academicProgress: z.coerce.number().min(0).max(100).default(0),
  quranMemorizedPages: z.coerce.number().int().min(0).default(0),
  attendanceRate: z.coerce.number().min(0).max(100).default(100),
  tuitionStatus: z.enum(['paid', 'partial', 'due', 'scholarship']).default('due'),
  status: z.enum(['active', 'follow_up', 'graduated', 'archived']).default('active'),
});

app.post('/api/v1/organizations/:organizationId/education/students', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = createStudentSchema.parse(req.body);
    const item = createStudent(organization.id, input);
    audit(res, {
      organizationId: organization.id,
      action: 'student.create',
      entityType: 'student',
      entityId: item.id,
      metadata: { name: item.name, track: item.track },
    });

    res.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/organizations/:organizationId/education/staff', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  res.json({ data: listStaffMembers(organization.id) });
});

const createStaffSchema = z.object({
  name: z.string().min(2),
  role: z.enum(['teacher', 'quran_teacher', 'admin', 'accountant', 'supervisor', 'hr']).default('teacher'),
  department: z.enum(['school', 'quran', 'finance', 'hr', 'admin']).default('school'),
  salary: z.coerce.number().min(0).default(0),
  status: z.enum(['active', 'on_leave', 'inactive']).default('active'),
});

app.post('/api/v1/organizations/:organizationId/education/staff', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = createStaffSchema.parse(req.body);
    const item = createStaffMember(organization.id, input);
    audit(res, {
      organizationId: organization.id,
      action: 'staff.create',
      entityType: 'staff',
      entityId: item.id,
      metadata: { name: item.name, role: item.role },
    });

    res.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/organizations/:organizationId/education/finance', (req, res) => {
  const organization = ensureOrganization(req, res);
  if (!organization) return;

  res.json({ data: listFinanceEntries(organization.id) });
});

const createFinanceSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.enum(['tuition', 'donation', 'salary', 'operations', 'books', 'transport', 'other']).default('other'),
  amount: z.coerce.number().min(0),
  description: z.string().min(2),
  date: z.string().default(() => new Date().toISOString()),
});

app.post('/api/v1/organizations/:organizationId/education/finance', requireManage, (req, res, next) => {
  try {
    const organization = ensureOrganization(req, res);
    if (!organization) return;

    const input = createFinanceSchema.parse(req.body);
    const item = createFinanceEntry(organization.id, input);
    audit(res, {
      organizationId: organization.id,
      action: 'financeEntry.create',
      entityType: 'financeEntry',
      entityId: item.id,
      metadata: { type: item.type, amount: item.amount, category: item.category },
    });

    res.status(201).json({ data: item });
  } catch (error) {
    next(error);
  }
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
