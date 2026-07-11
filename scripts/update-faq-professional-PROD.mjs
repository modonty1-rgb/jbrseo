#!/usr/bin/env node
/**
 * 🚨 PRODUCTION FAQ SYNC — mirrors update-faq-professional.mjs but targets `modonty` (prod).
 *
 * Uses MODONTY_PROD_DATABASE_URL from .env.local (never .env, never guessed).
 * Refuses to run unless DB name is exactly "modonty".
 * Requires a --confirm=YES flag to actually write (dry-run by default).
 *
 * Data source: scripts/research/faq-final-data.mjs (shared with dev script).
 *
 * Usage:
 *   Dry-run (safe preview):  node scripts/update-faq-professional-PROD.mjs
 *   Actual write:            node scripts/update-faq-professional-PROD.mjs --confirm=YES
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { faqData } from "./research/faq-final-data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const envRaw = readFileSync(path.resolve(here, "..", ".env.local"), "utf8");
const prodUrl = envRaw.match(/^MODONTY_PROD_DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";

if (!prodUrl) {
  console.error("❌ MODONTY_PROD_DATABASE_URL not found in .env.local");
  process.exit(1);
}

const dbName = prodUrl.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";

console.log("─".repeat(60));
console.log("🚨 PRODUCTION FAQ SYNC");
console.log("─".repeat(60));
console.log(`Target DB: ${prodUrl.replace(/:[^:@]+@/, ":****@")}`);
console.log(`DB name detected: ${dbName}`);
console.log("─".repeat(60));

if (dbName !== "modonty") {
  console.error(`❌ REFUSING: expected "modonty", got "${dbName}". Aborting.`);
  process.exit(2);
}

const confirmed = process.argv.some((a) => a === "--confirm=YES");
if (!confirmed) {
  console.log("\n⚠️  DRY RUN mode (no writes).");
  console.log("   To actually apply, re-run with: --confirm=YES\n");
}

process.env.DATABASE_URL = prodUrl;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

const tagCounts = {};
for (const f of faqData.faqs) tagCounts[f.tag] = (tagCounts[f.tag] || 0) + 1;
console.log(`\nPlanned FAQ: ${faqData.faqs.length} questions across ${Object.keys(tagCounts).length} tags`);
for (const [tag, count] of Object.entries(tagCounts)) {
  console.log(`  · ${tag}: ${count}`);
}

try {
  const before = await prisma.landingSection.findUnique({ where: { section: "faq" } });
  console.log(`\nCurrent PROD state: ${before?.data?.faqs?.length ?? 0} questions.`);

  if (!confirmed) {
    console.log("\n🛑 DRY RUN — no changes made. Re-run with --confirm=YES to apply.");
  } else {
    await prisma.landingSection.upsert({
      where: { section: "faq" },
      create: { section: "faq", data: faqData },
      update: { data: faqData },
    });

    const after = await prisma.landingSection.findUnique({ where: { section: "faq" } });
    console.log(`\n✅ PROD FAQ updated: ${after?.data?.faqs?.length ?? 0} questions live.`);
  }
} finally {
  await prisma.$disconnect();
}
