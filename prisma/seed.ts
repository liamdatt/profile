import { existsSync } from "node:fs";
import argon2 from "argon2";
import { Role, UserStatus } from "@prisma/client";
import { createPrismaClient } from "../lib/prisma-client";

if (existsSync(".env")) {
  process.loadEnvFile?.(".env");
}

if (existsSync(".env.local")) {
  process.loadEnvFile?.(".env.local");
}

const prisma = createPrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the first admin.");
  }

  const passwordHash = await argon2.hash(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: {
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.APPROVED,
    },
    create: {
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.APPROVED,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
