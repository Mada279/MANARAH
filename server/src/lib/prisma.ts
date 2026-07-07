/**
 * Lazy Prisma loader.
 *
 * This file intentionally avoids a named `import { PrismaClient } from '@prisma/client'`
 * because Prisma Client is generated locally after `npm run db:generate`.
 * In environments where the generated client is not available yet, TypeScript can still
 * compile the server, while runtime usage will show a clear setup error.
 */

type PrismaClientLike = Record<string, unknown> & {
  $connect?: () => Promise<void>;
  $disconnect?: () => Promise<void>;
};

const globalForPrisma = globalThis as unknown as {
  manarahPrisma?: PrismaClientLike;
};

export async function getPrisma(): Promise<PrismaClientLike> {
  if (globalForPrisma.manarahPrisma) {
    return globalForPrisma.manarahPrisma;
  }

  const prismaModule = (await import('@prisma/client')) as Record<string, unknown>;
  const PrismaClient = prismaModule.PrismaClient as (new () => PrismaClientLike) | undefined;

  if (!PrismaClient) {
    throw new Error(
      'PrismaClient is not generated yet. Run: npm run db:generate, then npm run db:migrate and npm run db:seed.',
    );
  }

  globalForPrisma.manarahPrisma = new PrismaClient();
  return globalForPrisma.manarahPrisma;
}
