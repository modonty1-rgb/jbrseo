#!/usr/bin/env node
/**
 * 🚨 Sync LandingSection "about" FROM dev DB TO prod DB.
 * Dev already has the row; prod is missing → prod page shows "قيد التحديث" fallback.
 *
 * Usage:
 *   Dry-run:      node scripts/sync-about-DEV-to-PROD.mjs
 *   Actual write: node scripts/sync-about-DEV-to-PROD.mjs --confirm=YES
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const CONFIRM = process.argv.includes("--confirm=YES");

// Load both env files (dev + prod URLs) — extract each explicitly.
const envLocal = readFileSync(path.resolve(here, "..", ".env.local"), "utf8");
const envRoot  = readFileSync(path.resolve(here, "..", ".env"), "utf8");
const devUrl  = envLocal.match(/^DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";
const prodUrl = envRoot.match(/^DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";

const devDbName  = devUrl.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";
const prodDbName = prodUrl.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";

if (devDbName !== "modonty_dev") {
  console.error(`❌ Refusing: dev source DB is "${devDbName}", expected "modonty_dev".`);
  process.exit(2);
}
if (prodDbName !== "modonty") {
  console.error(`❌ Refusing: prod target DB is "${prodDbName}", expected "modonty".`);
  process.exit(2);
}

console.log(`Source (dev):   ${devDbName}`);
console.log(`Target (prod):  ${prodDbName}`);
console.log(`Section:        about`);
console.log(`Mode:           ${CONFIRM ? "🚨 WRITE" : "🔍 DRY-RUN"}`);
console.log("");

const { PrismaClient } = await import("@prisma/client");

// Read from DEV
process.env.DATABASE_URL = devUrl;
const devClient = new PrismaClient();
const devRow = await devClient.landingSection.findFirst({ where: { section: "about" } });
await devClient.$disconnect();

if (!devRow) {
  console.error("❌ Source dev DB has no about row.");
  process.exit(1);
}
console.log(`✅ Source row found — data keys: ${Object.keys(devRow.data ?? {}).join(", ")}`);
console.log("");

// Check prod
process.env.DATABASE_URL = prodUrl;
const prodClient = new PrismaClient();
const prodRow = await prodClient.landingSection.findFirst({ where: { section: "about" } });

if (prodRow) {
  console.log(`⚠️  Prod already has about row (updated ${prodRow.updatedAt.toISOString()})`);
  console.log(`   Existing keys: ${Object.keys(prodRow.data ?? {}).join(", ")}`);
} else {
  console.log(`📭 Prod has NO about row — will create.`);
}

if (!CONFIRM) {
  console.log("");
  console.log("🔍 Dry-run — re-run with --confirm=YES to write.");
  await prodClient.$disconnect();
  process.exit(0);
}

console.log("");
console.log("🚨 Writing to prod…");
await prodClient.landingSection.upsert({
  where: { section: "about" },
  create: { section: "about", data: devRow.data },
  update: { data: devRow.data },
});

const verify = await prodClient.landingSection.findFirst({ where: { section: "about" } });
console.log(`✅ Prod about row now has keys: ${Object.keys(verify?.data ?? {}).join(", ")}`);
console.log(`   updatedAt: ${verify?.updatedAt.toISOString()}`);
await prodClient.$disconnect();
console.log("\n✅ Done.");
