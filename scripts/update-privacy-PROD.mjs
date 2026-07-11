#!/usr/bin/env node
/**
 * 🚨 PROD: Mirror of update-privacy.mjs for production DB.
 * Guarded to modonty. Requires --confirm=YES.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { privacyData } from "./research/privacy-policy-data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const CONFIRM = process.argv.includes("--confirm=YES");

const envRaw = readFileSync(path.resolve(here, "..", ".env"), "utf8");
const url = envRaw.match(/^DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";
const dbName = url.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";

if (dbName !== "modonty") {
  console.error(`❌ Refusing: DB is "${dbName}", expected "modonty" (prod).`);
  process.exit(2);
}
console.log(`Target: ${dbName} (PROD)`);
console.log(`Mode:   ${CONFIRM ? "🚨 WRITE" : "🔍 DRY-RUN"}`);

process.env.DATABASE_URL = url;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  const before = await prisma.landingSection.findUnique({ where: { section: "privacy" } });
  console.log(`Before: ${before?.data ? "exists" : "missing"} · ${before?.data?.sections?.length ?? 0} sections`);

  if (!CONFIRM) {
    console.log("\n🔍 Dry-run — re-run with --confirm=YES to write.");
    process.exit(0);
  }

  console.log("\n🚨 Writing to prod…");
  await prisma.landingSection.upsert({
    where: { section: "privacy" },
    create: { section: "privacy", data: privacyData },
    update: { data: privacyData },
  });

  const after = await prisma.landingSection.findUnique({ where: { section: "privacy" } });
  console.log(`After:  ${after?.data?.sections?.length ?? 0} sections · updatedAt=${after?.data?.updatedAt}`);
  console.log("\n✅ privacy updated in PROD.");
} finally {
  await prisma.$disconnect();
}
