#!/usr/bin/env node
/**
 * 🚨 Delete duplicate LandingSection rows in PROD (and optionally DEV).
 * MongoDB never enforced Prisma's `@unique` on `section` — so every section has 2 rows.
 * We keep the row with the newest `updatedAt`, delete the older twin.
 *
 * Usage:
 *   Dry-run (prod): node scripts/dedupe-landing-sections.mjs
 *   Actual  (prod): node scripts/dedupe-landing-sections.mjs --confirm=YES
 *   Dry-run (dev):  DB_TARGET=dev node scripts/dedupe-landing-sections.mjs
 *   Actual  (dev):  DB_TARGET=dev node scripts/dedupe-landing-sections.mjs --confirm=YES
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const CONFIRM = process.argv.includes("--confirm=YES");
const target = process.env.DB_TARGET === "dev" ? "dev" : "prod";

const envFile = target === "prod" ? ".env" : ".env.local";
const envRaw = readFileSync(path.resolve(here, "..", envFile), "utf8");
const url = envRaw.match(/^DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";
const dbName = url.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";
const expectedDb = target === "prod" ? "modonty" : "modonty_dev";

if (dbName !== expectedDb) {
  console.error(`❌ Refusing: DB is "${dbName}", expected "${expectedDb}".`);
  process.exit(2);
}

console.log(`Target: ${dbName} (${target})`);
console.log(`Mode:   ${CONFIRM ? "🚨 WRITE (DELETE)" : "🔍 DRY-RUN"}`);
console.log("");

process.env.DATABASE_URL = url;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  const all = await prisma.landingSection.findMany({});
  const bySection = new Map();
  for (const row of all) {
    const arr = bySection.get(row.section) ?? [];
    arr.push(row);
    bySection.set(row.section, arr);
  }

  const toDelete = [];
  console.log(`Total rows: ${all.length}`);
  console.log(`Unique sections: ${bySection.size}`);
  console.log("");

  for (const [section, rows] of bySection) {
    if (rows.length <= 1) continue;
    // Sort newest first — keep [0], delete rest.
    rows.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    const [keep, ...dropped] = rows;
    console.log(`${section}: ${rows.length} rows`);
    console.log(`  KEEP   id=${keep.id} updated=${keep.updatedAt.toISOString().slice(0, 10)}`);
    for (const d of dropped) {
      console.log(`  DELETE id=${d.id} updated=${d.updatedAt.toISOString().slice(0, 10)}`);
      toDelete.push(d.id);
    }
  }

  console.log("");
  console.log(`Rows to delete: ${toDelete.length}`);

  if (!CONFIRM) {
    console.log("🔍 Dry-run — re-run with --confirm=YES to delete.");
    process.exit(0);
  }

  console.log("");
  console.log("🚨 Deleting…");
  const res = await prisma.landingSection.deleteMany({ where: { id: { in: toDelete } } });
  console.log(`✅ Deleted ${res.count} rows.`);

  const after = await prisma.landingSection.count();
  console.log(`   Row count after: ${after}`);
} finally {
  await prisma.$disconnect();
}
