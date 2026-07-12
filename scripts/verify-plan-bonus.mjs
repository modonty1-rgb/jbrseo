/**
 * Verify the "٦ شهور هدية على السنوي" claim per plan.
 *
 * Landing math: effectiveMonthly = (priceYearly * 12) / 18
 * Claim is HONEST when:  effectiveMonthly < priceMonthly (yearly IS a discount)
 * Claim is DECEPTIVE if: effectiveMonthly ≥ priceMonthly (no real saving)
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
const plans = await prisma.plan.findMany({
  where: { visible: true, priceYearly: { gt: 0 } },
  orderBy: { displayOrder: "asc" },
});

console.log(`Plans found: ${plans.length}\n`);
console.log("─".repeat(90));
console.log("Plan".padEnd(20), "monthly".padStart(10), "yearlyM".padStart(10), "annual".padStart(12), "effMo".padStart(10), "save%".padStart(8), "honest?".padStart(10));
console.log("─".repeat(90));

let allHonest = true;
for (const p of plans) {
  const annual = p.priceYearly * 12;
  const eff = Math.round(annual / 18);
  const savePct = p.priceMonthly > 0 ? Math.round((1 - eff / p.priceMonthly) * 100) : 0;
  const honest = eff < p.priceMonthly;
  if (!honest) allHonest = false;
  const flag = honest ? "✅" : "❌";
  console.log(
    p.name.padEnd(20),
    String(p.priceMonthly).padStart(10),
    String(p.priceYearly).padStart(10),
    String(annual).padStart(12),
    String(eff).padStart(10),
    `${savePct}%`.padStart(8),
    flag.padStart(10),
  );
}

console.log("─".repeat(90));
console.log(allHonest ? "\n✅ All plans honor the '6 months bonus' claim." : "\n❌ Some plans FAIL the claim — the '٦ شهور هدية' is deceptive for them.");
await prisma.$disconnect();
