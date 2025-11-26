import { PrismaClient } from '@prisma/client';

// Garante uma única instância do Prisma em dev para evitar vazamento de conexões
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'error'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;