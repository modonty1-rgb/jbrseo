#!/usr/bin/env node
/**
 * 🚨 Stage 3 · Task 2-1
 * Swap "استرداد ١٤ يوم مضمون" → "⏱️ التزام بالتسليم ٧٢ ساعة" in hero.trust
 * Idempotent — no-op if already the target value.
 *
 * Usage:
 *   Dry-run (dev):  node scripts/stage3-hero-trust-swap-refund-to-commitment.mjs
 *   Actual  (dev):  node scripts/stage3-hero-trust-swap-refund-to-commitment.mjs --confirm=YES
 *   Dry-run (prod): DB_TARGET=prod node scripts/stage3-hero-trust-swap-refund-to-commitment.mjs
 *   Actual  (prod): DB_TARGET=prod node scripts/stage3-hero-trust-swap-refund-to-commitment.mjs --confirm=YES
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const CONFIRM = process.argv.includes("--confirm=YES");
const target = process.env.DB_TARGET === "prod" ? "prod" : "dev";
const envFile = target === "prod" ? ".env" : ".env.local";
const envRaw = readFileSync(path.resolve(here, "..", envFile), "utf8");
const url = envRaw.match(/^DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";
const dbName = url.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";
const expectedDb = target === "prod" ? "modonty" : "modonty_dev";

if (dbName !== expectedDb) {
  console.error(`❌ Refusing: DB is "${dbName}", expected "${expectedDb}".`);
  process.exit(2);
}

const OLD_ITEM = "استرداد ١٤ يوم مضمون";
const NEW_ITEM = "⏱️ التزام بالتسليم ٧٢ ساعة";

console.log(`Target: ${dbName} (${target})`);
console.log(`Mode:   ${CONFIRM ? "🚨 WRITE" : "🔍 DRY-RUN"}`);
console.log(`Old:    "${OLD_ITEM}"`);
console.log(`New:    "${NEW_ITEM}"`);
console.log("");

process.env.DATABASE_URL = url;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  const row = await prisma.landingSection.findFirst({ where: { section: "hero" } });
  if (!row) {
    console.error("❌ No hero section row found.");
    process.exit(1);
  }
  const data = row.data ?? {};
  const trust = Array.isArray(data.trust) ? data.trust : [];

  console.log(`Current trust (${trust.length} items):`);
  trust.forEach((t, i) => console.log(`  [${i}] "${t}"`));
  console.log("");

  if (trust.includes(NEW_ITEM) && !trust.includes(OLD_ITEM)) {
    console.log(`✅ Already migrated. No-op.`);
    process.exit(0);
  }

  const newTrust = trust.map((t) => (t === OLD_ITEM ? NEW_ITEM : t));
  const changed = newTrust.some((t, i) => t !== trust[i]);

  if (!changed) {
    console.log(`⚠️  "${OLD_ITEM}" not found. Nothing to swap.`);
    process.exit(0);
  }

  console.log(`Proposed trust (${newTrust.length} items):`);
  newTrust.forEach((t, i) => {
    const marker = t !== trust[i] ? "🔄 " : "   ";
    console.log(`  [${i}] ${marker}"${t}"`);
  });
  console.log("");

  if (!CONFIRM) {
    console.log("🔍 Dry-run — re-run with --confirm=YES to apply.");
    process.exit(0);
  }

  console.log("🚨 Writing…");
  await prisma.landingSection.update({
    where: { id: row.id },
    data: { data: { ...data, trust: newTrust } },
  });
  const verify = await prisma.landingSection.findFirst({ where: { section: "hero" } });
  console.log(`✅ Updated. New item at position [3]: "${verify?.data?.trust?.[3] ?? "(missing)"}"`);
} finally {
  await prisma.$disconnect();
}
