// Backfill Subscriber.updatedAt for legacy Mongo documents that predate the
// column (missing/null updatedAt → Prisma throws on a full-row read because the
// field is a non-nullable DateTime). Sets updatedAt = createdAt, falling back to
// the current time if createdAt is also missing. Idempotent + additive.
//
// Run per DB (prints the DB name first for safety):
//   node --env-file=.env.local scripts/backfill-subscriber-updatedat.mjs   (dev)
//   DATABASE_URL="<prod url>" node scripts/backfill-subscriber-updatedat.mjs (prod)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const dbUrl = process.env.DATABASE_URL || "";
const dbName = dbUrl.split("/").pop()?.split("?")[0] || "UNKNOWN";
const COLL = "Subscriber";
const MISSING = { $or: [{ updatedAt: null }, { updatedAt: { $exists: false } }] };

console.log("=== Subscriber.updatedAt backfill ===");
console.log("DATABASE_URL DB name:", dbName);

const before = await prisma.$runCommandRaw({ count: COLL, query: MISSING });
console.log("records with null/missing updatedAt:", before.n);

if (before.n > 0) {
  const res = await prisma.$runCommandRaw({
    update: COLL,
    updates: [
      {
        q: MISSING,
        u: [{ $set: { updatedAt: { $ifNull: ["$createdAt", "$$NOW"] } } }],
        multi: true,
      },
    ],
  });
  console.log("update result:", JSON.stringify(res));
}

const after = await prisma.$runCommandRaw({ count: COLL, query: MISSING });
console.log("remaining null/missing after:", after.n);
console.log(after.n === 0 ? "✅ clean" : "❌ still broken");

await prisma.$disconnect();
