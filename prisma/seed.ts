import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const row = await prisma.siteSettings.findFirst();
  if (!row) {
    await prisma.siteSettings.create({
      data: {
        gtmId: "",
        hotjarId: "",
        fbPixelId: "",
        whatsappNumber: "",
      },
    });
    console.log("Created single SiteSettings row.");
  } else {
    console.log("SiteSettings row already exists.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
