import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const COLD_START_PATTERNS = [
  "Can't reach database server",
  "Connection refused",
  "Connection terminated",
  "ECONNREFUSED",
  "ETIMEDOUT",
];

function isColdStartError(err: unknown): boolean {
  if (!(err instanceof Prisma.PrismaClientInitializationError) && !(err instanceof Prisma.PrismaClientKnownRequestError)) {
    return false;
  }
  const msg = (err as Error).message ?? "";
  return COLD_START_PATTERNS.some((p) => msg.includes(p));
}

function createPrismaClient() {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

  return client.$extends({
    query: {
      async $allOperations({ args, query }) {
        const maxAttempts = 4;
        const baseDelayMs = 800;
        let lastError: unknown;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            return await query(args);
          } catch (err) {
            lastError = err;
            if (!isColdStartError(err) || attempt === maxAttempts) throw err;
            const delay = baseDelayMs * attempt;
            await new Promise((r) => setTimeout(r, delay));
          }
        }
        throw lastError;
      },
    },
  });
}

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForExtended = globalThis as unknown as {
  prismaExtended: ExtendedPrismaClient | undefined;
};

export const prisma: ExtendedPrismaClient =
  globalForExtended.prismaExtended ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForExtended.prismaExtended = prisma;
  globalForPrisma.prisma = prisma as unknown as PrismaClient;
}
