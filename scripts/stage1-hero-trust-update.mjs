#!/usr/bin/env node
/**
 * 🚨 Add "استرداد ١٤ يوم مضمون" to hero.trust array.
 * If item already exists, no-op. Idempotent.
 *
 * Usage:
 *   Dry-run (dev):  node scripts/stage1-hero-trust-update.mjs
 *   Actual  (dev):  node scripts/stage1-hero-trust-update.mjs --confirm=YES
 *   Dry-run (prod): DB_TARGET=prod node scripts/stage1-hero-trust-update.mjs
 *   Actual  (prod): DB_TARGET=prod node scripts/stage1-hero-trust-update.mjs --confirm=YES
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

const NEW_ITEM = "استرداد ١٤ يوم مضمون";

console.log(`Target: ${dbName} (${target})`);
console.log(`Mode:   ${CONFIRM ? "🚨 WRITE" : "🔍 DRY-RUN"}`);
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

  if (trust.includes(NEW_ITEM)) {
    console.log(`✅ "${NEW_ITEM}" already present. No update needed.`);
    process.exit(0);
  }

  const newTrust = [...trust, NEW_ITEM];
  console.log(`Proposed trust (${newTrust.length} items):`);
  newTrust.forEach((t, i) => console.log(`  [${i}] ${t === NEW_ITEM ? "➕ " : "   "}"${t}"`));
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
  console.log(`✅ Updated. New count: ${verify?.data?.trust?.length ?? 0}`);
} finally {
  await prisma.$disconnect();
}
