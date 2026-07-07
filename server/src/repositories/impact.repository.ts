import { impactMetrics, saveStore, type ImpactMetric } from '../lib/memory-store.js';

export type CreateImpactMetricInput = {
  name: string;
  key: string;
  current: number;
  target: number;
  unit: string;
  programId?: string;
};

export type UpdateImpactMetricInput = Partial<CreateImpactMetricInput>;

export function listImpactMetrics(organizationId: string) {
  return impactMetrics.filter((metric) => metric.organizationId === organizationId);
}

export function createImpactMetric(organizationId: string, input: CreateImpactMetricInput) {
  const metric: ImpactMetric = {
    id: `metric-${crypto.randomUUID()}`,
    organizationId,
    createdAt: new Date().toISOString(),
    ...input,
  };

  impactMetrics.unshift(metric);
  saveStore();
  return metric;
}

export function updateImpactMetric(organizationId: string, metricId: string, input: UpdateImpactMetricInput) {
  const metric = impactMetrics.find((item) => item.id === metricId && item.organizationId === organizationId);
  if (!metric) return null;

  Object.assign(metric, input, { updatedAt: new Date().toISOString() });
  saveStore();
  return metric;
}

export function deleteImpactMetric(organizationId: string, metricId: string) {
  const index = impactMetrics.findIndex((item) => item.id === metricId && item.organizationId === organizationId);
  if (index === -1) return false;

  impactMetrics.splice(index, 1);
  saveStore();
  return true;
}
