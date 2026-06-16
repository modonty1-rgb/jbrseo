import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type SocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitterX?: string;
  youtube?: string;
  tiktok?: string;
  snapchat?: string;
};

function clean(v: string | undefined): string | undefined {
  const s = (v ?? "").trim();
  return s ? s : undefined;
}

async function main(): Promise<void> {
  const payload: SocialLinks = {
    facebook: clean(process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL),
    instagram: clean(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL),
    linkedin: clean(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL),
    twitterX: clean(process.env.NEXT_PUBLIC_SOCIAL_TWITTER_X_URL),
    youtube: clean(process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL),
    tiktok: clean(process.env.NEXT_PUBLIC_SOCIAL_TIKTOK_URL),
    snapchat: clean(process.env.NEXT_PUBLIC_SOCIAL_SNAPCHAT_URL),
  };

  await prisma.landingSection.upsert({
    where: { section: "socialLinks" },
    create: { section: "socialLinks", data: payload },
    update: { data: payload },
  });

  console.log("[seed-social-links] Upserted socialLinks (unified — no country).");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });
