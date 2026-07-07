import { auditLogs, saveStore, type AuditLog, type User } from '../lib/memory-store.js';

export type AuditInput = {
  organizationId?: string;
  actor?: User;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
};

export function recordAuditLog(input: AuditInput) {
  const auditLog: AuditLog = {
    id: `audit-${crypto.randomUUID()}`,
    organizationId: input.organizationId,
    actorUserId: input.actor?.id,
    actorEmail: input.actor?.email,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: input.metadata,
    createdAt: new Date().toISOString(),
  };

  auditLogs.unshift(auditLog);
  saveStore();
  return auditLog;
}

export function listAuditLogs(organizationId?: string, limit = 50) {
  const filtered = organizationId
    ? auditLogs.filter((log) => !log.organizationId || log.organizationId === organizationId)
    : auditLogs;

  return filtered.slice(0, limit);
}
