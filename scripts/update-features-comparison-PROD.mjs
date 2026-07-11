#!/usr/bin/env node
/**
 * 🚨 PROD: Mirror of update-features-comparison.mjs for production DB.
 * Guarded to modonty. Requires --confirm=YES.
 *
 * Usage:
 *   Dry-run:      node scripts/update-features-comparison-PROD.mjs
 *   Actual write: node scripts/update-features-comparison-PROD.mjs --confirm=YES
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { featuresCatalog as featuresComparisonData } from "../lib/features-catalog.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const envRaw = readFileSync(path.resolve(here, "..", ".env.local"), "utf8");
const prodUrl = envRaw.match(/^MODONTY_PROD_DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";
if (!prodUrl) { console.error("❌ MODONTY_PROD_DATABASE_URL not found"); process.exit(1); }
const dbName = prodUrl.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";

console.log("─".repeat(60));
console.log("🚨 PRODUCTION featuresComparison SYNC");
console.log("─".repeat(60));
console.log(`Target DB: ${prodUrl.replace(/:[^:@]+@/, ":****@")}`);
console.log(`DB name: ${dbName}`);
console.log("─".repeat(60));

if (dbName !== "modonty") { console.error(`❌ REFUSING: expected "modonty", got "${dbName}".`); process.exit(2); }

const confirmed = process.argv.some((a) => a === "--confirm=YES");
if (!confirmed) console.log("\n⚠️  DRY RUN mode. Re-run with --confirm=YES.\n");

process.env.DATABASE_URL = prodUrl;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  const before = await prisma.landingSection.findUnique({ where: { section: "featuresComparison" } });
  console.log(`Current PROD: ${before?.data?.rows?.length ?? 0} rows`);
  console.log(`Planned: ${featuresComparisonData.rows.length} rows`);

  if (!confirmed) {
    console.log(JSON.stringify(featuresComparisonData, null, 2));
    console.log("\n🛑 DRY RUN — no changes. Re-run with --confirm=YES.");
  } else {
    await prisma.landingSection.upsert({
      where: { section: "featuresComparison" },
      create: { section: "featuresComparison", data: featuresComparisonData },
      update: { data: featuresComparisonData },
    });
    console.log("\n✅ PROD featuresComparison updated.");
  }
} finally {
  await prisma.$disconnect();
}
