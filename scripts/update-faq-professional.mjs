#!/usr/bin/env node
/**
 * DEV FAQ update — writes 18 finalized Q&A to modonty_dev.
 * Data source: scripts/research/faq-final-data.mjs (shared with PROD script).
 * Guard: refuses if DATABASE_URL is not modonty_dev.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { faqData } from "./research/faq-final-data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const envRaw = readFileSync(path.resolve(here, "..", ".env.local"), "utf8");
const url = envRaw.match(/^DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";
const dbName = url.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";

console.log("─".repeat(60));
console.log(`DB name: ${dbName}`);
console.log("─".repeat(60));

if (dbName !== "modonty_dev") {
  console.error(`❌ Refusing: DB is "${dbName}", expected "modonty_dev".`);
  process.exit(2);
}
console.log("✅ Confirmed DEV database. Proceeding.\n");

process.env.DATABASE_URL = url;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

console.log(`Preparing to update FAQ: ${faqData.faqs.length} questions across ${new Set(faqData.faqs.map(f => f.tag)).size} tags.\n`);

const tagCounts = {};
for (const f of faqData.faqs) tagCounts[f.tag] = (tagCounts[f.tag] || 0) + 1;
for (const [tag, count] of Object.entries(tagCounts)) {
  console.log(`  · ${tag}: ${count}`);
}
console.log("");

try {
  const before = await prisma.landingSection.findUnique({ where: { section: "faq" } });
  console.log(`Before: ${before?.data?.faqs?.length ?? 0} questions in DB.`);

  await prisma.landingSection.upsert({
    where: { section: "faq" },
    create: { section: "faq", data: faqData },
    update: { data: faqData },
  });

  const after = await prisma.landingSection.findUnique({ where: { section: "faq" } });
  console.log(`After:  ${after?.data?.faqs?.length ?? 0} questions in DB.`);
  console.log("\n✅ FAQ updated successfully.");
} finally {
  await prisma.$disconnect();
}
