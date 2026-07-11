#!/usr/bin/env node
/**
 * 🚨 PROD: Mirror of update-finalcta.mjs for production DB.
 * Guarded to modonty. Requires --confirm=YES flag.
 *
 * Usage:
 *   Dry-run (safe):  node scripts/update-finalcta-PROD.mjs
 *   Actual write:    node scripts/update-finalcta-PROD.mjs --confirm=YES
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const envRaw = readFileSync(path.resolve(here, "..", ".env.local"), "utf8");
const prodUrl = envRaw.match(/^MODONTY_PROD_DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";
if (!prodUrl) { console.error("❌ MODONTY_PROD_DATABASE_URL not found in .env.local"); process.exit(1); }
const dbName = prodUrl.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";

console.log("─".repeat(60));
console.log("🚨 PRODUCTION finalCta SYNC");
console.log("─".repeat(60));
console.log(`Target DB: ${prodUrl.replace(/:[^:@]+@/, ":****@")}`);
console.log(`DB name detected: ${dbName}`);
console.log("─".repeat(60));

if (dbName !== "modonty") { console.error(`❌ REFUSING: expected "modonty", got "${dbName}".`); process.exit(2); }

const confirmed = process.argv.some((a) => a === "--confirm=YES");
if (!confirmed) console.log("\n⚠️  DRY RUN mode. Re-run with --confirm=YES to apply.\n");

process.env.DATABASE_URL = prodUrl;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

const newData = {
  title1: "حضور لا وعود",
  title2: "انطلق اليوم بمحتوى احترافي يبني حضورك الرقمي",
  subtitle: "انضم لأوائل الشركات التي تختار المحتوى طريقاً للنمو — لا الإعلانات",
  wa: "كلّمنا على واتساب",
};

try {
  const before = await prisma.landingSection.findUnique({ where: { section: "finalCta" } });
  console.log("Current PROD:", JSON.stringify(before?.data, null, 2));

  if (!confirmed) {
    console.log("\nPlanned change:", JSON.stringify(newData, null, 2));
    console.log("\n🛑 DRY RUN — no changes. Re-run with --confirm=YES to apply.");
  } else {
    await prisma.landingSection.upsert({
      where: { section: "finalCta" },
      create: { section: "finalCta", data: newData },
      update: { data: newData },
    });
    const after = await prisma.landingSection.findUnique({ where: { section: "finalCta" } });
    console.log("\nAfter:", JSON.stringify(after?.data, null, 2));
    console.log("\n✅ PROD finalCta updated.");
  }
} finally {
  await prisma.$disconnect();
}
