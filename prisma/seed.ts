import { PrismaClient } from "@prisma/client";
import { landing, seo } from "../app/content/landing";
import { landingImages } from "../app/content/landing-images";
import { footerTexts } from "../app/components/texts";

const prisma = new PrismaClient();

const COUNTRIES = ["SA", "EG"] as const;

const SECTION_HEADINGS: Record<string, { eyebrow?: string; title?: string; highlightBadge?: string }> = {
  whyNow: { eyebrow: "لماذا الآن", title: "كل شهر تأخير له ثمن" },
  howItWorks: { eyebrow: "الطريقة", title: "كيف نعمل" },
  outcomes: { eyebrow: "النتائج", title: "ما الذي تحصل عليه" },
  socialProof: { eyebrow: "الشهادات", title: "شركاء يثقون بنا" },
  pricingTeaser: { eyebrow: "الخطط", title: "اختر خطتك", highlightBadge: "الأكثر شيوعاً" },
  faq: { eyebrow: "الأسئلة", title: "أسئلة شائعة" },
};

const PRICING_PAGE = {
  title: "خطة الأسعار — مدونتي",
  description: "اختر الباقة المناسبة: ستارتر، غروث، أو سكيل. ادفع 12، استلم 18 شهراً.",
  h1: "خطة الأسعار — قريباً",
  intro:
    "نعمل على تجهيز صفحة الأسعار. اختر الباقة المناسبة من البطاقات أدناه عند الإطلاق.",
};

function textRows(country: string): { country: string; section: string; key: string; value: string }[] {
  const rows: { country: string; section: string; key: string; value: string }[] = [];

  const add = (section: string, key: string, value: string) => rows.push({ country, section, key, value });

  add("hero", "h1", landing.hero.h1);
  add("hero", "subheadline", landing.hero.subheadline);
  add("hero", "benefits", JSON.stringify(landing.hero.benefits));
  add("hero", "proof", landing.hero.proof);
  add("hero", "cta", landing.hero.cta);

  add("whyNow", "lines", JSON.stringify(landing.whyNow.lines));
  add("howItWorks", "steps", JSON.stringify(landing.howItWorks.steps));
  add("outcomes", "items", JSON.stringify(landing.outcomes));
  add("socialProof", "testimonial", JSON.stringify(landing.socialProof.testimonial));
  add("socialProof", "stats", JSON.stringify(landing.socialProof.stats));

  const plansWithCtaLink = landing.pricingTeaser.plans.map((p) => ({
    ...p,
    ctaLink: "/pricing",
  }));
  add("pricingTeaser", "plans", JSON.stringify(plansWithCtaLink));
  add("faq", "items", JSON.stringify(landing.faq));
  add("finalCta", "headline", landing.finalCta.headline);
  add("finalCta", "cta", landing.finalCta.cta);

  add("seo", "title", seo.title);
  add("seo", "description", seo.description);
  add("seo", "canonical", seo.canonical);
  add("seo", "ogLocale", seo.ogLocale);

  for (const [section, data] of Object.entries(SECTION_HEADINGS)) {
    if (data.eyebrow) add("sectionHeadings", `${section}_eyebrow`, data.eyebrow);
    if (data.title) add("sectionHeadings", `${section}_title`, data.title);
    if (data.highlightBadge) add("sectionHeadings", `${section}_highlightBadge`, data.highlightBadge);
  }

  add("footer", "brandName", footerTexts.brandName);
  add("footer", "copyright", footerTexts.copyright);

  add("pricingPage", "title", PRICING_PAGE.title);
  add("pricingPage", "description", PRICING_PAGE.description);
  add("pricingPage", "h1", PRICING_PAGE.h1);
  add("pricingPage", "intro", PRICING_PAGE.intro);

  return rows;
}

function imageRows(country: string): { country: string; key: string; url: string }[] {
  return [
    { country, key: "contactAvatar", url: landingImages.contactAvatar },
    { country, key: "logoWhite", url: landingImages.logoWhite },
    { country, key: "company", url: landingImages.company },
    { country, key: "pricing_0", url: landingImages.pricing[0] },
    { country, key: "pricing_1", url: landingImages.pricing[1] },
    { country, key: "testimonial_0", url: landingImages.testimonial[0] },
    { country, key: "testimonial_1", url: landingImages.testimonial[1] },
    { country, key: "testimonial_2", url: landingImages.testimonial[2] },
  ];
}

async function main() {
  for (const country of COUNTRIES) {
    for (const row of textRows(country)) {
      await prisma.landingText.upsert({
        where: {
          country_section_key: { country, section: row.section, key: row.key },
        },
        create: row,
        update: { value: row.value },
      });
    }
    for (const row of imageRows(country)) {
      await prisma.landingImage.upsert({
        where: { country_key: { country, key: row.key } },
        create: row,
        update: { url: row.url },
      });
    }

    // Seed PricingPlan rows from static landing content so homepage pricing
    // can read from the dedicated pricing_plans table.
    await Promise.all(
      landing.pricingTeaser.plans.map((plan, index) =>
        prisma.pricingPlan.upsert({
          where: { country_sortOrder: { country, sortOrder: index } },
          create: {
            country,
            sortOrder: index,
            name: plan.name,
            forWho: plan.forWho,
            highlight: false,
            features: [] as string[],
          },
          update: {
            name: plan.name,
            forWho: plan.forWho,
          },
        })
      )
    );
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
