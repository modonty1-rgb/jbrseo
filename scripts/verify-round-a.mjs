import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const subscriberId = "6a53ac51b9b80e7df3d5d6a7";
const row = await prisma.subscriber.findUnique({ where: { id: subscriberId } });
console.log("DATABASE_URL cluster/db:", (process.env.DATABASE_URL || "").replace(/mongodb\+srv:\/\/[^@]+@([^/]+)\/([^?]+).*/, "$1 / $2"));
console.log(JSON.stringify(row, null, 2));
await prisma.$disconnect();
