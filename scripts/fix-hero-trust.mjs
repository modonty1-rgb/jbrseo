/**
 * Fix false claims in hero.trust:
 *   "بدون بطاقة" (implies free trial — but we don't offer one)
 *   "إلغاء بأي وقت" (implies no auto-renewal — but auto-renew is default)
 * →
 *   "استرداد ١٤ يوم"
 *   "شركة سعودية مسجّلة"
 *   "دعم عربي ١٠٠٪"
 *
 * SAFETY: DEV only.
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const line = readFileSync(".env.local", "utf8")
  .split("\n")
  .find((l) => l.trim().startsWith("DATABASE_URL="));
const url = line.split("=").slice(1).join("=").trim().replace(/^"(.*)"$/, "$1");
if (!url.includes("modonty_dev")) throw new Error(`REFUSING: ${url.split("@")[1]}`);
console.log(`✅ ${url.split("@")[1]?.split("?")[0]}\n`);

const prisma = new PrismaClient({ datasources: { db: { url } } });

const NEW_TRUST = ["استرداد ١٤ يوم", "شركة سعودية مسجّلة", "دعم عربي ١٠٠٪"];

const row = await prisma.landingSection.findFirst({ where: { section: "hero" } });
if (!row) throw new Error("hero row not found");

const before = row.data?.trust;
console.log("BEFORE:", before);

const nextData = { ...row.data, trust: NEW_TRUST };
await prisma.landingSection.update({ where: { id: row.id }, data: { data: nextData } });

console.log("AFTER: ", NEW_TRUST);
console.log("\n✅ hero.trust updated");
await prisma.$disconnect();
