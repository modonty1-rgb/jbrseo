#!/usr/bin/env node
/**
 * 🔍 Stage 1 audit — read current DB values for hero CTA label + hero trust items.
 * Read-only. Run before applying the update script.
 *
 * Usage:
 *   node scripts/stage1-landing-audit.mjs            (dev by default)
 *   DB_TARGET=prod node scripts/stage1-landing-audit.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
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

console.log(`Target: ${dbName} (${target})`);
console.log(`Mode:   🔍 READ-ONLY AUDIT`);
console.log("");

process.env.DATABASE_URL = url;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  // 1. Site settings — ctaLabel
  const settings = await prisma.siteSettings.findFirst({});
  console.log("─── siteSettings.ctaLabel ───");
  console.log(`  current: "${settings?.ctaLabel ?? "(not set)"}"`);
  console.log(`  target:  "اختر باقتك"`);
  console.log("");

  // 2. Hero trust items
  const heroSection = await prisma.landingSection.findFirst({ where: { section: "hero" } });
  const trust = heroSection?.data?.trust ?? [];
  console.log("─── landingSection.hero.data.trust ───");
  console.log(`  current: [${trust.map((t) => `"${t}"`).join(", ")}]`);
  console.log(`  count:   ${trust.length}`);
  console.log(`  target:  add "استرداد ١٤ يوم مضمون" (replace one or append based on your call)`);
  console.log("");
} finally {
  await prisma.$disconnect();
}
