// Apply a rewritten FAQ array (JSON file of [{q,a,tag}]) to the `faq` landing
// section, keeping the section title. Prints DB name + samples for safety.
//   DRY_RUN=1 DATABASE_URL="<url>" node scripts/apply-faq.mjs <file.json>
//            DATABASE_URL="<url>" node scripts/apply-faq.mjs <file.json>
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const dbName = (process.env.DATABASE_URL || "").split("/").pop()?.split("?")[0] || "UNKNOWN";
const DRY = process.env.DRY_RUN === "1";
const FILE = process.argv[2];

if (!FILE) throw new Error("usage: node scripts/apply-faq.mjs <file.json>");
console.log(`=== apply-faq · ${DRY ? "DRY RUN" : "WRITE"} · DB: ${dbName} ===`);

const faqs = JSON.parse(readFileSync(FILE, "utf8"));
if (!Array.isArray(faqs) || faqs.length === 0) throw new Error("file is not a non-empty array");
for (const f of faqs) {
  if (typeof f.q !== "string" || typeof f.a !== "string" || typeof f.tag !== "string") {
    throw new Error("each item must have string q/a/tag");
  }
}
console.log(`parsed ${faqs.length} FAQ items`);

// zero Latin-letter guard (user requirement: no English)
const latin = faqs.filter((f) => /[A-Za-z]/.test(f.q) || /[A-Za-z]/.test(f.a));
console.log(`items with Latin letters: ${latin.length}${latin.length ? " ⚠️" : " ✅"}`);

const row = await prisma.landingSection.findUnique({ where: { section: "faq" } });
const current = row?.data ?? {};
const next = { ...current, faqs };
console.log("section title kept:", next.title ?? "—");
console.log("sample [1] Q:", faqs[0].q);
console.log("sample [4] Q:", faqs[3]?.q);

if (!DRY) {
  await prisma.landingSection.upsert({
    where: { section: "faq" },
    create: { section: "faq", data: next },
    update: { data: next },
  });
  console.log("✅ faq written");
}
await prisma.$disconnect();
console.log(DRY ? "\n(dry run — nothing written)" : "\n✅ done");
