import { PrismaClient } from "@prisma/client";
import { seo } from "../app/content/landing";
import { landingImages } from "../app/content/landing-images";
import { DEFAULT_SITE_SETTINGS_JSON } from "../lib/site-settings.types";

const prisma = new PrismaClient();

const COUNTRIES = ["SA", "EG"] as const;

async function main() {
  for (const country of COUNTRIES) {
    const settings = {
      ...DEFAULT_SITE_SETTINGS_JSON,
      seo: {
        ...DEFAULT_SITE_SETTINGS_JSON.seo,
        title: seo.title,
        description: seo.description,
        canonical: seo.canonical,
        ogLocale: seo.ogLocale,
      },
      images: {
        logoWhite: landingImages.logoWhite,
        logoLight: landingImages.logoLight,
        contactAvatar: landingImages.contactAvatar,
      },
    };
    await prisma.siteSettings.upsert({
      where: { country },
      create: { country, ...settings },
      update: settings,
    });
  }
  console.log("Seed done for SA and EG.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
