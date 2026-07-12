/**
 * Fix /about page's legalInfo (DEV DB).
 *
 *   ❌ Old legalName: "شركة جبر سيو (ذات مسؤولية محدودة)"
 *   ✅ New legalName: "شركة جبر الجنوبية"
 *
 *   ❌ Old phone: "+966 14 774822234" (34 digits — malformed)
 *   ✅ New phone: "" (cleared until real number confirmed)
 *
 * crNumber "4030560460" (Latin digits) confirmed as canonical format — no change.
 *
 * Run: node scripts/fix-about-legal-info.mjs
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

function loadDevUrl() {
  const line = readFileSync(".env.local", "utf8")
    .split("\n")
    .find((l) => l.trim().startsWith("DATABASE_URL="));
  if (!line) throw new Error("DATABASE_URL not found in .env.local");
  const url = line.split("=").slice(1).join("=").trim().replace(/^"(.*)"$/, "$1");
  if (!url.includes("modonty_dev")) {
    throw new Error(`REFUSING: not dev → ${url.split("@")[1]?.split("?")[0]}`);
  }
  return url;
}

const url = loadDevUrl();
console.log(`✅ Targeting: ${url.split("@")[1]?.split("?")[0]}\n`);

const prisma = new PrismaClient({ datasources: { db: { url } } });

const row = await prisma.landingSection.findFirst({ where: { section: "about" } });
if (!row) throw new Error("No 'about' row in LandingSection");

const before = row.data?.legalInfo ?? {};
console.log("BEFORE:");
console.log(`  legalName: ${before.legalName ?? "(missing)"}`);
console.log(`  phone:     ${before.phone ?? "(missing)"}`);
console.log();

const nextData = {
  ...row.data,
  legalInfo: {
    ...before,
    legalName: "شركة جبر الجنوبية",
    phone: "",
  },
};

await prisma.landingSection.update({
  where: { id: row.id },
  data: { data: nextData },
});

console.log("AFTER:");
console.log(`  legalName: ${nextData.legalInfo.legalName}`);
console.log(`  phone:     "${nextData.legalInfo.phone}"`);
console.log("\n✅ Done.");

await prisma.$disconnect();
