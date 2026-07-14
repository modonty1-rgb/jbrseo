import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const line = readFileSync(".env", "utf8").split("\n").find((l) => l.trim().startsWith("DATABASE_URL="));
const url = line.split("=").slice(1).join("=").trim().replace(/^"(.*)"$/, "$1");
if (url.includes("modonty_dev")) throw new Error("REFUSING dev URL");
if (!url.includes("/modonty?")) throw new Error("REFUSING non-/modonty URL");
console.log(`READ-ONLY on: ${url.split("@")[1]?.split("?")[0]}\n`);

const prisma = new PrismaClient({ datasources: { db: { url } } });

const row = await prisma.subscriber.findFirst({
  where: { email: "e2e-retest@jbrseo.com" },
  orderBy: { createdAt: "desc" },
});

if (!row) console.log("❌ No subscriber found");
else {
  console.log("✅ Subscriber found:");
  console.log("  id            :", row.id);
  console.log("  email         :", row.email);
  console.log("  contactName   :", row.contactName);
  console.log("  plan/billing  :", row.plan, "/", row.billing);
  console.log("  planName      :", row.planName);
  console.log("  paymentStatus :", row.paymentStatus);
  console.log("  paymentRef    :", row.paymentRef);
  console.log("  paidAt        :", row.paidAt);
  console.log("  failReason    :", row.failReason);
  const durationMs = row.paidAt && row.createdAt ? row.paidAt.getTime() - row.createdAt.getTime() : null;
  if (durationMs !== null) console.log(`  create→paid   : ${durationMs}ms (${(durationMs/1000).toFixed(1)}s)`);
}
await prisma.$disconnect();
