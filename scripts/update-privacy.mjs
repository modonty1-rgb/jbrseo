#!/usr/bin/env node
/**
 * DEV: Upsert LandingSection "privacy" with the structured PDPL-compliant content.
 * Guarded to modonty_dev.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { privacyData } from "./research/privacy-policy-data.mjs";

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
  const before = await prisma.landingSection.findUnique({ where: { section: "privacy" } });
  console.log(`Before: ${before?.data ? "exists" : "missing"} · ${before?.data?.sections?.length ?? 0} sections`);

  await prisma.landingSection.upsert({
    where: { section: "privacy" },
    create: { section: "privacy", data: privacyData },
    update: { data: privacyData },
  });

  const after = await prisma.landingSection.findUnique({ where: { section: "privacy" } });
  console.log(`After:  ${after?.data?.sections?.length ?? 0} sections · updatedAt=${after?.data?.updatedAt}`);
  console.log("\n✅ privacy updated.");
} finally {
  await prisma.$disconnect();
}
