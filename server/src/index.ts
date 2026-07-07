import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { z } from 'zod';
import { dashboardByOrganizationId, organizations } from './lib/memory-store.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'manarah-api',
    scope: 'Manarah OS Core + Mishkat MVP',
    persistence: 'memory-store-prototype',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/organizations', (_req, res) => {
  res.json({ data: organizations });
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

app.post('/api/v1/organizations', (req, res, next) => {
  try {
    const input = createOrganizationSchema.parse(req.body);
    const organization = {
      id: `org-${crypto.randomUUID()}`,
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      ...input,
    };

    organizations.unshift(organization);
    dashboardByOrganizationId[organization.id] = {
      programs: 0,
      beneficiaries: 0,
      volunteers: 0,
      volunteerHours: 0,
      documents: 0,
      metrics: 0,
    };

    res.status(201).json({ data: organization });
  } catch (error) {
    next(error);
  }
});

app.get('/api/v1/organizations/:organizationId/dashboard', (req, res) => {
  const { organizationId } = req.params;
  const dashboard = dashboardByOrganizationId[organizationId];

  if (!dashboard) {
    res.status(404).json({ error: 'OrganizationDashboardNotFound' });
    return;
  }

  res.json({ data: dashboard });
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
