/**
 * PROD MIRROR — run manually after code push.
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const line = readFileSync(".env", "utf8")
  .split("\n")
  .find((l) => l.trim().startsWith("DATABASE_URL="));
const url = line.split("=").slice(1).join("=").trim().replace(/^"(.*)"$/, "$1");
if (url.includes("modonty_dev")) throw new Error(`REFUSING: dev URL → ${url.split("@")[1]}`);
if (!url.includes("/modonty?")) throw new Error(`REFUSING: not /modonty → ${url.split("@")[1]}`);
console.log(`⚠ PROD ${url.split("@")[1]?.split("?")[0]}\n`);

const prisma = new PrismaClient({ datasources: { db: { url } } });

const NEW_TRUST = ["استرداد ١٤ يوم", "شركة سعودية مسجّلة", "دعم عربي ١٠٠٪"];

const row = await prisma.landingSection.findFirst({ where: { section: "hero" } });
if (!row) throw new Error("hero row not found");

console.log("BEFORE:", row.data?.trust);
await prisma.landingSection.update({
  where: { id: row.id },
  data: { data: { ...row.data, trust: NEW_TRUST } },
});
console.log("AFTER: ", NEW_TRUST);
console.log("\n✅ PROD hero.trust updated");
await prisma.$disconnect();
