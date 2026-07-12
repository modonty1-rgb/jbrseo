/**
 * READ-ONLY — check e2e test subscriber state in prod DB
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

// Use prod URL from .env (should be modonty, not modonty_dev)
const line = readFileSync(".env", "utf8")
  .split("\n")
  .find((l) => l.trim().startsWith("DATABASE_URL="));
const url = line.split("=").slice(1).join("=").trim().replace(/^"(.*)"$/, "$1");

if (url.includes("modonty_dev")) throw new Error(`REFUSING — expected prod, got dev: ${url.split("@")[1]}`);
if (!url.includes("/modonty?")) throw new Error(`REFUSING — not /modonty: ${url.split("@")[1]}`);

console.log(`READ-ONLY on PROD: ${url.split("@")[1]?.split("?")[0]}\n`);

const prisma = new PrismaClient({ datasources: { db: { url } } });

const row = await prisma.subscriber.findFirst({
  where: { email: "e2e-test@jbrseo.com" },
  orderBy: { createdAt: "desc" },
});

if (!row) {
  console.log("❌ No subscriber found for e2e-test@jbrseo.com");
} else {
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
  console.log("  createdAt     :", row.createdAt);
  console.log("  updatedAt     :", row.updatedAt);
}

await prisma.$disconnect();
