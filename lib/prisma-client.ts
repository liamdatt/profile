import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL must be set before constructing PrismaClient.");
  }

  return url;
}

export function createPrismaClient(options?: { log?: Prisma.LogLevel[] }) {
  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString: getDatabaseUrl(),
    }),
    log: options?.log,
  });
}
