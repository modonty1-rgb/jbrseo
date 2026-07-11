#!/usr/bin/env node
/**
 * 🚨 Sync LandingSection "faq" FROM dev DB TO prod DB.
 * The FAQ was extensively rebuilt in dev this session (18 questions vs the 10 in prod).
 * Requires --confirm=YES to write.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const CONFIRM = process.argv.includes("--confirm=YES");

const envLocal = readFileSync(path.resolve(here, "..", ".env.local"), "utf8");
const envRoot  = readFileSync(path.resolve(here, "..", ".env"), "utf8");
const devUrl  = envLocal.match(/^DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";
const prodUrl = envRoot.match(/^DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";
const devDbName  = devUrl.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";
const prodDbName = prodUrl.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";

if (devDbName !== "modonty_dev" || prodDbName !== "modonty") {
  console.error(`❌ Wrong DBs: dev="${devDbName}" prod="${prodDbName}".`);
  process.exit(2);
}

console.log(`Source (dev):   ${devDbName}`);
console.log(`Target (prod):  ${prodDbName}`);
console.log(`Section:        faq`);
console.log(`Mode:           ${CONFIRM ? "🚨 WRITE" : "🔍 DRY-RUN"}`);
console.log("");

const { PrismaClient } = await import("@prisma/client");

process.env.DATABASE_URL = devUrl;
const devClient = new PrismaClient();
const devRow = await devClient.landingSection.findFirst({ where: { section: "faq" } });
await devClient.$disconnect();
if (!devRow) { console.error("❌ Source dev has no faq row."); process.exit(1); }
const devCount = devRow.data?.faqs?.length ?? 0;
console.log(`✅ Source: ${devCount} FAQ items.`);

process.env.DATABASE_URL = prodUrl;
const prodClient = new PrismaClient();
const prodRow = await prodClient.landingSection.findFirst({ where: { section: "faq" } });
const prodCount = prodRow?.data?.faqs?.length ?? 0;
console.log(prodRow ? `⚠️  Prod has: ${prodCount} FAQ items (will be overwritten).` : `📭 Prod has NO faq row — will create.`);

if (!CONFIRM) { console.log("\n🔍 Dry-run — re-run with --confirm=YES."); await prodClient.$disconnect(); process.exit(0); }

console.log("\n🚨 Writing to prod…");
await prodClient.landingSection.upsert({
  where: { section: "faq" },
  create: { section: "faq", data: devRow.data },
  update: { data: devRow.data },
});
const verify = await prodClient.landingSection.findFirst({ where: { section: "faq" } });
console.log(`✅ Prod faq now has: ${verify?.data?.faqs?.length ?? 0} items.`);
await prodClient.$disconnect();
console.log("\n✅ Done.");
