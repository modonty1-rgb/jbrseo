#!/usr/bin/env node
/**
 * DEV: Upsert LandingSection "terms" with structured content.
 * Guarded to modonty_dev.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { termsData } from "./research/terms-of-service-data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const envRaw = readFileSync(path.resolve(here, "..", ".env.local"), "utf8");
const url = envRaw.match(/^DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";
const dbName = url.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";

if (dbName !== "modonty_dev") {
  console.error(`❌ Refusing: DB is "${dbName}", expected "modonty_dev".`);
  process.exit(2);
}

process.env.DATABASE_URL = url;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  const before = await prisma.landingSection.findUnique({ where: { section: "terms" } });
  console.log(`Before: ${before?.data ? "exists" : "missing"} · ${before?.data?.sections?.length ?? 0} sections`);

  await prisma.landingSection.upsert({
    where: { section: "terms" },
    create: { section: "terms", data: termsData },
    update: { data: termsData },
  });

  const after = await prisma.landingSection.findUnique({ where: { section: "terms" } });
  console.log(`After:  ${after?.data?.sections?.length ?? 0} sections · updatedAt=${after?.data?.updatedAt}`);
  console.log("\n✅ terms updated.");
} finally {
  await prisma.$disconnect();
}
