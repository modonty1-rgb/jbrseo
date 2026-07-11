import { PrismaClient } from "@prisma/client";

// Dedicated READ-ONLY Prisma client bound to Modonty's PRODUCTION database.
// Same schema as `lib/prisma.ts`, different `datasourceUrl`. This lets the
// trust section on the jbrseo landing page show real client logos regardless
// of environment — local dev, preview, or production — without ever pointing
// jbrseo's own writes (Subscriber, LandingSection, Plan …) at Modonty's prod.
//
// RULES:
//   1. Only ever call read methods here (`findMany`, `findUnique`, `count`).
//      Any call like `.update()` / `.create()` / `.delete()` MUST use the
//      main client from `lib/prisma.ts` instead.
//   2. If `MODONTY_PROD_DATABASE_URL` is missing at runtime, fall back to
//      the main `DATABASE_URL` so local dev without the var still boots
//      (it will just read from whatever `DATABASE_URL` points to).

const globalForModontyPrisma = globalThis as unknown as {
  modontyDb: PrismaClient | undefined;
};

function makeClient(): PrismaClient {
  const url = process.env.MODONTY_PROD_DATABASE_URL ?? process.env.DATABASE_URL;
  return url
    ? new PrismaClient({ datasourceUrl: url })
    : new PrismaClient();
}

export const modontyDb = globalForModontyPrisma.modontyDb ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalForModontyPrisma.modontyDb = modontyDb;
}
