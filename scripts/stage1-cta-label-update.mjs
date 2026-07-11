#!/usr/bin/env node
/**
 * 🚨 Update LandingSection ctaLabel from "دعنا نبني حضورك" → "اختر باقتك".
 * Idempotent — no-op if already the target value.
 *
 * Usage:
 *   Dry-run (dev):  node scripts/stage1-cta-label-update.mjs
 *   Actual  (dev):  node scripts/stage1-cta-label-update.mjs --confirm=YES
 *   Dry-run (prod): DB_TARGET=prod node scripts/stage1-cta-label-update.mjs
 *   Actual  (prod): DB_TARGET=prod node scripts/stage1-cta-label-update.mjs --confirm=YES
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

const NEW_LABEL = "اختر باقتك";

console.log(`Target: ${dbName} (${target})`);
console.log(`Mode:   ${CONFIRM ? "🚨 WRITE" : "🔍 DRY-RUN"}`);
console.log("");

process.env.DATABASE_URL = url;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  const row = await prisma.landingSection.findFirst({ where: { section: "ctaLabel" } });
  const current = row?.data?.ctaLabel ?? "(missing)";
  console.log(`Current: "${current}"`);
  console.log(`Target:  "${NEW_LABEL}"`);
  console.log("");

  if (current === NEW_LABEL) {
    console.log("✅ Already the target value. No-op.");
    process.exit(0);
  }

  if (!CONFIRM) {
    console.log("🔍 Dry-run — re-run with --confirm=YES to apply.");
    process.exit(0);
  }

  console.log("🚨 Writing…");
  if (row) {
    await prisma.landingSection.update({
      where: { id: row.id },
      data: { data: { ...row.data, ctaLabel: NEW_LABEL } },
    });
  } else {
    await prisma.landingSection.create({
      data: { section: "ctaLabel", data: { ctaLabel: NEW_LABEL } },
    });
  }
  const verify = await prisma.landingSection.findFirst({ where: { section: "ctaLabel" } });
  console.log(`✅ Updated. New value: "${verify?.data?.ctaLabel ?? "(missing)"}"`);
} finally {
  await prisma.$disconnect();
}
