/**
 * Rewrite about.legalInfo.note — old copy references "السجل التجاري" and
 * "رقم السجل المذكور", but crNumber is now the الرقم الموحّد (7036024383).
 * DEV only.
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
const row = await prisma.landingSection.findFirst({ where: { section: "about" } });
if (!row) throw new Error("about row not found");

const NEW_NOTE =
  "يمكن التحقق من بيانات الشركة عبر الرقم الوطني الموحّد المذكور من خلال المنصة الوطنية للسجلات التجارية في المملكة العربية السعودية.";

const nextData = {
  ...row.data,
  legalInfo: {
    ...row.data.legalInfo,
    note: NEW_NOTE,
  },
};

await prisma.landingSection.update({ where: { id: row.id }, data: { data: nextData } });
console.log("✏ about.legalInfo.note updated");
console.log(`   → ${NEW_NOTE}`);
await prisma.$disconnect();
