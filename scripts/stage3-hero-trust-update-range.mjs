#!/usr/bin/env node
/**
 * 🚨 Stage 3 · Range refinement
 * Update hero.trust item from "٧٢ ساعة" (flat) to "٧٢ ساعة → ١٤ يوم" (range).
 * Idempotent.
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

const OLD_ITEM = "⏱️ التزام بالتسليم ٧٢ ساعة";
const NEW_ITEM = "⏱️ تسليم من ٧٢ ساعة إلى ١٤ يوم";

console.log(`Target: ${dbName} (${target}) · Mode: ${CONFIRM ? "🚨 WRITE" : "🔍 DRY-RUN"}`);
console.log(`Old: "${OLD_ITEM}"`);
console.log(`New: "${NEW_ITEM}"`);
console.log("");

process.env.DATABASE_URL = url;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  const row = await prisma.landingSection.findFirst({ where: { section: "hero" } });
  if (!row) { console.error("❌ No hero row"); process.exit(1); }
  const data = row.data ?? {};
  const trust = Array.isArray(data.trust) ? data.trust : [];
  console.log(`Current: [${trust.map(t => `"${t}"`).join(", ")}]`);
  if (trust.includes(NEW_ITEM) && !trust.includes(OLD_ITEM)) { console.log("✅ Already migrated."); process.exit(0); }
  const newTrust = trust.map(t => t === OLD_ITEM ? NEW_ITEM : t);
  if (!newTrust.some((t, i) => t !== trust[i])) { console.log(`⚠️  "${OLD_ITEM}" not found.`); process.exit(0); }
  console.log(`New:     [${newTrust.map(t => `"${t}"`).join(", ")}]`);
  if (!CONFIRM) { console.log("\n🔍 Dry-run — re-run with --confirm=YES."); process.exit(0); }
  console.log("\n🚨 Writing…");
  await prisma.landingSection.update({ where: { id: row.id }, data: { data: { ...data, trust: newTrust } } });
  console.log("✅ Done.");
} finally {
  await prisma.$disconnect();
}
