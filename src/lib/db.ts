import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Security note (remediated per security audit Task 2):
 * - `log: ['query']` was removed: verbose Prisma query logging could leak
 *   customer data / enquiry contents into production logs.
 * - Only error-level logging is enabled. Never add 'query' in production.
 */
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
