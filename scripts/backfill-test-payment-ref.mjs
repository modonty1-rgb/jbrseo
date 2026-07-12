import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const subscriberId = "6a53ac51b9b80e7df3d5d6a7";
const orderReference = "d6483608-666f-45ac-9186-68f026b6726c";

console.log("Target DB:", (process.env.DATABASE_URL || "").replace(/mongodb\+srv:\/\/[^@]+@([^/]+)\/([^?]+).*/, "$1 / $2"));

const before = await prisma.subscriber.findUnique({ where: { id: subscriberId }, select: { paymentStatus: true, paymentRef: true } });
console.log("BEFORE:", before);

await prisma.subscriber.update({
  where: { id: subscriberId },
  data: { paymentRef: orderReference },
});

const after = await prisma.subscriber.findUnique({ where: { id: subscriberId }, select: { paymentStatus: true, paymentRef: true } });
console.log("AFTER (paymentRef set, still pending — polling should flip it):", after);

await prisma.$disconnect();
