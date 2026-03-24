// Sets Subscriber.contactName from null to "" (run: pnpm run db:fix-contact-names)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const result = await prisma.subscriber.updateMany({
    where: { contactName: null },
    data: { contactName: "" },
  });
  console.log(
    `[fix-null-contact-names] Updated ${result.count} subscriber(s): contactName null → ""`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });
